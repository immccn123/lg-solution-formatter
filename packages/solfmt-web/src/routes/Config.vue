<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "../store";

const store = useStore();
const { clangEnabled, clangConfig, enabledMathRules } = storeToRefs(store);

const clear = () => localStorage.removeItem("state");

const COMMIT_HASH: string = import.meta.env.VITE_COMMIT_HASH;
const MODE = import.meta.env.MODE;

/**
 * @typedef {Object} RuleConfig
 * @property {RegExp} pattern
 * @property {string | function} replace
 */

const mathReplaceRules: Record<string, { desc: string; group: string }> = {
  "sym/star-to-times": { desc: "* -> \\times (乘号)", group: "sym" },
  "sym/less-equal": { desc: "<= -> \\le (小于等于)", group: "sym" },
  "sym/greater-equal": { desc: ">= -> \\ge (大于等于)", group: "sym" },
  "sym/not-equal": { desc: "!= -> \\neq (不等于)", group: "sym" },
  "sym/double-equal-to-single": {
    desc: "== -> = (不允许双等号)",
    group: "sym",
  },
  "sym/arrow-right-to": { desc: "-> -> \\to (右箭头)", group: "sym" },
  "sym/arrow-left-gets": { desc: "<- -> \\gets (左箭头)", group: "sym" },
  "sym/double-arrow-implies": {
    desc: "=> -> \\Rightarrow (蕴含)",
    group: "sym",
  },

  "fn/gcd": { desc: "gcd -> \\gcd", group: "fn" },
  "fn/min": { desc: "min -> \\min", group: "fn" },
  "fn/max": { desc: "max -> \\max", group: "fn" },
  "fn/log": { desc: "log -> \\log", group: "fn" },
  "fn/lca": { desc: "LCA -> \\operatorname{LCA}", group: "fn" },
  "fn/lcm": { desc: "lcm -> \\operatorname{lcm}", group: "fn" },
  "fn/mex": { desc: "MEX -> \\operatorname{MEX}", group: "fn" },

  "syn/array-to-subscript": {
    desc: "dp[i][j] -> dp_{i,j} (数组转下标)",
    group: "syn",
  },
};

const groupedRules: Record<string, string[]> = {
  sym: [],
  fn: [],
  syn: [],
};

for (const id in mathReplaceRules) {
  const rule = mathReplaceRules[id];
  groupedRules[rule.group].push(id);
}

const groupNames: Record<string, string> = {
  sym: "符号转换规则 (Symbol)",
  fn: "数学函数规则 (Function)",
  syn: "高级语法转换规则 (Syntax)",
};

/**
 * @param {string} id
 * @returns {boolean}
 */
const isRuleEnabled = (id: string): boolean =>
  enabledMathRules.value.includes(id);
/**
 * @param {string} id
 */
const toggleRule = (id: string) => {
  console.log(id, enabledMathRules.value)
  const index = enabledMathRules.value.indexOf(id);
  if (index > -1) {
    enabledMathRules.value.splice(index, 1); // 禁用
  } else {
    enabledMathRules.value.push(id); // 启用
  }
  enabledMathRules.value = enabledMathRules.value;
};
</script>

<template>
  <div data-theme="cupcake">
    <div class="p-3">
      <h1 class="text-2xl inline-block">洛谷题解格式化工具</h1>
      <span> | 选项设置 </span>
        <router-link to="/" class="link link-primary">返回首页</router-link>
    </div>
    <div class="form-control mx-auto container px-3">
      <h2 class="text-xl font-bold mb-4 mt-8">数学公式替换规则</h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="(ids, group) in groupedRules"
          :key="group"
          class="collapse collapse-arrow border"
        >
          <input type="checkbox" />
          <div class="collapse-title text-lg font-medium">
            {{ groupNames[group] ?? "其他规则" }}
            <span class="text-sm ml-2">({{ ids.length }} 条)</span>
          </div>
          <div class="collapse-content p-4">
            <div v-for="id in ids" :key="id" class="form-control">
              <label class="label cursor-pointer p-1">
                <span class="label-text">{{ mathReplaceRules[id].desc }}</span>
                <input
                  type="checkbox"
                  class="toggle toggle-sm"
                  :checked="isRuleEnabled(id)"
                  @change="toggleRule(id)"
                />
              </label>
              <small class="text-xs opacity-50 ml-1">ID: {{ id }}</small>
              <div class="divider my-1"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-5">
        <label class="label cursor-pointer">
          <span class="label-text">启用 clang-format (实验性)</span>
          <input type="checkbox" class="toggle" v-model="clangEnabled" />
        </label>

        <label class="label cursor-pointer" v-if="clangEnabled">
          <span class="label-text">
            clang-format 设置
            <a
              href="https://clang.llvm.org/docs/ClangFormatStyleOptions.html"
              class="link link-primary"
              >帮助</a
            >
          </span>
        </label>
        <textarea
          v-if="clangEnabled"
          v-model="clangConfig"
          class="textarea textarea-bordered w-full border min-h-40 font-['Fira_Code']"
        ></textarea>
      </div>

      <div class="pt-8">
        <button class="btn btn-sm w-full" v-on:click="() => (clear(), store.$reset())">
          重置本地数据
        </button>
      </div>
    </div>

    <p style="text-align: center; font-size: small" class="pt-5">
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
