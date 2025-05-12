<script setup>
import { Icon } from '@iconify/vue';

defineProps({ show: Boolean })
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-white rounded-xl shadow-lg relative w-full max-w-md py-6 px-10">
      <Icon icon="ion:close" width="30" height="30" @click="$emit('close')"
        class="absolute top-2 right-2 cursor-pointer" />
      <slot />
    </div>
  </div>
</template>
