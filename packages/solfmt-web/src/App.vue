<script setup lang="ts">
import MonacoEditor, {
  useMonaco,
  VueMonacoDiffEditor,
} from "@guolao/vue-monaco-editor";
import GitHubTheme from "monaco-themes/themes/GitHub Light.json";
import { solutionFormatSync } from "../../lg-solution-formatter/index.js";

import { CButton, CButtonGroup } from "@coreui/vue";
import { ref } from "vue";

const monaco = useMonaco();
const code = ref("");

const showFormatted = ref(false),
  showDone = ref(false);

const loadTheme = () => {
  // @ts-expect-error I don't know why but is doesn't work
  monaco.monacoRef.value?.editor.defineTheme("github", GitHubTheme);
};

const formatRaw = () => {
  code.value = solutionFormatSync(code.value);
  showDone.value = true;
  setTimeout(() => (showDone.value = false), 1000);
};

const COMMIT_HASH: string = import.meta.env.VITE_COMMIT_HASH;
const MODE = import.meta.env.MODE;
</script>

<template>
  <div style="padding: 10px">
    <h1 style="display: inline-block">
      洛谷题解格式化工具<sub style="font-size: small">Beta</sub>
    </h1>
  </div>
  <div>
    <MonacoEditor
      height="73vh"
      language="markdown"
      theme="github"
      v-model:value="code"
      v-on:before-mount="loadTheme()"
      v-if="!showFormatted"
    />
    <VueMonacoDiffEditor
      height="73vh"
      language="markdown"
      theme="github"
      :original="code"
      :modified="solutionFormatSync(code)"
      v-else
    />
  </div>
  <div style="padding: 10px">
    <CButtonGroup role="group" size="sm">
      <CButton
        color="primary"
        v-on:click="() => (showFormatted = !showFormatted)"
        variant="outline"
        :disabled="showDone"
      >
        {{ showFormatted ? "返回" : "格式化并展示差异" }}
      </CButton>
      <CButton
        color="secondary"
        v-on:click="formatRaw"
        :disabled="showDone"
        variant="outline"
        v-if="!showFormatted"
      >
        {{ showDone ? "完成！" : "仅格式化" }}
      </CButton>
    </CButtonGroup>
    <details>
      <summary>⚠️注意事项</summary>
      <div>
        <ul>
          <li>
            目前的 Markdown 解析器会将任意的
            <code>$$ xxx $$</code> 处理为<b>行内</b>公式。如果需要块级公式，请在
            <code>$$</code> 的前后换行。<br />例如：
            <pre><code>{{ `$$\n\\TeX\n$$` }}</code></pre>
          </li>
          <li>请注意标题的 # 之后要添加空格，要不然会被转义。</li>
        </ul>
      </div>
    </details>
  </div>
  <p style="text-align: center; font-size: small">
    此版本仍在开发，部分表现与基于 marked.js (改)
    的旧版本不同。（现在效果跟只加了个 remark-pangu 差不多啦，还没有写复杂的
    Token 拼接）<br />
    本项目在 MIT 许可证下授权。
    <a href="https://github.com/immccn123/lg-solution-formatter">GitHub</a>
    <br />
    Vite mode: <code>{{ MODE }}</code> | Commit Hash:
    <code>{{ COMMIT_HASH.substring(0, 7) }}</code>
  </p>
</template>

<style scoped></style>
