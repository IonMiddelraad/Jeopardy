<script setup>
import { Icon } from '@iconify/vue';
import { Motion, Presence } from '@motionone/vue';

defineProps({ show: Boolean, canClose: Boolean, width: String })

defineEmits(['close'])
</script>

<template>
  <Presence>
    <Motion v-if="show" tag="div" class="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50"
      :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }">
      <Motion tag="div" class="bg-white rounded-xl shadow-lg relative py-6 px-10 overflow-y-auto"
        :style="{ width: width ? width : '60%', maxHeight: '90vh' }" :initial="{ y: -50, opacity: 0 }" :animate="{ y: 0, opacity: 1 }"
        :exit="{ y: -50, opacity: 0 }" :transition="{ duration: 0.3 }">
        <Icon v-if="canClose" icon="ion:close" width="30" height="30" @click="$emit('close')"
          class="absolute top-2 right-2 cursor-pointer" />
        <slot />
      </Motion>
    </Motion>
  </Presence>
</template>
