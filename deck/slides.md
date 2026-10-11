---
theme: nimbledeck
ndVariant: plain
ndMotion: fade-up
routerMode: hash
title: Arnaud Bletterer, resume
titleTemplate: "%s"
layout: full
background: mesh
---

<Stage full>

<At :x="96" :y="96" :w="760">

#### Research Scientist & Team Leader

</At>

<At :x="96" :y="150" :w="900">
<Kinetic text="Arnaud|Bletterer" mode="lines" from="up" :stagger="160" size="xl" :delay="250" />
</At>

<At :x="96" :y="440" :w="760">

[Bridging the gap between exploration and industrialization.]{.ab-lead}

</At>

<At :x="96" :y="560" :w="1140" enter="up" :delay="1700">
<Contact />
</At>

<At :x="900" :y="150" :w="300" enter="scale" :delay="500">
<Avatar :size="290" />
</At>

</Stage>

---
layout: statement
background: mesh
motion: curtain
---

#### The idea

<Kinetic text="Research that actually ships." mode="words" from="mask" :stagger="130" size="xl" accent="ships." :delay="200" />

---
layout: stage
---

<Stage full>

<At :x="96" :y="90" :w="520">

#### Profile

</At>

<At :x="96" :y="180" :w="540">
<Kinetic text="Curious by nature, practical by trade." mode="words" from="mask" :stagger="90" size="l" accent="practical," />
</At>

<At :x="680" :y="64" :w="520" :h="184" enter="right" :delay="300">
<Card icon="flask" title="Practical solutions" sub="Production-ready answers to complex real-world challenges." />
</At>

<At :x="680" :y="268" :w="520" :h="184" enter="right" :delay="450">
<Card icon="cube" title="Occam's razor" sub="The simplest solution that meets the real need, as often as possible." />
</At>

<At :x="680" :y="472" :w="520" :h="184" enter="right" :delay="600">
<Card icon="diagram" title="Aligned with deliverables" sub="A seamless, rapid transition from innovation to commercial software." />
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### The short version

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="Twelve years, in four numbers." mode="words" from="mask" :stagger="90" size="m" accent="four" />
</At>

<At :x="60" :y="250" :w="275" :h="380" frame bg="var(--nd-surface)" middle pad="0 16px" enter="up" :delay="400">
<Stat value="12" label="years from research to product" />
</At>
<At :x="355" :y="250" :w="275" :h="380" frame bg="var(--nd-surface)" middle pad="0 16px" enter="up" :delay="520">
<Stat value="7" label="research engineers in my largest team" :delay="150" />
</At>
<At :x="650" :y="250" :w="275" :h="380" frame bg="var(--nd-surface)" middle pad="0 16px" enter="up" :delay="640">
<Stat value="11" label="papers and a thesis published" :delay="300" />
</At>
<At :x="945" :y="250" :w="275" :h="380" frame bg="var(--nd-surface)" middle pad="0 16px" enter="up" :delay="760">
<Stat value="14" label="essays on industrial R&D" :delay="450" />
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Career

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="From LiDAR scans to clinical software." mode="words" from="mask" :stagger="90" size="m" accent="clinical" />
</At>

<At :x="60" :y="236" :w="1160" :h="3" bg="linear-gradient(90deg, var(--nd-accent), var(--nd-accent-2), transparent)" enter="left" :delay="500" />

<At :x="60" :y="230" :w="15" :h="15" bg="var(--nd-accent)" :radius="8" enter="scale" :delay="500" />

<At :x="355" :y="230" :w="15" :h="15" bg="var(--nd-accent)" :radius="8" enter="scale" :delay="650" />

<At :x="650" :y="230" :w="15" :h="15" bg="var(--nd-accent)" :radius="8" enter="scale" :delay="800" />

<At :x="945" :y="230" :w="15" :h="15" bg="var(--nd-accent)" :radius="8" enter="scale" :delay="950" />

<At :x="60" :y="266" :w="275" :h="330" enter="up" :delay="500">
<Card class="ab-timeline" tag="2014 to 2018" title="Ph.D Student" sub="I3S Laboratory and Cintoo">

**Massive LiDAR point clouds**, from compression to resampling.

</Card>
</At>

<At :x="355" :y="266" :w="275" :h="330" enter="up" :delay="650">
<Card class="ab-timeline" tag="2018 to 2023" title="Research Engineer" sub="QuantifiCare">

