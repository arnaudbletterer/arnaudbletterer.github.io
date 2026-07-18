// Normal Estimation Sandbox Logic - Point Clouds, PCA, and Graph-based Normal Propagation

let activeStep = 1;
let searchRadius = 45;
let noiseLevel = 8;
let currentShape = 'sinusoid'; // 'sinusoid', 'circle', 'corner'

let rawPoints = []; // Base coordinates [ {id, baseX, baseY, x, y, nx, ny, ...} ]
let activePoints = []; // Current coordinates matching noise level

let graphEdges = []; // Neighborhood connections for drawing
let mstEdges = [];   // Minimum Spanning Tree edges
let mstAdjacency = []; // Adjacency list for MST BFS traversal
let propagationSteps = []; // Sequential steps for animating BFS orientation
let propagationIndex = -1;
let propagationTimer = null;
let isPropagating = false;

// D3 selections
const svg = d3.select("#normal_svg");
const edgesGroup = d3.select("#edges-group");
const mstGroup = d3.select("#mst-group");
const ellipsesGroup = d3.select("#ellipses-group");
const pointsGroup = d3.select("#points-group");
const normalsGroup = d3.select("#normals-group");
const overlayGroup = d3.select("#overlay-group");

let hoveredPoint = null;

// Generate arrow head markers in SVG
function initMarkers() {
  const defs = svg.append("svg:defs");
  
  // Normal arrow marker (unoriented/oriented)
  defs.append("svg:marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", "6")
    .attr("refY", "5")
    .attr("markerWidth", "5")
    .attr("markerHeight", "5")
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0 1 L 10 5 L 0 9 z")
    .attr("fill", "currentColor");

  // Highlighted normal arrow marker
  defs.append("svg:marker")
    .attr("id", "arrow-highlight")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", "6")
    .attr("refY", "5")
    .attr("markerWidth", "6")
    .attr("markerHeight", "6")
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M 0 1 L 10 5 L 0 9 z")
    .attr("fill", "var(--primary)");
}

// Generate point cloud coordinates based on shape preset
function generateShapePoints() {
  rawPoints = [];
  let id = 0;
  
  if (currentShape === 'sinusoid') {
    const N = 40;
    const startX = 60;
    const endX = 540;
    const step = (endX - startX) / (N - 1);
    for (let i = 0; i < N; i++) {
      const bx = startX + i * step;
      // Wavy sine shape
      const by = 250 + 80 * Math.sin(bx / 65);
      rawPoints.push({
        id: id++,
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        nx: 0,
        ny: -1,
        tx: 1,
        ty: 0,
        lambda0: 0,
        lambda1: 0,
        oriented: false,
        mstParent: null
      });
    }
  } else if (currentShape === 'circle') {
    const N = 50;
    const cx = 300;
    const cy = 250;
    const r = 135;
    for (let i = 0; i < N; i++) {
      const angle = (i * 2 * Math.PI) / N;
      const bx = cx + r * Math.cos(angle);
      const by = cy + r * Math.sin(angle);
      rawPoints.push({
        id: id++,
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        nx: 0,
        ny: -1,
        tx: 1,
        ty: 0,
        lambda0: 0,
        lambda1: 0,
        oriented: false,
        mstParent: null
      });
    }
  } else if (currentShape === 'corner') {
    const N_side = 20;
    // Horizontal segment
    const startX = 140;
    const cornerX = 390;
    const cornerY = 360;
    const endY = 110;
    
    const hStep = (cornerX - startX) / N_side;
    for (let i = 0; i < N_side; i++) {
      const bx = startX + i * hStep;
      const by = cornerY;
      rawPoints.push({
        id: id++,
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        nx: 0,
        ny: -1,
        tx: 1,
        ty: 0,
        lambda0: 0,
        lambda1: 0,
        oriented: false,
        mstParent: null
      });
    }
    
    // Vertical segment (avoid overlapping corner point)
    const vStep = (cornerY - endY) / N_side;
    for (let i = 1; i <= N_side; i++) {
      const bx = cornerX;
      const by = cornerY - i * vStep;
      rawPoints.push({
        id: id++,
        baseX: bx,
        baseY: by,
        x: bx,
        y: by,
        nx: 0,
        ny: -1,
        tx: 1,
        ty: 0,
        lambda0: 0,
        lambda1: 0,
        oriented: false,
        mstParent: null
      });
    }
  }

  applyNoiseAndRecompute();
}

