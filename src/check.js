import fs from 'node:fs';
import path from 'node:path';

export const CHECKS = [
  [
    "trigger",
    "trigger|when|条件|触发",
    "Defines trigger."
  ],
  [
    "behavior",
    "behavior|do|must|行为|必须",
    "Defines behavior."
  ],
  [
    "exception",
    "exception|unless|except|例外|除非",
    "Defines exceptions."
  ],
  [
    "secret",
    "secret|token|cookie|password|密钥|密码",
    "Blocks secrets."
  ]
];

export function readTarget(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(entry.path, entry.name))
      .filter((file) => /\.(md|txt|json|ya?ml|log|env|js|ts)$/i.test(file))
      .slice(0, 120)
      .map((file) => `\n--- ${path.relative(target, file)} ---\n${fs.readFileSync(file, 'utf8')}`)
      .join('\n');
  }
  return fs.readFileSync(target, 'utf8');
}

export function redact(text) {
  return text
    .replace(/(ghp_|github_pat_|gitee_[A-Za-z0-9_]*|sk-[A-Za-z0-9_-]{16,})[A-Za-z0-9_\-]*/g, '[REDACTED_TOKEN]')
    .replace(/(token|password|secret|cookie)\s*[:=]\s*[^\s]+/gi, '$1=[REDACTED]');
}

export function checkText(text, target = 'input') {
  const source = redact(text);
  const results = CHECKS.map(([id, pattern, message]) => {
    const passed = new RegExp(pattern, 'i').test(source);
    return { id, passed, message };
  });
  const passed = results.filter((item) => item.passed).length;
  const score = Math.round((passed / results.length) * 100);
  return { tool: 'agent-memory-audit', target, score, passed, total: results.length, results, redacted: source };
}

export function checkFile(target) {
  return checkText(readTarget(target), target);
}

export function formatText(report) {
  const lines = [`Agent Memory Audit score: ${report.score}/100`];
  for (const item of report.results) lines.push(`${item.passed ? 'PASS' : 'WARN'}  ${item.id} - ${item.message}`);
  return lines.join('\n');
}

export function formatMarkdown(report) {
  const rows = report.results.map((item) => `| ${item.id} | ${item.passed ? 'PASS' : 'WARN'} | ${item.message} |`).join('\n');
  return `# Agent Memory Audit Report\n\nScore: **${report.score}/100**\n\n| Check | Status | Message |\n| --- | --- | --- |\n${rows}\n`;
}

export function formatAnnotations(report) {
  return report.results.filter((item) => !item.passed).map((item) => `::warning title=Agent Memory Audit ${item.id}::${item.message}`).join('\n');
}

export function formatSarif(report) {
  return {
    version: '2.1.0',
    runs: [{
      tool: { driver: { name: 'agent-memory-audit', informationUri: 'https://github.com/aolingge/agent-memory-audit', rules: report.results.map((item) => ({ id: item.id, shortDescription: { text: item.message } })) } },
      results: report.results.filter((item) => !item.passed).map((item) => ({ ruleId: item.id, level: 'warning', message: { text: item.message }, locations: [{ physicalLocation: { artifactLocation: { uri: report.target } } }] }))
    }]
  };
}
