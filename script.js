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
  gateShape.innerHTML = gateSvg(currentGate);
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

// 퀴즈 기능
let quizAnswer = 0;
function makeQuiz() {
  const gates = Object.keys(gateInfo);
  const gate = gates[Math.floor(Math.random() * gates.length)];
  const a = Math.round(Math.random());
  const b = Math.round(Math.random());
  quizAnswer = calculate(gate, a, b);
  const info = gateInfo[gate];
  document.getElementById("quizQuestion").textContent = info.needsB
    ? `${gate} 게이트에서 A=${a}, B=${b}일 때 출력 Y는?`
    : `${gate} 게이트에서 A=${a}일 때 출력 Y는?`;
  const feedback = document.getElementById("quizFeedback");
  feedback.textContent = "";
  feedback.className = "feedback";
}

document.querySelectorAll(".quiz-choice").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = Number(button.dataset.answer);
    const feedback = document.getElementById("quizFeedback");
    if (selected === quizAnswer) {
      feedback.textContent = "정답입니다!";
      feedback.className = "feedback correct";
    } else {
      feedback.textContent = `아쉬워요. 정답은 ${quizAnswer}입니다.`;
      feedback.className = "feedback wrong";
    }
  });
});

document.getElementById("newQuizBtn").addEventListener("click", makeQuiz);
makeQuiz();


// QR 공유 기능
function getDefaultShareUrl() {
  if (location.protocol === "http:" || location.protocol === "https:") {
    return location.href;
  }
  return "";
}

function makeQrCode() {
  const input = document.getElementById("shareUrl");
  const qrImage = document.getElementById("qrImage");
  const qrText = document.getElementById("qrText");
  const url = input.value.trim();

  if (!url) {
    qrImage.style.display = "none";
    qrText.textContent = "Netlify나 GitHub Pages로 배포한 주소를 입력한 뒤 QR 코드를 만들어 주세요.";
    return;
  }

  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;
  qrImage.style.display = "block";
  qrText.textContent = "휴대폰 카메라로 QR 코드를 스캔하면 웹사이트에 접속할 수 있습니다.";
}

async function copyShareUrl() {
  const input = document.getElementById("shareUrl");
  const qrText = document.getElementById("qrText");
  if (!input.value.trim()) {
    qrText.textContent = "복사할 주소가 없습니다. 먼저 웹사이트 주소를 입력해 주세요.";
    return;
  }
  try {
    await navigator.clipboard.writeText(input.value.trim());
    qrText.textContent = "웹사이트 주소가 복사되었습니다.";
  } catch (e) {
    input.select();
    qrText.textContent = "주소를 선택해 두었습니다. Ctrl+C로 복사해 주세요.";
  }
}

const shareUrlInput = document.getElementById("shareUrl");
if (shareUrlInput) {
  shareUrlInput.value = getDefaultShareUrl();
  document.getElementById("makeQrBtn").addEventListener("click", makeQrCode);
  document.getElementById("copyUrlBtn").addEventListener("click", copyShareUrl);
  if (shareUrlInput.value) makeQrCode();
}


