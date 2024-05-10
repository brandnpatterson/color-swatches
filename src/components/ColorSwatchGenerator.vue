<script setup>
import { onMounted, ref } from 'vue';
import throttle from 'underscore/modules/throttle';

import { fetchColor } from '../utils/api';
import Header from './Header.vue';
import ColorBlock from './ColorBlock.vue';
import RangeField from './RangeField.vue';

const requests = ref(0);
const colors = ref([]);
const saturation = ref('100');
const lightness = ref('50');
const errorMsg = ref(null);

const THROTTLE_RATE = 1000;

const generateColorSwatch = throttle(async () => {
  colors.value = [];
  requests.value = 0;

  for (let hue = 0; hue < 360; hue++) {
    const color = await fetchColor(hue, saturation.value, lightness.value);
    colors.value.push(color);

    if (color.error) {
      errorMsg.value = color.error;
      break;
    }

    requests.value++;
  }
}, THROTTLE_RATE);

onMounted(() => {
  generateColorSwatch();
});
</script>
<template>
  <div
    class="cs-layout d-flex flex-column align-items-center justify-content-center"
  >
    <Header />
    <form class="cs-generator-form" @submit.prevent="generateColorSwatch">
      <div class="cs-generator-fields">
        <RangeField name="Saturation" v-model="saturation" />
        <RangeField name="Lightness" v-model="lightness" />
      </div>
      <div class="text-right">
        <button type="submit">Generate</button>
      </div>
    </form>
    <div v-if="errorMsg">{{ errorMsg }}</div>
    <div v-else class="cs-color-blocks d-flex flex-wrap justify-content-center">
      <ColorBlock
        v-for="color in colors"
        :key="color.rgb.value"
        :name="color.name.value"
        :rgb="color.rgb.value"
      />
    </div>
  </div>
</template>
<style scoped>
.cs-layout {
  margin: 3rem auto;
  width: 100%;
}
.cs-generator-form {
  margin-bottom: 2rem;
  width: 24rem;
  max-width: 80vw;
}
.cs-generator-fields {
  margin-bottom: 1rem;
}
.cs-color-blocks {
  flex-flow: row wrap;
  gap: 2rem;
  min-width: 100vw;
}
</style>
<style>
/* general global styles */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.d-flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.align-items-center {
  align-items: center;
}
.align-content-flex-start {
  align-content: flex-start;
}
.justify-content-center {
  justify-content: center;
}
.text-right {
  text-align: right;
}
</style>
