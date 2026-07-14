---
layout: general_visualizer
title: "Didactic Guide: The Bilateral Filter"
subtitle: "An interactive guide to edge-preserving smoothing"
teaser_image: "media/bilateral_teaser.jpg"
custom_scripts:
  - "main.js"
steps:
  - title: "1. Spatial Kernel"
    description: >
      A standard Gaussian blur averages neighboring pixels based entirely on their spatial distance from the center pixel $\mathbf{x}$. The closer a neighbor $\mathbf{y}$ is, the higher its spatial weight:

      $$ w_s(\htmlClass{math-term-y}{\mathbf{y}}, \htmlClass{math-term-x}{\mathbf{x}}) = \exp\left(-\frac{\|\htmlClass{math-term-y}{\mathbf{y}} - \htmlClass{math-term-x}{\mathbf{x}}\|^2}{2\htmlClass{math-term-sigmas}{\sigma_s}^2}\right) $$

      Since color values are ignored, this blur completely destroys sharp edges.
    instruction: "🎮 **Play:** Move your cursor over the noisy step-edge image in the canvas. Observe the circular shape of the spatial kernel weight on the right."
    takeaway: "💡 **Key Insight:** Standard spatial filtering is **intensity-blind**. It treats all pixels in the neighborhood equally, regardless of whether they cross boundaries/edges."

  - title: "2. Range Kernel"
    description: >
      To preserve edges, we must also weight pixels by their photometric/intensity similarity. If a neighbor $\mathbf{y}$ has a color value $f(\mathbf{y})$ very different from the center pixel $f(\mathbf{x})$, its weight drops to zero:

      $$ w_r(\htmlClass{math-term-y}{\mathbf{y}}, \htmlClass{math-term-x}{\mathbf{x}}) = \exp\left(-\frac{\|\htmlClass{math-term-fy}{f(\mathbf{y})} - \htmlClass{math-term-fx}{f(\mathbf{x})}\|^2}{2\htmlClass{math-term-sigmar}{\sigma_r}^2}\right) $$

      This ensures pixels on the opposite side of a sharp boundary are ignored.
    instruction: "🎮 **Play:** Hover your cursor across the boundary line. Notice how the range kernel weight dynamically splits, excluding pixels on the opposite color side."
    takeaway: "💡 **Key Insight:** The range kernel is **spatially blind**. It only cares about color similarity. Combined with the spatial kernel, it allows local edge preservation."

  - title: "3. Bilateral Filtering"
    description: >
      The Bilateral Filter combines both spatial and range weights. The filtered output at pixel $\mathbf{x}$ is the normalized product of both kernels:
      $$ \htmlClass{math-term-bf}{BF(f)(\mathbf{x})} = \frac{1}{\htmlClass{math-term-wx}{W(\mathbf{x})}} \sum_{\mathbf{y} \in \Omega} \htmlClass{math-term-gs}{w_s(\mathbf{y}, \mathbf{x})} \htmlClass{math-term-gr}{w_r(\mathbf{y}, \mathbf{x})} \htmlClass{math-term-fy}{f(\mathbf{y})} $$
      where the normalization term is:
      $$ \htmlClass{math-term-wx}{W(\mathbf{x})} = \sum_{\mathbf{y} \in \Omega} \htmlClass{math-term-gs}{w_s(\mathbf{y}, \mathbf{x})} \htmlClass{math-term-gr}{w_r(\mathbf{y}, \mathbf{x})} $$
    instruction: "🎮 **Play:** Adjust the sliders below the canvas to control spatial reach ($\\sigma_s$) and edge sensitivity ($\\sigma_r$). Watch the noisy image become smooth while the boundary stays razor-sharp."
    takeaway: "💡 **Key Insight:** By decoupling spatial proximity and color similarity, the bilateral filter achieves edge-preserving smoothing, making it ideal for denoising medical scans or skin tones."
---

<div class="viewport-card" style="max-width: 800px; width: 100%;">
  <h3 id="main-canvas-title">Bilateral Filter Sandbox</h3>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.25rem;">
    <!-- Left Column: Input Image -->
    <div>
      <div style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;">Filtered Result (Live Update)</div>
      <div class="canvas-container">
        <canvas id="canvas-input" width="150" height="125"></canvas>
      </div>
    </div>
    
    <!-- Right Column: Weight Visualizer -->
    <div>
      <div style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.25rem;" id="kernel-type-label">Current Kernel Weight ($w_s$)</div>
      <div class="canvas-container">
        <canvas id="canvas-kernel" width="150" height="125"></canvas>
      </div>
    </div>
  </div>

  <!-- Real-time Intensity Slice Profile -->
  <div style="margin-bottom: 1.25rem; border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; background-color: var(--bg);">
    <div style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
      <span>Horizontal Intensity Slice Profile (at cursor row)</span>
      <span style="font-size: 0.75rem; font-weight: 500; text-transform: none;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; margin-right: 4px;"></span>Noisy Input
        <span style="display: inline-block; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; margin-left: 12px; margin-right: 4px;"></span>Filtered
      </span>
    </div>
    <div style="width: 100%; height: 90px; position: relative;">
      <canvas id="canvas-profile" style="width: 100%; height: 100%; display: block;"></canvas>
    </div>
  </div>

  <!-- Sliders and Controls -->
  <div class="workspace-row" style="max-width: 100%; gap: 1.5rem; display: grid; grid-template-columns: 1fr 1fr;">
    <div class="toolbox-card" style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
      <h2>Filter Parameters</h2>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div id="group-slider-s">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
            <label for="slider-sigma-s">Spatial Size ($\sigma_s$)</label>
            <span id="val-sigma-s" style="font-weight: 600; color: var(--primary);">6</span>
          </div>
          <input type="range" id="slider-sigma-s" min="2" max="15" value="6" style="width: 100%; cursor: pointer;">
        </div>
        
        <div id="group-slider-r">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
            <label for="slider-sigma-r">Color Similarity Tolerance ($\sigma_r$)</label>
            <span id="val-sigma-r" style="font-weight: 600; color: var(--primary);">30</span>
          </div>
          <input type="range" id="slider-sigma-r" min="10" max="100" value="30" style="width: 100%; cursor: pointer;">
        </div>
      </div>
    </div>

    <div class="toolbox-card" style="width: 100%; display: flex; flex-direction: column; gap: 0.75rem; justify-content: center;">
      <h2>Operations & Presets</h2>
      <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem;">
        <label for="preset-select" style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">IMAGE PRESET</label>
        <select id="preset-select" class="btn" style="width: 100%; text-align: left; padding: 0.4rem 0.75rem; font-weight: 500;" onchange="onPresetChange(this.value)">
          <option value="edge">Synthetic Step-Edge</option>
          <option value="face">Facial Skin Scan Detail</option>
          <option value="circles">Concentric Circles Grid</option>
          <option value="custom" disabled id="custom-option-label" style="display: none;">Uploaded Custom Image</option>
        </select>
      </div>
      <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.1rem;">
        <label for="image-upload" style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Or Upload Custom Image</label>
        <button class="btn btn-secondary" style="position: relative; overflow: hidden; width: 100%; margin-top: 0;">
          📤 Choose Image File
          <input type="file" id="image-upload" accept="image/*" onchange="handleImageUpload(event)" style="position: absolute; top: 0; left: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer;">
        </button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.25rem;">
        <button class="btn" onclick="toggleNoise()">Toggle Noise</button>
        <button class="btn" onclick="resetAll()">Reset View</button>
      </div>
    </div>
  </div>
</div>

