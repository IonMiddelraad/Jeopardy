<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits(['update:modelValue'])

function onToggle(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div>
    <label class="flex items-center cursor-pointer">
      <input type="checkbox" class="sr-only" :checked="modelValue"
        @change="onToggle"/>
      <div class="relative">
        <div class="block w-12 h-7 rounded-full transition-colors duration-300"
          :class="modelValue ? 'bg-green-500' : 'bg-gray-400'"></div>
        <div class="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300"
          :class="{ 'translate-x-5': modelValue }"></div>
      </div>
      <span class="ml-3 text-md font-medium text-gray-700">
        {{ label }}
      </span>
    </label>
  </div>
</template>