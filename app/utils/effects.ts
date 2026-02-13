export function createConfetti() {
  const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fff1f2"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-10px";
    confetti.style.width = Math.random() * 10 + 5 + "px";
    confetti.style.height = Math.random() * 10 + 5 + "px";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.zIndex = "200";
    confetti.style.borderRadius = "50%";
    confetti.style.pointerEvents = "none";
    document.body.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    confetti.animate(
      [
        { transform: "translate3d(0,0,0)", opacity: "1" },
        {
          transform: `translate3d(${Math.random() * 100 - 50}px, 100vh, 0) rotate(${Math.random() * 360}deg)`,
          opacity: "0",
        },
      ],
      {
        duration: duration * 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
      }
    );

    setTimeout(() => confetti.remove(), duration * 1000);
  }
}