**3D reconstruction** and face stitching.

</Card>
</At>

<At :x="650" :y="266" :w="275" :h="330" enter="up" :delay="800">
<Card class="ab-timeline" tag="2023 to 2026" title="Research Team Leader" sub="QuantifiCare, Quartier Latin">

A **research team** and its **validation pipelines**.

</Card>
</At>

<At :x="945" :y="266" :w="275" :h="330" enter="up" :delay="950">
<Card class="ab-timeline" tag="Since 07/2026" title="Expert Research Engineer" sub="Quartier Latin">

Core research on **vision and geometry**, shipped as modules.

</Card>
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="96" :y="90" :w="560">

#### Ph.D, 2014 to 2018

</At>

<At :x="96" :y="150" :w="560">
<Kinetic text="Gigantic point clouds." mode="words" from="mask" :stagger="110" size="l" accent="Gigantic" />
</At>

<At :x="96" :y="370" :w="520">

[Compression and out-of-core resampling of massive terrestrial LiDAR acquisitions, at I3S Laboratory and Cintoo.]{.ab-lead}

</At>

<At :x="96" :y="540" :w="520" enter="up" :delay="1500">

*A graph-based approach for modeling and processing gigantic point clouds from terrestrial LiDAR acquisitions* `2018`

</At>

<At :x="720" :y="130" :w="480" :h="270" frame bg="var(--nd-surface)" radius="16" enter="scale" :delay="400">
<Clip src="/media/eim-ya-kyaung.mp4" fit="cover" />
</At>

<At :x="670" :y="420" :w="530" enter="up" :delay="900">

`SGP 2018 Posters`

[Part of *Eim Ya Kyaung* resampled (2.9% of the 1.3 billion original points remaining) and reconstructed using Boltcheva and Lévy (2017). Acquisition courtesy of the CyArk/Google Open Heritage Program.]{.ab-cap}

