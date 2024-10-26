#!/usr/bin/env node


const { lstatSync, writeFileSync, readdirSync, mkdirSync } = require("fs");
const { resolve, normalize, join, dirname, basename } = require("path");
const { generateNgon, svgToPng } = require("./api");

/*
 * Generate n-gon SVG string from JSON read from given path (pos arg 0).
 * Write to .svg file, and also respective PNG buffer to .png file.
 * Files are emitted next to input file, unless a path given (pos arg 1).
 */
let inputDirPath = resolve(process.argv.slice(2)[0] ?? ".");
const inputJsonPaths = [];
if(lstatSync(resolve(inputDirPath)).isDirectory()) {
    inputJsonPaths.push(
        ...readdirSync(inputDirPath, {
            recursive: true
        })
    );
} else {
    inputJsonPaths.push(basename(inputDirPath));
    inputDirPath = dirname(inputDirPath);
}
const outputDirPath = resolve(process.argv.slice(2)[1] ?? ".");

inputJsonPaths
.filter(path => /\.json$/i.test(path))
.forEach(async path => {
    const outBaseDirPath = join(outputDirPath, dirname(path));
    const outBasePath = join(outBaseDirPath, basename(path).replace(/\.json$/i, ""));
    const ngonSvg = generateNgon(
        require(join(inputDirPath, path))
    );
    
    mkdirSync(outBaseDirPath, { recursive: true });
    
    writeFileSync(
        `${outBasePath}.svg`,
        ngonSvg
    );
    writeFileSync(
        `${outBasePath}.png`,
        await svgToPng(ngonSvg)
    );
    
    console.log(`\x1b[34mAttribute n-gon generated at \x1b[3m${normalize(outBasePath)}.[svg|png].\x1b[0m`);
});