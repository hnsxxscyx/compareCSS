<script setup>
import { ref,watchEffect } from 'vue'
import {getDiffPropertyOfCss} from '../helper/cssTree'
import {generateNodesListLineColor} from '../helper/lineColor'
  import Editer from "../components/Editer.vue";
  const codeValues = ref({
    'css1': '',
    'css2': ''
  })

const onCodeChange = ({value,name})=>{
  codeValues.value = {...codeValues.value, [name]:`${value}`};
}
const colors = ref();
watchEffect(()=>{
  if(Object.values(codeValues.value).filter(item=>!!item).length>1){
    getDiffPropertyOfCss(codeValues.value).then(res=>{
      colors.value = generateNodesListLineColor(res);
    }).catch(err=>{
      console.log(err);
    })
  }
})

</script>

<template>
  <div style="height: 80vh; display: flex">
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="css1"></Editer>
    </div>
    <div style="flex: 1">
      <Editer @codeChange="onCodeChange" name="css2" :colors="colors"></Editer>
    </div>
  </div>
</template>

<style>
</style>
