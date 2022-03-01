<script setup>
  import * as monaco from "monaco-editor";
  import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
  import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
  import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
  import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
  import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
  import { ref, onMounted, computed, watch } from "vue";
  import {
    generateNodesListLineColor,
    getSyntaxErrorColors,
  } from "../helper/lineColor";
  const props = defineProps({
    name: String,
    nodes: Array,
  });

  let editor;
  let decorationsInstance = [];

  const nodesIsError = computed(() => {
    return !props?.nodes?.[0]?.type;
  });

  const decorations = computed(() => {
    const nodes = props.nodes || [];
    const colors = !nodesIsError.value
      ? generateNodesListLineColor(nodes)
      : getSyntaxErrorColors(nodes);
    return colors.map((item) => {
      return {
        range: new monaco.Range(item.startLine, 1, item.endLine, 1),
        options: {
          isWholeLine: true,
          className: `color-${item.color}`,
          glyphMarginClassName: `color-${item.color}`,
          // linesDecorationsClassName: `color-${item.color}`,
          // inlineClassName:
        },
      };
    });
  });

  const contentList = computed(() => {
    const nodes = props.nodes || [];
    return nodes.map((node) => {
      return {
        text: nodesIsError.value
          ? `line ${node.line}`
          : `line ${
              node.loc.start.line === node.loc.end.line
                ? node.loc.end.line
                : node.loc.start.line + "-" + node.loc.end.line
            }`,
        line: nodesIsError.value ? node.line : node.loc.start.line,
        isError: nodesIsError.value,
      };
    });
  });

  watch(
    () => decorations,
    () => {
      decorationsInstance = editor.deltaDecorations(
        decorationsInstance,
        decorations.value
      );
    },
    {
      deep: true
    }
  );

  const jumpToLine = (line) => {
    editor.revealLineInCenter(line);
  };

  const emit = defineEmits(["codeChange"]);

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
      emit("codeChange", { value, name: props?.name });
    });
  });
</script>

<template>
  <div style="height: 100%">
    <div ref="editorRef" style="height: 100%"></div>
    <div className="content-list" style="max-height: 20vh">
      <p
        v-for="item in contentList"
        :key="item?.text"
        style="cursor: pointer"
        @click="jumpToLine(item.line)"
      >
        {{ item?.text }}
      </p>
    </div>
  </div>
</template>

<style>
  .color-green {
    background: rgba(0, 255, 0, 0.5);
  }
  .color-yellow {
    background: rgba(255, 255, 0, 0.5);
  }
  .color-red {
    background: rgba(255, 0, 0, 0.5);
  }
</style>
