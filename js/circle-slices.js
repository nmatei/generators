// TODO check this examples:
//   https://stackoverflow.com/questions/10028182/how-to-make-a-pie-chart-in-css

/**
 * @global
 * @var {Object} CircleSlices
 */

const defaultText = `
#1 Darul de a rezolva probleme
Discernământ spiritual interior
Creativitate și inventivitate
Luarea deciziilor

#2 Daruri de pastor-învățător
Consilierea
Pregatirea și conducerea închinării
Facerea de ucenici
Predicarea
Zidind unitatea trupului

#3 Orientat spre creștere
Un spirit vizionar
Adaptabil pentru creștere
Generator al creșterii
Motivat personal

#4 Penetrare în societate
Stil de conducere flexibil
Activitate evanghelistică în Biserică și în afara ei
Prezent permanent în Biserică
Găsește soluții pentru nevoile Comunității

#5 Abilitățile conducerii
Autoritate, competență și influență
Dezvoltarea conducerii Bisericii
Motivarea membrilor
Utilizarea tuturor darurilor spirituale
Viziune pe termen mediu și lung

#6 Abilități administrative
Primind și oferind informații și raport
Administrarea timpului
Planificarea obiectivelor. Adaptarea și îmbunătățirea lor.
Organizarea structurilor administrative

#7 Cunoștințe teologice / tehnice
Abilități financiare și contabile
Reguli și legi guvernamentale
Pregătirea lucrării și confirmarea ei
Practica și politica denominațională
Principiile Creșterii Bisericilor

#8 Abilități interpersonale și de comunicare
Ascultarea
Interacțiunea
Menținerea relațiilor
Probleme de construcții
Rezolvarea conflictelor

#9 Stabilitate personală
Făcând față stresului
Auto-încredere și auto-apreciere
Maturitate emoțională
Flexibilitate

#10 Stabilitate în familie
Rol și responsabilitate de soți
Rol și responsabilitate de soț
Cooperare în familie
`;

const defaultCenterText = `
# Disciplina
Viața de rugăciune activă
Spirit de slujitor
Practici etice și morale
Exercitarea credinței

# Spirituală
`;

const defaultsValues = {
  text: defaultText,
  centerText: defaultCenterText
};

const storedContent = getStoredContent();

function getStoredContent() {
  const content = JSON.parse(localStorage.getItem("generator-slices")) || {};
  return { ...defaultsValues, ...content };
}

function storeContent(content) {
  localStorage.setItem("generator-slices", JSON.stringify(content));
}

function syncValues(selector1, selector2) {
  const element1 = $(selector1);
  const element2 = $(selector2);
  element1.value = element2.value;
  element1.addEventListener("input", event => {
    element2.value = event.target.value;
  });
  element2.addEventListener("input", event => {
    element1.value = event.target.value;
    const inputEvent = new Event("input", { bubbles: true });
    element1.dispatchEvent(inputEvent);
  });
}

function loadPreviousValues() {
  $("#groupSize").value = storedContent.groupSize;
  $("#slicesSize").value = storedContent.slicesSize;
  $("#centerSize").value = storedContent.centerSize;
  $("#content").value = storedContent.text;
  $("#centerContent").value = storedContent.centerText;
  console.warn("storedContent", storedContent);
}

function initEvents() {
  syncValues("#rotate", "#rotateDegrees");
  syncValues("#zoom", "#zoomPercent");

  $("#rotate").addEventListener(
    "input",
    debounce(event => {
      const value = event.target.value;
      CircleSlices.rotate("#groups", -value);
    }, 300)
  );
  $("#zoom").addEventListener(
    "input",
    debounce(event => {
      const value = event.target.value;
      $("#groups").style.setProperty("--zoom", `${value}%`);
    }, 400)
  );

  $("#groups").addEventListener("rotate", event => {
    const angle = event.detail.angle;
    $("#rotate").value = angle;
    $("#rotateDegrees").value = angle;
  });

  ["groupSize", "slicesSize", "centerSize"].forEach(id => {
    $(`#${id}`).addEventListener(
      "change",
      debounce(function () {
        storedContent[id] = parseInt(this.value);
        storeContent(storedContent);
        start();
      }, 500)
    );
  });
  $("#content").addEventListener(
    "input",
    debounce(function () {
      const text = this.value.trim();
      storedContent.text = (text || "").trim();
      storeContent(storedContent);
      start();
    }, 500)
  );

  $("#centerContent").addEventListener(
    "input",
    debounce(function () {
      const text = this.value.trim();
      storedContent.centerText = (text || "").trim();
      storeContent(storedContent);
      start();
    }, 500)
  );
}

function start() {
  CircleSlices.render(storedContent);
}

loadPreviousValues();
initEvents();
start();

CircleSlices.render({
  renderTo: "#demo",
  groupSize: 420,
  slicesSize: 350,
  centerSize: 100,
  text: `
# 🔵 HTML
elements
structure
semantics

# 🎨 CSS
styles
layout
responsiveness

# ⚡ JS
logic
interaction
behavior
`,
  centerText: `# 🚀 Web`
});

// TODO check this changes
//  - color slices with different colors
