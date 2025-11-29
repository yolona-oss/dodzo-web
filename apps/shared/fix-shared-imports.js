#!/usr/bin/env node

/**
 * This script recursively fixes import paths in source and dist files.
 * It replaces:
 *      from '@/something'
 * with:
 *      from '@dodzo-web/shared/something'
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['src', 'dist']; // fix both TS source and built JS

function walkAndFix(dir) {
    const dirPath = path.join(ROOT, dir);

    if (!fs.existsSync(dirPath)) return;

    for (const file of fs.readdirSync(dirPath)) {
        const full = path.join(dirPath, file);
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
            walkAndFix(path.join(dir, file));
            continue;
        }

        if (!/\.(ts|js|mjs|cjs)$/.test(file)) continue;

        let content = fs.readFileSync(full, 'utf8');
        const updated = content.replace(/(['"])@\//g, `$1@dodzo-web/shared/`);

        if (content !== updated) {
            console.log('Fixed:', full);
            fs.writeFileSync(full, updated);
        }
    }
}

for (const dir of TARGET_DIRS) {
    walkAndFix(dir);
}

console.log('✔ Completed replacing path aliases');
