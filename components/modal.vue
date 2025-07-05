<script setup>
import { Icon } from "@iconify/vue";

defineProps({ show: Boolean, canClose: Boolean, width: String });

defineEmits(["close"]);
</script>

<template>
	<div
		v-if="show"
		class="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50"
		:initial="{ opacity: 0 }"
		:enter="{ opacity: 1 }"
		:leave="{ opacity: 0 }">
		<div
			v-motion-slide-bottom
			class="bg-white rounded-xl shadow-lg relative py-6 px-10 overflow-y-auto"
			:style="{ width: width ? width : '60%', maxHeight: '90vh' }"
			:initial="{ y: -50, opacity: 0 }"
			:animate="{ y: 0, opacity: 1 }"
			:exit="{ y: -50, opacity: 0 }"
			:transition="{ duration: 0.3 }">
			<Icon
				v-if="canClose"
				icon="ion:close"
				width="30"
				height="30"
				@click="$emit('close')"
				class="absolute top-2 right-2 cursor-pointer" />
			<slot />
		</div>
	</div>
</template>

<style lang="css">
.v-enter-active,
.v-leave-active {
	transition: opacity 0.2s;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
