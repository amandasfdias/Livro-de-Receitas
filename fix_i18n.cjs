const fs = require('fs');
const content = fs.readFileSync('i18n.ts', 'utf-8');
const lines = content.split('\n');
const outLines = [];
const seenStrings = new Set();
let inTranslation = false;

for (const line of lines) {
  if (line.includes('translation: {')) {
    inTranslation = true;
    seenStrings.clear();
    outLines.push(line);
    continue;
  }
  if (inTranslation && line.includes('}')) {
    if (line.match(/^\s*}(\s*,)?$/)) {
      inTranslation = false;
    }
  }
  
  const matchKey = line.match(/^\s*"([^"]+)"\s*:/);
  if (matchKey && inTranslation) {
    const key = matchKey[1];
    if (seenStrings.has(key)) {
      // SKIP duplicate
      continue;
    }
    seenStrings.add(key);
  }
  outLines.push(line);
}
fs.writeFileSync('i18n.ts', outLines.join('\n'));
