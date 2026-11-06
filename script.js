const nameInput = document.getElementById("personName");
const wishButton = document.getElementById("wishButton");
const greetingCard = document.getElementById("greetingCard");
const surprise = document.getElementById("surprise");
const wishTitle = document.getElementById("wishTitle");
const shareButton = document.getElementById("shareButton");
const againButton = document.getElementById("againButton");

let receiverName = "My Dear Friend";
let senderName = "Manu";

// Read a recipient name from a shared URL, if present.
const sharedName = new URLSearchParams(window.location.search).get("to");
if (sharedName) {
  receiverName = sharedName.slice(0, 35);
  nameInput.value = receiverName;
}

wishButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Please enter your name first! 😊");
    nameInput.focus();
    return;
  }

  receiverName = name.replace(/[<>]/g, "").slice(0, 35);
  wishTitle.textContent = `Dear ${receiverName} ❤️`;
  greetingCard.classList.add("hidden");
  surprise.classList.remove("hidden");
  launchFireworks();
});

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") wishButton.click();
});

againButton.addEventListener("click", () => {
  surprise.classList.add("hidden");
  greetingCard.classList.remove("hidden");
  nameInput.value = "";
  nameInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

shareButton.addEventListener("click", () => {
  const personalizedURL = new URL(window.location.href);
  personalizedURL.searchParams.set("to", receiverName);

  const message =
`🪔✨ Happy Diwali ${receiverName}! ✨🪔

शुभ दीपावली!

May this Diwali bring happiness, success, good health and prosperity into your life.

आपके जीवन में सुख, शांति और समृद्धि आएं।

A special surprise is waiting for you:
${personalizedURL.href}

With Love ❤️
From ${senderName}`;

  const whatsappURL = "https://wa.me/?text=" + encodeURIComponent(message);
  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// Floating golden particles
const particles = document.getElementById("particles");
for (let i = 0; i < 45; i++) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDuration = (5 + Math.random() * 8) + "s";
  particle.style.animationDelay = Math.random() * 8 + "s";
  particle.style.opacity = Math.random();
  particles.appendChild(particle);
}

// Canvas fireworks
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let fireworks = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchFireworks() {
  const colors = ["#ffd166", "#ff8c42", "#ffffff", "#ff5e78"];
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.55;
    for (let j = 0; j < 45; j++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      fireworks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 70,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  fireworks = fireworks.filter((particle) => particle.life > 0);

  for (const particle of fireworks) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.025;
    particle.life--;

    ctx.globalAlpha = particle.life / 70;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

setInterval(() => {
  if (Math.random() > 0.45) launchFireworks();
}, 4000);
