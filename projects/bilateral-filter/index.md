---
layout: general_visualizer
title: "Didactic Guide: The Bilateral Filter"
subtitle: "An interactive guide to edge-preserving smoothing"
teaser_image: "media/bilateral_teaser.jpg"
custom_scripts:
  - "main.js"
math_terms:
  math-term-g:
    title: "Input Value"
    term: "I(q)"
    desc: "The intensity/color value of the neighboring pixel $q$ before filtering."
  math-term-step1-ks:
    title: "Space Kernel"
    term: "k_s(\\|q - p\\|)"
    desc: "Evaluates the geometric proximity between the neighbor pixel $q$ and the center pixel $p$ using a Gaussian curve. Decreases as spatial distance increases."
  math-term-step1-q:
    title: "Neighbor Pixel"
    term: "q"
    desc: "A spatial coordinate of a neighboring pixel inside the filter window."
  math-term-step1-p:
    title: "Target Pixel"
    term: "p"
    desc: "The spatial coordinate of the center pixel currently being processed."
  math-term-step1-sigmas:
    title: "Spatial Sigma"
    term: '\sigma_s'
    desc: "The spatial standard deviation. Controls the radius and weight distribution of the space kernel."
  math-term-step2-kr:
    title: "Range Kernel"
    term: "k_r(\\|I(q) - I(p)\\|)"
    desc: "Evaluates the intensity/color similarity between the neighbor value $I(q)$ and center value $I(p)$ using a Gaussian curve. Drops to zero if values are very different."
  math-term-step2-iq:
    title: "Neighbor Value"
    term: "I(q)"
    desc: "The intensity/color value of the neighbor pixel $q$."
  math-term-step2-ip:
    title: "Center Value"
    term: "I(p)"
    desc: "The intensity/color value of the center target pixel $p$."
  math-term-step2-sigmar:
    title: "Range Sigma"
    term: '\sigma_r'
    desc: "The range standard deviation. Controls how sensitive the filter is to color differences (edge sensitivity)."
  math-term-step3-out:
    title: "Bilateral Output"
    term: "I'(p)"
    desc: "The new edge-preserving filtered color/intensity computed for the target pixel $p$."
  math-term-step3-wp:
    title: "Normalization Factor"
    term: "W_p"
    desc: "The sum of all combined weights over the neighborhood. Normalizes the output so the filtered intensity remains valid."
  math-term-step3-iq:
    title: "Neighbor Value"
    term: "I(q)"
    desc: "The intensity/color value of the neighbor pixel $q$."
  math-term-step3-kr:
    title: "Range Kernel"
    term: "k_r(\\|I(q) - I(p)\\|)"
    desc: "Evaluates the intensity/color similarity between the neighbor value $I(q)$ and center value $I(p)$ using a Gaussian curve. Drops to zero if values are very different."
  math-term-step3-ip:
    title: "Center Value"
    term: "I(p)"
    desc: "The intensity/color value of the center target pixel $p$."
  math-term-step3-ks:
    title: "Space Kernel"
    term: "k_s(\\|q - p\\|)"
    desc: "Evaluates the geometric proximity between the neighbor pixel $q$ and the center pixel $p$ using a Gaussian curve. Decreases as spatial distance increases."
  math-term-step3-q:
    title: "Neighbor Pixel"
    term: "q"
    desc: "A spatial coordinate of a neighboring pixel inside the filter window."
  math-term-step3-p:
    title: "Target Pixel"
    term: "p"
    desc: "The spatial coordinate of the center pixel currently being processed."
