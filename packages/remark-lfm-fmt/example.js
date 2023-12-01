import { remark } from "remark";
import * as fs from "node:fs";

import remarkLfmFmt from "./src/lib/fmt.js";

const buf = fs.readFileSync("example.md");

const file = await remark().use(remarkLfmFmt).process(buf);

console.log(String(file));
