import { MathFormatRules } from "./rule";

export default function remarkLfmFmt(config?: Config): (tree: Root) => void;
export type Root = import("mdast").Root;
export type RootContent = import("mdast").RootContent;

export type Config = {
  fwPunctuation?: boolean;
  enabledRules?: {
    math?: MathFormatRules[] // TODO: static type check
  }
};
