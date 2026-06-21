import { readFile, writeFile } from 'node:fs/promises';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { minify } from 'html-minifier-terser';

const SRC = new URL('./src/index.html', import.meta.url);
const OUT = new URL('./public/index.html', import.meta.url);

const PLACEHOLDER = '__OBFUSCATED_SCRIPT__';

// Animation-safe moderate preset: opaque to readers, but light enough that the
// embers requestAnimationFrame loop and the 1s countdown interval stay smooth.
const OBFUSCATOR_OPTS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  numbersToExpressions: true,
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  splitStrings: true,
  splitStringsChunkLength: 6,
  transformObjectKeys: true,
  selfDefending: true,
  identifierNamesGenerator: 'hexadecimal',
};

const MINIFY_OPTS = {
  removeComments: true,        // strip HTML comments
  collapseWhitespace: true,
  conservativeCollapse: true,  // keep single spaces so inline layout is unaffected
  minifyCSS: true,             // strips the /* */ CSS banners + compresses
  minifyJS: false,             // leave the already-obfuscated blob untouched
  decodeEntities: false,       // preserve &#x12022; cuneiform entities and &nbsp;
  keepClosingSlash: true,
  caseSensitive: true,
};

const html = await readFile(SRC, 'utf8');

const scriptRe = /<script>([\s\S]*?)<\/script>/;
const match = html.match(scriptRe);
if (!match) throw new Error('No inline <script> block found in src/index.html');

const obfuscated = JavaScriptObfuscator.obfuscate(match[1], OBFUSCATOR_OPTS).getObfuscatedCode();

// Swap in a placeholder before minifying so html-minifier never parses the blob,
// then restore the obfuscated code into the minified shell.
const withPlaceholder = html.replace(scriptRe, `<script>${PLACEHOLDER}</script>`);
const minified = await minify(withPlaceholder, MINIFY_OPTS);
const out = minified.replace(PLACEHOLDER, () => obfuscated);

await writeFile(OUT, out, 'utf8');
console.log(`Built public/index.html (${out.length} bytes) from src/index.html`);
