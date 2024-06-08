<template>
  <div class="box">
    <span>
      <input
        type="range"
        min="0"
        max="100"
        v-model="value"
        @input="updateWeight"
        step="10"
      />
    </span>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
const props = defineProps({
  initialValue: Number,
})
const value = ref<number>(props.initialValue || 40)
const emit = defineEmits(['update-weight'])

const updateWeight = () => {
  emit('update-weight', value.value)
}
</script>

<style scoped>
.box {
  padding: 20px 20px 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.box .value {
  font-size: 30px;
  font-weight: 600;
  font-family: sans-serif;
  color: #3498db;
  margin-left: 10px;
}
</style>
