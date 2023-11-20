<script lang="ts" setup>
defineProps<{
  selected: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="px-2 py-1 hover:bg-indigo-900/50 relative"
    :class="{
      'text-indigo-400': selected,
    }"
  >
    <slot />

    <div
      class="absolute inset-x-2 bottom-0 h-px bg-indigo-500 transition-all duration-100"
      :class="{
        'scale-x-0': !selected,
      }"
    />
  </button>
</template>
