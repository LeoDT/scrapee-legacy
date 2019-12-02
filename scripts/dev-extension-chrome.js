const Bundler = require('parcel-bundler');
const path = require('path');
const fs = require('fs-extra');

const dist = path.resolve(__dirname, '../', 'dist/extension-chrome/');
const filesToCopy = [
  'src/extension-chrome/manifest.json',
  'src/extension-chrome/nativeMessageManifest.json'
];
const entry = ['src/extension-chrome/background.ts'];

fs.ensureDirSync(dist);

filesToCopy.forEach(f => {
  const file = path.resolve(__dirname, '../', f);
  fs.ensureSymlinkSync(file, path.resolve(dist, path.basename(f)));
});

const bundler = new Bundler(entry, {
  outDir: dist,
  contentHash: false,
  autoInstall: false,
  hmr: false
});

bundler.bundle();
