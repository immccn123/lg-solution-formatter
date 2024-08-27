declare module "@wasm-fmt/clang-format/clang-format-vite.js" {
  export * from "@wasm-fmt/clang-format";
}

/**
 * @param {string} config
 */
export default function remarkClangFmtWasm(
  config?: string
): (tree: Root) => Promise<void>;
export type Root = import("mdast").Root;
export type RootContent = import("mdast").RootContent;
export type VFile = import("vfile").VFile;
