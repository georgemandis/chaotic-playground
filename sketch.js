let vertices = [];
let startPoints = [];
let currents = [];
let dragging = null;
let dragIndex = -1;
let dragType = null; // 'vertex' or 'start'
let pts;
let running = true;
let speed = 50;
let mode = 'vertex'; // 'vertex' or 'start'
let vertexColors = [];
let removeRadius = 20;
let ratio = 0.5;
let continuous = false;
let bw = false;
let animated = false;
let velocities = [];
let trailMode = false;
let trailSize = 6;

// UI
let panelX, panelY, panelW, panelH;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pts = createGraphics(width, height);
  pts.background(0);

  // Default 3 vertices with colors
  for (let i = 0; i < 3; i++) {
    addVertex(random(width), random(height));
  }

  addStartPoint(random(width), random(height));

  panelW = 220;
  panelH = 280;
  panelX = width - panelW - 15;
  panelY = 15;
}

function addVertex(x, y) {
  vertices.push(createVector(x, y));
  vertexColors.push(color(
    random(100, 255),
    random(100, 255),
    random(100, 255)
  ));
  velocities.push(createVector(random(-2, 2), random(-2, 2)));
}

function resetCanvas() {
  pts.background(0);
  for (let i = 0; i < currents.length; i++) {
    currents[i] = startPoints[i].copy();
  }
}

function addStartPoint(x, y) {
  startPoints.push(createVector(x, y));
  currents.push(createVector(x, y));
}

function draw() {
  // Animate vertices
  if (animated && running) {
    for (let i = 0; i < vertices.length; i++) {
      vertices[i].x += velocities[i].x;
      vertices[i].y += velocities[i].y;
      if (vertices[i].x < 0 || vertices[i].x > width) velocities[i].x *= -1;
      if (vertices[i].y < 0 || vertices[i].y > height) velocities[i].y *= -1;
      vertices[i].x = constrain(vertices[i].x, 0, width);
      vertices[i].y = constrain(vertices[i].y, 0, height);
    }
  }

  if (running && vertices.length >= 2) {
    let steps = trailMode ? 1 : speed;
    for (let i = 0; i < steps; i++) {
      for (let c = 0; c < currents.length; c++) {
        let idx = floor(random(vertices.length));
        let v = vertices[idx];
        currents[c].x = currents[c].x + ratio * (v.x - currents[c].x);
        currents[c].y = currents[c].y + ratio * (v.y - currents[c].y);

        if (trailMode) {
          let prevX = currents[c].prevX || currents[c].x;
          let prevY = currents[c].prevY || currents[c].y;
          if (bw) {
            pts.stroke(255, 20);
          } else {
            let col = vertexColors[idx];
            pts.stroke(red(col), green(col), blue(col), 20);
          }
          pts.strokeWeight(1);
          pts.line(prevX, prevY, currents[c].x, currents[c].y);
          currents[c].prevX = currents[c].x;
          currents[c].prevY = currents[c].y;
        } else {
          if (bw) {
            pts.stroke(255, 150);
          } else {
            let col = vertexColors[idx];
            pts.stroke(red(col), green(col), blue(col), 150);
          }
          pts.strokeWeight(1);
          pts.point(currents[c].x, currents[c].y);
        }
      }
    }
  }

  image(pts, 0, 0);

  // Draw vertices
  noStroke();
  for (let i = 0; i < vertices.length; i++) {
    fill(vertexColors[i]);
    ellipse(vertices[i].x, vertices[i].y, 14, 14);
  }

  // Draw start points
  fill(0, 255, 0);
  for (let sp of startPoints) {
    ellipse(sp.x, sp.y, 14, 14);
  }

  drawPanel();
}

