import formatSolution from "@imkdown/lg-solution-formatter";
import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const currentDir = __dirname;

const testDirs = await fs
  .readdir(currentDir, { withFileTypes: true })
  .then((dirents) =>
    dirents
      .filter(
        (dirent) => dirent.isDirectory() && dirent.name.startsWith("test-"),
      )
      .map((dirent) => dirent.name),
  );

describe("Markdown 文件格式化", async () => {
  for (const dirName of testDirs) {
    const caseDir = path.join(currentDir, dirName);
    const inputPath = path.join(caseDir, "input.md");
    const outputPath = path.join(caseDir, "output.md");
    const describePath = path.join(caseDir, "describe.txt");

    const testDescription = (await fs.access(describePath).catch((_) => false))
      ? fs.readFileSync(describePath, "utf-8").trim()
      : dirName;

    it(`[${dirName}] ${testDescription}`, async () => {
      expect(!!(await fs.stat(inputPath).catch((_) => false))).toBeTruthy();
      expect(!!(await fs.stat(outputPath).catch((_) => false))).toBeTruthy();

      const inputContent = await fs.readFile(inputPath, "utf-8");
      const expectedOutput = await fs.readFile(outputPath, "utf-8");

      const actualOutput = await formatSolution(inputContent);

      expect(actualOutput).toBe(expectedOutput);
    });
  }
});
