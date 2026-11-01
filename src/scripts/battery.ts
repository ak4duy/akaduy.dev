const BATTERY_KEY = "social-battery";
let battery = 100;
try {
  const saved = Number(sessionStorage.getItem(BATTERY_KEY));
  if (sessionStorage.getItem(BATTERY_KEY) !== null && Number.isFinite(saved)) {
    battery = Math.min(100, Math.max(0, saved));
  }
} catch {}

function renderBattery() {
  const button = document.querySelector<HTMLElement>("[data-battery]");
  if (!button) return;
  const level = Math.round(battery);
  button.style.setProperty("--level", `${level}%`);
  button.toggleAttribute("data-low", level > 0 && level <= 20);
  button.querySelector<HTMLElement>("[data-battery-label]")!.hidden = level > 0;
  const value = button.querySelector<HTMLElement>("[data-battery-value]")!;
  value.hidden = level === 0;
  value.textContent = `${level}%`;
}

function drain(amount: number) {
  battery = Math.max(0, battery - amount);
  try { sessionStorage.setItem(BATTERY_KEY, String(battery)); } catch {}
  renderBattery();
}

setInterval(() => { if (!document.hidden) drain(1); }, 6000);
let lastScroll = scrollY;
addEventListener("scroll", () => {
  const distance = Math.abs(scrollY - lastScroll);
  if (distance < 600) return;
  lastScroll = scrollY;
  drain(Math.floor(distance / 600));
}, { passive: true });

document.addEventListener("click", (event) => {
  const button = (event.target as Element).closest?.<HTMLElement>("[data-battery]");
  if (!button) return;
  battery = 100;
  drain(0);
});

document.addEventListener("astro:page-load", () => {
  lastScroll = scrollY;
  renderBattery();
});
renderBattery();