// Add Gaussian noise offsets to the points and perform geometric processing
function applyNoiseAndRecompute() {
  // Seed offsets deterministically based on ID to avoid jitter during parameter slider moves
  rawPoints.forEach(p => {
    // Basic pseudo-random Gaussian noise formulation
    const angle = (p.id * 1.618) % (2 * Math.PI);
    const rad = Math.abs(Math.sin(p.id * 9.81)) * noiseLevel;
    p.x = p.baseX + rad * Math.cos(angle);
    p.y = p.baseY + rad * Math.sin(angle);
    p.oriented = false;
  });

  computeNeighborhoodsAndPCA();
}

// Compute neighborhood lists, local covariance matrices, and eigenvectors (PCA)
function computeNeighborhoodsAndPCA() {
  const N = rawPoints.length;
  
  // 1. Reset neighbor lists
  rawPoints.forEach(p => {
    p.neighbors = [];
  });

  // 2. Find points inside spatial radius search
  graphEdges = [];
  for (let i = 0; i < N; i++) {
    const pi = rawPoints[i];
    for (let j = i + 1; j < N; j++) {
      const pj = rawPoints[j];
      const dx = pj.x - pi.x;
      const dy = pj.y - pi.y;
      const d2 = dx*dx + dy*dy;
      if (d2 <= searchRadius * searchRadius) {
        pi.neighbors.push(j);
        pj.neighbors.push(i);
        graphEdges.push({ source: i, target: j });
      }
    }
  }

  // 3. Compute Local PCA for each point
  rawPoints.forEach(p => {
    // Set of neighbors + self
    const indices = [p.id, ...p.neighbors];
    const K = indices.length;
    
    if (K < 2) {
      // Fallback if isolated
      p.lambda0 = 2;
      p.lambda1 = 40;
      p.nx = 0;
      p.ny = -1;
      p.rawNx = 0;
      p.rawNy = -1;
      p.tx = 1;
      p.ty = 0;
      return;
    }
    
    // Compute local centroid
    let sumX = 0, sumY = 0;
    indices.forEach(idx => {
      const n = rawPoints[idx];
      sumX += n.x;
      sumY += n.y;
    });
    const cx = sumX / K;
    const cy = sumY / K;
    
    // Compute symmetric covariance matrix terms
    let cxx = 0, cxy = 0, cyy = 0;
    indices.forEach(idx => {
      const n = rawPoints[idx];
      const dx = n.x - cx;
      const dy = n.y - cy;
      cxx += dx * dx;
      cxy += dx * dy;
      cyy += dy * dy;
    });
    cxx /= K;
    cxy /= K;
    cyy /= K;
    
    // Analytical eigenvalues of 2x2 symmetric matrix
    const trace = cxx + cyy;
    const det = cxx * cyy - cxy * cxy;
    const gap = Math.sqrt(Math.max(0, trace * trace - 4 * det));
    const lambda1 = (trace + gap) / 2; // Maximum eigenvalue
    const lambda0 = (trace - gap) / 2; // Minimum eigenvalue
    
    p.lambda0 = lambda0;
    p.lambda1 = lambda1;
    
    // Compute eigenvector for minimum eigenvalue (Normal n) robustly
    let nx = 0, ny = 0;
    const row1_x = -cxy;
    const row1_y = cxx - lambda0;
    const row2_x = lambda0 - cyy;
    const row2_y = cxy;
    
    // Select the row with the larger norm to avoid dividing by tiny numbers
    if (row1_x*row1_x + row1_y*row1_y > row2_x*row2_x + row2_y*row2_y) {
      nx = row1_x;
      ny = row1_y;
    } else {
      nx = row2_x;
      ny = row2_y;
    }
    
    // Normalize to unit length with a safe epsilon fallback
    const len = Math.sqrt(nx*nx + ny*ny);
    if (len > 1e-8) {
      p.rawNx = nx / len;
      p.rawNy = ny / len;
    } else {
      p.rawNx = 0;
      p.rawNy = -1;
    }
    p.nx = p.rawNx;
    p.ny = p.rawNy;
    
    // Tangent ( eigenvector of max eigenvalue )
    p.tx = -p.ny;
    p.ty = p.nx;
  });

  // Re-generate normal ambiguities (randomize normal orientations initially)
  // unless currently animating propagation
  if (!isPropagating) {
    scrambleNormalDirections();
  }
}

