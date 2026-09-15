const gateInfo = {
  AND: {
    title: "AND 게이트",
    formula: "Y = A · B",
    description: "AND 게이트는 모든 입력이 1일 때만 출력이 1이 됩니다. 두 스위치를 모두 켜야 전등이 켜지는 회로와 비슷합니다.",
    needsB: true,
    calc: (a, b) => a && b ? 1 : 0,
  },
  OR: {
    title: "OR 게이트",
    formula: "Y = A + B",
    description: "OR 게이트는 입력 중 하나라도 1이면 출력이 1이 됩니다. 여러 스위치 중 하나만 켜도 전등이 켜지는 회로와 비슷합니다.",
    needsB: true,
    calc: (a, b) => a || b ? 1 : 0,
  },
  NOT: {
    title: "NOT 게이트",
    formula: "Y = A̅",
    description: "NOT 게이트는 입력을 반대로 바꿉니다. 입력 A가 1이면 출력은 0, 입력 A가 0이면 출력은 1이 됩니다.",
    needsB: false,
    calc: (a) => a ? 0 : 1,
  },
  NAND: {
    title: "NAND 게이트",
    formula: "Y = (A · B)̅",
    description: "NAND 게이트는 AND 결과를 반전한 게이트입니다. A와 B가 모두 1일 때만 출력이 0이고, 나머지는 1입니다.",
    needsB: true,
    calc: (a, b) => !(a && b) ? 1 : 0,
  },
  NOR: {
    title: "NOR 게이트",
    formula: "Y = (A + B)̅",
    description: "NOR 게이트는 OR 결과를 반전한 게이트입니다. A와 B가 모두 0일 때만 출력이 1입니다.",
    needsB: true,
    calc: (a, b) => !(a || b) ? 1 : 0,
  },
  XOR: {
    title: "XOR 게이트",
    formula: "Y = A ⊕ B",
    description: "XOR 게이트는 두 입력이 서로 다를 때만 출력이 1이 됩니다. 반가산기의 Sum 계산에 사용됩니다.",
    needsB: true,
    calc: (a, b) => a !== b ? 1 : 0,
  },
  XNOR: {
    title: "XNOR 게이트",
    formula: "Y = (A ⊕ B)̅",
    description: "XNOR 게이트는 XOR 결과를 반전한 게이트입니다. 두 입력이 서로 같을 때 출력이 1이 됩니다.",
    needsB: true,
    calc: (a, b) => a === b ? 1 : 0,
  },
};

let currentGate = "AND";
let inputA = 0;
let inputB = 0;

const outputValue = document.getElementById("outputValue");
const led = document.getElementById("led");
const gateShape = document.getElementById("gateShape");
const gateTitle = document.getElementById("gateTitle");
const gateFormula = document.getElementById("gateFormula");
const gateDescription = document.getElementById("gateDescription");
const truthHead = document.getElementById("truthHead");
const truthBody = document.getElementById("truthBody");
const inputBRow = document.getElementById("inputBRow");
const inputHint = document.getElementById("inputHint");

function calculate(gate, a, b) {
  return gateInfo[gate].calc(a, b);
}

function selectGate(gate) {
  currentGate = gate;
  document.querySelectorAll(".gate-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.gate === gate);
  });
  update();
}

function setInput(input, value) {
  const numberValue = Number(value);
  if (input === "A") inputA = numberValue;
  if (input === "B") inputB = numberValue;

  document.querySelectorAll(`[data-input="${input}"]`).forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.value) === numberValue);
  });
  update();
}

function update() {
  const info = gateInfo[currentGate];
  const result = calculate(currentGate, inputA, inputB);

  outputValue.textContent = result;
  led.classList.toggle("on", result === 1);
  gateShape.textContent = currentGate;
  gateTitle.textContent = info.title;
  gateFormula.textContent = info.formula;
  gateDescription.textContent = info.description;

  inputBRow.style.display = info.needsB ? "flex" : "none";
  inputHint.textContent = info.needsB
    ? "현재 선택한 게이트는 입력 A, B를 사용합니다."
    : "NOT 게이트는 입력 A만 사용합니다. 입력 B는 계산에 사용되지 않습니다.";

  updateTruthTable();
}

function updateTruthTable() {
  const info = gateInfo[currentGate];
  truthHead.innerHTML = info.needsB
    ? `<tr><th>A</th><th>B</th><th>Y</th></tr>`
    : `<tr><th>A</th><th>Y</th></tr>`;

  const rows = info.needsB
    ? [[0, 0], [0, 1], [1, 0], [1, 1]]
    : [[0], [1]];

  truthBody.innerHTML = rows.map((row) => {
    const a = row[0];
    const b = row[1] ?? 0;
    const y = calculate(currentGate, a, b);
    return info.needsB
      ? `<tr><td>${a}</td><td>${b}</td><td><strong>${y}</strong></td></tr>`
      : `<tr><td>${a}</td><td><strong>${y}</strong></td></tr>`;
  }).join("");
}

document.querySelectorAll(".gate-btn").forEach((button) => {
  button.addEventListener("click", () => selectGate(button.dataset.gate));
});

document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => setInput(button.dataset.input, button.dataset.value));
});

update();
