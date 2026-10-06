(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "modelo";
  const proposal = window.BRS_CONFIG.proposals[id] || window.BRS_CONFIG.proposals.modelo;

  const text = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
  text("[data-proposal-client]", proposal.client);
  text("[data-proposal-project]", proposal.project);
  text("[data-proposal-code]", proposal.code);
  text("[data-proposal-date]", proposal.date);
  text("[data-proposal-validity]", proposal.validity);
  text("[data-proposal-context]", proposal.context);
  text("[data-proposal-investment]", proposal.investment);

  document.querySelectorAll("[data-proposal-scope]").forEach((list) => {
    list.replaceChildren(...proposal.scope.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  });

  document.querySelectorAll("[data-proposal-timeline]").forEach((tbody) => {
    tbody.replaceChildren(...proposal.timeline.map((row) => {
      const tr = document.createElement("tr");
      row.forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      return tr;
    }));
  });

  document.querySelectorAll("[data-proposal-assumptions]").forEach((list) => {
    list.replaceChildren(...proposal.assumptions.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  });

  if (params.get("print") === "1") window.addEventListener("load", () => setTimeout(() => window.print(), 500));
})();
