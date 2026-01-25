// 🔥 FIREBASE CONFIG (PASTE YOUR OWN)
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

const flame = document.getElementById("flame");
const levelBar = document.getElementById("level");

// 📝 Submit Wish
function submitWish() {
  const wish = document.getElementById("wishInput").value.trim();
  if (!wish) {
    alert("Please write a wish ✨");
    return;
  }

  db.collection("wishes").add({
    wish: wish,
    time: new Date()
  });

  document.getElementById("wishStep").classList.add("hidden");
  document.getElementById("blowStep").classList.remove("hidden");
  document.getElementById("title").innerText = "🕯️ Blow the Candle";
}

// 🎤 Blow Detection
let audioContext, analyser, dataArray;

async function startMic() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  detectBlow();
}

function detectBlow() {
  analyser.getByteFrequencyData(dataArray);
  const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  levelBar.style.width = Math.min(volume * 2, 100) + "%";

  if (volume > 35 && !flame.classList.contains("off")) {
  flame.classList.add("off");
  launchConfetti(); // 🎉
}

  requestAnimationFrame(detectBlow);
}

/* 🎉 CONFETTI – GUARANTEED VERSION */
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener("resize", resizeConfetti);

function launchConfetti() {
  const pieces = [];
  const colors = ["#ff5f8a", "#ffd166", "#6ecb63", "#4dabf7"];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    });
  }

  let start = null;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      p.y += p.speed;
      p.rotation += p.speed;
    });

    if (progress < 2200) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  requestAnimationFrame(animate);
}
