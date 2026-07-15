// Bilateral Filter Sandbox JS Logic - Live Edge Preserving Visualizer
let activeFilterStep = 1;
let sigmaS = 6;
let sigmaR = 30;
let hasNoise = true;
let currentPreset = 'edge'; // 'edge', 'face', 'circles'

const width = 150;
const height = 125;

// Canvas elements
const canvasInput = document.getElementById('canvas-input');
const canvasKernel = document.getElementById('canvas-kernel');
const canvasOutput = document.getElementById('canvas-output');
const canvasProfile = document.getElementById('canvas-profile');

const ctxInput = canvasInput.getContext('2d');
const ctxKernel = canvasKernel.getContext('2d');
const ctxOutput = canvasOutput.getContext('2d');
const ctxProfile = canvasProfile.getContext('2d');

// Image data storage (using clean & noisy backing buffers)
let cleanPixels = new Uint8ClampedArray(width * height);
let noisyPixels = new Uint8ClampedArray(width * height);
let filteredPixels = new Uint8ClampedArray(width * height);

// Mouse probe position
let mouseX = width / 2;
let mouseY = height / 2;
let isHovering = false;

// Generate images based on active preset
function generatePresetImage() {
  if (currentPreset === 'edge') {
    // 1. Synthetic Step-Edge: Light region on the left, dark on the right
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const boundaryX = width / 2 + Math.sin(y / 15) * 12; // Wavy boundary
        const val = (x < boundaryX) ? 190 : 60;
        
        cleanPixels[idx] = val;
        const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 22;
        noisyPixels[idx] = Math.max(0, Math.min(255, val + noise));
      }
    }
  } else if (currentPreset === 'face') {
    // 2. 3D-Shaded Geometric Sphere (Lambertian Shading)
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.38;
    const Lx = 0.577, Ly = -0.577, Lz = 0.577; // Light source direction vector (normalized)
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let val = 45; // Deep background
        
        const dx = x - cx;
        const dy = y - cy;
        const dist2 = dx*dx + dy*dy;
        
        if (dist2 < r*r) {
          const z = Math.sqrt(r*r - dist2);
          const nx = dx / r;
          const ny = dy / r;
          const nz = z / r;
          const dot = nx*Lx + ny*Ly + nz*Lz;
          const diffuse = Math.max(0, dot);
          
          // Render a beautifully shaded sphere with a light highlight
          val = 50 + Math.floor(190 * diffuse);
        }
        
        cleanPixels[idx] = val;
        const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 24;
        noisyPixels[idx] = Math.max(0, Math.min(255, val + noise));
      }
    }
  } else if (currentPreset === 'circles') {
    // 3. Mathematical Sinusoidal Ripple Grid
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        
        // 2D Ripple field formula
        const angle = Math.sqrt((x - width/2)*(x - width/2) + (y - height/2)*(y - height/2)) / 5.5;
        const factor = Math.sin(angle);
        const val = 127 + Math.floor(95 * factor);
        
        cleanPixels[idx] = val;
        const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 24;
        noisyPixels[idx] = Math.max(0, Math.min(255, val + noise));
      }
    }
  }
  
  // Re-run filter and draw instantly
  applyBilateralFilter();
}

