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

// 조합논리회로 실험: 반가산기 / 전가산기
let currentExperiment = "half";
let expInputs = { A: 0, B: 0, Cin: 0 };

function updateExperiment() {
  const a = expInputs.A, b = expInputs.B, cin = expInputs.Cin;
  let sum, carry;

  if (currentExperiment === "half") {
    sum = a ^ b;
    carry = a & b;
    document.getElementById("experimentTitle").textContent = "반가산기 실험";
    document.getElementById("experimentDescription").textContent = "반가산기는 두 1비트 입력 A, B를 더해서 합 Sum과 자리올림 Carry를 출력합니다.";
    document.getElementById("adderFormula").textContent = "Sum = A ⊕ B, Carry = A · B";
    document.getElementById("carryLabel").textContent = "Carry";
    document.getElementById("cinRow").style.display = "none";
  } else {
    sum = a ^ b ^ cin;
    carry = (a & b) | (a & cin) | (b & cin);
    document.getElementById("experimentTitle").textContent = "전가산기 실험";
    document.getElementById("experimentDescription").textContent = "전가산기는 A, B와 이전 자리올림 Cin까지 더해서 Sum과 Cout을 출력합니다.";
    document.getElementById("adderFormula").textContent = "Sum = A ⊕ B ⊕ Cin, Cout = AB + ACin + BCin";
    document.getElementById("carryLabel").textContent = "Cout";
    document.getElementById("cinRow").style.display = "flex";
  }

  document.getElementById("sumValue").textContent = sum;
  document.getElementById("carryValue").textContent = carry;
  document.getElementById("sumLed").classList.toggle("on", sum === 1);
  document.getElementById("carryLed").classList.toggle("on", carry === 1);
}

document.querySelectorAll(".experiment-btn").forEach((button) => {
  button.addEventListener("click", () => {
    currentExperiment = button.dataset.experiment;
    document.querySelectorAll(".experiment-btn").forEach((b) => b.classList.toggle("active", b === button));
    updateExperiment();
  });
});

document.querySelectorAll(".exp-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.expInput;
    expInputs[key] = Number(button.dataset.value);
    document.querySelectorAll(`[data-exp-input="${key}"]`).forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.value) === expInputs[key]);
    });
    updateExperiment();
  });
});

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
updateExperiment();
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
let currentHard = 0; let wrongNotes=[];
function renderHardQuiz(){
  const q=hardQuestions[currentHard]; const qEl=document.getElementById('hardQuizQuestion'); if(!qEl) return;
  qEl.textContent=q.q; const choices=document.getElementById('hardQuizChoices'); choices.innerHTML='';
  q.choices.forEach((c,i)=>{const b=document.createElement('button'); b.className='hard-choice'; b.textContent=c; b.onclick=()=>checkHardAnswer(i); choices.appendChild(b);});
  const fb=document.getElementById('hardQuizFeedback'); fb.textContent=''; fb.className='feedback';
}
function checkHardAnswer(i){
  const q=hardQuestions[currentHard]; const fb=document.getElementById('hardQuizFeedback');
  if(i===q.answer){fb.textContent='정답입니다!'; fb.className='feedback correct';}
  else{fb.textContent=`오답입니다. 정답: ${q.choices[q.answer]}`; fb.className='feedback wrong'; wrongNotes.push({q:q.q,your:q.choices[i],ans:q.choices[q.answer],explain:q.explain}); renderWrongNotes();}
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

// 5단계 직접 실습
let practiceType='half';
let practiceState={A:0,B:0,Cin:0,S:0,D0:0,D1:1,count:0};
function makePracticeInputs(keys){
  const box=document.getElementById('practiceInputs'); if(!box) return; box.innerHTML='';
  keys.forEach(k=>{const row=document.createElement('div'); row.className='input-row'; row.innerHTML=`<span class="input-label">${k}</span><button class="practice-toggle ${practiceState[k]===0?'active':''}" data-pkey="${k}" data-pval="0">0</button><button class="practice-toggle ${practiceState[k]===1?'active':''}" data-pkey="${k}" data-pval="1">1</button>`; box.appendChild(row);});
  box.querySelectorAll('.practice-toggle').forEach(btn=>btn.onclick=()=>{practiceState[btn.dataset.pkey]=Number(btn.dataset.pval); updatePractice();});
}
function updatePractice(){
  const t=document.getElementById('practiceTitle'); if(!t) return; const d=document.getElementById('practiceDesc'), dia=document.getElementById('practiceDiagram'), out=document.getElementById('practiceOutput');
  const A=practiceState.A,B=practiceState.B,Cin=practiceState.Cin,S=practiceState.S,D0=practiceState.D0,D1=practiceState.D1;
  if(practiceType==='half'){t.textContent='반가산기 제작'; d.textContent='XOR 게이트와 AND 게이트를 조합해 Sum과 Carry를 만듭니다.'; dia.textContent='A,B → XOR/AND → Sum, Carry'; makePracticeInputs(['A','B']); out.textContent=`Sum=${A^B}, Carry=${A&B}`;}
  else if(practiceType==='full'){t.textContent='전가산기 제작'; d.textContent='반가산기 2개와 OR 게이트를 조합해 세 입력의 덧셈을 구현합니다.'; dia.textContent='A,B,Cin → XOR/AND/OR → Sum, Cout'; makePracticeInputs(['A','B','Cin']); out.textContent=`Sum=${A^B^Cin}, Cout=${(A&B)|(A&Cin)|(B&Cin)}`;}
  else if(practiceType==='mux'){t.textContent='2:1 멀티플렉서 제작'; d.textContent='선택선 S로 D0 또는 D1 중 하나를 출력합니다.'; dia.textContent='D0,D1,S → NOT/AND/OR → Y'; makePracticeInputs(['D0','D1','S']); out.textContent=`Y=${S?D1:D0}`;}
  else {t.textContent='10진 카운터 제작'; d.textContent='버튼을 누르며 0부터 9까지 증가하고 다시 0으로 돌아가는 BCD 카운터 흐름을 확인합니다.'; dia.textContent='CLK → 플립플롭 4개 → BCD(0000~1001)'; document.getElementById('practiceInputs').innerHTML='<button class="practice-btn" id="clkBtn">CLK 펄스 입력</button><button class="practice-btn" id="resetCnt">Reset</button>'; document.getElementById('clkBtn').onclick=()=>{practiceState.count=(practiceState.count+1)%10;updatePractice();}; document.getElementById('resetCnt').onclick=()=>{practiceState.count=0;updatePractice();}; out.textContent=`현재 값=${practiceState.count}, BCD=${practiceState.count.toString(2).padStart(4,'0')}`;}
}
document.querySelectorAll('.practice-btn').forEach(btn=>{ if(btn.dataset.practice) btn.addEventListener('click',()=>{practiceType=btn.dataset.practice;document.querySelectorAll('.practice-btn[data-practice]').forEach(b=>b.classList.toggle('active',b===btn));updatePractice();});});
updatePractice();