// Scramble estimated normal directions randomly (simulating the unoriented PCA state)
function scrambleNormalDirections() {
  rawPoints.forEach(p => {
    // Generate pseudo-random sign flip based on coordinate
    const seedVal = Math.sin(p.baseX * 12.9898 + p.baseY * 78.233);
    const sign = seedVal > 0 ? 1 : -1;
    const baseNx = p.rawNx !== undefined ? p.rawNx : p.nx;
    const baseNy = p.rawNy !== undefined ? p.rawNy : p.ny;
    p.nx = baseNx * sign;
    p.ny = baseNy * sign;
    p.oriented = false;
  });
}

// Scramble trigger called from DOM button
function randomizeNormals() {
  scrambleNormalDirections();
  redraw();
}

// Reset shape trigger
function resetPoints() {
  stopPropagation();
  mstEdges = [];
  generateShapePoints();
  redraw();
}

// Build Riemannian Graph MST using Prim's Algorithm
function computeMST() {
  const N = rawPoints.length;
  if (N === 0) return;
  
  mstEdges = [];
  mstAdjacency = Array(N).fill(null).map(() => []);
  
  const inMST = Array(N).fill(false);
  const minWeight = Array(N).fill(Infinity);
  const parent = Array(N).fill(-1);
  
  // Start from node 0
  minWeight[0] = 0;
  
  for (let step = 0; step < N; step++) {
    // Find nearest unvisited node
    let u = -1;
    let minW = Infinity;
    for (let i = 0; i < N; i++) {
      if (!inMST[i] && minWeight[i] < minW) {
        minW = minWeight[i];
        u = i;
      }
    }
    
    if (u === -1) {
      // Graph is disconnected, select a new seed to create a forest
      for (let i = 0; i < N; i++) {
        if (!inMST[i]) {
          u = i;
          minWeight[i] = 0;
          break;
        }
      }
      if (u === -1) break;
    }
    
    inMST[u] = true;
    
    // Add edge to MST list
    if (parent[u] !== -1) {
      mstEdges.push({ source: parent[u], target: u });
      mstAdjacency[parent[u]].push(u);
      mstAdjacency[u].push(parent[u]);
    }
    
    // Relax neighbor weights
    const pu = rawPoints[u];
    pu.neighbors.forEach(v => {
      if (!inMST[v]) {
        const pv = rawPoints[v];
        // Weight is plane alignment: 1 - |nu . nv|
        // Plus a tiny distance weight penalty to favor compact spatial tree topologies
        const dot = Math.abs(pu.nx * pv.nx + pu.ny * pv.ny);
        const dist = Math.sqrt((pv.x - pu.x)**2 + (pv.y - pu.y)**2);
        const w = (1.0 - dot) + 0.002 * dist;
        
        if (w < minWeight[v]) {
          minWeight[v] = w;
          parent[v] = u;
        }
      }
    });
  }
}

// Generate the queue of normal-flipping updates using BFS along the MST
function preparePropagationSteps() {
  propagationSteps = [];
  const N = rawPoints.length;
  if (N === 0) return;
  
  const visited = Array(N).fill(false);
  
  // Find point closest to the top-left to act as the primary root
  let root = 0;
  let minDist = Infinity;
  rawPoints.forEach((p, idx) => {
    const d = p.x * p.x + p.y * p.y;
    if (d < minDist) {
      minDist = d;
      root = idx;
    }
  });

  // Calculate Point Cloud Centroid to align the initial root outward
  let sumX = 0, sumY = 0;
  rawPoints.forEach(p => { sumX += p.x; sumY += p.y; });
  const Gx = sumX / N;
  const Gy = sumY / N;

  const queue = [root];
  visited[root] = true;
  
  // Check if root normal points outward (away from centroid)
  const rootPoint = rawPoints[root];
  const outX = rootPoint.x - Gx;
  const outY = rootPoint.y - Gy;
  const dotRoot = rootPoint.nx * outX + rootPoint.ny * outY;
  
  propagationSteps.push({
    parent: null,
    child: root,
    shouldFlip: dotRoot < 0
  });

  // Loop over BFS queue
  while (queue.length > 0) {
    const u = queue.shift();
    
    mstAdjacency[u].forEach(v => {
      if (!visited[v]) {
        visited[v] = true;
        queue.push(v);
        
        // Push candidate step details
        propagationSteps.push({
          parent: u,
          child: v,
          shouldFlip: null // Computed sequentially during animation
        });
      }
    });
  }
  
  // Check if there are disconnected components (unvisited nodes) and queue them
  for (let i = 0; i < N; i++) {
    if (!visited[i]) {
      const qSub = [i];
      visited[i] = true;
      propagationSteps.push({
        parent: null,
        child: i,
        shouldFlip: false
      });
      while (qSub.length > 0) {
        const u = qSub.shift();
        mstAdjacency[u].forEach(v => {
          if (!visited[v]) {
            visited[v] = true;
            qSub.push(v);
            propagationSteps.push({
              parent: u,
              child: v,
              shouldFlip: null
            });
          }
        });
      }
    }
  }
}

