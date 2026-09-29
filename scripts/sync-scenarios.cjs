const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  const mod = await import(pathToFileURL(path.join(process.cwd(), 'src/data/practiceScenarios.js')).href);
  const finish = 'Termine quando todas as etapas da situação forem cumpridas e a conversa tiver um fechamento natural. A cena deve ter começo, meio e fim; não encerre após uma resposta curta.';
  const entriesTs = mod.practiceScenarios.map(s => `  '${s.id}': { title: ${JSON.stringify(s.title)}, role: ${JSON.stringify(s.role)}, goal: ${JSON.stringify(`${s.goal} Etapas esperadas: ${s.steps.join(' > ')}.`)}, finish: ${JSON.stringify(finish)} }`).join(',\n');
  const tsPath = path.join(process.cwd(), 'backend/src/chats/gemini.service.ts');
  let ts = fs.readFileSync(tsPath, 'utf8');
  ts = ts.replace(/const scenarioGuidance:[\s\S]*?;\n\nconst audienceGuidance/, `const scenarioGuidance: Record<string, { title: string; role: string; goal: string; finish: string }> = {\n${entriesTs}\n};\n\nconst audienceGuidance`);
  fs.writeFileSync(tsPath, ts);
  const entriesJs = mod.practiceScenarios.map(s => `  '${s.id}': { title: ${JSON.stringify(s.title)}, role: ${JSON.stringify(s.role)}, goal: ${JSON.stringify(`${s.goal} Etapas esperadas: ${s.steps.join(' > ')}.`)}, finish: ${JSON.stringify(finish)} }`).join(',\n');
  const jsPath = path.join(process.cwd(), 'deploy-mysql-template/server/server.js');
  let js = fs.readFileSync(jsPath, 'utf8');
  js = js.replace(/const scenarioGuidance = \{[\s\S]*?\};\n/, `const scenarioGuidance = {\n${entriesJs}\n};\n`);
  fs.writeFileSync(jsPath, js);
})();
