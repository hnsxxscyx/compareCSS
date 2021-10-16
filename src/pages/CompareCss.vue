<script setup>
import { ref,watchEffect } from 'vue'
  import Editer from "../components/Editer.vue";
  const codeValues = ref({})

const onCodeChange = ({value,name})=>{
  codeValues.value = {...codeValues.value, name:value};
}
watchEffect(()=>{
  console.log(codeValues.value);
})

</script>

<template>
  <div style="height: 80vh; display: flex">
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="code-1"></Editer>
    </div>
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="code-2"></Editer>
    </div>
  </div>
</template>

<style>
</style>
