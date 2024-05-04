import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import copy from 'rollup-plugin-copy';
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    input: Object.fromEntries(
        globSync('../../src/**/*.ts').map(file => [
            // This remove `src/` as well as the file extension from each
            // file, so e.g. src/nested/foo.js becomes nested/foo
            path.relative(
                '../../src',
                file.slice(0, file.length - path.extname(file).length)
            ),
            // This expands the relative paths to absolute paths, so e.g.
            // src/nested/foo becomes /project/src/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url))
        ])
    ),
    output: {
        format: 'es',
        dir: '.'
    },
    plugins: [
        alias({
            entries: [
                {
                    find: "@zosx",
                    replacement: `${__dirname}/../../node_modules/zosx/dist/Legacy`
                }
            ]
        }),
        typescript({
            compilerOptions: {
                paths: {
                    "@zosx/*": [`${__dirname}/../../node_modules/zosx/dist/Legacy/*`]
                }
            }
        }),
        copy({
            targets: [
                { src: "../mzfw/assets", dest: "." },
                { src: "../mzfw/assets_raw", dest: "." },
            ]
        }),
    ]
};