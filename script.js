const form = document.querySelector("#inquiry");
const statusNode = document.querySelector(".form-status");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const revealNodes = document.querySelectorAll(".reveal");
const fragranceRows = document.querySelectorAll(".fragrance-row");
const fragranceSelect = document.querySelector("#fragranceSelect");

document.documentElement.classList.add("has-js");

const getHeaderOffset = () => {
  const header = document.querySelector(".site-header");
  const isSticky = window.matchMedia("(min-width: 721px)").matches;

  return header && isSticky ? header.getBoundingClientRect().height : 0;
};

const scrollToHashTarget = (hash, behavior = "smooth") => {
  if (!hash || hash === "#") return;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top: Math.max(top, 0), behavior });
};

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = hash ? document.getElementById(hash.slice(1)) : null;

    if (!hash || !target) return;

    event.preventDefault();
    history.pushState(null, "", hash);
    scrollToHashTarget(hash);
  });
});

window.addEventListener("hashchange", () => {
  requestAnimationFrame(() => scrollToHashTarget(window.location.hash, "auto"));
});

window.addEventListener("load", () => {
  requestAnimationFrame(() => scrollToHashTarget(window.location.hash, "auto"));
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

fragranceRows.forEach((row) => {
  const button = row.querySelector("button");
  button?.addEventListener("click", () => {
    const fragrance = row.dataset.fragrance;
    if (!fragrance) return;

    fragranceRows.forEach((item) => item.classList.toggle("is-active", item === row));
    if (fragranceSelect) fragranceSelect.value = fragrance;
    scrollToHashTarget("#purchase");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const fragrance = String(data.get("fragrance") || "").trim();

  statusNode.textContent = `${name || "Inquiry"} received. We will reply with a concise recommendation for ${
    fragrance || "the selected direction"
  }.`;
  form.reset();
});
