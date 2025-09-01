const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const calculator = document.getElementById('calculator');
const overlayText = document.getElementById('overlay-text');
const paragraph = document.getElementById('overlay-paragraph');
const historyList = document.getElementById("historyList");

const hamburger = document.querySelector(".hamburger-menu");
const sideMenu = document.querySelector(".side-menu");

let idleTimer;
const texts = ["Ayoko gumawa ng SciCal", "Tara Inom", "I labyu sir", "Give me Coffee", "Unemployed ASH"];
let currentIndex = 0;

setInterval(() => {
  currentIndex = (currentIndex + 1) % texts.length;
  paragraph.textContent = texts[currentIndex];
}, 4000);

function resetIdle() {
  calculator.classList.remove('idle');
  overlayText.classList.remove('show');
  clearTimeout(idleTimer);

  idleTimer = setTimeout(() => {
    calculator.classList.add('idle');
    overlayText.classList.add('show');
  }, 500);
}

function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    resetIdle();
    const value = button.textContent;

    if (button.classList.contains("clear")) {
      display.innerHTML = "<span>0</span>";

    } else if (button.classList.contains("delete")) {
      const spans = display.querySelectorAll("span");
      if (spans.length > 1) spans[spans.length - 1].remove();
      else display.innerHTML = "<span>0</span>";

    } else if (button.classList.contains("equal")) {
      try {
        let expr = Array.from(display.querySelectorAll("span"))
          .map(s => s.textContent)
          .join("")
          .replace(/x/g, "*");
        
        const result = eval(expr);

        if (!isFinite(result)) throw "Invalid operation";

        display.innerHTML = `<span>${result}</span>`;
        addToHistory(expr, result);

      } catch (err) {
        display.innerHTML = `<span>Invalid operation</span>`;

        const expr = Array.from(display.querySelectorAll("span"))
          .map(s => s.textContent)
          .join("");
        addToHistory(expr, "Sorry Baby");
      }

    } else {
      const firstSpan = display.querySelector("span");
      if (firstSpan && firstSpan.textContent === "0" && !isNaN(value)) {
        display.innerHTML = "";
      }

      const span = document.createElement("span");
      span.textContent = value;
      display.appendChild(span);

      span.classList.add("pop");
      span.addEventListener("animationend", () => {
        span.classList.remove("pop");
      }, { once: true });
    }
  });
});

hamburger.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
});

document.addEventListener('mousemove', resetIdle);
document.addEventListener('keydown', resetIdle);

resetIdle();
