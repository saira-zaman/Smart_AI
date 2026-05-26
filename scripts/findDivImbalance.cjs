const fs = require('fs');
const src = fs.readFileSync(process.argv[2] || 'src/App.tsx','utf8');
function stripBracesAndStrings(s){
  let out=''; let i=0;
  while(i<s.length){
    const ch=s[i];
    if(ch==='{'){ let depth=1;i++; while(i<s.length&&depth>0){ if(s[i]==='{') depth++; else if(s[i]==='}') depth--; i++; } }
    else if(ch==='"'||ch==="'"||ch==='`'){ const q=ch; out+=q; i++; while(i<s.length){ if(s[i]==='\\') { i+=2; continue;} if(s[i]===q){ out+=q; i++; break;} i++; } }
    else { out+=ch; i++; }
  }
  return out;
}
const clean = stripBracesAndStrings(src);
const tagRe = /<(\/)?(div)\b[^>]*>/g;
let match; const stack=[];
while((match=tagRe.exec(clean))!==null){ const isClose=!!match[1]; const tag=match[2]; const line=clean.slice(0,match.index).split('\n').length; if(!isClose){ stack.push({tag,line,idx:match.index}); } else{ if(stack.length===0){ console.log('Extra closing',tag,'at',line); } else{ stack.pop(); } } }
if(stack.length){ console.log('Unclosed divs:',stack.length); stack.slice(0,20).forEach(x=>console.log(`<div opened at line ${x.line}>`)); } else console.log('All divs closed');
