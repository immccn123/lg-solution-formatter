export default function remarkLfmFmt(): (tree: Root, file: VFile) => void;
export type Root = import('mdast').Root;
export type RootContent = import('mdast').RootContent;
export type VFile = import('vfile').VFile;
