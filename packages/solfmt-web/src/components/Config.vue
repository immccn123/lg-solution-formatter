<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useStore } from "../store";
import { ref, watch } from "vue";

const store = useStore();
const { clangEnabled, clangConfig } = storeToRefs(store);

const model = ref<HTMLDialogElement | null>(null);

const props = defineProps({ open: Number });

watch(props, () => {
  if (props.open) model.value?.showModal();
});

const clear = () => localStorage.removeItem("state");
</script>

<template>
  <dialog ref="model" id="configModel" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">选项设置</h3>
      <div class="form-control">
        <div class="pb-5">
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
              >帮助</a>
            </span>
          </label>
          <textarea
            v-if="clangEnabled"
            v-model="clangConfig"
            class="textarea textarea-bordered w-full border min-h-40 font-['Fira_Code']"
          ></textarea>
        </div>

        <button class="btn btn-sm" v-on:click="() => (clear(), store.$reset())">
          重置本地数据
        </button>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
