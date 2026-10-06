(function () {
  function value(form, name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || "").trim() : "";
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch { return false; }
  }

  document.querySelectorAll("[data-brief-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const summary = [
        "SOLICITAÇÃO INICIAL - BRS",
        `Nome: ${value(form, "nome")}`,
        `Empresa: ${value(form, "empresa")}`,
        `Contato: ${value(form, "contato")}`,
        `Tipo de obra: ${value(form, "tipo")}`,
        `Local: ${value(form, "local")}`,
        `Estágio: ${value(form, "estagio")}`,
        `Área estimada: ${value(form, "area")}`,
        `Objetivo: ${value(form, "objetivo")}`,
        `Principal desafio: ${value(form, "desafio")}`
      ].join("\n");
      const copied = await copyText(summary);
      status.textContent = copied
        ? "Resumo copiado. Cole no canal de contato da BRS para iniciar a conversa."
        : "Briefing organizado. O envio automático será conectado quando os canais oficiais forem configurados.";
    });
  });
})();
