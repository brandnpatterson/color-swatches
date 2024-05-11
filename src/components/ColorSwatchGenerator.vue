<script setup>
import { onMounted, ref } from 'vue';
import throttle from 'underscore/modules/throttle';

import { generateColorBatch } from '../utils/api';
import Header from './Header.vue';
import ColorBlock from './ColorBlock.vue';
import Loading from './Loading.vue';
import RangeField from './RangeField.vue';
import { MAX_HUE, THROTTLE_RATE } from '../utils/constants';

const colors = ref({});
const saturation = ref('0');
const lightness = ref('0');
const loading = ref(false);
const error = ref(null);

const generateNewBatches = throttle(async (index) => {
  loading.value = true;

  if (index === 0) {
    colors.value = {};
  }

  const payload = await generateColorBatch(
    index,
    saturation.value,
    lightness.value
  );

  if (payload.error) {
    error.value = payload.error;
    return;
  }

  // display each color once
  payload.colors.forEach((item) => {
    colors.value[item.name.value] = item.rgb.value;
  });

  // take the previous index and fetch another batch if less than max
  if (payload.index >= MAX_HUE) {
    loading.value = false;
    return;
  }

  generateNewBatches(payload.index);
}, THROTTLE_RATE);
</script>
<template>
  <div
    class="cs-layout d-flex flex-column align-items-center justify-content-center"
  >
    <Header />
    <form class="cs-generator-form" @submit.prevent="generateNewBatches(0)">
      <div class="cs-generator-fields">
        <RangeField name="Saturation" v-model="saturation" />
        <RangeField name="Lightness" v-model="lightness" />
      </div>
      <div class="text-right">
        <button class="cs-button-submit" type="submit">Generate</button>
      </div>
    </form>
    <div v-if="error">Error: "{{ error }}". Please try again.</div>
    <Loading v-else-if="loading" class="cs-loading"></Loading>
    <div
      v-if="Object.keys(colors).length !== 0"
      class="cs-color-blocks d-flex flex-wrap justify-content-center"
    >
      <ColorBlock
        v-for="[name, rgb] in Object.entries(colors)"
        :key="name"
        :name="name"
        :rgb="rgb"
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
  margin-bottom: 4rem;
  width: 24rem;
  max-width: 80vw;
}
.cs-generator-fields {
  margin-bottom: 1rem;
}
.cs-button-submit {
  background-color: hsl(212, 100%, 50%);
  color: white;
}
.cs-button-cancel {
  background-color: none;
  color: hsl(212, 100%, 50%);
  margin-right: 1rem;
}
.cs-loading {
  margin-bottom: 4rem;
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
button {
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  display: inline-block;
  font-size: 16px;
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