// Compute the entire filter result instantly using pre-computed math lookup tables
function applyBilateralFilter() {
  const source = hasNoise ? noisyPixels : cleanPixels;
  
  // 1. Pre-compute spatial Gaussian weight table (radius limited to 3*sigmaS)
  const spatialRadius = Math.ceil(sigmaS * 3);
  const spatialWeights = [];
  const sCoeff = 2 * sigmaS * sigmaS;
  for (let dy = -spatialRadius; dy <= spatialRadius; dy++) {
    for (let dx = -spatialRadius; dx <= spatialRadius; dx++) {
      const d2 = dx * dx + dy * dy;
      if (d2 <= spatialRadius * spatialRadius) {
        spatialWeights.push({
          dx: dx,
          dy: dy,
          w_s: Math.exp(-d2 / sCoeff)
        });
      }
    }
  }
  const sLen = spatialWeights.length;

  // 2. Pre-compute range weight table (difference between 0 and 255)
  const rangeWeights = new Float32Array(256);
  const rCoeff = 2 * sigmaR * sigmaR;
  for (let i = 0; i < 256; i++) {
    rangeWeights[i] = Math.exp(-(i * i) / rCoeff);
  }

  // 3. Main fast filtering loop
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const centerVal = source[idx];
      
      let sumVal = 0;
      let sumW = 0;
      
      for (let i = 0; i < sLen; i++) {
        const item = spatialWeights[i];
        const nx = x + item.dx;
        const ny = y + item.dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          const neighborVal = source[nidx];
          
          let w = 1.0;
          if (activeFilterStep === 1) {
            // Gaussian: only spatial weights
            w = item.w_s;
          } else if (activeFilterStep === 2) {
            // Range Similarity only: ignore spatial distance, use entire image radius
            const dI = Math.abs(neighborVal - centerVal);
            w = rangeWeights[dI];
          } else {
            // Bilateral: spatial weight * range weight
            const dI = Math.abs(neighborVal - centerVal);
            w = item.w_s * rangeWeights[dI];
          }
          
          sumVal += neighborVal * w;
          sumW += w;
        }
      }
      
      filteredPixels[idx] = sumW > 0 ? sumVal / sumW : centerVal;
    }
  }
  
  // Redraw canvases
  drawInputCanvas();
  updateKernelCanvas();
  drawIntensityProfile();
  updateSVGOverlay();
  updateProfileExplanation();
}

// Draw the source (noisy/clean) and filtered result images
function drawInputCanvas() {
  // 1. Draw source (noisy or clean input) on Left Canvas (Input)
  const source = hasNoise ? noisyPixels : cleanPixels;
  const imgDataSrc = ctxInput.createImageData(width, height);
  const dataSrc = imgDataSrc.data;
  for (let i = 0; i < width * height; i++) {
    const val = source[i];
    const idx = i * 4;
    dataSrc[idx]     = val;
    dataSrc[idx + 1] = val;
    dataSrc[idx + 2] = val;
    dataSrc[idx + 3] = 255;
  }
  ctxInput.putImageData(imgDataSrc, 0, 0);

  // 2. Draw filtered pixels on Right Canvas (Output)
  const imgDataOut = ctxOutput.createImageData(width, height);
  const dataOut = imgDataOut.data;
  for (let i = 0; i < width * height; i++) {
    const val = filteredPixels[i];
    const idx = i * 4;
    dataOut[idx]     = val;
    dataOut[idx + 1] = val;
    dataOut[idx + 2] = val;
    dataOut[idx + 3] = 255;
  }
  ctxOutput.putImageData(imgDataOut, 0, 0);
}

