export interface TraceSpan {
  type: string
  trace_id: string
  span_id: string
  parent_id: string
  name: string
  resource: string
  service: string
  error: number
  start: number
  duration: number
  meta: Partial<{
    '_dd.p.dm': string
    service: string
    version: string
    'runtime-id': string
    'http.url': string
    'http.method': string
    'span.kind': string
    'http.useragent': string
    component: string
    'request.query': string
    'request.variables': string
    'request.operationName': string
    'request.extensions': string
    'out.host': string
    'http.status_code': string
    'tcp.remote.host': string
    'tcp.family': string
    'tcp.local.address': string
    'graphql.execute.operationName': string
    'graphql.execute.document': string
    'graphql.execute.variables': string
    'graphql.execute.result': string
    'graphql.resolver.fieldName': string
    'graphql.resolver.typeName': string
    'graphql.resolver.resultType': string
    'graphql.resolver.args': string
    language: string
  }>
  metrics: Partial<{
    '_dd.agent_psr': number
    '_dd.top_level': number
    '_dd.measured': number
    process_id: number
    '_sampling_priority_v1': number
    'tcp.remote.port': number
    'tcp.local.port': number
    'network.destination.port': number
  }>
}

export interface Trace {
  id: string
  date: number
  service: string
  resource: string
  start: number
  duration: number
  method?: string
  statusCode?: string
  spans: TraceSpan[]
}

export const useTracesStore = defineStore('traces', () => {
  const rawTraces = ref<TraceSpan[][]>([])

  async function fetchTraces() {
    const response = await useFetch('/api/traces')
    rawTraces.value = response.data.value
  }

  fetchTraces()

  const focused = useWindowFocus()

  watch(focused, (value) => {
    if (value)
      fetchTraces()
  })

  const traces = computed(() => rawTraces.value.map((spans) => {
    const [firstSpan] = spans

    return {
      id: firstSpan.trace_id,
      date: Math.floor(firstSpan.start / 1000000),
      service: firstSpan.service,
      resource: firstSpan.resource,
      start: firstSpan.start,
      duration: firstSpan.duration,
      method: firstSpan.meta['http.method'],
      statusCode: firstSpan.meta['http.status_code'],
      spans,
    } satisfies Trace
  }))

  const selectedTraceId = ref<string | null>(null)

  watch(traces, (value) => {
    if (value.length > 0 && selectedTraceId.value === null)
      selectedTraceId.value = value[0].id
  })

  const selectedTrace = computed(() => {
    if (selectedTraceId.value === null)
      return null

    return traces.value.find(trace => trace.id === selectedTraceId.value)
  })

  return {
    traces,
    selectedTraceId,
    selectedTrace,
  }
})
