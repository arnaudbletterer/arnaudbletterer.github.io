---
layout: visualizer
title: "Didactic Guide: Partial Voronoi Diagrams"
steps:
  - title: "1. Voronoi Partitioning"
    description: >
      A Voronoi diagram partitions a space based on distance to generator points (sites). Each cell represents the region of space closer to its site than to any other site:

      $$ \htmlClass{math-term-vi}{V_i} = \{ \htmlClass{math-term-x}{\mathbf{x}} \in \htmlClass{math-term-omega}{\Omega} \mid \htmlClass{math-term-dxs}{d(\mathbf{x}, \mathbf{s}_i)} \le \htmlClass{math-term-dxs2}{d(\mathbf{x}, \mathbf{s}_j)} \quad \htmlClass{math-term-forall}{\forall j \neq i} \} $$
    instruction: "🎮 **Play:** Click anywhere on the white canvas to insert new generator sites. Watch the cell boundaries dynamically recalculate and adapt."
    takeaway: "💡 **Key Insight:** Standard Voronoi partitioning is **globally dependent**. Adding or moving a single site can affect cell boundaries far away."
  - title: "2. Lloyd's Relaxation (CVT)"
    description: >
      Lloyd's algorithm is an iterative optimization process that moves each site to the geometric center (centroid) of its cell, redistributing them uniformly:

      $$ \htmlClass{math-term-sik}{\mathbf{s}_i^{(k+1)}} = \frac{\htmlClass{math-term-integral-top}{\int_{V_i} \mathbf{x} \, d\mathbf{x}}}{\htmlClass{math-term-integral-bottom}{\int_{V_i} d\mathbf{x}}} $$
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation** to watch the cells relax into a uniform honeycomb partition. Click the canvas to add sites during optimization."
    takeaway: "💡 **Key Insight:** Computing centroids requires integrating over entire cells. In a global setting, this creates tight synchronization locks, making parallel processing impossible."
  - title: "3. Partially Explored Domains & The Voronoi Basin"
    description: >
      In physical domains (such as robotic mapping or partial sensor scans), we only know generator sites within a **known region** (the clear central region), while the surrounding space remains a completely **unknown region**.

      To prevent cells from bleeding infinitely into the unknown space, we define a natural, irregular boundary limit. To mathematically guarantee that any unseen sites in the unknown region cannot distort our known cells, we construct the cell's **Voronoi Basin** (union of vertex disks):

      $$ \htmlClass{math-term-bsi}{B(\mathbf{s}_i)} = \htmlClass{math-term-union}{\bigcup}_{\htmlClass{math-term-vertices}{v \in \text{vertices}(V_i)}} \htmlClass{math-term-disk}{D(v, d(v, \mathbf{s}_i))} $$
    instruction: "🎮 **Play:** Click on a cell in the central known region to view its Basin (dashed circles). The union of these disks forms a safety envelope."
    takeaway: "💡 **Key Insight (Locality Theorem):** If the safety envelope (Basin) of a cell lies entirely within our known region, the cell's shape is **mathematically guaranteed** to be correct, regardless of what sites might exist in the unknown region."
  - title: "4. Domain Barrier & Parallel Relaxation"
    description: "To separate the known region from the unknown surrounding region during optimization, we treat the irregular wobbly border as a physical **barrier segment**. Known sites inside the center cannot have their cells cross this barrier during relaxation."
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation**. Observe how the cells relax and pack perfectly against the wobbly boundary, never bleeding into the outer unknown region."
    takeaway: "💡 **Key Insight (Distributed CVT):** By treating the wobbly boundary as a barrier, we decouple the domains. This allows us to run Lloyd's relaxation on separate sub-domains in parallel with zero communication overhead, enabling massive scaling."
---
