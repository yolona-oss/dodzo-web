"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var PACKAGE_PREFIX = '@dodzo-web/shared/';
var SOURCE_DIR = './src'; // Adjust this to your source directory
function getRelativePath(fromFile, toFile) {
    var fromDir = path.dirname(fromFile);
    var relativePath = path.relative(fromDir, toFile);
    // Ensure the path starts with ./ or ../
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    // Remove .ts extension if present, as imports don't need it
    relativePath = relativePath.replace(/\.ts$/, '');
    return relativePath;
}
function convertImportsInFile(filePath, sourceRoot) {
    var content = fs.readFileSync(filePath, 'utf-8');
    var lines = content.split('\n');
    var modified = false;
    var newLines = lines.map(function (line) {
        // Match import statements with @dodzo-web/shared/
        var importRegex = /^(\s*import\s+(?:{[^}]+}|[\w*]+|\*\s+as\s+\w+)\s+from\s+['"])@dodzo-web\/shared\/([^'"]+)(['"];?)$/;
        var match = line.match(importRegex);
        if (match) {
            var prefix = match[1], importPath = match[2], suffix = match[3];
            // Convert the package path to a file system path
            var targetPath = path.join(sourceRoot, importPath);
            // Check if it's a file or directory
            var targetFile = targetPath;
            if (fs.existsSync(targetPath + '.ts')) {
                targetFile = targetPath + '.ts';
            }
            else if (fs.existsSync(targetPath + '.tsx')) {
                targetFile = targetPath + '.tsx';
            }
            else if (fs.existsSync(path.join(targetPath, 'index.ts'))) {
                targetFile = path.join(targetPath, 'index.ts');
            }
            else if (fs.existsSync(path.join(targetPath, 'index.tsx'))) {
                targetFile = path.join(targetPath, 'index.tsx');
            }
            // Get relative path
            var relativePath = getRelativePath(filePath, targetFile);
            modified = true;
            return "".concat(prefix).concat(relativePath).concat(suffix);
        }
        return line;
    });
    if (modified) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
        console.log("\u2713 Updated: ".concat(filePath));
    }
}
function processDirectory(dir, sourceRoot) {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules and other common directories
            if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') {
                continue;
            }
            processDirectory(fullPath, sourceRoot);
        }
        else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
            convertImportsInFile(fullPath, sourceRoot);
        }
    }
}
// Main execution
var sourceRoot = path.resolve(SOURCE_DIR);
if (!fs.existsSync(sourceRoot)) {
    console.error("Error: Source directory \"".concat(sourceRoot, "\" does not exist"));
    process.exit(1);
}
console.log("Converting imports in: ".concat(sourceRoot));
console.log('---');
processDirectory(sourceRoot, sourceRoot);
console.log('---');
console.log('Done!');
