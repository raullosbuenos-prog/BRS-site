import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, "..");
const output = path.join(root, "dist/assets/images/titles");
const font = process.env.ETHNOCENTRIC_FONT;

if (!font) throw new Error("Defina ETHNOCENTRIC_FONT com o caminho local da fonte licenciada.");

const titles = [
  ["estrutura-em-controle-white.png", "ESTRUTURA EM CONTROLE", "#FFFFFF"],
  ["estrutura-em-controle-black.png", "ESTRUTURA EM CONTROLE", "#000000"],
  ["portfolio-institucional-black.png", "PORTFÓLIO INSTITUCIONAL", "#000000"],
  ["gestao-integral-de-obras-black.png", "GESTÃO INTEGRAL DE OBRAS", "#000000"],
  ["planejamento-e-pre-construcao-black.png", "PLANEJAMENTO E PRÉ-CONSTRUÇÃO", "#000000"],
  ["fiscalizacao-e-controle-black.png", "FISCALIZAÇÃO E CONTROLE", "#000000"],
  ["bts-e-empreendimentos-black.png", "BTS E EMPREENDIMENTOS", "#000000"],
  ["metodo-que-gera-previsibilidade-white.png", "MÉTODO QUE GERA PREVISIBILIDADE", "#FFFFFF"],
  ["transparencia-em-pratica-black.png", "TRANSPARÊNCIA EM PRÁTICA", "#000000"],
  ["portfolio-e-cases-black.png", "PORTFÓLIO E CASES", "#000000"],
  ["governanca-e-relatorios-black.png", "GOVERNANÇA E RELATÓRIOS", "#000000"],
  ["por-que-brs-black.png", "POR QUE BRS", "#000000"],
  ["fale-com-a-brs-white.png", "FALE COM A BRS", "#FFFFFF"],
  ["proposta-comercial-white.png", "PROPOSTA COMERCIAL", "#FFFFFF"],
  ["investimento-e-escopo-black.png", "INVESTIMENTO E ESCOPO", "#000000"],
  ["solicite-uma-analise-black.png", "SOLICITE UMA ANÁLISE", "#000000"],
  ["base-de-decisoes-claras-white.png", "BASE DE DECISÕES CLARAS", "#FFFFFF"]
];

await fs.mkdir(output, { recursive: true });
for (const [filename, title, color] of titles) {
  await run("/usr/bin/convert", [
    "-background", "none",
    "-fill", color,
    "-font", font,
    "-pointsize", "58",
    "-kerning", "1",
    "-gravity", "West",
    "-size", "1400x160",
    `caption:${title}`,
    "-trim",
    "+repage",
    path.join(output, filename)
  ]);
}

console.log(JSON.stringify({ output, count: titles.length }));
