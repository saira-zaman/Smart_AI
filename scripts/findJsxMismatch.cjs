const fs = require('fs');
const path = process.argv[2] || 'src/App.tsx';
let src = fs.readFileSync(path, 'utf8');

// Preprocess to remove JS expressions and strings so '>' inside them don't break tag parsing
function stripBracesAndStrings(s) {
  let out = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '{') {
      // skip until matching }
      let depth = 1; i++;
      while (i < s.length && depth > 0) {
        if (s[i] === '{') depth++;
        else if (s[i] === '}') depth--;
        i++;
      }
    } else if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch; out += '"'; i++;
      while (i < s.length) {
        if (s[i] === '\\') { i += 2; continue; }
        if (s[i] === quote) { i++; break; }
        i++;
      }
    } else {
      out += ch; i++;
    }
  }
  return out;
}

src = stripBracesAndStrings(src);

const tagRe = /<(\/)?([A-Za-z0-9_\-:.]+)([^>]*)>/g;
const selfClosingRe = /\/$/;
let match;
const stack = [];
while ((match = tagRe.exec(src)) !== null) {
  const isClose = !!match[1];
  const tag = match[2];
  const rest = match[3] || '';
  const line = src.slice(0, match.index).split('\n').length;
  if (!isClose) {
    if (selfClosingRe.test(rest.trim()) || match[0].endsWith('/>') || rest.includes('/>') || rest.trim().endsWith('/')) {
      continue;
    }
    stack.push({ tag, index: match.index, line });
  } else {
    if (stack.length === 0) {
      console.log(`Unmatched closing </${tag}> at line ${line}`);
      process.exit(1);
    }
    const last = stack.pop();
    if (last.tag !== tag) {
      console.log(`Tag mismatch at line ${line}: closing </${tag}> but last opened was <${last.tag}> (opened at line ${last.line})`);
      process.exit(1);
    }
  }
}
if (stack.length) {
  const last = stack.pop();
  console.log(`Unclosed tag <${last.tag}> opened at line ${last.line}`);
  process.exit(1);
}
console.log('No mismatched tags found.');
