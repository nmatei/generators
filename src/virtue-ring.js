import "./virtue-ring.css";

export var COLORS = [
  { color: "#4CAF50", textColor: "#fff" },
  { color: "#00BCD4", textColor: "#fff" },
  { color: "#FFC107", textColor: "#333" },
  { color: "#FF8A65", textColor: "#fff" },
  { color: "#EC407A", textColor: "#fff" },
  { color: "#FFEB3B", textColor: "#333" },
  { color: "#EF5350", textColor: "#fff" },
  { color: "#5C6BC0", textColor: "#fff" }
];

var DEFAULTS = {
  renderTo: "#virtue-ring",
  size: 300,
  nodeSize: 96,
  borderWidth: 3,
  fontSize: 10,
  fontFamily: "Georgia, serif",
  shadow: true,
  nodes: []
};

function calcPositions(n, size, nodeSize) {
  var cx = size / 2;
  var cy = size / 2;
  var rRing = size / 2 - nodeSize / 2;
  var positions = [];
  for (var i = 0; i < n; i++) {
    var angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    positions.push({
      x: Math.round(cx + rRing * Math.cos(angle)),
      y: Math.round(cy + rRing * Math.sin(angle))
    });
  }
  return positions;
}

export function render(options) {
  var opts = Object.assign({}, DEFAULTS, options);
  var nodes = opts.nodes;
  var size = opts.size;
  var nodeSize = opts.nodeSize;
  var borderWidth = opts.borderWidth;
  var fontSize = opts.fontSize;
  var fontFamily = opts.fontFamily;
  var shadow = opts.shadow;

  var container = typeof opts.renderTo === "string" ? document.querySelector(opts.renderTo) : opts.renderTo;
  if (!container) {
    console.warn("VirtueRing: renderTo element not found", opts.renderTo);
    return null;
  }

  var n = nodes.length;
  if (n < 2) {
    console.warn("VirtueRing: at least 2 nodes required");
    return null;
  }

  var positions = calcPositions(n, size, nodeSize);
  var r = nodeSize / 2;
  var shadowStyle = shadow ? "box-shadow:0 2px 6px rgba(0,0,0,0.3);" : "";
  var nodeBase = "position:absolute;border-radius:50%;border-style:solid;border-color:white;transform:translate(-50%,-50%);";

  var html = '<div class="vr-diagram" style="width:' + size + "px;height:" + size + 'px;">';

  // Colored circles z=1..n (each covers the previous)
  for (var i = 0; i < n; i++) {
    var p = positions[i];
    var node = nodes[i];
    html +=
      '<div class="vr-node" style="left:' +
      p.x +
      "px;top:" +
      p.y +
      "px;width:" +
      nodeSize +
      "px;height:" +
      nodeSize +
      "px;background:" +
      node.color +
      ";z-index:" +
      (i + 1) +
      ";border-width:" +
      borderWidth +
      "px;" +
      shadowStyle +
      '"></div>';
  }

  // Half-wrapper for nodes[0] at z=n+1 — closes the chain loop over nodes[n-1]
  // Clips the left half of nodes[0]'s circle using overflow:hidden
  var p0 = positions[0];
  html +=
    '<div style="position:absolute;left:' +
    (p0.x - r) +
    "px;top:" +
    (p0.y - r) +
    "px;width:" +
    r +
    "px;height:" +
    nodeSize +
    "px;overflow:hidden;z-index:" +
    (n + 1) +
    ';">' +
    '<div class="vr-node" style="left:' +
    r +
    "px;top:" +
    r +
    "px;width:" +
    nodeSize +
    "px;height:" +
    nodeSize +
    "px;background:" +
    nodes[0].color +
    ";border-width:" +
    borderWidth +
    'px;box-shadow:none;"></div>' +
    "</div>";

  // Labels above all circles (z=50 in CSS)
  for (var j = 0; j < n; j++) {
    var lp = positions[j];
    var lnode = nodes[j];
    html +=
      '<div class="vr-label" style="left:' +
      lp.x +
      "px;top:" +
      lp.y +
      "px;width:" +
      nodeSize +
      "px;height:" +
      nodeSize +
      "px;color:" +
      (lnode.textColor || "#fff") +
      ";font-size:" +
      fontSize +
      "px;font-family:" +
      fontFamily +
      ';">' +
      lnode.label +
      "</div>";
  }

  html += "</div>";
  container.innerHTML = html;
  return container;
}
