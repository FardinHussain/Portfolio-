// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

const heroTl = gsap.timeline({ delay: 0.15 });

heroTl
.from('.hero-tag', { y: 16, opacity: 0, duration: 0.7, ease: 'power3.out' })
.from('#heroTitle', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
.from('.hero-desc', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.6')
.from('.hero-cta', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');

document.querySelectorAll('.reveal').forEach(el => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%"
    }
  });
});

// Modal System
function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    modal.classList.add("visible");
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("visible");
  document.body.style.overflow = "";
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

function backdropClose(event, id) {
  if (event.target === document.getElementById(id)) {
    closeModal(id);
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.visible").forEach(m => closeModal(m.id));
  }
});
