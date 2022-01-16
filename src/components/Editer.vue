<script setup>
  import * as monaco from "monaco-editor";
  import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
  import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import { ref, onMounted, computed, watch } from "vue";

  const props = defineProps({
    name: String,
    colors: Array,
  });

  const editorInstance = ref();
  let editor;
  let decorationsInstance = []

  const decorations = computed(()=>props.colors.map(item=>{
    return { 
      range: new monaco.Range(item.startLine, 1, item.endLine, 1),
			options: {
				isWholeLine: true,
        className: `color-${item.color}`,
        glyphMarginClassName: `color-${item.color}`,
				// linesDecorationsClassName: `color-${item.color}`,
        // inlineClassName: 
			}
    }
  }))

  watch(()=>props.colors,()=>{
      decorationsInstance = editor.deltaDecorations(decorationsInstance, decorations.value);
  })



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
.color-green{
  background: green;
}
.color-yellow{
  background: yellow;
}
.color-red{
  background: red;
}
</style>