// 2단계: IC 칩 핀 배치 이미지 정보
const icData = {
  AND: { title: "7408 AND IC", name: "7408 AND IC", desc: "7408은 2입력 AND 게이트 4개가 들어 있는 14핀 IC입니다. 14번 핀은 5V, 7번 핀은 GND에 연결합니다.", pins: ["1A","1B","1Y","2A","2B","2Y","3Y","3A","3B","4Y","4A","4B"] },
  OR: { title: "7432 OR IC", name: "7432 OR IC", desc: "7432는 2입력 OR 게이트 4개가 들어 있는 14핀 IC입니다. 입력 중 하나라도 1이면 출력이 1입니다.", pins: ["1A","1B","1Y","2A","2B","2Y","3Y","3A","3B","4Y","4A","4B"] },
  NOT: { title: "7404 NOT IC", name: "7404 NOT IC", desc: "7404는 입력을 반전하는 NOT 게이트 6개가 들어 있는 14핀 IC입니다.", pins: ["1A","1Y","2A","2Y","3A","3Y","4Y","4A","5Y","5A","6Y","6A"] },
  NAND: { title: "7400 NAND IC", name: "7400 NAND IC", desc: "7400은 2입력 NAND 게이트 4개가 들어 있는 14핀 IC입니다. AND 결과를 반전합니다.", pins: ["1A","1B","1Y","2A","2B","2Y","3Y","3A","3B","4Y","4A","4B"] },
  NOR: { title: "7402 NOR IC", name: "7402 NOR IC", desc: "7402는 2입력 NOR 게이트 4개가 들어 있는 14핀 IC입니다. OR 결과를 반전합니다.", pins: ["1Y","1A","1B","2Y","2A","2B","3B","3A","3Y","4B","4A","4Y"] },
  XOR: { title: "7486 XOR IC", name: "7486 XOR IC", desc: "7486은 2입력 XOR 게이트 4개가 들어 있는 14핀 IC입니다. 두 입력이 서로 다를 때 출력이 1입니다.", pins: ["1A","1B","1Y","2A","2B","2Y","3Y","3A","3B","4Y","4A","4B"] },
};
function updateIcChip(type) {
  const data = icData[type];
  if (!data) return;
  document.getElementById("icTitle").textContent = data.title;
  document.getElementById("icName").textContent = data.name;
  document.getElementById("icDesc").textContent = data.desc;
  const ids = ["pin1","pin2","pin3","pin4","pin5","pin6","pin8","pin9","pin10","pin11","pin12","pin13"];
  ids.forEach((id, i) => document.getElementById(id).textContent = data.pins[i]);
}
document.querySelectorAll(".ic-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".ic-btn").forEach((b) => b.classList.toggle("active", b === button));
    updateIcChip(button.dataset.ic);
  });
});
updateIcChip("AND");

// 4단계: 브레드보드 배치 실습
let currentTool = "AND";
let wireStart = null;
const board = document.getElementById("breadboard");
const wireLayer = document.getElementById("wireLayer");
if (board) {
  document.querySelectorAll(".tool").forEach(btn=>btn.addEventListener("click",()=>{currentTool=btn.dataset.tool;document.querySelectorAll(".tool").forEach(b=>b.classList.toggle("active",b===btn));wireStart=null;}));
  board.addEventListener("click", (e)=>{
    const rect=board.getBoundingClientRect(); const x=e.clientX-rect.left; const y=e.clientY-rect.top;
    if(currentTool==="WIRE"){
      if(!wireStart){ wireStart={x,y}; return; }
      const line=document.createElementNS("http://www.w3.org/2000/svg","line"); line.setAttribute("x1",wireStart.x); line.setAttribute("y1",wireStart.y); line.setAttribute("x2",x); line.setAttribute("y2",y); line.setAttribute("class","wire-line"); wireLayer.appendChild(line); wireStart=null; return;
    }
    const part=document.createElement("div"); part.className=`part ${currentTool}`; part.textContent=currentTool; part.style.left=Math.max(5,Math.min(805,x-43))+"px"; part.style.top=Math.max(50,Math.min(300,y-20))+"px"; board.appendChild(part);
  });
  document.getElementById("clearBoard").addEventListener("click",()=>{board.querySelectorAll(".part").forEach(p=>p.remove()); wireLayer.innerHTML=""; wireStart=null;});
}

