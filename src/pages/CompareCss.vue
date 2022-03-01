<script setup>
  import { ref, watchEffect } from "vue";
  import { getDiffPropertyOfCss } from "../helper/cssTree";
  import Editer from "../components/Editer.vue";
  const codeValues = ref({
    css1: "",
    css2: "",
  });

  const onCodeChange = ({ value, name }) => {
    codeValues.value = { ...codeValues.value, [name]: `${value}` };
  };
  const nodes1 = ref();
  const nodes2 = ref();
  watchEffect(() => {
    if (Object.values(codeValues.value).filter((item) => !!item).length > 1) {
      getDiffPropertyOfCss(codeValues.value)
        .then((res) => {
          nodes1.value = [];
          nodes2.value = res;

        })
        .catch((err) => {
          nodes1.value = err[0];
          nodes2.value = err[1];
        });
    }
  });
</script>

<template>
  <div style="height: 80vh; display: flex">
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="css1" :nodes="nodes1"></Editer>
    </div>
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="css2" :nodes="nodes2"></Editer>
    </div>
  </div>
</template>

<style>
</style>
