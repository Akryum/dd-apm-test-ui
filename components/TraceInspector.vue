<script lang="ts" setup>
const tracesStore = useTracesStore()

const tab = ref<'flamechart' | 'raw'>('flamechart')

const selectedSpan = ref<TraceSpan | null>(null)
const previewingSpan = ref<TraceSpan | null>(null)
</script>

<template>
  <div>
    <div v-if="!tracesStore.selectedTrace" class="flex flex-col gap-4 p-4 items-center justify-center h-full text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="opacity-70"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v7m4-7v4m4-4v9M5 3a2 2 0 0 0-2 2m6-2h1m4 0h1m4 0a2 2 0 0 1 2 2m0 4v1m0 4v1m0 4a2 2 0 0 1-2 2m-5 0h1m-6 0h1m-5 0a2 2 0 0 1-2-2m0-5v1m0-6v1" /></svg>
      <div>No trace selected</div>
    </div>

    <div v-else class="h-full flex flex-col divide-y divide-gray-900">
      <div class="flex">
        <BaseTab
          :selected="tab === 'flamechart'"
          @click="tab = 'flamechart'"
        >
          Flamechart
        </BaseTab>
        <BaseTab
          :selected="tab === 'raw'"
          @click="tab = 'raw'"
        >
          Raw
        </BaseTab>
      </div>
      <template v-if="tab === 'flamechart'">
        <div class="h-1/2 overflow-auto">
          <TraceFlamechart
            v-model:selected-span="selectedSpan"
            :trace="tracesStore.selectedTrace"
            @previewing-span="previewingSpan = $event"
          />
        </div>
        <div class="h-1/2 overflow-auto">
          <SpanInspector
            v-if="previewingSpan ?? selectedSpan"
            :span="(previewingSpan ?? selectedSpan)!"
          />
        </div>
      </template>

      <pre v-if="tab === 'raw'" class="h-full overflow-auto p-2">{{ JSON.stringify(tracesStore.selectedTrace.spans, null, 2) }}</pre>
    </div>
  </div>
</template>
