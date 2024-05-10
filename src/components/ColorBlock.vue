<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  rgb: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div
    class="cs-color-block-container d-flex flex-column align-content-flex-start align-items-center"
  >
    <div class="visualized" :style="{ background: rgb }"></div>
    <div>{{ name }}</div>
    <div>{{ rgb }}</div>
  </div>
</template>
<style>
.cs-color-block-container {
  gap: 1rem;
  min-width: 10rem;
}
.visualized {
  height: 5rem;
  width: 5rem;
}
</style>