// Stop any running propagation animation
function stopPropagation() {
  if (propagationTimer) {
    propagationTimer.stop();
    propagationTimer = null;
  }
  isPropagating = false;
  
  const btn = document.getElementById("btn-mst-run");
  if (btn) {
    btn.innerHTML = "⚡ Run MST Propagation";
    btn.classList.remove("btn-secondary");
    btn.classList.add("btn-primary");
  }
}

// Start and run normal orientation propagation step-by-step
function runMSTPropagation() {
  if (isPropagating) {
    stopPropagation();
    redraw();
    return;
  }
  
  // Set oriented flags initially to false
  rawPoints.forEach(p => p.oriented = false);
  
  computeMST();
  preparePropagationSteps();
  
  isPropagating = true;
  propagationIndex = 0;
  
  const btn = document.getElementById("btn-mst-run");
  if (btn) {
    btn.innerHTML = "⏹️ Stop Propagation";
    btn.classList.add("btn-secondary");
    btn.classList.remove("btn-primary");
  }

  // Iterate BFS steps dynamically
  propagationTimer = d3.interval(() => {
    if (propagationIndex >= propagationSteps.length) {
      stopPropagation();
      // Final oriented colors refresh
      redraw();
      return;
    }
    
    const step = propagationSteps[propagationIndex];
    const childP = rawPoints[step.child];
    
    if (step.parent === null) {
      // Root element orientation
      childP.oriented = true;
      if (step.shouldFlip) {
        childP.nx = -childP.nx;
        childP.ny = -childP.ny;
      }
    } else {
      const parentP = rawPoints[step.parent];
      childP.oriented = true;
      
      // Calculate dot product relative to parent's current orientation
      const dot = parentP.nx * childP.nx + parentP.ny * childP.ny;
      step.shouldFlip = dot < 0;
      
      if (step.shouldFlip) {
        childP.nx = -childP.nx;
        childP.ny = -childP.ny;
      }
    }
    
    propagationIndex++;
    redraw();
  }, 90);
}

