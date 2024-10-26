const Sharp = require("sharp");


function rgbaStr(r, g, b, a = 1.0) {
    return `rgba(${[ r, g, b, a ].join(", ")})`;
}

// “Draw” refers to generating an SVG tag string.
function drawPolygon(verts, strokeWidth = 1, stroke = rgbaStr(0, 0, 0), fill = rgbaStr(255, 255, 255, 0)) {
    return `<polygon style="${
        `fill: ${fill}; stroke: ${stroke}; stroke-width: ${strokeWidth}px; stroke-linecap: round; stroke-linejoin: round;"`
    } points="${verts.flat().join(" ")}" />`;
}

function drawText(x, y, caption, anchor = "middle", stroke = rgbaStr(0, 0, 0), fontSize, verticalAlignment = 0.5) {
    return `<text ${
        `style="font-family: sans-serif; font-size: ${fontSize}px; text-anchor: ${anchor}; color: ${stroke}"`
    } x="${x}" y="${y + fontSize * verticalAlignment}">${caption}</text>`;
}

/**
 * Compute corrdinates of a equilateral, centered polygon with n vertices (n-gon).
 * @param n Number of vertices in polygon
 * @param r Radius of polygon (distance vertice to center) 
 * @param c Center coordinate (radius by default)
 * @returns 2D-array of vertices
 */
function getPolygonVerts(n, r, c = r) {
    return new Array(n)
    .fill(null)
    .map((_, i) => {
        const x = r * Math.cos(2 * Math.PI * i / n);
        const y = r * Math.sin(2 * Math.PI * i / n);
        const phi = -0.5 * Math.PI;
        return [
            c + (x * Math.cos(phi) - y * Math.sin(phi)),
            c + (x * Math.sin(phi) + y * Math.cos(phi)),
        ];
    })
    .map((p, _, verts) => {
        const offset = 0.5 * (r * 2 - (
            verts.reduce((acc, p) => Math.max(acc, p[1]), -Infinity)
            - verts.reduce((acc, p) => Math.min(acc, p[1]), Infinity)
        ))
        return [
            p[0],
            p[1] + offset 
        ]
    });
}


/**
 * Generate an SVG string for a given array of attributes:
 * {
 *   attribute: string;
 *   degree: number([0, 1]);
 * }[]
 */
module.exports.generateNgon = function(dataArray, r = 175, fontSize = 20, colors = {
    line: rgbaStr(190, 195, 190),
    text: rgbaStr(0, 0, 0),
    primary: rgbaStr(180, 224, 163),
    primaryTranslucent: rgbaStr(232, 255, 223, 0.65)
}) {
    const n = dataArray.length;
    const m = r * 0.125;
    const s = r * 0.005;
    if(n < 3) throw new SyntaxError("Data object count must be at least 3 (to draw n-gon)");

    const verts = getPolygonVerts(n, r);

    let maxCaptionLength = -Infinity;
    const svg = [
        drawPolygon(getPolygonVerts(n, r * (1/2), r), s, colors.line),
        drawPolygon(getPolygonVerts(n, r * (3/4), r), s, colors.line),
        drawPolygon(verts, s, colors.line),
        drawPolygon(dataArray
            .map((dataObj, i) => [
                (verts[i][0] - r) * dataObj.degree + r,
                (verts[i][1] - r) * dataObj.degree + r
            ]), s * 2, colors.primary, colors.primaryTranslucent),
        dataArray
        .map((dataObj, i) => {
            maxCaptionLength = Math.max(maxCaptionLength, dataObj.attribute.length);
            
            const gravitation = (i / n) - 0.5;
            const side = i ? gravitation : 0;
            const verticalAlignment = i ? (gravitation ? 0.5 : 1) : 0;
            return drawText(
                verts[i][0] + ((side > 0) ? -m : ((side < 0) ? m : 0)),
                verts[i][1] + (!i ? -m : (!side ? m : 0)),
                dataObj.attribute,
                (side < 0)
                    ? "start"
                    : (side > 0)
                        ? "end"
                        : "middle",
                colors.text,
                fontSize,
                i ? verticalAlignment : 0
            );
        })
    ].flat();
    
    const captionOffset = m + maxCaptionLength * (fontSize * 0.525);    // empirical char with coefficient
    return [
        "<?xml version=\"1.0\" encoding=\"utf-8\"?>",
        `<svg viewBox=\"${
            -captionOffset
        } ${
            -1 * (fontSize + m)
        } ${
            r * 2 + 2 * captionOffset
        } ${
            r * 2 + 2 * (fontSize + m)
        }\" xmlns=\"http://www.w3.org/2000/svg\">`,
            ... svg,
        "</svg>"
    ].join("\n");
}

module.exports.svgToPng = async function(svg) {
    return await new Sharp(Buffer.from(svg, "utf-8"))
        .resize(1200)
        .png()
        .toBuffer();
}