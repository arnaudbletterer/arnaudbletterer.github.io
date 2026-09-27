---
layout: visualizer
title: "Didactic Guide: Partial Voronoi Diagrams"
real_world_context:
  badge: "Robotics, Cell Towers & Supercomputing"
  icon: "fa-solid fa-map-location-dot"
  title: "Why this matters in daily life"
  summary: "How does a delivery company decide which warehouse serves your house? How do cellular carriers place cell towers so nobody loses signal? And how does an exploration rover or robot vacuum map a building when rooms are still locked in the dark? Voronoi diagrams are the mathematics of territory, balance, and spatial coverage."
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
    title: 'Disk'
    term: 'D(v, d(v, \mathbf{s}_i))'
    desc: 'A closed disk centered at vertex $v$ with a radius equal to the distance from $v$ to the site $\mathbf{s}_i$.'
steps:
  - title: "1. Voronoi Partitioning"
    intuitive_title: "1. Nearest Coffee Shop Territories"
    description: >
      A Voronoi diagram partitions a space based on distance to generator points (sites). Each cell represents the region of space closer to its site than to any other site:

      $$ \htmlClass{math-term-vi math-color-1}{V_i} = \{ \htmlClass{math-term-x math-color-2}{\mathbf{x}} \in \htmlClass{math-term-omega math-color-3}{\Omega} \mid \htmlClass{math-term-dxs math-color-4}{d(\mathbf{x}, \mathbf{s}_i)} \le \htmlClass{math-term-dxs2 math-color-5}{d(\mathbf{x}, \mathbf{s}_j)} \quad \htmlClass{math-term-forall math-color-6}{\forall j \neq i} \} $$
    intuitive_description: >
      Imagine dropping pins for coffee shops across a city map. Every person walking through town wants to visit the shop closest to them.

      If you color every spot on the map by its nearest shop, straight dividing lines naturally appear halfway between them. These territories are called **Voronoi cells**. Every point inside a cell is closer to its own shop than to any other shop in town.
    instruction: "🎮 **Play:** Click anywhere on the white canvas to insert new generator sites. Watch the cell boundaries dynamically recalculate and adapt."
    intuitive_instruction: "🎮 **What to try:** Click anywhere on the white canvas to add new shops. Watch the colorful territory boundaries dynamically snap and redraw around your clicks."
    takeaway: "💡 **Key Insight:** Standard Voronoi partitioning is **globally dependent**. Adding or moving a single site can affect cell boundaries far away."
    intuitive_takeaway: "💡 **The Big Idea:** Standard Voronoi territories are globally connected. Adding a single new shop can cause boundary lines to shift and ripple outward."

  - title: "2. Lloyd's Relaxation (CVT)"
    intuitive_title: "2. The Honeycomb Effect"
    description: >
      Lloyd's algorithm is an iterative optimization process that moves each site to the geometric center (centroid) of its cell, redistributing them uniformly:

      $$ \htmlClass{math-term-sik math-color-1}{\mathbf{s}_i^{(k+1)}} = \frac{\htmlClass{math-term-integral-top math-color-2}{\int_{V_i} \mathbf{x} \, d\mathbf{x}}}{\htmlClass{math-term-integral-bottom math-color-3}{\int_{V_i} d\mathbf{x}}} $$
    intuitive_description: >
      If several coffee shops are clustered right next to each other, parts of the city are overcrowded while other neighborhoods are ignored.

      Lloyd's algorithm gently nudges each shop toward the center of its territory. Over several steps, the shops push apart evenly, settling into a beautifully balanced hexagonal honeycomb pattern, just like honeybees constructing a hive with maximum space and minimum wax.
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation** to watch the cells relax into a uniform honeycomb partition. Click the canvas to add sites during optimization."
    intuitive_instruction: "🎮 **What to try:** Click **Run Lloyd Relaxation**. Watch the irregular polygons smooth out and settle into a calm, uniform honeycomb lattice."
    takeaway: "💡 **Key Insight:** Computing centroids requires integrating over entire cells. In a global setting, this creates tight synchronization locks, making parallel processing impossible."
    intuitive_takeaway: "💡 **The Big Idea:** Rebalancing territories requires recalculating every cell. In massive simulations, this creates a major bottleneck: computers cannot easily divide the work because every cell depends on its neighbors."

  - title: "3. Partially Explored Domains & The Voronoi Basin"
    intuitive_title: "3. Fog of War & The Safety Bubble"
    description: >
      In physical domains (such as robotic mapping or partial sensor scans), we only know generator sites within a **known region** (the clear central region), while the surrounding space remains a completely **unknown region**.

      To prevent cells from bleeding infinitely into the unknown space, we define a natural, irregular boundary limit. To mathematically guarantee that any unseen sites in the unknown region cannot distort our known cells, we construct the cell's **Voronoi Basin** (union of vertex disks):

      $$ \htmlClass{math-term-bsi math-color-1}{B(\mathbf{s}_i)} = \htmlClass{math-term-union math-color-2}{\bigcup}_{\htmlClass{math-term-vertices math-color-3}{v \in \text{vertices}(V_i)}} \htmlClass{math-term-disk math-color-4}{D(v, d(v, \mathbf{s}_i))} $$
    intuitive_description: >
      In the real world, a robot or 3D scanner only sees what is currently in front of its sensors (the bright area in the center). The surrounding world is shrouded in unknown 'fog of war' (the dark border).

      How can a robot trust its local map without knowing what lies hidden in the dark?

      This is the core insight of Arnaud's doctoral research: we draw a 'safety bubble' (the Basin) around a cell. If the entire bubble fits safely inside our visible area, we are **100% mathematically guaranteed** that whatever is lurking in the unseen darkness can never alter that cell!
    instruction: "🎮 **Play:** Click on a cell in the central known region to view its Basin (dashed circles). The union of these disks forms a safety envelope."
    intuitive_instruction: "🎮 **What to try:** Click on any cell in the bright center. Dashed green circles appear around its corners. If all circles stay inside the bright area, the cell is safe. If a red circle spills into the dark fog, unseen points outside could change its shape."
    takeaway: "💡 **Key Insight (Locality Theorem):** If the safety envelope (Basin) of a cell lies entirely within our known region, the cell's shape is **mathematically guaranteed** to be correct, regardless of what sites might exist in the unknown region."
    intuitive_takeaway: "💡 **The Big Idea (The Locality Theorem):** You do not need to scan the entire world to trust your local map. The safety bubble proves when local information is already complete and final."

  - title: "4. Domain Barrier & Parallel Relaxation"
    intuitive_title: "4. Divide and Conquer in Parallel"
    description: "To separate the known region from the unknown surrounding region during optimization, we treat the irregular wobbly border as a physical **barrier segment**. Known sites inside the center cannot have their cells cross this barrier during relaxation."
    intuitive_description: >
      Because our safety bubble mathematically insulates known cells from the unknown darkness, we can turn the boundary into a solid wall.

      Known points inside relax and pack against this barrier, never leaking into the unexplored territory. This breakthrough allows supercomputers to chop a gigantic 3D model into thousands of independent pieces, optimizing all of them in parallel across multiple processors with zero lag and zero communication locks.
    instruction: "🎮 **Play:** Click **Run Lloyd Relaxation**. Observe how the cells relax and pack perfectly against the wobbly boundary, never bleeding into the outer unknown region."
    intuitive_instruction: "🎮 **What to try:** Click **Run Lloyd Relaxation**. Notice how the cells pack snugly against the wobbly border without ever bleeding into the dark outer fog."
    takeaway: "💡 **Key Insight (Distributed CVT):** By treating the wobbly boundary as a barrier, we decouple the domains. This allows us to run Lloyd's relaxation on separate sub-domains in parallel with zero communication overhead, enabling massive scaling."
    intuitive_takeaway: "💡 **The Big Idea (Parallel Scalability):** Decoupling territory optimization allows massive geometry datasets, from city scale 3D LiDAR to millions of biological cells, to be processed in parallel at lightning speed."
---
