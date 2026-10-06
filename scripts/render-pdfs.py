#!/usr/bin/env python3
"""Exporta os documentos HTML da BRS para PDFs sem depender de JavaScript."""

from __future__ import annotations

import os
from pathlib import Path

from lxml import html
from weasyprint import HTML


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
OUT = Path(os.environ.get("BRS_OUTPUT_DIR", ROOT / "exports")).resolve()
WORK = OUT / "rendered-html"

BRAND = {
    "name": "BRS Administração de Obras",
    "tagline": "Controle para construir. Transparência para investir.",
    "region": "Londrina e Norte do Paraná",
}

CONTACT = {
    "site": (
        "https://brs-estrutura-em-controle.raul-losbuenos.chatgpt.site",
        "brs-estrutura-em-controle.raul-losbuenos.chatgpt.site",
    ),
    "whatsapp": ("https://wa.me/5500000000000", "INSERIR WHATSAPP"),
    "email": ("mailto:contato@seudominio.com.br", "INSERIR E-MAIL"),
}

PROPOSAL = {
    "client": "CLIENTE MODELO",
    "project": "Administração de obra",
    "code": "BRS-PROP-000",
    "date": "24 de setembro de 2026",
    "validity": "15 dias",
    "context": (
        "Esta página demonstra a estrutura editável da proposta. Substitua este texto "
        "pelo cenário real, estágio atual, objetivo do investimento e principais riscos identificados."
    ),
    "scope": [
        "Diagnóstico técnico e definição de responsabilidades",
        "Planejamento físico-financeiro e cronograma executivo",
        "Equalização de fornecedores e apoio às contratações",
        "Acompanhamento da execução, medições e qualidade",
        "Relatórios gerenciais e organização documental",
        "Encerramento, aceite e databook",
    ],
    "timeline": [
        ["Mobilização", "Semanas 1-2", "Levantamento, premissas e plano de trabalho"],
        ["Planejamento", "Semanas 2-4", "Escopo, cronograma, orçamento e contratações"],
        ["Execução", "Conforme obra", "Gestão, controle, registros e decisões"],
        ["Entrega", "Encerramento", "Aceite, documentação e rastreabilidade"],
    ],
    "investment": "PREENCHER VALOR E CONDIÇÃO COMERCIAL",
    "assumptions": [
        "Valores, impostos, deslocamentos e condições serão definidos na proposta final.",
        "Escopo e responsabilidades devem ser validados antes da contratação.",
        "Alterações relevantes de projeto, prazo ou área podem exigir revisão comercial.",
    ],
}


def set_text(tree, xpath: str, value: str) -> None:
    for node in tree.xpath(xpath):
        node.text = value


def hydrate_common(tree) -> None:
    set_text(tree, "//*[@data-brand-name]", BRAND["name"])
    set_text(tree, "//*[@data-tagline]", BRAND["tagline"])
    set_text(tree, "//*[@data-region]", BRAND["region"])

    for link in tree.xpath("//*[@data-contact-link]"):
        key = link.get("data-contact-link")
        if key not in CONTACT:
            continue
        href, label = CONTACT[key]
        link.set("href", href)
        label_nodes = link.xpath(".//*[@data-contact-label]")
        for label_node in label_nodes:
            label_node.text = label

    base = CONTACT["site"][0].rstrip("/")
    for link in tree.xpath("//*[@data-route-link]"):
        route = (link.get("data-route-link") or "").lstrip("/")
        link.set("href", f"{base}/{route}")


def parse_document(source: Path):
    tree = html.parse(str(source)).getroot()
    hydrate_common(tree)
    return tree


def write_hydrated(tree, filename: str) -> Path:
    WORK.mkdir(parents=True, exist_ok=True)
    target = WORK / filename
    target.write_bytes(html.tostring(tree, encoding="utf-8", method="html", doctype="<!doctype html>"))
    return target


def export_pdf(tree, filename: str, base_url: Path) -> None:
    hydrated = write_hydrated(tree, filename.replace(".pdf", ".html"))
    HTML(filename=str(hydrated), base_url=str(base_url)).write_pdf(str(OUT / filename))


def portfolio(a4: bool):
    tree = parse_document(DIST / "portfolio" / "index.html")
    if a4:
        body = tree.xpath("//body")[0]
        classes = set((body.get("class") or "").split())
        classes.add("layout-a4")
        body.set("class", " ".join(sorted(classes)))
    return tree


def proposal():
    tree = parse_document(DIST / "propostas" / "index.html")
    values = {
        "//*[@data-proposal-client]": PROPOSAL["client"],
        "//*[@data-proposal-project]": PROPOSAL["project"],
        "//*[@data-proposal-code]": PROPOSAL["code"],
        "//*[@data-proposal-date]": PROPOSAL["date"],
        "//*[@data-proposal-validity]": PROPOSAL["validity"],
        "//*[@data-proposal-context]": PROPOSAL["context"],
        "//*[@data-proposal-investment]": PROPOSAL["investment"],
    }
    for xpath, value in values.items():
        set_text(tree, xpath, value)

    for node in tree.xpath("//*[@data-proposal-scope]"):
        node[:] = []
        for item in PROPOSAL["scope"]:
            li = html.Element("li")
            li.text = item
            node.append(li)

    for node in tree.xpath("//*[@data-proposal-timeline]"):
        node[:] = []
        for row in PROPOSAL["timeline"]:
            tr = html.Element("tr")
            for value in row:
                td = html.Element("td")
                td.text = value
                tr.append(td)
            node.append(tr)

    for node in tree.xpath("//*[@data-proposal-assumptions]"):
        node[:] = []
        for item in PROPOSAL["assumptions"]:
            li = html.Element("li")
            li.text = item
            node.append(li)
    return tree


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    export_pdf(
        portfolio(False),
        "BRS_Portfolio_Institucional_Digital_16x9.pdf",
        DIST / "portfolio",
    )
    export_pdf(
        portfolio(True),
        "BRS_Portfolio_Institucional_Impressao_A4.pdf",
        DIST / "portfolio",
    )
    export_pdf(
        proposal(),
        "BRS_Proposta_Comercial_Modelo.pdf",
        DIST / "propostas",
    )
    print(f"PDFs exportados em {OUT}")


if __name__ == "__main__":
    main()