// Main visual drawing system using D3
function redraw() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const activeColor = isDark ? "#60a5fa" : "#0041aa";
  const normalColor = isDark ? "#e2e8f0" : "#475569";
  const edgeColor = isDark ? "rgba(96, 165, 250, 0.15)" : "rgba(0, 65, 170, 0.1)";

  // 1. Draw Neighborhood Edges (Step 1)
  if (activeStep === 1) {
    mstGroup.selectAll("line").remove();
    ellipsesGroup.selectAll("path").remove();
    
    const uEdges = edgesGroup.selectAll("line")
      .data(graphEdges);
      
    uEdges.enter().append("line")
      .merge(uEdges)
      .attr("x1", d => rawPoints[d.source].x)
      .attr("y1", d => rawPoints[d.source].y)
      .attr("x2", d => rawPoints[d.target].x)
      .attr("y2", d => rawPoints[d.target].y)
      .attr("stroke", d => {
        if (hoveredPoint !== null && (d.source === hoveredPoint.id || d.target === hoveredPoint.id)) {
          return activeColor;
        }
        return edgeColor;
      })
      .attr("stroke-width", d => {
        if (hoveredPoint !== null && (d.source === hoveredPoint.id || d.target === hoveredPoint.id)) {
          return 2.2;
        }
        return 0.85;
      })
      .attr("stroke-dasharray", d => {
        if (hoveredPoint !== null && (d.source === hoveredPoint.id || d.target === hoveredPoint.id)) {
          return "none";
        }
        return "none";
      });
      
    uEdges.exit().remove();
  } else {
    edgesGroup.selectAll("line").remove();
  }

  // 2. Draw MST Edges (Step 3)
  if (activeStep === 3) {
    const uMst = mstGroup.selectAll("line")
      .data(mstEdges);
      
    uMst.enter().append("line")
      .merge(uMst)
      .attr("x1", d => rawPoints[d.source].x)
      .attr("y1", d => rawPoints[d.source].y)
      .attr("x2", d => rawPoints[d.target].x)
      .attr("y2", d => rawPoints[d.target].y)
      .attr("stroke", (d, idx) => {
        // Highlight edges currently orienting or already oriented
        if (isPropagating) {
          const stepCount = propagationIndex;
          let orientedEdge = false;
          let activeTraverse = false;
          
          for (let i = 0; i < stepCount; i++) {
            const step = propagationSteps[i];
            if (step.parent !== null) {
              if ((step.parent === d.source && step.child === d.target) || 
                  (step.parent === d.target && step.child === d.source)) {
                orientedEdge = true;
                if (i === stepCount - 1) {
                  activeTraverse = true;
                }
              }
            }
          }
          if (activeTraverse) return "var(--primary)";
          if (orientedEdge) return "rgba(16, 185, 129, 0.7)"; // Green oriented edge
        }
        return isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
      })
      .attr("stroke-width", d => {
        if (isPropagating) {
          const stepCount = propagationIndex;
          for (let i = 0; i < stepCount; i++) {
            const step = propagationSteps[i];
            if (step.parent !== null && 
                ((step.parent === d.source && step.child === d.target) || 
                 (step.parent === d.target && step.child === d.source))) {
              return i === stepCount - 1 ? 4.5 : 2.5;
            }
          }
        }
        return 1.25;
      });
      
    uMst.exit().remove();
  } else {
    mstGroup.selectAll("line").remove();
  }

  // 3. Draw PCA Ellipses (Step 2)
  if (activeStep === 2) {
    const activeEllipses = rawPoints.filter(p => {
      return hoveredPoint !== null && p.id === hoveredPoint.id;
    });
    
    const uEllipses = ellipsesGroup.selectAll("path")
      .data(activeEllipses, d => d.id);
      
    uEllipses.enter().append("path")
      .merge(uEllipses)
      .attr("d", d => {
        // Build SVG path for rotated ellipse
        // Scaling factor for drawing
        const scale = 5.5;
        const rx = Math.sqrt(d.lambda1) * scale;
        const ry = Math.sqrt(d.lambda0) * scale;
        
        // Generate parametric points for rotated ellipse
        const pts = [];
        const steps = 40;
        const angle = Math.atan2(d.ty, d.tx);
        
        for (let i = 0; i <= steps; i++) {
          const t = (i * 2 * Math.PI) / steps;
          // Coordinates relative to center
          const ex = rx * Math.cos(t);
          const ey = ry * Math.sin(t);
          // Rotate
          const rx_rot = ex * Math.cos(angle) - ey * Math.sin(angle);
          const ry_rot = ex * Math.sin(angle) + ey * Math.cos(angle);
          
          pts.push((d.x + rx_rot).toFixed(1) + "," + (d.y + ry_rot).toFixed(1));
        }
        return "M" + pts.join("L") + "Z";
      })
      .attr("fill", "rgba(16, 185, 129, 0.08)")
      .attr("stroke", "rgb(16, 185, 129)")
      .attr("stroke-width", 2.2)
      .attr("stroke-dasharray", "4,3");
      
    uEllipses.exit().remove();
  } else {
    ellipsesGroup.selectAll("path").remove();
  }

  // 4. Draw Normals (Step 2 & 3)
  if (activeStep >= 2) {
    const uNormals = normalsGroup.selectAll("line")
      .data(rawPoints, d => d.id);
      
    uNormals.enter().append("line")
      .merge(uNormals)
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", d => d.x + d.nx * 24)
      .attr("y2", d => d.y + d.ny * 24)
      .attr("stroke", d => {
        if (activeStep === 3) {
          if (d.oriented) return "#10b981"; // Oriented = green
          return "#ef4444"; // Unoriented = red
        }
        if (hoveredPoint !== null && d.id === hoveredPoint.id) {
          return "var(--primary)";
        }
        return normalColor;
      })
      .attr("stroke-width", d => {
        if (hoveredPoint !== null && d.id === hoveredPoint.id) return 3.2;
        return 1.8;
      })
      .attr("marker-end", d => {
        if (hoveredPoint !== null && d.id === hoveredPoint.id) return "url(#arrow-highlight)";
        return "url(#arrow)";
      });
      
    uNormals.exit().remove();
  } else {
    normalsGroup.selectAll("line").remove();
  }

  // 5. Draw Points
  const uPoints = pointsGroup.selectAll("circle")
    .data(rawPoints, d => d.id);
    
  uPoints.enter().append("circle")
    .merge(uPoints)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => {
      if (hoveredPoint !== null && d.id === hoveredPoint.id) return 7;
      return 4.5;
    })
    .attr("fill", d => {
      if (hoveredPoint !== null && d.id === hoveredPoint.id) return "var(--primary)";
      if (activeStep === 3) {
        if (d.oriented) return "#10b981"; // Oriented = green
        return "#ef4444"; // Unoriented = red
      }
      return normalColor;
    })
    .attr("stroke", isDark ? "#1e293b" : "#ffffff")
    .attr("stroke-width", 1.5)
    .on("mouseover", function(d) {
      hoveredPoint = d;
      redraw();
    })
    .on("mouseout", function() {
      hoveredPoint = null;
      redraw();
    });
    
  uPoints.exit().remove();

  // 6. Draw Local Search Probe (Step 1)
  if (activeStep === 1 && hoveredPoint !== null) {
    const uOverlay = overlayGroup.selectAll("circle")
      .data([hoveredPoint], d => d.id);
      
    uOverlay.enter().append("circle")
      .merge(uOverlay)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", searchRadius)
      .attr("fill", "none")
      .attr("stroke", activeColor)
      .attr("stroke-width", 1.25)
      .attr("stroke-dasharray", "3,3");
      
    uOverlay.exit().remove();
  } else {
    overlayGroup.selectAll("circle").remove();
  }
}