// Draw the spatial/similarity filter kernel weight on the right canvas
function updateKernelCanvas() {
  const imgData = ctxKernel.createImageData(width, height);
  const data = imgData.data;
  
  // Fill background
  const bgR = 15, bgG = 17, bgB = 23; // Dark theme card default background
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    data[idx]     = bgR;
    data[idx + 1] = bgG;
    data[idx + 2] = bgB;
    data[idx + 3] = 255;
  }
  
  // Always render weights for (mouseX, mouseY)
  const source = hasNoise ? noisyPixels : cleanPixels;
  const centerIdx = Math.floor(mouseY) * width + Math.floor(mouseX);
  const centerVal = source[centerIdx];
  
  let rCoeff = 124, gCoeff = 58, bCoeff = 237;
  if (activeFilterStep === 1) {
    rCoeff = 124; gCoeff = 58; bCoeff = 237; // Violet
  } else if (activeFilterStep === 2) {
    rCoeff = 5; gCoeff = 150; bCoeff = 105; // Green
  } else {
    rCoeff = 219; gCoeff = 39; bCoeff = 119; // Magenta
  }
  
  // Evaluate spatial radius
  const radius = (activeFilterStep === 2) ? Math.max(width, height) : Math.ceil(sigmaS * 3);
  const startX = Math.max(0, Math.floor(mouseX - radius));
  const endX = Math.min(width - 1, Math.floor(mouseX + radius));
  const startY = Math.max(0, Math.floor(mouseY - radius));
  const endY = Math.min(height - 1, Math.floor(mouseY + radius));
  
  for (let ny = startY; ny <= endY; ny++) {
    for (let nx = startX; nx <= endX; nx++) {
      const dx = nx - mouseX;
      const dy = ny - mouseY;
      const d2 = dx*dx + dy*dy;
      
      let w = 0;
      if (activeFilterStep === 1) {
        w = Math.exp(-d2 / (2 * sigmaS * sigmaS));
      } else if (activeFilterStep === 2) {
        const neighborVal = source[ny * width + nx];
        const dI = neighborVal - centerVal;
        w = Math.exp(-(dI*dI) / (2 * sigmaR * sigmaR));
      } else {
        const neighborVal = source[ny * width + nx];
        const dI = neighborVal - centerVal;
        const w_s = Math.exp(-d2 / (2 * sigmaS * sigmaS));
        const w_r = Math.exp(-(dI*dI) / (2 * sigmaR * sigmaR));
        w = w_s * w_r;
      }
      
      if (w > 0.005) {
        const idx = (ny * width + nx) * 4;
        data[idx]     = Math.floor(bgR * (1 - w) + rCoeff * w);
        data[idx + 1] = Math.floor(bgG * (1 - w) + gCoeff * w);
        data[idx + 2] = Math.floor(bgB * (1 - w) + bCoeff * w);
      }
    }
  }
  
  ctxKernel.putImageData(imgData, 0, 0);
}

// Update high-resolution SVG overlay vector target indicators
function updateSVGOverlay() {
  const svgInput = document.getElementById('svg-overlay-input');
  const svgKernel = document.getElementById('svg-overlay-kernel');
  const svgOutput = document.getElementById('svg-overlay-output');
  
  const guideLineInput = document.getElementById('guide-line-input');
  const guideLineOutput = document.getElementById('guide-line-output');
  const sigmaCircle = document.getElementById('sigma-circle-input');
  const probeDotInput = document.getElementById('probe-dot-input');
  const probeDotKernel = document.getElementById('probe-dot-kernel');
  const probeDotOutput = document.getElementById('probe-dot-output');
  
  if (!svgInput || !svgKernel) return;
  
  // Theme color dynamically matching active step
  let themeVar = 'rgb(124, 58, 237)';
  if (activeFilterStep === 1) themeVar = 'rgb(124, 58, 237)';
  else if (activeFilterStep === 2) themeVar = 'rgb(5, 150, 105)';
  else themeVar = 'rgb(219, 39, 119)';
  
  svgInput.style.color = themeVar;
  svgKernel.style.color = themeVar;
  if (svgOutput) svgOutput.style.color = themeVar;
  
  // Update targets position
  if (probeDotInput) {
    probeDotInput.setAttribute('cx', mouseX);
    probeDotInput.setAttribute('cy', mouseY);
    probeDotInput.setAttribute('stroke-width', isHovering ? '1.5' : '1.0');
    probeDotInput.setAttribute('stroke-dasharray', isHovering ? 'none' : '1.5,1.5');
  }
  if (probeDotKernel) {
    probeDotKernel.setAttribute('cx', mouseX);
    probeDotKernel.setAttribute('cy', mouseY);
    probeDotKernel.setAttribute('stroke-width', isHovering ? '1.5' : '1.0');
    probeDotKernel.setAttribute('stroke-dasharray', isHovering ? 'none' : '1.5,1.5');
  }
  if (probeDotOutput) {
    probeDotOutput.setAttribute('cx', mouseX);
    probeDotOutput.setAttribute('cy', mouseY);
    probeDotOutput.setAttribute('stroke-width', isHovering ? '1.5' : '1.0');
    probeDotOutput.setAttribute('stroke-dasharray', isHovering ? 'none' : '1.5,1.5');
  }
  
  // Update horizontal guide lines position
  if (guideLineInput) {
    guideLineInput.setAttribute('y1', mouseY);
    guideLineInput.setAttribute('y2', mouseY);
    guideLineInput.setAttribute('stroke-dasharray', isHovering ? 'none' : '3,3');
    guideLineInput.setAttribute('stroke', isHovering ? 'rgba(239, 68, 68, 0.65)' : 'rgba(239, 68, 68, 0.35)');
  }
  if (guideLineOutput) {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0041aa';
    let primaryStroke = primaryColor;
    if (primaryColor.startsWith('rgb')) {
      primaryStroke = primaryColor.replace('rgb', 'rgba').replace(')', isHovering ? ', 0.65)' : ', 0.35)');
    }
    guideLineOutput.setAttribute('y1', mouseY);
    guideLineOutput.setAttribute('y2', mouseY);
    guideLineOutput.setAttribute('stroke-dasharray', isHovering ? 'none' : '3,3');
    guideLineOutput.setAttribute('stroke', primaryStroke);
  }
  
  // Update spatial sigma reach circle radius
  if (sigmaCircle) {
    if (activeFilterStep === 1 || activeFilterStep === 3) {
      sigmaCircle.style.display = 'block';
      sigmaCircle.setAttribute('cx', mouseX);
      sigmaCircle.setAttribute('cy', mouseY);
      sigmaCircle.setAttribute('r', sigmaS * 2);
    } else {
      sigmaCircle.style.display = 'none';
    }
  }
}

