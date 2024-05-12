<script setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
});
const fieldName = props.name.toLowerCase();
</script>
<template>
  <div class="cs-range-field d-flex flex-column">
    <label :for="fieldName">{{ name }}: {{ modelValue }}%</label>
    <input
      :id="fieldName"
      :disabled="disabled"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      type="range"
    />
  </div>
</template>
<style scoped>
.cs-range-field {
  margin-bottom: 1rem;
}
</style>
