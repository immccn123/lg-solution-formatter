import esbuild from "esbuild";

const buildTasks = [
  esbuild.build({
    entryPoints: ["variants/browser-bundled.js"],
    bundle: true,
    target: "chrome54",
    outfile: "dist/lgsolfmt-browser-bundled.js",
  }),
  esbuild.build({
    entryPoints: ["variants/browser-bundled.js"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: "chrome54",
    outfile: "dist/lgsolfmt-browser-bundled.min.js",
  }),
]

await Promise.all(buildTasks);