function drawPanel() {
  panelX = width - panelW - 15;

  // Background
  fill(0, 180);
  noStroke();
  rect(panelX, panelY, panelW, panelH, 8);

  fill(255);
  textSize(12);
  textFont('monospace');
  textAlign(LEFT, TOP);

  let x = panelX + 12;
  let y = panelY + 12;

  // Play/pause
  text(running ? '[P] Pause' : '[P] Play', x, y);
  y += 22;

  // Speed
  text('[←/→] Speed: ' + speed, x, y);
  y += 22;

  // Ratio
  text('[↑/↓] Ratio: ' + nf(ratio, 1, 2), x, y);
  y += 22;

  // Mode
  let modeLabel = mode === 'vertex' ? 'Vertex (red)' : 'Start (green)';
  text('[M] Mode: ' + modeLabel, x, y);
  y += 22;

  // Instructions
  text('Click to add ' + mode, x, y);
  y += 22;

  text('Right-click to remove', x, y);
  y += 22;

  text('[X] Continuous: ' + (continuous ? 'ON' : 'OFF'), x, y);
  y += 22;

  text('[B] B&W: ' + (bw ? 'ON' : 'OFF'), x, y);
  y += 22;

  text('[A] Animate: ' + (animated ? 'ON' : 'OFF'), x, y);
  y += 22;

  text('[T] Trail: ' + (trailMode ? 'ON' : 'OFF'), x, y);
  y += 22;

  text('[C] Clear canvas', x, y);
  y += 22;

  // Counts
  fill(180);
  text(vertices.length + ' vertices / ' + startPoints.length + ' starts', x, y);
}

function insidePanel(mx, my) {
  return mx > panelX && mx < panelX + panelW && my > panelY && my < panelY + panelH;
}

function keyPressed() {
  if (key === 'p' || key === 'P') {
    running = !running;
  } else if (key === 'm' || key === 'M') {
    mode = mode === 'vertex' ? 'start' : 'vertex';
  } else if (key === 'c' || key === 'C') {
    pts.background(0);
    for (let i = 0; i < currents.length; i++) {
      currents[i] = startPoints[i].copy();
    }
  } else if (keyCode === RIGHT_ARROW) {
    speed = min(speed + 10, 500);
  } else if (keyCode === LEFT_ARROW) {
    speed = max(speed - 10, 10);
  } else if (keyCode === UP_ARROW) {
    ratio = min(ratio + 0.05, 0.95);
    resetCanvas();
  } else if (keyCode === DOWN_ARROW) {
    ratio = max(ratio - 0.05, 0.05);
    resetCanvas();
  } else if (key === 'x' || key === 'X') {
    continuous = !continuous;
  } else if (key === 'b' || key === 'B') {
    bw = !bw;
    resetCanvas();
  } else if (key === 'a' || key === 'A') {
    animated = !animated;
  } else if (key === 't' || key === 'T') {
    trailMode = !trailMode;
    resetCanvas();
  }
}

function mousePressed() {
  if (insidePanel(mouseX, mouseY)) return;

  // Right-click to remove
  if (mouseButton === RIGHT) {
    // Check start points
    for (let i = startPoints.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, startPoints[i].x, startPoints[i].y) < removeRadius) {
        if (startPoints.length > 1) {
          startPoints.splice(i, 1);
          currents.splice(i, 1);
          pts.background(0);
        }
        return;
      }
    }
    // Check vertices
    for (let i = vertices.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, vertices[i].x, vertices[i].y) < removeRadius) {
        if (vertices.length > 2) {
          vertices.splice(i, 1);
          vertexColors.splice(i, 1);
          velocities.splice(i, 1);
          pts.background(0);
          for (let j = 0; j < currents.length; j++) {
            currents[j] = startPoints[j].copy();
          }
        }
        return;
      }
    }
    return;
  }

  // Left-click: check for drag first
  for (let i = 0; i < startPoints.length; i++) {
    if (dist(mouseX, mouseY, startPoints[i].x, startPoints[i].y) < removeRadius) {
      dragging = startPoints[i];
      dragIndex = i;
      dragType = 'start';
      return;
    }
  }
  for (let i = 0; i < vertices.length; i++) {
    if (dist(mouseX, mouseY, vertices[i].x, vertices[i].y) < removeRadius) {
      dragging = vertices[i];
      dragIndex = i;
      dragType = 'vertex';
      return;
    }
  }

  // Click empty space: add point
  if (mode === 'vertex') {
    addVertex(mouseX, mouseY);
  } else {
    addStartPoint(mouseX, mouseY);
  }
  pts.background(0);
  for (let i = 0; i < currents.length; i++) {
    currents[i] = startPoints[i].copy();
  }
}

function mouseDragged() {
  if (dragging) {
    dragging.x = mouseX;
    dragging.y = mouseY;
    if (!continuous) {
      if (dragType === 'start') {
        currents[dragIndex] = startPoints[dragIndex].copy();
      }
      resetCanvas();
    }
  }
}

function mouseReleased() {
  dragging = null;
  dragType = null;
  dragIndex = -1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pts.resizeCanvas(width, height);
}
