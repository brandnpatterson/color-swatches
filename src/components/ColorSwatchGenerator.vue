<script setup>
import { onMounted, ref } from 'vue';
import throttle from 'underscore/modules/throttle';

import { generateColorBatch } from '../utils/api';
import Header from './Header.vue';
import ColorBlock from './ColorBlock.vue';
import Loading from './Loading.vue';
import RangeField from './RangeField.vue';
import {
  MAX_HUE,
  THROTTLE_RATE,
  DEFAULT,
  ERROR,
  LOADING,
  STOPPING,
} from '../utils/constants';

const colors = ref({});
const saturation = ref('0');
const lightness = ref('0');
const errorMessage = ref(null);
const status = ref(DEFAULT);

const generateNewBatches = throttle(async (index) => {
  status.value = LOADING;

  if (index === 0) {
    colors.value = {};
  }

  const payload = await generateColorBatch(
    index,
    saturation.value,
    lightness.value
  );

  // stop process if there is an error
  if (payload.error) {
    errorMessage.value = payload.error;
    status.value = ERROR;
    return;
  }

  // stop process if user presses Cancel
  if (status.value === STOPPING) {
    status.value = DEFAULT;
    return;
  }

  // display each color once
  payload.colors.forEach((item) => {
    colors.value[item.name.value] = item.rgb.value;
  });

  // take the previous index and fetch another batch if less than max
  if (payload.index >= MAX_HUE) {
    status.value = DEFAULT;
    return;
  }

  // re-run this function to get a new batch of colors
  generateNewBatches(payload.index);
}, THROTTLE_RATE);

function stopGenerating() {
  colors.value = {};
  status.value = STOPPING;
}
</script>
<template>
  <div
    class="cs-layout d-flex flex-column align-items-center justify-content-center"
  >
    <Header />
    <form class="cs-generator-form" @submit.prevent="generateNewBatches(0)">
      <div class="cs-generator-fields">
        <RangeField
          :disabled="status === LOADING"
          name="Saturation"
          v-model="saturation"
        />
        <RangeField
          :disabled="status === LOADING"
          name="Lightness"
          v-model="lightness"
        />
      </div>
      <div class="text-right">
        <button
          v-if="status === LOADING"
          @click="stopGenerating"
          class="cs-button-cancel"
          type="button"
        >
          Cancel
        </button>
        <button
          :disabled="status === LOADING"
          class="cs-button-submit"
          type="submit"
        >
          Generate
        </button>
      </div>
    </form>
    <div v-if="status === ERROR">
      Error: "{{ errorMessage }}". Please try again.
    </div>
    <Loading v-else-if="status === LOADING" class="cs-loading"></Loading>
    <div class="cs-color-blocks d-flex flex-wrap justify-content-center">
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