[A. Bletterer, F. Payan, M. Antonini and A. Meftah. Out-of-core Resampling of Gigantic Point Clouds. SGP 2018 Posters, pp. 1-2. doi:10.2312/sgp.20181178](https://doi.org/10.2312/sgp.20181178){.ab-ref}

[D. Boltcheva and B. Lévy. Surface reconstruction by computing restricted Voronoi cells in parallel. Computer-Aided Design 90, pp. 123-134, 2017.]{.ab-ref}

</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Industry, 2018 to today

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="What each chapter delivered." mode="words" from="mask" :stagger="90" size="m" accent="delivered." />
</At>

<At :x="60" :y="236" :w="370" :h="420" enter="up" :delay="500">
<Card class="ab-timeline" icon="cube" title="Research Engineer" sub="QuantifiCare, 2018 to 2023">

- 3D reconstruction in daily clinical use
- Autonomous face stitching, consistent model delivery

</Card>
</At>

<At :x="455" :y="236" :w="370" :h="420" enter="up" :delay="650">
<Card class="ab-timeline" icon="people" title="Research Team Leader" sub="QuantifiCare, Quartier Latin, 2023 to 2026">

- Research aligned with production deliverables
- Automated validation pipelines, and clinical research supervised to publication

</Card>
</At>

<At :x="850" :y="236" :w="370" :h="420" enter="up" :delay="800">
<Card class="ab-timeline" icon="flask" title="Expert Research Engineer" sub="Quartier Latin, since July 2026">

- Core technical research and algorithm design
- High-performance pipelines, from prototype to production-ready modules

</Card>
</At>

</Stage>


---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Skills

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="A toolbox built for production." mode="words" from="mask" :stagger="90" size="m" accent="production." />
</At>

<At :x="60" :y="215" :w="370" :h="150" enter="up" :delay="400">
<Card title="Computer Vision"><code>OpenCV</code></Card>
</At>
<At :x="455" :y="215" :w="370" :h="150" enter="up" :delay="480">
<Card title="3D & Geometry"><code>MeshLab</code> <code>IGL</code></Card>
</At>
<At :x="850" :y="215" :w="370" :h="150" enter="up" :delay="560">
<Card title="Machine Learning"><code>PyTorch</code> <code>scikit-learn</code></Card>
</At>
<At :x="60" :y="378" :w="370" :h="150" enter="up" :delay="640">
<Card title="Rendering"><code>OpenGL</code> <code>WebGL</code></Card>
</At>
<At :x="455" :y="378" :w="370" :h="150" enter="up" :delay="720">
<Card title="Languages"><code>Python</code> <code>C++</code></Card>
</At>
<At :x="850" :y="378" :w="370" :h="150" enter="up" :delay="800">
<Card title="Dev & Ops"><code>Git</code> <code>GitLab</code> <code>Docker</code> <code>VS Code</code> <code>Linux</code></Card>
</At>

<At :x="60" :y="548" :w="1160" :h="112" enter="up" :delay="880">
<Card title="Beyond the tools"><code>Mentoring</code> <code>Validation pipelines</code> <code>Clinical research</code> <code>Technical writing</code></Card>
</At>


</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Side projects

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="Built to be explored, not just read." mode="words" from="mask" :stagger="90" size="m" accent="explored," />
</At>

<At :x="60" :y="232" :w="370" :h="426" enter="up" :delay="400">
<Tilt><Project id="voronoi" tag="Geometry" title="Partial Voronoi Diagrams">Voronoi partitioning on partially known domains, with Lloyd's relaxation.</Project></Tilt>
</At>

<At :x="455" :y="232" :w="370" :h="426" enter="up" :delay="550">
<Tilt><Project id="bilateral" tag="Image processing" title="The Bilateral Filter">Edge-preserving smoothing: spatial closeness meets colour similarity.</Project></Tilt>
</At>

<At :x="850" :y="232" :w="370" :h="426" enter="up" :delay="700">
<Tilt><Project id="normals" tag="Point clouds" title="Normal Estimation">Neighborhood graphs, PCA ellipses and MST orientation propagation.</Project></Tilt>
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Selected publications

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="Geometry first, then medicine." mode="words" from="mask" :stagger="90" size="m" accent="medicine." />
</At>

<At :x="60" :y="244" :w="700" :h="122" enter="left" :delay="400">
<Card class="ab-compact" tag="2022 / Eurographics" title="Graph-based Computation of Voronoi Diagrams on Large-scale Point-based Surfaces" />
</At>
<At :x="60" :y="380" :w="700" :h="122" enter="left" :delay="500">
<Card class="ab-compact" tag="2020 / IEEE TVCG" title="A local graph-based structure for processing gigantic aggregated 3D point clouds" />
</At>
<At :x="60" :y="516" :w="700" :h="122" enter="left" :delay="600">
<Card class="ab-compact" tag="2018 / SGP" title="Out-of-core Resampling of Gigantic Point Clouds" />
</At>

<At :x="800" :y="244" :w="420" :h="198" enter="right" :delay="500">
<Card class="ab-compact" tag="2025 / JAMA Dermatology" title="Objective Assessment of Target Vitiligo Areas by Semiautomatic Analysis of Standardized UV Images" />
</At>
<At :x="800" :y="456" :w="420" :h="182" enter="right" :delay="650">
<Card class="ab-compact" tag="2024 / Dermatology and Therapy" title="Automatic Acne Severity Grading with a Small and Imbalanced Data Set of Low-Resolution Images" />
</At>

<At :x="60" :y="646" :w="1100" enter="up" :delay="900">

The full list is on [Google Scholar](https://scholar.google.com/citations?user=fEbApYQAAAAJ).

</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Writing

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="I think out loud about R&D." mode="words" from="mask" :stagger="90" size="m" accent="R&D." />
</At>

<At :x="0" :y="260" :w="1280" :h="64">
<Marquee :speed="38" gap="14px"><Chips :items="['R&D Principles & Convictions', 'On the Shoulders of Giants', 'The Translation Problem', 'Leading R&D Teams Without Losing Technical Edge', 'Leveraging Traction in R&D']" /></Marquee>
</At>

<At :x="0" :y="360" :w="1280" :h="64">
<Marquee :speed="30" gap="14px"><Chips :items="['Managing Exploratory Debt vs. Structural Debt in R&D', 'AI Agents in Industrial R&D', 'Beyond Autocomplete: AI Agents as Forensic Investigators', 'The Cadence of Thought', 'The Mentorship Paradox']" /></Marquee>
</At>

<At :x="0" :y="460" :w="1280" :h="64">
<Marquee :speed="44" gap="14px"><Chips :items="['The Architecture of Calibrated Autonomy', 'The Hubris of Expertise', 'Failing Fast, Failing Small', 'Shrink the Loop, Keep the Gate']" /></Marquee>
</At>

<At :x="60" :y="646" :w="1100" enter="up" :delay="900">

All of them at [arnaudbletterer.github.io](https://arnaudbletterer.github.io/articles.html).

</At>

</Stage>

---
layout: statement
background: mesh
motion: blur-in
---

#### Bernard of Chartres, 1159

<Kinetic text="We see more and farther than our predecessors, not because we have keener vision or greater height, but because we are lifted up and borne aloft on their gigantic stature." mode="words" from="blur" :stagger="55" size="m" accent="gigantic,stature." :delay="300" />

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Foundations

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="From Strasbourg to the Côte d'Azur." mode="words" from="mask" :stagger="90" size="m" accent="Strasbourg" />
</At>

<At :x="60" :y="250" :w="700" :h="118" enter="left" :delay="400">
<Card class="ab-compact" tag="2018" title="Ph.D in Automatic, Signal and Image Processing" sub="Université Côte d'Azur" />
</At>
<At :x="60" :y="384" :w="700" :h="118" enter="left" :delay="500">
<Card class="ab-compact" tag="2014" title="Master in Computer Science" sub="Université de Strasbourg" />
</At>
<At :x="60" :y="518" :w="700" :h="118" enter="left" :delay="600">
<Card class="ab-compact" tag="2012" title="Bachelor in Computer Science" sub="Université de Strasbourg" />
</At>

<At :x="800" :y="250" :w="420" :h="386" enter="right" :delay="500">
<Card icon="graduation" title="Languages">

**French**, native speaker

**English**, professional use

**German**, school level

**Russian**, beginner

</Card>
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="60" :y="70" :w="1100">

#### Beyond work

</At>

<At :x="60" :y="120" :w="1160">
<Kinetic text="Curiosity does not clock out." mode="words" from="mask" :stagger="90" size="m" accent="clock" />
</At>

<At :x="60" :y="270" :w="275" :h="270" enter="up" :delay="400">
<Card icon="camera" title="Photography" sub="Some of my work is online.">

[Portfolio](https://sceyonara.abletterer.synology.me/){.ab-mini} [Instagram](https://www.instagram.com/sceyonara/){.ab-mini}

</Card>
</At>
<At :x="355" :y="270" :w="275" :h="270" enter="up" :delay="520">
<Card icon="laptop" title="Recreational programming" sub="Programming for the fun of it." />
</At>
<At :x="650" :y="270" :w="275" :h="270" enter="up" :delay="640">
<Card icon="cube" title="Blender" sub="Generating beautiful renderings." />
</At>
<At :x="945" :y="270" :w="275" :h="270" enter="up" :delay="760">
<Card icon="guitar" title="Bass guitar" sub="Playing in my free time." />
</At>

</Stage>

---
layout: stage
---

<Stage full>

<At :x="96" :y="90" :w="480">

#### This deck

</At>

<At :x="96" :y="150" :w="520">
<Kinetic text="Made with Nimbledeck." mode="words" from="mask" :stagger="110" size="l" accent="Nimbledeck." />
</At>

<At :x="96" :y="400" :w="500" enter="up" :delay="900">

[My own slide system: plain Markdown in, motion out.]{.ab-lead}

</At>

<At :x="96" :y="560" :w="540" enter="up" :delay="1300">
<Contact set="nimbledeck" />
</At>

<At :x="680" :y="110" :w="540" :h="420" frame bg="var(--nd-surface)" pad="28px" enter="right" :delay="500">
<Typewriter lang="md" :size="19" :speed="22" :delay="1200">

```md
---
layout: statement
background: mesh
motion: curtain
---

#### The idea

<Kinetic
  text="Research that actually ships."
  mode="words" from="mask"
  accent="ships." />
```

</Typewriter>
</At>

</Stage>

---
layout: full
background: mesh
---

<Stage full>

<At :x="96" :y="120" :w="300" enter="scale">
<Avatar :size="150" />
</At>

<At :x="96" :y="320" :w="1100">
<Kinetic text="Let's talk." mode="words" from="mask" :stagger="140" size="xl" accent="talk." :delay="300" />
</At>

<At :x="96" :y="500" :w="1140" enter="up" :delay="1200">
<Contact />
</At>

</Stage>
