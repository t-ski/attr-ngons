const TARGET_SVG = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="-116.375 -41.875 582.75 433.75" xmlns="http://www.w3.org/2000/svg">
<polygon style="fill: rgba(255, 255, 255, 0); stroke: rgba(190, 195, 190, 1); stroke-width: 0.875px; stroke-linecap: round; stroke-linejoin: round;" points="175 87.5 250.77722283113837 131.25 250.77722283113837 218.75 175 262.5 99.22277716886163 218.75000000000003 99.22277716886163 131.25" />
<polygon style="fill: rgba(255, 255, 255, 0); stroke: rgba(190, 195, 190, 1); stroke-width: 0.875px; stroke-linecap: round; stroke-linejoin: round;" points="175 43.75 288.66583424670756 109.37499999999999 288.66583424670756 240.62499999999997 175 306.25 61.33416575329245 240.62500000000006 61.33416575329244 109.37499999999999" />
<polygon style="fill: rgba(255, 255, 255, 0); stroke: rgba(190, 195, 190, 1); stroke-width: 0.875px; stroke-linecap: round; stroke-linejoin: round;" points="175 0 326.55444566227675 87.5 326.55444566227675 262.5 175 350 23.44555433772325 262.50000000000006 23.44555433772325 87.49999999999997" />
<polygon style="fill: rgba(232, 255, 223, 0.65); stroke: rgba(180, 224, 163, 1); stroke-width: 1.75px; stroke-linecap: round; stroke-linejoin: round;" points="175 66.5 300.7901898996897 102.375 281.08811196359375 236.25 175 304.5 114.3782217350893 210.00000000000003 56.787532383424136 106.74999999999997" />
<text style="font-family: sans-serif; font-size: 20px; text-anchor: middle; color: rgba(0, 0, 0, 1)" x="175" y="-21.875">Pace</text>
<text style="font-family: sans-serif; font-size: 20px; text-anchor: start; color: rgba(0, 0, 0, 1)" x="348.42944566227675" y="97.5">Shooting</text>
<text style="font-family: sans-serif; font-size: 20px; text-anchor: start; color: rgba(0, 0, 0, 1)" x="348.42944566227675" y="272.5">Passing</text>
<text style="font-family: sans-serif; font-size: 20px; text-anchor: middle; color: rgba(0, 0, 0, 1)" x="175" y="391.875">Dribbling</text>
<text style="font-family: sans-serif; font-size: 20px; text-anchor: end; color: rgba(0, 0, 0, 1)" x="1.5705543377232516" y="272.50000000000006">Defending</text>
<text style="font-family: sans-serif; font-size: 20px; text-anchor: end; color: rgba(0, 0, 0, 1)" x="1.5705543377232516" y="97.49999999999997">Physical</text>
</svg>
`.trim();

require("assert")
.deepEqual(
    require("../lib/api").generateNgon(require("./data.json")),
    TARGET_SVG
);


console.log(`\x1b[32mUnit tests successful.\x1b[0m`);