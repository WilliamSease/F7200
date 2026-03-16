// scripts/gen-color-reference.mjs
import colorSchemes from './public/colorSchemes.json' with { type: "json" };
import { writeFileSync } from 'fs';

console.info(colorSchemes)

const cards = Object.entries(colorSchemes.colorSchemes)
  .map(
    ([key, scheme]) => `
  <div class="entry" style="background: ${scheme.background}; color: ${scheme.foreground};">
    <div class="scheme-name">${key}</div>
    <div class="description">${scheme.description}</div>
    <div class="sample-large">user?  fomulder</div>
    <div class="sample-small">pass!  ••••••</div>
    <div class="sample-small">ø ⚙  ⌁⌁⌁  →</div>
    <div class="sample-hover" style="color: ${scheme.hover};">hover →</div>
  </div>
`
  )
  .join('')

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @font-face { font-family: 'WO3'; src: url('./WipEout-Fonts/WO3.ttf'); }
  body { background: #222; margin: 40px; font-family: 'WO3', monospace; }
  .entry { display: inline-block; margin: 20px; padding: 32px 40px; width: 340px; vertical-align: top; }
  .scheme-name { font-size: 11px; font-family: monospace; margin-bottom: 20px; opacity: 0.5; }
  .description { font-size: 13px; font-family: monospace; margin-bottom: 20px; opacity: 0.7; }
  .sample-large { font-size: 32px; margin-bottom: 4px; }
  .sample-small { font-size: 20px; margin-bottom: 16px; }
  .sample-hover { font-size: 20px; margin-bottom: 16px; }
</style>
</head>
<body>
${cards}
</body>
</html>`

writeFileSync('./public/colorSchemeReference.html', html)
console.log('written to public/colorSchemeReference.html')
