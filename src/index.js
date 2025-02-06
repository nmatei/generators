import "./circle-slices.css";
import { $, decreaseFont } from "./common/utilities";

const defaultsValues = {
  renderTo: "#groups",
  groupSize: 1100,
  slicesSize: 950,
  centerSize: 250,
  text: "",
  centerText: "",
  // calculated
  titles: [],
  phrases: []
};

function preparePhrases(text) {
  let phrases = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  //const titles = phrases.filter(line => line.startsWith("#"));
  // group phrases by titles and remove titles from phrases (return title + phrases.length after them)
  const titles = phrases.reduce((acc, line) => {
    if (line.startsWith("#")) {
      acc.push({
        text: line.substring(1).trim(),
        children: []
      });
    } else {
      acc[acc.length - 1].children.push(line);
    }
    return acc;
  }, []);

  phrases = phrases
    .filter(line => !line.startsWith("#"))
    .map(line => ({
      text: line
    }));

  return {
    titles,
    phrases
  };
}

function createObjects(phrases, color) {
  const length = phrases.reduce((acc, item) => acc + (item.children || [1]).length, 0);
  const radius = 360 / length;
  const odd = length % 2 === 1 ? 0 : 1;
  let index = 0;
  return phrases.map(({ text, children = [] }, i) => {
    const slices = children.length || 1;
    index += slices;
    const elementAngle = Math.round(slices * radius);
    const angle = Math.round(index * radius - radius / 2);
    const lineColor = color || `hsl(${Math.round(index * radius)}, 100%, 50%)`;
    const lineAngle = angle + odd * Math.round(radius / 2);
    const textAngle = angle - elementAngle / 2 + odd * Math.round(radius / 2);

    return {
      line: `<div data-index="${i + 1}" class="slice-line" style="--angle: ${lineAngle}deg; --color: ${lineColor}"></div>`,
      text: `<div data-index="${i + 1}" class="slice-text" style="--angle: ${textAngle}deg;">
          <div class="phrase-inner">${text}</div>
        </div>`
    };
  });
}

function createSlices(circle, phrases, width = 800, innerWidth = 250, lineWidth, color) {
  if (typeof circle === "string") {
    circle = $(circle);
  }
  circle.style.width = `${width}px`;
  circle.style.height = `${width}px`;
  circle.style.setProperty("--line-width", `${lineWidth || (width - innerWidth) / 2}px`);
  circle.style.setProperty("--text-width", `${(width - innerWidth) / 2}px`);
  circle.style.setProperty("--padding-start", `${innerWidth}px`);

  const objects = createObjects(phrases, color);
  circle.innerHTML = objects.map(({ line }) => line).join("");
  circle.innerHTML += objects.map(({ text }) => text).join("");
  return circle;
}

function createMiddleGrid(circle, width, centerText) {
  if (typeof circle === "string") {
    circle = $(circle);
  }
  circle.style.width = `${width}px`;
  circle.style.height = `${width}px`;

  const { titles } = preparePhrases(centerText);
  circle.innerHTML = "";
  titles.forEach(({ text, children }, i) => {
    circle.innerHTML += `<h2>${text}</h2><div class="grid" id="inner-grid-${i}"></div>`;
    $(`#inner-grid-${i}`, circle).innerHTML += children.map(text => `<div class="center-text">${text}</div>`).join("");
  });
  return circle;
}

export function rotate(target, degrees) {
  if (typeof degrees !== "number") {
    degrees = parseFloat(degrees);
  }
  const $target = $(target);
  $target.style.transform = `rotate(${degrees}deg)`;
  $(".circle-slice-center", $target).style.transform = `rotate(${degrees * -1}deg)`;
}

function initEvents(options) {
  $(options.renderTo).addEventListener("click", event => {
    const target = event.target;
    if (target.closest(".phrase-inner")) {
      const slice = target.closest(".slice-text");
      const angle = parseFloat(slice.style.getPropertyValue("--angle").replace("deg", ""));
      rotate(options.renderTo, -angle);
      $(options.renderTo).dispatchEvent(new CustomEvent("rotate", { detail: { angle } }));
    }
  });
}

function start(options) {
  const { groupSize, slicesSize, centerSize } = options;

  let renderTo = $(options.renderTo);
  if (!renderTo) {
    console.warn("%o not found, creating it in body", options.renderTo);
    renderTo = document.createElement("div");
    renderTo.id = options.renderTo.substring(1);
    document.body.appendChild(renderTo);
  }
  renderTo.classList.add("circle-slice-group", "circle");
  const groups = createSlices(options.renderTo, options.titles, groupSize, slicesSize, (groupSize - centerSize) / 2);
  // TODO config for slices id or dynamic id
  groups.innerHTML += `<div class="circle-slices circle"></div>`;
  const slicesCircle = $(".circle-slices", groups);
  const slicesCircleId = options.renderTo + "-slices";
  slicesCircle.id = slicesCircleId;
  const slices = createSlices(slicesCircle, options.phrases, slicesSize, centerSize);
  slices.innerHTML += `<div class="circle-slice-center circle"></div>`;
  const centerCircle = $(".circle-slice-center", slices);
  createMiddleGrid(centerCircle, centerSize, options.centerText);

  //wait until animation is done then decrease font
  setTimeout(() => {
    decreaseFont(`${slicesCircleId} .phrase-inner`, "", 26);
  }, 1000);
}

export function render(options) {
  const storedOptions = { ...defaultsValues };

  Object.assign(storedOptions, options);
  const { phrases, titles } = preparePhrases(storedOptions.text);
  Object.assign(storedOptions, {
    phrases,
    titles
  });
  start(storedOptions);
  initEvents(storedOptions);
}

export function update(options) {
  // TODO...
  console.warn("not implemented yet", options);
}
