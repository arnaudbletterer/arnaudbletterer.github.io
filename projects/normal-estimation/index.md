---
layout: general_visualizer
title: "Didactic Guide: Point Cloud Normal Estimation"
subtitle: "An interactive guide to normal estimation & graph propagation"
custom_scripts:
  - "https://d3js.org/d3.v4.min.js"
  - "main.js"
math_terms:
  math-term-ni:
    title: 'Neighborhood'
    term: '\mathcal{N}(\mathbf{p}_i)'
    desc: 'The set of neighboring points surrounding the target point $\mathbf{p}_i$, used to estimate local surface properties.'
  math-term-epsilon:
    title: 'Radius Epsilon'
    term: '\epsilon'
    desc: 'The spatial radius defining the size of the neighborhood. Points closer than $\epsilon$ are included.'
  math-term-ci:
    title: 'Covariance Matrix'
    term: '\mathbf{C}_i'
    desc: 'A $2 \times 2$ symmetric matrix describing the spatial spread of neighbors around their local centroid.'
  math-term-wij:
    title: 'Propagation Weight'
    term: 'w_{ij}'
    desc: 'Edge weight between point $i$ and $j$, equal to $1 - |\mathbf{n}_i \cdot \mathbf{n}_j|$. Near 0 for parallel normals, near 1 for perpendicular normals.'
  math-term-dot:
    title: 'Normal Dot Product'
    term: '\mathbf{n}_i \cdot \mathbf{n}_j'
    desc: 'The dot product of adjacent normals. If negative, they point in opposite directions and one must be flipped.'
  math-term-pi-point:
    title: 'Target Point'
    term: '\mathbf{p}_i'
    desc: 'The spatial coordinate of the target point currently being processed.'
  math-term-pj-point:
    title: 'Neighbor Point'
    term: '\mathbf{p}_j'
    desc: 'A neighboring point coordinate belonging to the point''s local search neighborhood.'
  math-term-centroid:
    title: 'Neighborhood Centroid'
    term: '\bar{\mathbf{p}}_i'
    desc: 'The geometric center of all neighborhood points: $\bar{\mathbf{p}}_i = \frac{1}{K} \sum \mathbf{p}_j$.'
  math-term-ni-vec:
    title: 'Normal Vector'
    term: '\mathbf{n}_i'
    desc: 'The unit normal vector perpendicular to the local tangent plane estimated at point $i$.'
  math-term-lambda:
    title: 'Smallest Eigenvalue'
    term: '\lambda_0'
    desc: 'Eigenvalue representing variance in the normal direction. Near 0 for thin clean surfaces, increases with noise.'
steps:
  - title: "1. Local Neighborhoods"
    description: >
      To estimate local geometry at a point $\htmlClass{math-term-pi-point math-color-3}{\mathbf{p}_i}$ on a raw point cloud, we must first establish its local context. We construct a neighborhood $\htmlClass{math-term-ni math-color-1}{\mathcal{N}(\mathbf{p}_i)}$ of nearby points, typically using the $k$-nearest neighbors ($k$-NN) or a spatial radius search ($\epsilon$-neighborhood):

      $$ \htmlClass{math-term-ni math-color-1}{\mathcal{N}(\mathbf{p}_i)} = \{ \htmlClass{math-term-pj-point math-color-2}{\mathbf{p}_j} \in \mathcal{P} \mid \|\htmlClass{math-term-pj-point math-color-2}{\mathbf{p}_j} - \htmlClass{math-term-pi-point math-color-3}{\mathbf{p}_i}\| \le \htmlClass{math-term-epsilon math-color-4}{\epsilon} \} $$
    instruction: "🎮 **Play:** Hover over the canvas to see the local neighborhood connection graph (colored lines) update in real-time around your cursor."
    takeaway: '💡 **Key Insight:** Choosing the neighborhood size ($\htmlClass{math-term-epsilon math-color-4}{\epsilon}$) is a fundamental scale problem: if too small, noise dominates; if too large, fine geometric details and sharp corners are smoothed out.'

  - title: "2. Principal Component Analysis (PCA)"
    description: >
      For each point $\mathbf{p}_i$, we analyze the spatial layout of its neighborhood $\mathcal{N}(\mathbf{p}_i)$ by computing the symmetric covariance matrix $\htmlClass{math-term-ci math-color-1}{\mathbf{C}_i}$ relative to the neighborhood's centroid $\htmlClass{math-term-centroid math-color-2}{\bar{\mathbf{p}}_i}$:

      $$ \htmlClass{math-term-ci math-color-1}{\mathbf{C}_i} = \frac{1}{|\mathcal{N}(\mathbf{p}_i)|} \sum_{j \in \mathcal{N}(\mathbf{p}_i)} (\mathbf{p}_j - \htmlClass{math-term-centroid math-color-2}{\bar{\mathbf{p}}_i})(\mathbf{p}_j - \htmlClass{math-term-centroid math-color-2}{\bar{\mathbf{p}}_i})^T $$

      The eigenvectors of $\mathbf{C}_i$ define the principal directions of variance. The eigenvector associated with the smallest eigenvalue $\htmlClass{math-term-lambda math-color-4}{\lambda_0}$ points in the direction of minimum variance: our estimated normal vector $\htmlClass{math-term-ni-vec math-color-3}{\mathbf{n}_i}$.
    instruction: '🎮 **Play:** Hover over points. The colored ellipse shows the local covariance PCA distribution, and the line shows the estimated normal. Notice that the normal direction ($\pm\mathbf{n}$) is mathematically ambiguous.'
    takeaway: "💡 **Key Insight:** Standard PCA only gives a normal *line*, not a *vector*. Normals estimated independently at each point are randomly oriented inward or outward."

  - title: "3. Minimum Spanning Tree (MST) Orientation Propagation"
    description: >
      To align all normals consistently, we construct a Riemannian graph connecting adjacent neighbors. We weight each edge $\{i, j\}$ by the alignment of their tangent plane normals:

      $$ \htmlClass{math-term-wij math-color-1}{w_{ij}} = 1 - |\htmlClass{math-term-dot math-color-2}{\mathbf{n}_i \cdot \mathbf{n}_j}| $$

      We compute the Minimum Spanning Tree (MST) on this graph. Starting from a chosen root, we propagate orientations along the tree: if the dot product $\mathbf{n}_i \cdot \mathbf{n}_j < 0$, we flip $\mathbf{n}_j$ to $-\mathbf{n}_j$.
    instruction: "🎮 **Play:** Click **Run MST Propagation** to watch orientation propagate along the tree edges, flipping all unaligned normals into a consistent, unified outward direction."
    takeaway: '💡 **Key Insight:** Minimizing $1 - |\htmlClass{math-term-dot math-color-2}{\mathbf{n}_i \cdot \mathbf{n}_j}|$ ensures we propagate orientations along flat regions first, avoiding propagation across sharp folds or noisy seams where orientations can break.'
