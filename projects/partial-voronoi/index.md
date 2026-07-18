---
layout: visualizer
title: "Didactic Guide: Partial Voronoi Diagrams"
math_terms:
  math-term-vi:
    title: 'Voronoi Cell'
    term: 'V_i'
    desc: 'The region of space associated with site $\mathbf{s}_i$. It contains all points that are closer to $\mathbf{s}_i$ than to any other site.'
  math-term-x:
    title: 'Point in Space'
    term: '\mathbf{x}'
    desc: 'An arbitrary coordinate vector within the domain space.'
  math-term-omega:
    title: 'Domain Space'
    term: '\Omega'
    desc: 'The entire bounded area in which the sites and cells are defined.'
  math-term-dxs:
    title: 'Distance to Site'
    term: 'd(\mathbf{x}, \mathbf{s}_i)'
    desc: 'The Euclidean distance between point $\mathbf{x}$ and the current site $\mathbf{s}_i$.'
  math-term-dxs2:
    title: 'Distance to other Site'
    term: 'd(\mathbf{x}, \mathbf{s}_j)'
    desc: 'The Euclidean distance between point $\mathbf{x}$ and any other generator site $\mathbf{s}_j$.'
  math-term-forall:
    title: 'Universal Condition'
    term: '\forall j \neq i'
    desc: 'Requires the distance inequality to hold true for every other site $j$ in the diagram.'
  math-term-sik:
    title: 'Next Position'
    term: '\mathbf{s}_i^{(k+1)}'
    desc: 'The updated position coordinates vector of site $i$ for the next iteration $(k+1)$.'
  math-term-centroid:
    title: 'Cell Centroid'
    term: '\text{Centroid}(V_i)'
    desc: 'The geometric center of mass of the Voronoi cell. Moving the site here minimizes the dispersion of the cell.'
  math-term-integral-top:
    title: 'First Moment of Area'
    term: '\int_{V_i} \mathbf{x} d\mathbf{x}'
    desc: 'The area-weighted coordinate integral over the cell, representing the numerator in centroid computation.'
  math-term-integral-bottom:
    title: 'Cell Area'
    term: '\int_{V_i} d\mathbf{x}'
    desc: 'The total geometric area of the Voronoi cell (integrating the area element $d\mathbf{x}$), acting as the normalising denominator.'
  math-term-bsi:
    title: 'Voronoi Basin'
    term: 'B(\mathbf{s}_i)'
    desc: 'The safety envelope of site $\mathbf{s}_i$. It is the union of circles centered at cell vertices.'
  math-term-union:
    title: 'Union Operator'
    term: '\bigcup'
    desc: 'The combined area covered by all individual vertex disks taken together.'
  math-term-vertices:
    title: 'Cell Vertices'
    term: 'v \in \text{vertices}(V_i)'
    desc: 'The corner points where the edges of cell $V_i$ intersect.'
  math-term-disk:
    title: 'Disks (Circles)'
    term: 'D(v, d(v, \mathbf{s}_i))'
    desc: 'A closed disk centered at vertex $v$ with a radius equal to the distance from $v$ to the site $\mathbf{s}_i$.'
steps:
  - title: "1. Voronoi Partitioning"
    description: >
      A Voronoi diagram partitions a space based on distance to generator points (sites). Each cell represents the region of space closer to its site than to any other site:

      $$ \htmlClass{math-term-vi math-color-1}{V_i} = \{ \htmlClass{math-term-x math-color-2}{\mathbf{x}} \in \htmlClass{math-term-omega math-color-3}{\Omega} \mid \htmlClass{math-term-dxs math-color-4}{d(\mathbf{x}, \mathbf{s}_i)} \le \htmlClass{math-term-dxs2 math-color-5}{d(\mathbf{x}, \mathbf{s}_j)} \quad \htmlClass{math-term-forall math-color-6}{\forall j \neq i} \} $$
    instruction: "🎮 **Play:** Click anywhere on the white canvas to insert new generator sites. Watch the cell boundaries dynamically recalculate and adapt."
    takeaway: "💡 **Key Insight:** Standard Voronoi partitioning is **globally dependent**. Adding or moving a single site can affect cell boundaries far away."
  - title: "2. Lloyd's Relaxation (CVT)"
    description: >
      Lloyd's algorithm is an iterative optimization process that moves each site to the geometric center (centroid) of its cell, redistributing them uniformly:

      $$ \htmlClass{math-term-sik math-color-1}{\mathbf{s}_i^{(k+1)}} = \frac{\htmlClass{math-term-integral-top math-color-2}{\int_{V_i} \mathbf{x} \, d\mathbf{x}}}{\htmlClass{math-term-integral-bottom math-color-3}{\int_{V_i} d\mathbf{x}}} $$
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation** to watch the cells relax into a uniform honeycomb partition. Click the canvas to add sites during optimization."
    takeaway: "💡 **Key Insight:** Computing centroids requires integrating over entire cells. In a global setting, this creates tight synchronization locks, making parallel processing impossible."
  - title: "3. Partially Explored Domains & The Voronoi Basin"
    description: >
      In physical domains (such as robotic mapping or partial sensor scans), we only know generator sites within a **known region** (the clear central region), while the surrounding space remains a completely **unknown region**.

      To prevent cells from bleeding infinitely into the unknown space, we define a natural, irregular boundary limit. To mathematically guarantee that any unseen sites in the unknown region cannot distort our known cells, we construct the cell's **Voronoi Basin** (union of vertex disks):

      $$ \htmlClass{math-term-bsi math-color-1}{B(\mathbf{s}_i)} = \htmlClass{math-term-union math-color-2}{\bigcup}_{\htmlClass{math-term-vertices math-color-3}{v \in \text{vertices}(V_i)}} \htmlClass{math-term-disk math-color-4}{D(v, d(v, \mathbf{s}_i))} $$
    instruction: "🎮 **Play:** Click on a cell in the central known region to view its Basin (dashed circles). The union of these disks forms a safety envelope."
    takeaway: "💡 **Key Insight (Locality Theorem):** If the safety envelope (Basin) of a cell lies entirely within our known region, the cell's shape is **mathematically guaranteed** to be correct, regardless of what sites might exist in the unknown region."
  - title: "4. Domain Barrier & Parallel Relaxation"
    description: "To separate the known region from the unknown surrounding region during optimization, we treat the irregular wobbly border as a physical **barrier segment**. Known sites inside the center cannot have their cells cross this barrier during relaxation."
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation**. Observe how the cells relax and pack perfectly against the wobbly boundary, never bleeding into the outer unknown region."
    takeaway: "💡 **Key Insight (Distributed CVT):** By treating the wobbly boundary as a barrier, we decouple the domains. This allows us to run Lloyd's relaxation on separate sub-domains in parallel with zero communication overhead, enabling massive scaling."
---
