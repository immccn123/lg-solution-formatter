<script setup lang="ts">
import CodeMirror from "vue-codemirror6";

import { basicSetup } from "codemirror";
import { MergeView } from "@codemirror/merge";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

import formatSolution, {
  formatSolutionSync,
} from "@imkdown/lg-solution-formatter";

import { ref, watch } from "vue";
import { EditorState } from "@codemirror/state";

let lastTimeout: number = 0;

const code = ref("");

const showFormatted = ref(false),
  showDone = ref(false);

const mergedEditor = ref<HTMLDivElement | null>(null);

const formatRaw = () => {
  code.value = formatSolutionSync(code.value);

  showDone.value = true;
  clearTimeout(lastTimeout);
  lastTimeout = setTimeout(() => (showDone.value = false), 1000);
};

const formatAndCopy = () => {
  formatRaw();
  window.navigator.clipboard.writeText(code.value);
};

const COMMIT_HASH: string = import.meta.env.VITE_COMMIT_HASH;
const MODE = import.meta.env.MODE;

watch(showFormatted, async () => {
  if (!showFormatted.value) return;
  while (!mergedEditor.value)
    await new Promise((resolve) => setTimeout(resolve, 20));
  new MergeView({
    a: {
      doc: code.value,
      extensions: [
        EditorState.readOnly.of(true),
        basicSetup,
        markdown({ codeLanguages: languages }),
      ],
    },
    b: {
      doc: await formatSolution(code.value),
      extensions: [
        EditorState.readOnly.of(true),
        basicSetup,
        markdown({ codeLanguages: languages }),
      ],
    },
    parent: mergedEditor.value,
  });
});
</script>

<template>
  <div data-theme="cupcake">
    <div class="p-3">
      <h1 class="text-2xl inline-block">洛谷题解格式化工具</h1>
      <span v-if="showFormatted"> | 差异对比</span>
    </div>
    <div class="w-full">
      <div v-if="!showFormatted">
        <div class="border box-border w-full" id="editor">
          <CodeMirror
            basic
            v-model="code"
            :lang="markdown({ codeLanguages: languages })"
          />
        </div>
      </div>
      <div v-else>
        <div id="editor" ref="mergedEditor"></div>
      </div>
    </div>
    <div class="p-3">
      <div class="join">
        <button
          class="btn join-item btn-sm btn-neutral"
          v-on:click="() => (showFormatted = !showFormatted)"
        >
          {{ showFormatted ? "返回" : "格式化并展示差异" }}
        </button>
        <button
          class="btn join-item btn-sm btn-primary w-28"
          v-on:click="formatAndCopy"
          v-if="!showFormatted"
        >
          格式化并复制
        </button>
        <button
          class="btn join-item btn-sm"
          v-on:click="formatRaw"
          v-if="!showFormatted"
        >
          仅格式化
        </button>
      </div>
      <button class="btn btn-outline btn-secondary btn-sm mx-2" v-if="showDone">
        完成
      </button>
      <details>
        <summary>⚠️注意事项</summary>
        <div>
          <ul>
            <li>请注意标题的 # 之后要添加空格，要不然会被转义。</li>
          </ul>
        </div>
      </details>
    </div>
    <p style="text-align: center; font-size: small">
      本项目在 MIT 许可证下授权；本 web 应用在 AGPL v3 或更新版本下授权。
      <a
        href="https://github.com/immccn123/lg-solution-formatter"
        class="link link-primary"
      >
        GitHub
      </a>
      <br />
      Vite mode: <code>{{ MODE }}</code> | Commit Hash:
      <code>{{ COMMIT_HASH.substring(0, 7) }}</code>
    </p>
  </div>
</template>

<style>
#editor {
  height: 80vh;
}

#editor * {
  font-family: "Fira Code", monospace;
}

#editor .cm-editor,
#editor > * {
  height: 100%;
  border: none;
}

#editor .cm-scroller {
  overflow: auto;
}
</style>
