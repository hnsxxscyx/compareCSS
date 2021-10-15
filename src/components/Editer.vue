<script setup>
  import * as monaco from "monaco-editor";
  import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
  import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import { ref, onMounted } from "vue";

  const props = defineProps({
    name: String,
  });

  const emit = defineEmits(['codeChange'])

  const editorRef = ref(null);
  if (!window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "json") {
          return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
          return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };
  }
  let editor;
  onMounted(() => {
    editor = monaco.editor.create(editorRef.value, {
      language: "css",
      theme: "vs-dark",
    });
    editor.onDidChangeModelContent((listener) => {
      const value = editor?.getValue();
      emit('codeChange',{value, name: props?.name})
    });
  });
</script>

<template>
  <div ref="editorRef" style="height: 100%"></div>
</template>

<style>
</style>
