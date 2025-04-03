const fs = require('fs');
const path = require('path');

// Create the destination directory if it doesn't exist
const publicWasmDir = path.join(process.cwd(), 'public', 'static', 'wasm');
if (!fs.existsSync(publicWasmDir)) {
  fs.mkdirSync(publicWasmDir, { recursive: true });
}

// Copy the WASM file
const sourceWasmPath = path.join(process.cwd(), 'node_modules', '@jlongster', 'sql.js', 'dist', 'sql-wasm.wasm');
const destWasmPath = path.join(publicWasmDir, 'sql-wasm.wasm');

fs.copyFileSync(sourceWasmPath, destWasmPath);
console.log('WASM file copied successfully!'); 