// Draw 1D horizontal profile slices comparing noisy vs filtered row intensities
function drawIntensityProfile() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvasProfile.getBoundingClientRect();
  canvasProfile.width = rect.width * dpr;
  canvasProfile.height = rect.height * dpr;
  
  ctxProfile.scale(dpr, dpr);
  ctxProfile.clearRect(0, 0, rect.width, rect.height);
  
  const hRow = Math.floor(mouseY);
  const source = hasNoise ? noisyPixels : cleanPixels;
  
  // Draw helper grid lines
  ctxProfile.strokeStyle = 'rgba(200, 200, 200, 0.15)';
  ctxProfile.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    const yGrid = rect.height * (i / 4);
    ctxProfile.beginPath();
    ctxProfile.moveTo(0, yGrid);
    ctxProfile.lineTo(rect.width, yGrid);
    ctxProfile.stroke();
  }

  // Draw light/dark labels
  ctxProfile.font = '500 10px Inter, sans-serif';
  ctxProfile.fillStyle = 'var(--text-muted)';
  ctxProfile.fillText('Light', 8, 14);
  ctxProfile.fillText('Dark', 8, rect.height - 8);
  
  // Calculate horizontal scale mapping image width (150) to canvas width
  const scaleX = rect.width / (width - 1);
  const scaleY = (rect.height - 12) / 255; // Margins top/bottom
  
  // Helper to map pixel value to canvas y-coordinate
  const getY = (val) => rect.height - 6 - (val * scaleY);
  
  // 1. Draw Noisy Input slice profile (red line)
  ctxProfile.strokeStyle = 'rgba(239, 68, 68, 0.55)'; // Orange-Red
  ctxProfile.lineWidth = 1.2;
  ctxProfile.beginPath();
  for (let x = 0; x < width; x++) {
    const val = source[hRow * width + x];
    const cx = x * scaleX;
    const cy = getY(val);
    if (x === 0) ctxProfile.moveTo(cx, cy);
    else ctxProfile.lineTo(cx, cy);
  }
  ctxProfile.stroke();
  
  // 2. Draw Filtered slice profile (Primary Theme color)
  const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0041aa';
  
  ctxProfile.strokeStyle = activeColor;
  ctxProfile.lineWidth = 2.5;
  ctxProfile.beginPath();
  for (let x = 0; x < width; x++) {
    const val = filteredPixels[hRow * width + x];
    const cx = x * scaleX;
    const cy = getY(val);
    if (x === 0) ctxProfile.moveTo(cx, cy);
    else ctxProfile.lineTo(cx, cy);
  }
  ctxProfile.stroke();
  
  // 3. Draw vertical hover line indicator
  if (isHovering) {
    const hx = mouseX * scaleX;
    ctxProfile.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctxProfile.setLineDash([2, 2]);
    ctxProfile.lineWidth = 1.2;
    ctxProfile.beginPath();
    ctxProfile.moveTo(hx, 0);
    ctxProfile.lineTo(hx, rect.height);
    ctxProfile.stroke();
    ctxProfile.setLineDash([]);
  }
}