---

<div class="viewport-card" style="max-width: 800px; width: 100%;">
  <h3 id="main-canvas-title">Normal Estimation Sandbox</h3>
  
  <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; position: relative; width: 100%;">
    <!-- SVG Canvas Viewport -->
    <div class="svg-container" style="width: 100%; max-width: 600px; aspect-ratio: 6/5;">
      <svg width="600" height="500" viewBox="0 0 600 500" id="normal_svg">
        <!-- SVG content groups -->
        <g id="edges-group"></g>
        <g id="mst-group"></g>
        <g id="ellipses-group"></g>
        <g id="points-group"></g>
        <g id="normals-group"></g>
        <g id="overlay-group"></g>
      </svg>
    </div>
  </div>

  <!-- Interactive Controls Row -->
  <div class="workspace-row" style="max-width: 100%; gap: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; margin-top: 0.5rem;">
    <!-- Parameters Card -->
    <div class="toolbox-card" style="width: 100%; display: flex; flex-direction: column; gap: 1rem; align-items: stretch;">
      <h2>Parameters</h2>
      
      <div id="group-slider-epsilon" style="display: flex; flex-direction: column; gap: 0.25rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
          <label for="slider-epsilon">Search Radius ($\epsilon$)</label>
          <span id="val-epsilon" style="font-weight: 600; color: var(--primary);">45px</span>
        </div>
        <input type="range" id="slider-epsilon" min="20" max="90" value="45" style="width: 100%; cursor: pointer;">
      </div>

      <div id="group-slider-noise" style="display: flex; flex-direction: column; gap: 0.25rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
          <label for="slider-noise">Point Noise</label>
          <span id="val-noise" style="font-weight: 600; color: var(--primary);">Medium</span>
        </div>
        <input type="range" id="slider-noise" min="0" max="20" value="8" style="width: 100%; cursor: pointer;">
      </div>
    </div>

    <!-- Controls Card -->
    <div class="toolbox-card" style="width: 100%; display: flex; flex-direction: column; gap: 0.75rem; justify-content: center; align-items: stretch;">
      <h2>Configurations & Presets</h2>
      
      <div style="display: flex; flex-direction: column; gap: 0.4rem;">
        <label for="shape-select" style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Shape Preset</label>
        <select id="shape-select" class="btn" style="width: 100%; text-align: left; padding: 0.4rem 0.75rem; font-weight: 500;">
          <option value="sinusoid">Wavy Sine Surface</option>
          <option value="circle">Closed Circle (Loop)</option>
          <option value="corner">Sharp 90° Corner</option>
        </select>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.4rem;" id="mst-btn-container">
        <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">MST Operations</label>
        <button class="btn btn-primary" id="btn-mst-run" style="width: 100%; margin-top: 0;">⚡ Run MST Propagation</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.2rem;">
        <button class="btn btn-secondary" onclick="randomizeNormals()" id="btn-scramble" style="width: 100%; margin-top: 0;">Scramble Normals</button>
        <button class="btn btn-secondary" onclick="resetPoints()" style="width: 100%; margin-top: 0;">Reset Shape</button>
      </div>
    </div>
  </div>
</div>
