import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

let hasError = false;

// 1. Verify that 'public' exists
if (!fs.existsSync(publicDir)) {
  console.error('❌ Error: public directory not found at', publicDir);
  process.exit(1);
}

// Case-sensitive file existence checker (even on Windows)
function fileExistsCaseSensitive(fullPath) {
  const normalized = path.normalize(fullPath);
  const parts = normalized.split(path.sep);
  
  // Start from root
  let current = parts[0] ? parts[0] + path.sep : path.sep;
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    try {
      const entries = fs.readdirSync(current);
      if (!entries.includes(part)) {
        return false;
      }
    } catch {
      return false;
    }
    current = path.join(current, part);
  }
  return true;
}

// 2. Scan all files in public for uppercase letters or spaces
console.log('🔍 Checking public/ files for uppercase letters and spaces...');
const publicFiles = [];

function checkPublicFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const name = entry.name;
    const fullPath = path.join(dir, name);
    const relFromPublic = path.relative(publicDir, fullPath).replace(/\\/g, '/');

    if (/[A-Z]/.test(name)) {
      console.error(`❌ Case error: "${relFromPublic}" contains uppercase letters.`);
      hasError = true;
    }
    if (/\s/.test(name)) {
      console.error(`❌ Space error: "${relFromPublic}" contains whitespace.`);
      hasError = true;
    }

    if (entry.isDirectory()) {
      checkPublicFiles(fullPath);
    } else {
      publicFiles.push('/' + relFromPublic);
    }
  }
}

checkPublicFiles(publicDir);

// 3. Scan src and index.html for asset references
console.log('🔍 Scanning source code for referenced public assets...');
const srcFiles = [];

function walkSrc(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSrc(fullPath);
    } else if (/\.(tsx?|jsx?|css|html|json)$/.test(entry.name)) {
      srcFiles.push(fullPath);
    }
  }
}

walkSrc(path.join(rootDir, 'src'));
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  srcFiles.push(path.join(rootDir, 'index.html'));
}

const assetRegex = /['"`](\/(?:images|menu|icons|assets)?[^'"`\s\?#]+\.(?:jpg|jpeg|png|webp|gif|svg|ico|pdf))['"`]/gi;
const referencedAssets = new Set();

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    const assetPath = match[1];
    // Ignore external URLs or api paths
    if (!assetPath.startsWith('http') && !assetPath.startsWith('//')) {
      referencedAssets.add(assetPath);
    }
  }
}

console.log(`Found ${referencedAssets.size} unique public asset references in source code.`);

for (const ref of referencedAssets) {
  const cleanRef = ref.startsWith('/') ? ref.slice(1) : ref;
  const fullDiskPath = path.join(publicDir, cleanRef);

  if (!fs.existsSync(fullDiskPath)) {
    console.error(`❌ Missing asset: Referenced "${ref}" does not exist in public/.`);
    hasError = true;
  } else if (!fileExistsCaseSensitive(fullDiskPath)) {
    console.error(`❌ Case mismatch: Referenced "${ref}" has incorrect casing on disk.`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\n💥 Asset validation failed! Please fix the errors above.');
  process.exit(1);
} else {
  console.log('✅ All public assets are valid, lowercase, space-free, and exist with exact case!\n');
}

