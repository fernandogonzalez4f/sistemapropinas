<script setup lang="ts">
import AddTip from "./components/AddTip.vue";
import DividirPropinas from "./components/DividirPropinas.vue";
import PagarPropinas from "./components/PagarPropinas.vue";
</script>

<template>
  <div>
    <h1>Sistema de Propinas</h1>
    <AddTip />
    <hr />
    <DividirPropinas />
    <hr />
    <PagarPropinas />
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
hr {
  margin: 20px 0;
}
</style>
