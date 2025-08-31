import { Octokit } from "octokit";
import { formatSolution } from "@imkdown/lg-solution-formatter";
import * as fs from "node:fs";
import { execSync } from "node:child_process";

const context = {
  token: process.env.GITHUB_TOKEN,
  issue: {
    number: parseInt(/** @type {string} */ (process.env.ISSUE_NUMBER)),
    body: /** @type {string} */ (process.env.ISSUE_BODY),
  },
  repo: {
    owner: /** @type {string} */ (process.env.REPO_OWNER),
    name: /** @type {string} */ (process.env.REPO_NAME),
  },
};

const octokit = new Octokit({ auth: context.token });

const issueBody = context.issue.body;

const inputMatch = issueBody.match(
  /\*\*输入\*\*\s*```(?:markdown)?\s*([\s\S]*?)\s*```/i
);
const expectedMatch = issueBody.match(
  /\*\*预期输出\*\*\s*```(?:markdown)?\s*([\s\S]*?)\s*```/i
);

if (!inputMatch) {
  console.log("No input content found, ignoring this issue");
  process.exit(0);
}

const inputContent = inputMatch[1].trim();
const expectedContent = expectedMatch ? expectedMatch[1].trim() : null;

(async () => {
  try {
    const formattedContent = await formatSolution(inputContent, {
      fwPunctuation: true,
    });

    /**
     * @param {string} original
     * @param {string} formatted
     * @param {string} title
     */
    const generateDiff = (original, formatted, title) => {
      fs.writeFileSync("/tmp/original.md", original);
      fs.writeFileSync("/tmp/formatted.md", formatted);

      try {
        const diffOutput = execSync(
          "diff -u /tmp/original.md /tmp/formatted.md",
          { encoding: "utf8" }
        );
        return `## ${title}\n\`\`\`diff\n${diffOutput}\n\`\`\`\n\n`;
      } catch (/** @type {*} */ error) {
        if (error.stdout) {
          return `## ${title}\n\`\`\`diff\n${error.stdout}\n\`\`\`\n\n`;
        }
        return `## ${title}\n无差异\n\n`;
      }
    };

    let comment = `## 格式化处理结果\n\n`;

    if (expectedContent) {
      comment += generateDiff(
        expectedContent,
        formattedContent,
        "与预期输出的差异"
      );
    }

    comment += generateDiff(inputContent, formattedContent, "与输入的差异");

    comment += `## 格式化结果源码\n\`\`\`markdown\n${formattedContent}\n\`\`\`\n\n`;

    comment += `## 格式化结果预览\n${formattedContent}\n\n`;

    if (expectedContent) {
      comment += `## 预期输出预览\n${expectedContent}\n\n`;
    }

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.name,
      issue_number: context.issue.number,
      body: comment,
    });
  } catch (/** @type {*} */ error) {
    console.error("格式化错误:", error);

    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.name,
      issue_number: context.issue.number,
      body: `格式化处理失败：\n\`\`\`\n${error.message}\n\`\`\`\n`,
    });
  }
})();
