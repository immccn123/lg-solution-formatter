declare module "@wasm-fmt/clang-format/clang-format-vite.js" {
  export * from "@wasm-fmt/clang-format";
  export { default } from "@wasm-fmt/clang-format";
}

declare module "@imkdown/remark-clang-fmt-wasm/vite.js" {
  /**
   * @param {string} config
   */
  export default function remarkClangFmtWasm(
    config?: string
  ): (tree: Root) => Promise<void>;
  export type Root = import("mdast").Root;
  export type RootContent = import("mdast").RootContent;
  export type VFile = import("vfile").VFile;
}

declare module "@imkdown/remark-clang-fmt-wasm/node.js" {
  export * from "@imkdown/remark-clang-fmt-wasm/vite.js";
  export default function remarkClangFmtWasm(
    config?: string
  ): (tree: Root) => Promise<void>;
}
