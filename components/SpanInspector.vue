<script lang="ts" setup>
defineProps<{
  span: TraceSpan
}>()
</script>

<template>
  <div class="flex h-full break-all">
    <div class="flex flex-col p-2 w-1/4">
      <div>
        <span class="text-gray-500">
          Name:
        </span>
        <span>
          {{ span.name }}
        </span>
      </div>
      <div>
        <span class="text-gray-500">
          Service:
        </span>
        <span>
          {{ span.service }}
        </span>
      </div>
      <div>
        <span class="text-gray-500">
          Duration:
        </span>
        <span>
          {{ formatDuration(span.duration) }}
        </span>
      </div>
      <div>
        <span class="text-gray-500">
          Start:
        </span>
        <span>
          {{ formatDate(Math.floor(span.start / 1000000)) }}
        </span>
      </div>
      <div>
        <span class="text-gray-500">
          Resource:
        </span>
        <span>
          {{ span.resource }}
        </span>
      </div>
    </div>

    <div class="w-3/4 h-full overflow-auto">
      <div
        v-for="(value, key) in span.meta"
        :key="key"
      >
        <span class="text-gray-500">
          {{ key }}:
        </span>
        <span>
          {{ span.meta[key] }}
        </span>
      </div>
    </div>
  </div>
</template>
