const form = document.querySelector("#requestForm");
const statusNode = document.querySelector(".form-status");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const goal = String(data.get("goal") || "").trim();

  statusNode.textContent = `${name || "Заявка"} принята: ${goal || "поиск жилья"}. Мы свяжемся и уточним параметры.`;
  form.reset();
});