steps:
  - title: "1. Spatial Kernel"
    description: >
      A standard Gaussian blur averages neighboring pixels based entirely on their spatial distance from the center pixel $p$. The closer a neighbor $q$ is, the higher its spatial weight:

      $$ \htmlClass{math-term-step1-ks math-color-1}{k_s(\|q - p\|)} = \exp\left(-\frac{\|\htmlClass{math-term-step1-q math-color-2}{q} - \htmlClass{math-term-step1-p math-color-3}{p}\|^2}{2\htmlClass{math-term-step1-sigmas math-color-4}{\sigma_s}^2}\right) $$

      Since color values are ignored, this blur completely destroys sharp edges.
    instruction: "🎮 **Play:** Move your cursor over the noisy step-edge image in the canvas. Observe the circular shape of the spatial kernel weight on the right."
    takeaway: "💡 **Key Insight:** Standard spatial filtering is **intensity-blind**. It treats all pixels in the neighborhood equally, regardless of whether they cross boundaries/edges."

  - title: "2. Range Kernel"
    description: >
      To preserve edges, we must also weight pixels by their photometric/intensity similarity. If a neighbor $q$ has a color value $I(q)$ very different from the center pixel $I(p)$, its range weight drops to zero:

      $$ \htmlClass{math-term-step2-kr math-color-1}{k_r(\|I(q) - I(p)\|)} = \exp\left(-\frac{\|\htmlClass{math-term-step2-iq math-color-2}{I(q)} - \htmlClass{math-term-step2-ip math-color-3}{I(p)}\|^2}{2\htmlClass{math-term-step2-sigmar math-color-4}{\sigma_r}^2}\right) $$

      This ensures pixels on the opposite side of a sharp boundary are ignored.
    instruction: "🎮 **Play:** Hover your cursor across the boundary line. Notice how the range kernel weight dynamically splits, excluding pixels on the opposite color side."
    takeaway: "💡 **Key Insight:** The range kernel is **spatially blind**. It only cares about color similarity. Combined with the spatial kernel, it allows local edge preservation."

  - title: "3. Bilateral Filtering"
    description: >
      The Bilateral Filter combines both spatial and range weights. The filtered output at pixel $p$ is the normalized product of both kernels:
      $$ \htmlClass{math-term-step3-out math-color-1}{I'(p)} = \frac{1}{\htmlClass{math-term-step3-wp math-color-2}{W_p}} \sum_{q \in \Omega} \htmlClass{math-term-step3-iq math-color-3}{I(q)} \htmlClass{math-term-step3-kr math-color-4}{k_r(\|I(q) - I(p)\|)} \htmlClass{math-term-step3-ks math-color-6}{k_s(\|q - p\|)} $$
      where the normalization term is:
      $$ \htmlClass{math-term-step3-wp math-color-2}{W_p} = \sum_{q \in \Omega} \htmlClass{math-term-step3-kr math-color-4}{k_r(\|I(q) - I(p)\|)} \htmlClass{math-term-step3-ks math-color-6}{k_s(\|q - p\|)} $$
    instruction: "🎮 **Play:** Adjust the sliders below the canvas to control spatial reach ($\\sigma_s$) and edge sensitivity ($\\sigma_r$). Watch the noisy image become smooth while the boundary stays razor-sharp."
    takeaway: "💡 **Key Insight:** By decoupling spatial proximity and color similarity, the bilateral filter achieves edge-preserving smoothing, making it ideal for denoising medical scans or skin tones."
---

<div class="viewport-card" style="max-width: 800px; width: 100%;">
  <h3 id="main-canvas-title">Bilateral Filter Sandbox</h3>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
    <!-- Left Column: Input Image -->
    <div>
      <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">1. Noisy Input (Probe)</div>
      <div class="canvas-container" style="position: relative;">
        <canvas id="canvas-input" width="150" height="125"></canvas>
        <svg id="svg-overlay-input" viewBox="0 0 150 125" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;">
          <!-- Horizontal probe guide line -->
          <line id="guide-line-input" x1="0" y1="62.5" x2="150" y2="62.5" stroke="rgba(239, 68, 68, 0.45)" stroke-width="0.75" />
          <!-- Spatial sigma reach circle -->
          <circle id="sigma-circle-input" cx="75" cy="62.5" r="12" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2,2" />
          <!-- Probe target point -->
          <circle id="probe-dot-input" cx="75" cy="62.5" r="3.2" fill="#ffffff" stroke="currentColor" stroke-width="1.2" />
        </svg>
      </div>
    </div>
    
    <!-- Middle Column: Weight Visualizer -->
    <div>
      <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;" id="kernel-type-label">2. Space Kernel ($k_s$)</div>
      <div class="canvas-container" style="position: relative;">
        <canvas id="canvas-kernel" width="150" height="125"></canvas>
        <svg id="svg-overlay-kernel" viewBox="0 0 150 125" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;">
          <!-- Probe target point -->
          <circle id="probe-dot-kernel" cx="75" cy="62.5" r="3.2" fill="#ffffff" stroke="currentColor" stroke-width="1.2" />
        </svg>
      </div>
    </div>

    <!-- Right Column: Filtered Result -->
    <div>
      <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">3. Filtered Output</div>
      <div class="canvas-container" style="position: relative;">
        <canvas id="canvas-output" width="150" height="125"></canvas>
        <svg id="svg-overlay-output" viewBox="0 0 150 125" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;">
          <!-- Horizontal probe guide line -->
          <line id="guide-line-output" x1="0" y1="62.5" x2="150" y2="62.5" stroke="currentColor" stroke-width="0.75" />
          <!-- Probe target point -->
          <circle id="probe-dot-output" cx="75" cy="62.5" r="3.2" fill="#ffffff" stroke="currentColor" stroke-width="1.2" />
        </svg>
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
    <p id="profile-explanation" style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-top: 0.6rem; font-style: italic; text-align: center;">
      Loading slice explanation...
    </p>
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
          <option value="face">3D-Shaded Sphere</option>
          <option value="circles">Mathematical Ripple Grid</option>
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
      <div style="margin-top: 0.5rem; width: 100%;">
        <button class="btn btn-secondary" style="width: 100%; margin-top: 0;" onclick="resetAll()">Reset Sandbox View</button>
      </div>
    </div>
  </div>
</div>

