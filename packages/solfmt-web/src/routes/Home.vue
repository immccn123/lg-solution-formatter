<script setup lang="ts">
import CodeMirror from "vue-codemirror6";

import { basicSetup } from "codemirror";
import { MergeView } from "@codemirror/merge";
import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

import { formatSolution } from "@imkdown/lg-solution-formatter";

import { ref, watch } from "vue";
import { EditorState } from "@codemirror/state";
import { useStore } from "../store";
import { storeToRefs } from "pinia";

let lastTimeout: any = 0;

const store = useStore();
const refStore = storeToRefs(store);

store.$subscribe((_mutation, state) => {
  localStorage.setItem("state", JSON.stringify(state));
});

const code = refStore.code;

const showFormatted = ref(false),
  formatting = ref(false),
  showDone = ref(false);

const mergedEditor = ref<HTMLDivElement | null>(null);

const formatRaw = async () => {
  formatting.value = true;

  code.value = await formatSolution(code.value, {
    clang: {
      enabled: refStore.clangEnabled.value,
      config: refStore.clangConfig.value,
    },
    rlfConfig: {
      enabledRules: {
        math: refStore.enabledMathRules.value,
      },
    },
  });

  showDone.value = true;
  clearTimeout(lastTimeout);
  lastTimeout = setTimeout(() => (showDone.value = false), 1000);
  formatting.value = false;
};

const formatAndCopy = () => {
  formatRaw();
  window.navigator.clipboard.writeText(code.value);
};

const COMMIT_HASH: string = import.meta.env.VITE_COMMIT_HASH;
const MODE = import.meta.env.MODE;

watch(showFormatted, async () => {
  if (!showFormatted.value) return;
  formatting.value = true;
  while (!mergedEditor.value)
    await new Promise((resolve) => setTimeout(resolve, 20));

  const solution = await formatSolution(code.value, {
    clang: {
      enabled: refStore.clangEnabled.value,
      config: refStore.clangConfig.value,
    },
    rlfConfig: {
      enabledRules: {
        math: refStore.enabledMathRules.value,
      },
    },
  });

  formatting.value = false;

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
      doc: solution,
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
      <span v-else>
        | By
        <a href="https://imken.moe" class="link link-primary">Imken</a>
      </span>
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
          class="btn join-item btn-sm btn-neutral w-36"
          v-on:click="() => (showFormatted = !showFormatted)"
          :disabled="formatting"
        >
          <span
            v-if="formatting"
            class="loading loading-ring loading-md"
          ></span>
          <span v-else>
            {{ showFormatted ? "返回" : "格式化并展示差异" }}
          </span>
        </button>
        <button
          class="btn join-item btn-sm btn-primary w-28"
          v-on:click="formatAndCopy"
          v-if="!showFormatted"
          :disabled="formatting"
        >
          格式化并复制
        </button>
        <button
          class="btn join-item btn-sm"
          v-on:click="formatRaw"
          v-if="!showFormatted"
          :disabled="formatting"
        >
          仅格式化
        </button>
        <router-link to="/config" class="btn join-item btn-sm"
          >选项设置</router-link
        >
      </div>
      <button class="btn btn-outline btn-secondary btn-sm mx-2" v-if="showDone">
        完成
      </button>
    </div>

    <p style="text-align: center; font-size: small">
      本 web 应用在 AGPL v3 或更新版本下授权，本项目的其他部分在 MIT
      许可证下授权。
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