// Hook called when user switches guide steps
function onStepChange(step) {
  activeStep = step;
  stopPropagation();
  
  // Set step state properties
  const mstContainer = document.getElementById("mst-btn-container");
  const scrambleBtn = document.getElementById("btn-scramble");
  
  if (mstContainer) {
    mstContainer.style.display = (step === 3) ? "flex" : "none";
  }
  if (scrambleBtn) {
    scrambleBtn.style.display = (step === 3) ? "block" : "none";
  }
  
  // Scramble normals if entering step 2 or 3 to demonstrate ambiguity/orient state
  if (step >= 2) {
    scrambleNormalDirections();
  }
  
  redraw();
}

// Handle theme switching callbacks
function onThemeChange(theme) {
  redraw();
}

// Bind interactive DOM events
window.addEventListener('DOMContentLoaded', () => {
  initMarkers();
  generateShapePoints();
  
  // Slider epsilon search radius
  const sliderEps = document.getElementById("slider-epsilon");
  const valEps = document.getElementById("val-epsilon");
  if (sliderEps) {
    sliderEps.addEventListener("input", (e) => {
      searchRadius = parseInt(e.target.value);
      valEps.innerText = searchRadius + "px";
      stopPropagation();
      mstEdges = [];
      computeNeighborhoodsAndPCA();
      redraw();
    });
  }
  
  // Slider noise level
  const sliderNoise = document.getElementById("slider-noise");
  const valNoise = document.getElementById("val-noise");
  if (sliderNoise) {
    sliderNoise.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      noiseLevel = val;
      
      let label = "Medium";
      if (val === 0) label = "None";
      else if (val < 7) label = "Low";
      else if (val > 14) label = "High";
      
      valNoise.innerText = label;
      stopPropagation();
      mstEdges = [];
      applyNoiseAndRecompute();
      redraw();
    });
  }
  
  // Shape preset dropdown
  const shapeSelect = document.getElementById("shape-select");
  if (shapeSelect) {
    shapeSelect.addEventListener("change", (e) => {
      currentShape = e.target.value;
      resetPoints();
    });
  }
  
  // MST Run button
  const runBtn = document.getElementById("btn-mst-run");
  if (runBtn) {
    runBtn.addEventListener("click", () => {
      runMSTPropagation();
    });
  }
  
  // SVG background click listener to add custom points
  svg.on("click", function() {
    // Only allow custom sampling in Step 1/2 when not propagating
    if (isPropagating || activeStep === 3) return;
    
    // Ignore click if clicking directly on a point circle
    if (d3.event.target.tagName.toLowerCase() === "circle" && d3.event.target.id !== "normal_svg") return;
    
    const coords = d3.mouse(this);
    const newId = rawPoints.length;
    
    rawPoints.push({
      id: newId,
      baseX: coords[0],
      baseY: coords[1],
      x: coords[0],
      y: coords[1],
      nx: 0,
      ny: -1,
      tx: 1,
      ty: 0,
      lambda0: 0,
      lambda1: 0,
      oriented: false,
      mstParent: null
    });
    
    mstEdges = [];
    computeNeighborhoodsAndPCA();
    redraw();
  });

  // Load first step view state
  onStepChange(1);
});
