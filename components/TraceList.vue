<script lang="ts" setup>
const tracesStore = useTracesStore()

function getStatusCodeClass(statusCode: string) {
  if (statusCode.startsWith('2'))
    return 'bg-green-500'
  else if (statusCode.startsWith('4'))
    return 'bg-orange-500'
  else if (statusCode.startsWith('5'))
    return 'bg-red-500'
  else
    return 'bg-gray-500'
}

onKeyStroke('ArrowUp', () => {
  const index = tracesStore.traces.findIndex(trace => trace.id === tracesStore.selectedTraceId)
  if (index === -1)
    tracesStore.selectedTraceId = tracesStore.traces[0]?.id
  else if (index > 0)
    tracesStore.selectedTraceId = tracesStore.traces[index - 1].id
})

onKeyStroke('ArrowDown', () => {
  const index = tracesStore.traces.findIndex(trace => trace.id === tracesStore.selectedTraceId)
  if (index === -1)
    tracesStore.selectedTraceId = tracesStore.traces[tracesStore.traces.length - 1]?.id
  else if (index < tracesStore.traces.length - 1)
    tracesStore.selectedTraceId = tracesStore.traces[index + 1].id
})
</script>

<template>
  <div class="divide-y divide-gray-900 flex flex-col">
    <div class="py-1 flex text-gray-500">
      <div class="px-2 w-[20%] truncate">
        {{ tracesStore.traces.length }} trace{{ tracesStore.traces.length > 1 ? 's' : '' }}
      </div>

      <div class="px-2 w-0 flex-1 truncate">
        Service
      </div>

      <div class="px-2 w-[16%] text-right truncate">
        Duration
      </div>

      <div class="px-2 w-[16%] truncate">
        Method
      </div>

      <div class="px-2 w-[100px] text-center truncate">
        Status
      </div>

      <div class="px-2 w-[100px] text-right truncate">
        Spans
      </div>
    </div>

    <div class="h-full overflow-auto">
      <div
        v-for="trace in tracesStore.traces"
        :key="trace.id"
        class="flex hover:bg-indigo-900/50 cursor-pointer py-1"
        :class="{
          '!bg-indigo-800 text-indigo-200': tracesStore.selectedTraceId === trace.id,
        }"
        @click="tracesStore.selectedTraceId = trace.id"
      >
        <div class="px-2 w-[20%] truncate">
          {{ formatDate(trace.date) }}
        </div>

        <div class="px-2 w-0 flex-1 flex items-center gap-1 truncate">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="opacity-50"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20" /></g></svg>
          {{ trace.service }}
        </div>

        <div class="px-2 w-[16%] text-right truncate">
          {{ formatDuration(trace.duration) }}
        </div>

        <div class="px-2 w-[16%] truncate">
          {{ trace.method }}
        </div>

        <div class="px-2 w-[100px] text-center flex justify-center truncate">
          <div v-if="trace.statusCode" :class="getStatusCodeClass(trace.statusCode)" class="px-1 rounded text-white">
            {{ trace.statusCode }}
          </div>
        </div>

        <div class="px-2 w-[100px] text-right truncate">
          {{ trace.spans.length }}
        </div>
      </div>
    </div>
  </div>
</template>
