let portrait = document.body.classList.contains("portrait");
const defaultFontSize = 36;

function setOrientation(portraitValue) {
  portrait = portraitValue;
  document.body.classList.remove(portraitValue ? "landscape" : "portrait");
  document.body.classList.add(portraitValue ? "portrait" : "landscape");

  // Set print orientation dynamically
  const style = document.getElementById("print-orientation") || document.createElement("style");
  if (!style.id) {
    style.id = "print-orientation";
    document.head.appendChild(style);
  }

  style.textContent = `
    @media print {
      @page {
        size: A4 ${portraitValue ? "portrait" : "landscape"};
      }
    }
  `;

  // Update radio buttons to match orientation
  document.getElementById("portrait").checked = portraitValue;
  document.getElementById("landscape").checked = !portraitValue;

  displayNames(getStoredNames(), portraitValue);
}

function getStoredNames() {
  let items = JSON.parse(localStorage.getItem("badgeNames")) || [];
  if (items.length === 0) {
    items = ["Enter Names"];
  }
  return items;
}

function storeNames(names) {
  localStorage.setItem("badgeNames", JSON.stringify(names));
}

function initEvents() {
  $("#names").addEventListener(
    "input",
    debounce(function () {
      const value = this.value || "Enter Names";
      const names = value
        .split("\n")
        .map(name => name.trim())
        .filter(name => name);
      storeNames(names);
      displayNames(names, portrait);
    }, 300)
  );
}

function displayNames(names, portrait = true) {
  names = [...names];
  const itemsPerPage = portrait ? 9 : 5; // 5 because will duplicate each name

  if (names.length % itemsPerPage !== 0) {
    new Array(itemsPerPage - (names.length % itemsPerPage)).fill(0).forEach(() => names.push(" "));
  }

  if (!portrait) {
    //TODO duplicate each row to make it double sided (one row has 5 elements
    names = names.reduce((acc, name, index, all) => {
      acc.push(name);
      if (index % 5 === 4) {
        acc.push(...all.slice(index - 4, index + 1));
      }
      return acc;
    }, []);
  }

  const badges = names.map((name, i) => {
    const parts = name.split(/\s+/);
    const flip = portrait ? "" : i % 10 >= 5 ? "flip" : "";
    return `<div class="badge ${flip}">
          ${parts.map(part => `<div>${part}</div>`).join("")}
        </div>`;
  });
  $("#badges").innerHTML = badges.join("");

  decreaseFont(".badge", "div", defaultFontSize);
}

const names = getStoredNames();
$("#names").value = names.join("\n");
displayNames(names, portrait);

// Initialize orientation based on body class
const initialPortrait = document.body.classList.contains("portrait");
setOrientation(initialPortrait);
initEvents();
