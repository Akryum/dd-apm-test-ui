<script lang="ts" setup>
const props = defineProps<{
  trace: Trace
  selectedSpan: TraceSpan | null
}>()

defineEmits<{
  previewingSpan: [TraceSpan | null]
  'update:selectedSpan': [TraceSpan]
}>()

const sortedSpans = computed(() => props.trace.spans.slice().sort((a, b) => b.duration - a.duration))

const spanDepthMap = computed(() => {
  const result = new Map<TraceSpan, number>()
  for (let i = 0; i < sortedSpans.value.length; i++) {
    const span = sortedSpans.value[i]
    const spanEnd = span.start + span.duration
    let depth = 0
    for (let j = 0; j < i; j++) {
      const other = sortedSpans.value[j]
      const otherEnd = other.start + other.duration
      const notColliding = spanEnd <= other.start || span.start >= otherEnd
      if (!notColliding) {
        // Collision!
        depth = result.get(other)! + 1
      }
    }
    result.set(span, depth)
  }
  return result
})

const groupedSpans = computed(() => {
  const result = new Map<TraceSpan, TraceSpan[]>()
  for (const span of props.trace.spans) {
    const parent = props.trace.spans.find(s => s.span_id === span.parent_id)
    if (parent) {
      if (!result.has(parent))
        result.set(parent, [])

      result.get(parent)!.push(span)
    }
    else {
      if (!result.has(span))
        result.set(span, [])
    }
  }
  return result
})

const groups = computed(() => {
  const result = []
  for (const [rootSpan, children] of groupedSpans.value.entries()) {
    const spans = [rootSpan, ...children].sort((a, b) => b.duration - a.duration)
    result.push({
      spans,
      color: stringToColor(rootSpan.name),
    })
  }
  return result
})

// const groupsWithRelativeDepths = computed(() => {
//   const result: Array<{
//     spansWithDepth: Map<TraceSpan, number>
//     height: number
//     start: number
//     end: number
//     duration: number
//   }> = []

//   for (const [rootSpan, children] of groupedSpans.value.entries()) {
//     const spans = [rootSpan, ...children].sort((a, b) => b.duration - a.duration)
//     const spansWithDepth = new Map()
//     let height = 0
//     let start = Number.POSITIVE_INFINITY
//     let end = 0
//     for (let i = 0; i < spans.length; i++) {
//       const span = spans[i]
//       const spanEnd = span.start + span.duration
//       let depth = 0
//       for (let j = 0; j < i; j++) {
//         const other = spans[j]
//         const otherEnd = other.start + other.duration
//         const notColliding = spanEnd <= other.start || span.start >= otherEnd
//         if (!notColliding) {
//           // Collision!
//           depth = spansWithDepth.get(other)! + 1
//         }
//       }
//       spansWithDepth.set(span, depth)
//       if (depth > height)
//         height = depth + 1

//       if (span.start < start)
//         start = span.start
//       if (spanEnd > end)
//         end = spanEnd
//     }

//     result.push({
//       spansWithDepth,
//       height,
//       start,
//       end,
//       duration: end - start,
//     })
//   }

//   return result.sort((a, b) => b.duration - a.duration)
// })

// const groups = computed(() => {
//   const groupsMapToDepth: Map<typeof groupsWithRelativeDepths.value[number], number> = new Map()

//   for (let i = 0; i < groupsWithRelativeDepths.value.length; i++) {
//     const group = groupsWithRelativeDepths.value[i]
//     let depth = 0
//     for (let j = 0; j < i; j++) {
//       const other = groupsWithRelativeDepths.value[j]
//       const notColliding = group.end <= other.start || group.start >= other.end
//       if (!notColliding) {
//         // Collision!
//         depth = groupsMapToDepth.get(other)! + other.height
//       }
//     }
//     groupsMapToDepth.set(group, depth)
//   }

//   return groupsWithRelativeDepths.value.map(group => ({
//     ...group,
//     depth: groupsMapToDepth.get(group)!,
//     color: stringToColor(group.spansWithDepth.keys().next().value.name),
//   }))
// })
</script>

<template>
  <div class="relative mx-4">
    <template
      v-for="group in groups"
      :key="group.start"
    >
      <div
        v-for="span in group.spans"
        :key="span.span_id"
        class="h-[24px] truncate absolute cursor-pointer border border-transparent hover:border-white/50"
        :class="{
          '!border-white': selectedSpan === span,
        }"
        :style="{
          top: `${spanDepthMap.get(span)! * 25}px`,
          // top: `${(group.depth + depth) * 24}px`,
          left: `${(span.start - trace.start) / trace.duration * 100}%`,
          width: `${span.duration / trace.duration * 100}%`,
          backgroundColor: group.color,
        }"
        @mouseenter="$emit('previewingSpan', span)"
        @mouseleave="$emit('previewingSpan', null)"
        @click="$emit('update:selectedSpan', span)"
      >
        {{ span.name }}
      </div>
    </template>
  </div>
</template>
