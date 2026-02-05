console.log("JS loaded");

/* ===== FIREBASE ===== */
const firebaseConfig = {
   apiKey: "AIzaSyC72J7iRcpzPzBAPyghS27AuKHz6ym30iw",
  authDomain: "bday-wish-d44d8.firebaseapp.com",
  projectId: "bday-wish-d44d8",
  storageBucket: "bday-wish-d44d8.firebasestorage.app",
  messagingSenderId: "716705756367",
  appId: "1:716705756367:web:6173b27a25eb9cd50333ba"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ===== ELEMENTS ===== */
const flame = document.getElementById("flame");
const levelBar = document.getElementById("level");
const bgMusic = document.getElementById("bgMusic");
const popSound = document.getElementById("popSound");

/* ===== SUBMIT WISH ===== */
document.getElementById("submitWishBtn").addEventListener("click", async () => {
  const wish = document.getElementById("wishInput").value.trim();
  if (!wish) return alert("Write a wish ✨");

  await db.collection("wishes").add({
    wish,
    time: new Date()
  });

  document.getElementById("wishStep").classList.add("hidden");
  document.getElementById("blowStep").classList.remove("hidden");

  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
});

/* ===== MIC + BLOW ===== */
let audioContext, analyser, dataArray, micStream, listening = false;

document.getElementById("micBtn").addEventListener("click", startMic);

async function startMic() {
  micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source = audioContext.createMediaStreamSource(micStream);
  source.connect(analyser);

  dataArray = new Uint8Array(analyser.frequencyBinCount);
  listening = true;
  detectBlow();
}

function detectBlow() {
  if (!listening) return;

  analyser.getByteFrequencyData(dataArray);
  const volume = dataArray.reduce((a,b)=>a+b,0)/dataArray.length;
  levelBar.style.width = Math.min(volume*2,100)+"%";

  if (volume > 35 && !flame.classList.contains("off")) {
    flame.classList.add("off");
    launchConfetti();
    popSound.play().catch(()=>{});
    stopMic();

    setTimeout(() => {
      window.location.href = "letters.html";
    }, 2000);

    return;
  }

  requestAnimationFrame(detectBlow);
}

function stopMic() {
  listening = false;
  micStream.getTracks().forEach(t=>t.stop());
  audioContext.close();
}

/* ===== CONFETTI ===== */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

function launchConfetti() {
  const pieces = Array.from({length:120}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*-canvas.height,
    s: Math.random()*6+4,
    v: Math.random()*3+2,
    r: Math.random()*360,
    c: ["#ff5f8a","#ffd166","#6ecb63","#4dabf7"][Math.floor(Math.random()*4)]
  }));

  let start;
  function anim(t){
    if(!start) start=t;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.fillStyle=p.c;
      ctx.fillRect(p.x,p.y,p.s,p.s);
      p.y+=p.v;
    });
    if(t-start<1800) requestAnimationFrame(anim);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  requestAnimationFrame(anim);
}