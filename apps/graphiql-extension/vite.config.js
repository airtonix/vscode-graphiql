"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vite_1 = require("vite");
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
/**
 * @type {import('vite').UserConfig}
 */
const config = (0, vite_1.defineConfig)(() => {
    return {
        plugins: [
            (0, vite_tsconfig_paths_1.default)({
                root: '../..',
            }),
        ],
        build: {
            rollupOptions: {
                external: ['vscode', 'path'],
            },
            lib: {
                entry: (0, path_1.resolve)(__dirname, 'src/index.ts'),
                name: 'GraphiQLExtension',
                fileName: (format) => `graphiql-extension.${format}.js`,
            },
            outDir: './dist',
        },
    };
});
// eslint-disable-next-line import/no-default-export
exports.default = config;
//# sourceMappingURL=vite.config.js.map