# Chaos Game

**[Try it live](https://georgemandis.github.io/chaotic-playground/)**

An interactive visualization of the [chaos game](https://en.wikipedia.org/wiki/Chaos_game), a method for generating fractals through a deceptively simple algorithm.

## The Algorithm

1. Pick some points on a plane. These are your **vertices**.
2. Pick a **starting point** anywhere.
3. Randomly choose one of the vertices.
4. Draw a new point some fraction of the distance between your current point and the chosen vertex.
5. Repeat from step 3, using the most recent point each time.

That's it. From pure randomness, structure emerges.

A common misconception is that you're measuring between two vertices, or doing some kind of triangulation. You're not. Each step involves exactly **one** randomly chosen vertex and your **one** current point. You go halfway (or some fraction) between them, mark the spot, and that's your new current point.

## The Starting Point

The starting point is necessary to kick off the game -- you need *some* position to begin measuring from. But it has essentially no influence on the outcome. After roughly 10 iterations, every possible starting point converges onto the same fractal shape. This is what mathematicians call an **attractor**: no matter where you begin, the system pulls you into the same structure. The starting point is the spark, not the fire.

## The Ratio

The **ratio** controls how far you move toward the chosen vertex each step. A ratio of 0.50 means "go halfway" -- this is the classic version.

This parameter is what makes different vertex counts produce (or not produce) fractals:

- **3 vertices, ratio 0.50** -- the classic Sierpinski triangle. The three sub-triangles created by halving never overlap, so you get a clean fractal.
- **4 vertices (square), ratio 0.50** -- fills in uniformly. At 1/2, the four quadrant copies overlap completely, destroying the fractal structure.
- **4 vertices, ratio ~0.33** -- a fractal appears again! At 1/3, the four copies are small enough to not overlap.

The general rule: for **n** vertices arranged as a regular polygon, a ratio of `1 / (1 + 1/(n-2))` or lower tends to produce clean fractals. But irregular vertex placement creates interesting in-between states where you can see ghostly overlapping triangular structures.

Higher ratios (toward 1.0) mean points cluster tightly around the vertices. Lower ratios (toward 0.0) mean points barely move and cluster around the starting point. The sweet spot depends on how many vertices you have.

## What We're Changing

This sketch lets you play with the parameters that are normally fixed in the classic Sierpinski demonstration:

- **Number of vertices** -- The classic uses 3. Adding more changes the geometry entirely. The Sierpinski triangle is just one member of a whole family of fractals.
- **Vertex placement** -- The classic often uses an equilateral triangle, but the algorithm works with *any* 3 points. Drag them around to see the fractal stretch and skew -- it always maintains its self-similar structure.
- **Ratio** -- The classic uses 1/2 (halfway). Changing this reveals why 1/2 is special for 3 vertices, and lets you find the right ratio for other vertex counts.
- **Number of starting points** -- Normally there's just one. Adding more lets you watch multiple independent random walks all converge to the same attractor simultaneously, which really drives home that the starting point doesn't matter.
- **Speed** -- The classic is instantaneous (or on paper, tedious). Slowing it down lets you watch the structure emerge from apparent noise.

## Controls

| Key | Action |
|-----|--------|
| **P** | Play / Pause |
| **Left/Right arrows** | Decrease / Increase speed (points per frame) |
| **Up/Down arrows** | Increase / Decrease ratio |
| **M** | Toggle mode: adding vertices (colored) vs. starting points (green) |
| **C** | Clear canvas and restart |
| **Click** | Add a vertex or starting point (depending on mode) |
| **Right-click** | Remove nearest vertex or starting point |
| **Drag** | Move any point |

## Things to Try

- Start with 3 vertices and slowly decrease the ratio below 0.50 -- watch the triangle shrink and separate.
- Add a 4th vertex and lower the ratio until structure appears.
- Add 5 or 6 vertices and find their sweet-spot ratio.
- Place vertices in a line rather than spread out.
- Add multiple green starting points -- they all converge to the same fractal attractor regardless of where they start (that's the "chaos" part).
- Drag a vertex while the sketch is running and watch the fractal morph.
