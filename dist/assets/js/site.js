(function () {
  const config = window.BRS_CONFIG;
  const root = document.documentElement;
  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll("[data-brand-name]").forEach((node) => { node.textContent = config.brand.name; });
  document.querySelectorAll("[data-tagline]").forEach((node) => { node.textContent = config.brand.tagline; });
  document.querySelectorAll("[data-region]").forEach((node) => { node.textContent = config.brand.region; });

  document.querySelectorAll("[data-contact-link]").forEach((link) => {
    const type = link.dataset.contactLink;
    const map = {
      site: [config.contact.siteUrl, config.contact.siteLabel],
      whatsapp: [config.contact.whatsappUrl, config.contact.whatsappLabel],
      email: [config.contact.emailUrl, config.contact.emailLabel]
    };
    if (!map[type]) return;
    link.href = map[type][0];
    const label = link.querySelector("[data-contact-label]");
    if (label) label.textContent = map[type][1];
    if (type !== "email") link.target = "_blank";
    link.rel = "noopener";
    if (config.contact.placeholdersActive && type !== "site") link.dataset.placeholder = "true";
  });

  const navItems = [...document.querySelectorAll("[data-nav-section], [data-nav-route]")];
  const clearCurrentNav = () => navItems.forEach((link) => link.removeAttribute("aria-current"));
  const markCurrentNav = (link, value) => {
    clearCurrentNav();
    link.setAttribute("aria-current", value);
  };
  const currentPath = window.location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  const routeItem = navItems.find((link) => {
    const route = link.dataset.navRoute;
    return route && currentPath.endsWith("/" + route);
  });
  if (routeItem) markCurrentNav(routeItem, "page");

  const sections = navItems
    .filter((link) => link.dataset.navSection)
    .map((link) => ({ link, section: document.getElementById(link.dataset.navSection) }))
    .filter((item) => item.section);
  if (sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      const item = sections.find(({section}) => section === active.target);
      if (item) markCurrentNav(item.link, "location");
    }, { rootMargin: "-18% 0px -65% 0px", threshold: [0, .15, .35] });
    sections.forEach(({section}) => sectionObserver.observe(section));
  }

  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const route = link.dataset.routeLink || "";
    link.href = `${config.contact.siteUrl.replace(/\/$/, "")}/${route.replace(/^\//, "")}`;
  });

  document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-fullscreen]").forEach((button) => button.addEventListener("click", async () => {
    if (!document.fullscreenElement) await root.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }));

  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = String(year); });
})();
