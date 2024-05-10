<script setup>
defineEmits(['update:modelValue']);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});
const fieldName = props.name.toLowerCase();
</script>
<template>
  <div class="d-flex flex-column">
    <label :for="fieldName">{{ name }}: {{ modelValue }}%</label>
    <input
      :id="fieldName"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="range"
    />
  </div>
</template>
