export function formatDate(date: number): string {
  const d = new Date(date)
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  const millisecond = d.getMilliseconds()

  return `${d.toLocaleDateString()} ${hour}:${minute}:${second}.${millisecond}`
}

/**
 * Display in the either ns, µs, ms or s
 */
export function formatDuration(durationInNanoSeconds: number) {
  const durationInMicroSeconds = durationInNanoSeconds / 1000
  const durationInMilliSeconds = durationInMicroSeconds / 1000
  const durationInSeconds = durationInMilliSeconds / 1000

  if (durationInSeconds > 1)
    return `${durationInSeconds.toFixed(3)}s`

  if (durationInMilliSeconds > 1)
    return `${durationInMilliSeconds.toFixed(3)}ms`

  if (durationInMicroSeconds > 1)
    return `${durationInMicroSeconds.toFixed(3)}µs`

  return `${durationInNanoSeconds}ns`
}
