export default defineEventHandler(async () => {
  const response = await fetch('http://localhost:8126/test/traces')
  return await response.json()
})
