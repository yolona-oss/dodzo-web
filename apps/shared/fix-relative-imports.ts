import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_PREFIX = '@dodzo-web/shared/';
const SOURCE_DIR = './src'; // Adjust this to your source directory

function getRelativePath(fromFile: string, toFile: string): string {
  const fromDir = path.dirname(fromFile);
  let relativePath = path.relative(fromDir, toFile);
  
  // Ensure the path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Remove .ts extension if present, as imports don't need it
  relativePath = relativePath.replace(/\.ts$/, '');
  
  return relativePath;
}

function convertImportsInFile(filePath: string, sourceRoot: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  const newLines = lines.map(line => {
    // Match import statements with @dodzo-web/shared/
    const importRegex = /^(\s*import\s+(?:{[^}]+}|[\w*]+|\*\s+as\s+\w+)\s+from\s+['"])@dodzo-web\/shared\/([^'"]+)(['"];?)$/;
    const match = line.match(importRegex);
    
    if (match) {
      const [, prefix, importPath, suffix] = match;
      
      // Convert the package path to a file system path
      const targetPath = path.join(sourceRoot, importPath);
      
      // Check if it's a file or directory
      let targetFile = targetPath;
      if (fs.existsSync(targetPath + '.ts')) {
        targetFile = targetPath + '.ts';
      } else if (fs.existsSync(targetPath + '.tsx')) {
        targetFile = targetPath + '.tsx';
      } else if (fs.existsSync(path.join(targetPath, 'index.ts'))) {
        targetFile = path.join(targetPath, 'index.ts');
      } else if (fs.existsSync(path.join(targetPath, 'index.tsx'))) {
        targetFile = path.join(targetPath, 'index.tsx');
      }
      
      // Get relative path
      const relativePath = getRelativePath(filePath, targetFile);
      modified = true;
      
      return `${prefix}${relativePath}${suffix}`;
    }
    
    return line;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    console.log(`✓ Updated: ${filePath}`);
  }
}

function processDirectory(dir: string, sourceRoot: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other common directories
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') {
        continue;
      }
      processDirectory(fullPath, sourceRoot);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      convertImportsInFile(fullPath, sourceRoot);
    }
  }
}

// Main execution
const sourceRoot = path.resolve(SOURCE_DIR);

if (!fs.existsSync(sourceRoot)) {
  console.error(`Error: Source directory "${sourceRoot}" does not exist`);
  process.exit(1);
}

console.log(`Converting imports in: ${sourceRoot}`);
console.log('---');

processDirectory(sourceRoot, sourceRoot);

console.log('---');
console.log('Done!');