// 5단계: 심화 퀴즈 + 6단계: 오답노트
const hardQuestions = [
  {q:"반가산기에서 A=1, B=1일 때 Sum과 Carry는?", choices:["Sum=0, Carry=1","Sum=1, Carry=0","Sum=1, Carry=1","Sum=0, Carry=0"], answer:0, explain:"반가산기에서 Sum=A⊕B라서 0, Carry=A·B라서 1입니다."},
  {q:"전가산기에서 A=1, B=1, Cin=1일 때 Sum과 Cout은?", choices:["Sum=1, Cout=1","Sum=0, Cout=1","Sum=1, Cout=0","Sum=0, Cout=0"], answer:0, explain:"1+1+1=3(2진수 11)이므로 Sum=1, Cout=1입니다."},
  {q:"2입력 MUX에서 선택선 S=0이면 보통 어떤 입력이 출력되는가?", choices:["D0","D1","두 입력 모두","출력 없음"], answer:0, explain:"기본 2:1 MUX는 S=0일 때 D0, S=1일 때 D1을 선택합니다."},
  {q:"7408 AND IC에서 일반적으로 VCC와 GND 핀 번호는?", choices:["14번 VCC, 7번 GND","7번 VCC, 14번 GND","1번 VCC, 8번 GND","4번 VCC, 11번 GND"], answer:0, explain:"대부분 14핀 74xx IC는 14번이 VCC(+5V), 7번이 GND입니다."},
  {q:"7세그먼트에서 숫자 8을 표시하려면?", choices:["a~g 모두 켠다","a,b만 켠다","g만 끈다","d,e,f만 켠다"], answer:0, explain:"숫자 8은 7개의 세그먼트 a,b,c,d,e,f,g가 모두 켜진 형태입니다."},
  {q:"NAND 게이트만으로 NOT을 만들려면?", choices:["두 입력을 같은 A에 연결한다","출력을 GND에 연결한다","입력 하나를 비운다","두 NAND 출력을 더한다"], answer:0, explain:"NAND의 두 입력에 같은 A를 넣으면 Y=!(A·A)=!A가 되어 NOT처럼 동작합니다."}
];
hardQuestions.push(...[{"q": "AND 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "AND의 진리표에 입력 0, 0를 대입하면 출력은 0입니다."}, {"q": "AND 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "AND의 진리표에 입력 0, 1를 대입하면 출력은 0입니다."}, {"q": "AND 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "AND의 진리표에 입력 1, 0를 대입하면 출력은 0입니다."}, {"q": "AND 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "AND의 진리표에 입력 1, 1를 대입하면 출력은 1입니다."}, {"q": "OR 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "OR의 진리표에 입력 0, 0를 대입하면 출력은 0입니다."}, {"q": "OR 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "OR의 진리표에 입력 0, 1를 대입하면 출력은 1입니다."}, {"q": "OR 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "OR의 진리표에 입력 1, 0를 대입하면 출력은 1입니다."}, {"q": "OR 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "OR의 진리표에 입력 1, 1를 대입하면 출력은 1입니다."}, {"q": "NAND 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "NAND의 진리표에 입력 0, 0를 대입하면 출력은 1입니다."}, {"q": "NAND 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "NAND의 진리표에 입력 0, 1를 대입하면 출력은 1입니다."}, {"q": "NAND 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "NAND의 진리표에 입력 1, 0를 대입하면 출력은 1입니다."}, {"q": "NAND 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "NAND의 진리표에 입력 1, 1를 대입하면 출력은 0입니다."}, {"q": "NOR 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "NOR의 진리표에 입력 0, 0를 대입하면 출력은 1입니다."}, {"q": "NOR 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "NOR의 진리표에 입력 0, 1를 대입하면 출력은 0입니다."}, {"q": "NOR 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "NOR의 진리표에 입력 1, 0를 대입하면 출력은 0입니다."}, {"q": "NOR 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "NOR의 진리표에 입력 1, 1를 대입하면 출력은 0입니다."}, {"q": "XOR 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "XOR의 진리표에 입력 0, 0를 대입하면 출력은 0입니다."}, {"q": "XOR 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "XOR의 진리표에 입력 0, 1를 대입하면 출력은 1입니다."}, {"q": "XOR 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "XOR의 진리표에 입력 1, 0를 대입하면 출력은 1입니다."}, {"q": "XOR 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "XOR의 진리표에 입력 1, 1를 대입하면 출력은 0입니다."}, {"q": "XNOR 게이트에서 A=0, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "XNOR의 진리표에 입력 0, 0를 대입하면 출력은 1입니다."}, {"q": "XNOR 게이트에서 A=0, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "XNOR의 진리표에 입력 0, 1를 대입하면 출력은 0입니다."}, {"q": "XNOR 게이트에서 A=1, B=0일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 0, "explain": "XNOR의 진리표에 입력 1, 0를 대입하면 출력은 0입니다."}, {"q": "XNOR 게이트에서 A=1, B=1일 때 Y는?", "choices": ["0", "1", "입력과 무관하게 고정되지 않음", "항상 고임피던스"], "answer": 1, "explain": "XNOR의 진리표에 입력 1, 1를 대입하면 출력은 1입니다."}, {"q": "NOT 게이트에서 A=0일 때 Y는?", "choices": ["0", "1", "A와 무관", "두 개의 출력"], "answer": 1, "explain": "NOT은 입력의 논리값을 반전합니다."}, {"q": "NOT 게이트에서 A=1일 때 Y는?", "choices": ["0", "1", "A와 무관", "두 개의 출력"], "answer": 0, "explain": "NOT은 입력의 논리값을 반전합니다."}, {"q": "74HC192의 카운트 범위는?", "choices": ["0~9", "0~15", "1~16", "0~255"], "answer": 0, "explain": "BCD 십진 업/다운 카운터이며 9 다음은 0입니다."}, {"q": "74HC192 DIP-16의 UP 클록 핀은?", "choices": ["4번", "8번", "16번", "5번"], "answer": 3, "explain": "UP=5, DOWN=4입니다. 반대 클록은 HIGH로 유지합니다."}, {"q": "74HC192 DIP-16의 DOWN 클록 핀은?", "choices": ["14번", "11번", "4번", "5번"], "answer": 2, "explain": "DOWN은 4번이고 UP을 HIGH로 유지합니다."}, {"q": "74HC192에서 MR을 HIGH로 하면?", "choices": ["병렬 로드", "0으로 초기화", "1 증가", "1 감소"], "answer": 1, "explain": "MR은 HIGH 활성 비동기 리셋입니다."}, {"q": "74HC192에서 /PL을 LOW로 하면?", "choices": ["병렬 입력값 로드", "전원 차단", "항상 9 출력", "클록 주파수 두 배"], "answer": 0, "explain": "/PL은 LOW 활성 병렬 로드입니다."}, {"q": "두 자리 증가 카운터의 일의 자리 CARRY는 어디로 연결하는가?", "choices": ["십의 자리 GND", "표시기 COM", "일의 자리 MR", "십의 자리 UP"], "answer": 3, "explain": "자리올림 출력을 상위 자리 UP 클록에 연결합니다."}, {"q": "두 자리 감소 카운터의 일의 자리 BORROW는 어디로 연결하는가?", "choices": ["일의 자리 UP", "디코더 LE", "십의 자리 DOWN", "십의 자리 VCC"], "answer": 2, "explain": "자리내림 출력을 상위 자리 DOWN에 연결합니다."}, {"q": "CD4511의 주요 기능은?", "choices": ["4비트 곱셈", "BCD를 7세그먼트 신호로 변환", "클록 생성", "전압 증폭"], "answer": 1, "explain": "BCD 입력을 받아 a~g 출력을 생성합니다."}, {"q": "CD4511과 기본적으로 사용하는 표시기는?", "choices": ["공통 캐소드", "공통 애노드", "아무 LED나 저항 없이", "LCD 전용"], "answer": 0, "explain": "CD4511의 HIGH 출력으로 공통 캐소드 세그먼트를 켭니다."}, {"q": "LED 세그먼트마다 저항을 넣는 이유는?", "choices": ["클록 증가", "기억 용량 증가", "BCD 반전", "전류 제한"], "answer": 3, "explain": "과전류를 방지하기 위해 각 세그먼트에 개별 저항을 둡니다."}, {"q": "74HC14가 버튼 입력에 유용한 이유는?", "choices": ["차량을 직접 감지함", "전원을 생성함", "슈미트 트리거로 입력 잡음에 강함", "십진수를 표시함"], "answer": 2, "explain": "RC 회로와 함께 접점 튐을 줄입니다. 인버터이므로 논리 반전에 유의합니다."}, {"q": "상승 에지형 D 플립플롭은 언제 D를 저장하는가?", "choices": ["전원을 끈 뒤", "클록 0→1", "클록 1→0만", "항상 즉시"], "answer": 1, "explain": "비동기 제어가 비활성일 때 상승 에지에서 D를 Q로 저장합니다."}, {"q": "JK 플립플롭에서 J=K=1이면 유효 클록에서?", "choices": ["출력 반전", "항상 0", "항상 1", "현재 상태 유지"], "answer": 0, "explain": "두 입력이 1이면 토글합니다."}, {"q": "T=1인 T 플립플롭의 출력 주파수는?", "choices": ["입력의 2배", "입력과 동일", "항상 0Hz", "입력의 1/2"], "answer": 3, "explain": "매 클록마다 반전하므로 두 클록이 출력 한 주기입니다."}, {"q": "555 비안정 모드의 역할은?", "choices": ["차량 누적 저장", "단락 보호 전용", "반복 펄스 발생", "BCD 해독"], "answer": 2, "explain": "RC 충전과 방전으로 반복 클록을 만듭니다."}, {"q": "입차 12대, 출차 5대이면 현재 주차 대수는?", "choices": ["12대", "7대", "17대", "5대"], "answer": 1, "explain": "초기 0대일 때 현재 주차=누적 입차−누적 출차입니다."}, {"q": "정원 99대 중 99대 주차 상태에서 입차하면?", "choices": ["입차를 차단하고 집계 유지", "00대로 순환", "100대 허용", "출차를 증가"], "answer": 0, "explain": "만차 검출로 UP 펄스를 차단해야 합니다."}, {"q": "현재 주차가 0대일 때 출차 입력은?", "choices": ["99대로 변경", "−1대로 변경", "입차 누적 증가", "차단하고 0대 유지"], "answer": 3, "explain": "빈 주차장의 출차를 차단해 카운터 언더플로를 막습니다."}]);
let currentHard = 0; let wrongNotes=[];
function renderHardQuiz(){
  const q=hardQuestions[currentHard]; const qEl=document.getElementById('hardQuizQuestion'); if(!qEl) return;
  qEl.textContent=`[${currentHard+1} / ${hardQuestions.length}] ${q.q}`; const choices=document.getElementById('hardQuizChoices'); choices.innerHTML='';
  q.choices.forEach((c,i)=>{const b=document.createElement('button'); b.className='hard-choice'; b.textContent=c; b.onclick=()=>checkHardAnswer(i); choices.appendChild(b);});
  const fb=document.getElementById('hardQuizFeedback'); fb.textContent=''; fb.className='feedback';
}
function checkHardAnswer(i){
  const q=hardQuestions[currentHard]; const fb=document.getElementById('hardQuizFeedback');
  if(i===q.answer){fb.textContent='정답입니다! '+q.explain; fb.className='feedback correct';}
  else{fb.textContent=`오답입니다. 정답: ${q.choices[q.answer]} · ${q.explain}`; fb.className='feedback wrong'; wrongNotes.push({q:q.q,your:q.choices[i],ans:q.choices[q.answer],explain:q.explain}); renderWrongNotes();}
}
function renderWrongNotes(){
  const box=document.getElementById('wrongNotes'); if(!box) return;
  if(wrongNotes.length===0){box.className='wrong-notes empty'; box.textContent='아직 틀린 문제가 없습니다.'; return;}
  box.className='wrong-notes'; box.innerHTML=wrongNotes.map((w,n)=>`<div class="wrong-item"><h4>오답 ${n+1}. ${w.q}</h4><p><strong>내 답:</strong> ${w.your}</p><p><strong>정답:</strong> ${w.ans}</p><p><strong>해설:</strong> ${w.explain}</p></div>`).join('');
}
const nextHard=document.getElementById('nextHardQuiz'); if(nextHard) nextHard.addEventListener('click',()=>{currentHard=(currentHard+1)%hardQuestions.length; renderHardQuiz();});
const clearWrong=document.getElementById('clearWrongNotes'); if(clearWrong) clearWrong.addEventListener('click',()=>{wrongNotes=[]; renderWrongNotes();});
renderHardQuiz(); renderWrongNotes();

// 단계별 페이지 전환: 상단바 클릭 시 해당 단계만 표시
function showPage(page){
  document.querySelectorAll('.page-section').forEach(sec=>sec.classList.toggle('active-page', sec.dataset.pageSection===page));
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active', a.dataset.page===page));
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showPage(a.dataset.page);}));
showPage('intro');


function gateSvg(type) {
 const inv=['NOT','NAND','NOR','XNOR'].includes(type), or=['OR','NOR','XOR','XNOR'].includes(type), xor=['XOR','XNOR'].includes(type);
 const shape=type==='NOT'?'<path d="M50 18L130 60L50 102Z"/>':or?'<path d="M48 18Q100 18 135 60Q100 102 48 102Q76 60 48 18Z"/>':'<path d="M50 18H88A42 42 0 0 1 88 102H50Z"/>';
 return `<svg viewBox="0 0 200 120" role="img" aria-label="${type} 게이트 기호"><g fill="#eff6ff" stroke="#2563eb" stroke-width="3">${shape}${xor?'<path d="M37 18Q65 60 37 102" fill="none"/>':''}${inv?'<circle cx="143" cy="60" r="7" fill="white"/>':''}<path d="M${inv?150:135} 60H190"/>${type==='NOT'?'<path d="M10 60H50"/>':'<path d="M10 38H56M10 82H56"/>'}</g><g fill="#172033" font-size="13"><text x="3" y="${type==='NOT'?53:30}">A</text>${type==='NOT'?'':'<text x="3" y="100">B</text>'}<text x="183" y="52">Y</text><text x="70" y="65">${type}</text></g></svg>`;
}
