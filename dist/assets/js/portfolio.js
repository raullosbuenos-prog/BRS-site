(function () {
  const params = new URLSearchParams(location.search);
  const layout = params.get("layout");
  if (layout === "a4") document.body.classList.add("layout-a4");

  const pages = Array.from(document.querySelectorAll(".doc-page"));
  const status = document.querySelector("[data-page-status]");

  function currentPage() {
    const midpoint = window.scrollY + window.innerHeight * .45;
    let winner = 0;
    pages.forEach((page, index) => {
      if (page.offsetTop <= midpoint) winner = index;
    });
    return winner;
  }

  function updateStatus() {
    if (status) status.textContent = `${String(currentPage() + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  }

  function go(delta) {
    const target = Math.max(0, Math.min(pages.length - 1, currentPage() + delta));
    pages[target].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", "ArrowDown"].includes(event.key)) { event.preventDefault(); go(1); }
    if (["ArrowLeft", "PageUp", "ArrowUp"].includes(event.key)) { event.preventDefault(); go(-1); }
  });
  window.addEventListener("scroll", updateStatus, { passive: true });
  updateStatus();

  if (params.get("print") === "1") {
    window.addEventListener("load", () => setTimeout(() => window.print(), 500));
  }
})();
