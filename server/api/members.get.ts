// server/api/members.get.ts
export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('https://jkt48.com/api/v1/members?lang=id', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      }
    })
    return response
  } catch (error) {
    console.error('Proxy Error:', error)
    return { error: 'Gagal mengambil data' }
  }
})