// Operation triggers

function resetAll() {
  mouseX = width / 2;
  mouseY = height / 2;
  
  // Reset slider state parameters
  sigmaS = 6;
  sigmaR = 30;
  
  // Update DOM slider elements
  const sliderS = document.getElementById('slider-sigma-s');
  const sliderR = document.getElementById('slider-sigma-r');
  const valS = document.getElementById('val-sigma-s');
  const valR = document.getElementById('val-sigma-r');
  
  if (sliderS) sliderS.value = 6;
  if (sliderR) sliderR.value = 30;
  if (valS) valS.innerText = 6;
  if (valR) valR.innerText = 30;
  
  applyBilateralFilter();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Calculate letterboxed drawing parameters to fit image inside width (150) and height (125)
      const canvasAspect = width / height;
      const imgAspect = img.width / img.height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;
      
      if (imgAspect > canvasAspect) {
        drawW = width;
        drawH = width / imgAspect;
        drawY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
      }
      
      // Create offscreen canvas to scale and render the image
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const oCtx = offscreen.getContext('2d');
      
      // Fill background with solid white
      oCtx.fillStyle = '#ffffff';
      oCtx.fillRect(0, 0, width, height);
      
      // Draw image centered and scaled
      oCtx.drawImage(img, drawX, drawY, drawW, drawH);
      
      // Read back pixels and convert to grayscale
      const imgData = oCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      
      for (let i = 0; i < width * height; i++) {
        const idx = i * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const gray = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
        
        cleanPixels[i] = gray;
        const noise = (Math.random() + Math.random() + Math.random() - 1.5) * 22;
        noisyPixels[i] = Math.max(0, Math.min(255, gray + noise));
      }
      
      // Set preset select to custom option
      currentPreset = 'custom';
      const presetSelect = document.getElementById('preset-select');
      const customOption = document.getElementById('custom-option-label');
      if (presetSelect && customOption) {
        customOption.style.display = 'block';
        presetSelect.value = 'custom';
      }
      
      // Apply filter and redraw
      applyBilateralFilter();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function onPresetChange(preset) {
  currentPreset = preset;
  generatePresetImage();
}

function handleMouseMove(e) {
  const rect = canvasInput.getBoundingClientRect();
  const scaleX = width / rect.width;
  const scaleY = height / rect.height;
  
  mouseX = (e.clientX - rect.left) * scaleX;
  mouseY = (e.clientY - rect.top) * scaleY;
  
  mouseX = Math.max(0, Math.min(width - 1, mouseX));
  mouseY = Math.max(0, Math.min(height - 1, mouseY));
  
  isHovering = true;
  
  drawInputCanvas();
  updateKernelCanvas();
  drawIntensityProfile();
  updateSVGOverlay();
  updateProfileExplanation();
}

function handleMouseLeave() {
  isHovering = false;
  drawInputCanvas();
  updateKernelCanvas();
  drawIntensityProfile();
  updateSVGOverlay();
  updateProfileExplanation();
}

function updateProfileExplanation() {
  const explanationEl = document.getElementById('profile-explanation');
  if (!explanationEl) return;
  
  let text = "";
  if (activeFilterStep === 1) {
    text = "📊 <b>Step 1 (Gaussian Blur):</b> The blue line averages pixel intensities purely based on spatial distance. Notice how it rounds off the sharp vertical step-edge, turning the clean boundary into a lazy, blurred slope.";
  } else if (activeFilterStep === 2) {
    text = "📊 <b>Step 2 (Similarity Tolerance):</b> The green similarity weights ignore spatial distance. Probing near the edge shows high weights only for pixels on the <i>same</i> side of the boundary, while completely ignoring the other side.";
  } else {
    text = "📊 <b>Step 3 (Bilateral Filter):</b> The blue line combines proximity and color similarity. Probing the edge shows a cropped weight circle that smooths noise on both sides but respects the boundary, keeping the vertical step razor-sharp.";
  }
  
  if (!isHovering) {
    text += " <i>(Defaulting to center coordinate; hover over the image to probe different areas).</i>";
  }
  
  explanationEl.innerHTML = text;
}

// Hook called by general_visualizer layout when the step changes
function onStepChange(step) {
  activeFilterStep = step;
  
  // Refresh filter state
  applyBilateralFilter();
  
  const labels = [
    "2. Spatial Weight ($w_s$)",
    "2. Range Weight ($w_r$)",
    "2. Bilateral Weight ($w_s \\times w_r$)"
  ];
  
  const labelEl = document.getElementById('kernel-type-label');
  if (labelEl) {
    labelEl.innerText = labels[step - 1];
    if (typeof renderMathInElement !== 'undefined') {
      renderMathInElement(labelEl, {
        delimiters: [{left: "$", right: "$", display: false}],
        trust: true
      });
    }
  }

  // Enable/Disable slider sections based on step
  const sliderGroupS = document.getElementById('group-slider-s');
  const sliderGroupR = document.getElementById('group-slider-r');
  
  if (sliderGroupS && sliderGroupR) {
    if (step === 1) {
      sliderGroupS.style.opacity = '1';
      sliderGroupS.style.pointerEvents = 'auto';
      sliderGroupR.style.opacity = '0.35';
      sliderGroupR.style.pointerEvents = 'none';
    } else if (step === 2) {
      sliderGroupS.style.opacity = '0.35';
      sliderGroupS.style.pointerEvents = 'none';
      sliderGroupR.style.opacity = '1';
      sliderGroupR.style.pointerEvents = 'auto';
    } else {
      sliderGroupS.style.opacity = '1';
      sliderGroupS.style.pointerEvents = 'auto';
      sliderGroupR.style.opacity = '1';
      sliderGroupR.style.pointerEvents = 'auto';
    }
  }
  
  updateSVGOverlay();
  updateProfileExplanation();
}

// Hook for layout theme changes
function onThemeChange(theme) {
  applyBilateralFilter();
}

// Initialization and event bindings
window.addEventListener('DOMContentLoaded', () => {
  generatePresetImage();
  
  // Attach hover events
  canvasInput.addEventListener('mousemove', handleMouseMove);
  canvasInput.addEventListener('mouseleave', handleMouseLeave);
  
  // Attach sliders
  const sliderS = document.getElementById('slider-sigma-s');
  const sliderR = document.getElementById('slider-sigma-r');
  const valS = document.getElementById('val-sigma-s');
  const valR = document.getElementById('val-sigma-r');
  
  if (sliderS) {
    sliderS.addEventListener('input', (e) => {
      sigmaS = parseInt(e.target.value);
      valS.innerText = sigmaS;
      applyBilateralFilter();
    });
  }
  
  if (sliderR) {
    sliderR.addEventListener('input', (e) => {
      sigmaR = parseInt(e.target.value);
      valR.innerText = sigmaR;
      applyBilateralFilter();
    });
  }
  
  // Trigger initial step configuration
  onStepChange(1);
  
  // Listen to resize to scale profile canvas
  window.addEventListener('resize', drawIntensityProfile);
});
