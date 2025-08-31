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

const inputContent = inputMatch[1].trim() + "\n";
const expectedContent = expectedMatch ? expectedMatch[1].trim() : null;

(async () => {
  const afterComment = `\n\n---\n\n由 Isokulas Bot 生成上述报告。请不要频繁编辑 issue。\n`;

  /**
   * @param {string} title
   * @param {string} content
   */
  const wrap = (title, content) =>
    `<details>\n<summary>${title}</summary>\n\n${content}\n</details>\n\n`;

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
        return wrap(title, "```diff\n" + diffOutput + "\n```");
      } catch (/** @type {*} */ error) {
        if (error.stdout) {
          return wrap(title, "```diff\n" + error.stdout + "\n```");
        }
        return `${title}：无差异\n\n`;
      }
    };

    let comment = `格式化处理结果如下：\n\n`;

    if (expectedContent) {
      comment += generateDiff(
        expectedContent + "\n",
        formattedContent,
        "与预期输出的差异"
      );
    }

    comment += generateDiff(inputContent, formattedContent, "与输入的差异");
    comment += wrap(
      "格式化结果源码",
      `\`\`\`markdown\n${formattedContent}\n\`\`\``
    );
    comment += wrap("格式化结果预览", formattedContent);

    if (expectedContent) {
      comment += wrap("预期输出预览", expectedContent);
    }

    comment += afterComment;

    await octokit.rest.reactions.createForIssue({
      owner: context.repo.owner,
      repo: context.repo.name,
      issue_number: context.issue.number,
      content: "eyes", // 👀
    });

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
      body:
        `格式化处理出现错误\n\n` +
        wrap("详情", `\`\`\`\n${error.message}\n\`\`\``) +
        afterComment,
    });
  }
})();
