export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  // Sesuaikan interface dengan JSON: data -> result
  interface JKT48NewsResponse {
    status: boolean;
    message: string;
    data: {
      count: string;
      result: {
        title: string;
        content_body: string;
        background_image: string;
        valid_date_from: string;
      }[]
    }
  }

  try {
    // Hapus <><> yang double, cukup satu saja
    const response = await $fetch<JKT48NewsResponse>(`https://jkt48.com/api/v1/news/${slug}?lang=id`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      }
    })

    // Akses melalui response.data.result
    if (response?.data?.result[0]?.content_body) {
      let html = response.data.result[0].content_body
      const proxyUrl = 'https://wsrv.nl/?url='

      // Regex 1: URL Lengkap
      html = html.replace(
        /src="(https?:\/\/jkt48\.com\/[^"]+)"/g, 
        `src="${proxyUrl}$1"`
      )

      // Regex 2: Path Relatif
      html = html.replace(
        /src="\/api\/v1\/([^"]+)"/g, 
        `src="${proxyUrl}https://jkt48.com/api/v1/$1"`
      )

      // Simpan kembali ke objek data
      response.data.result[0].content_body = html
    }

    return response
  } catch (error) {
    console.error('Proxy Error:', error)
    // Kembalikan struktur yang sama agar frontend tidak crash
    return { 
      status: false, 
      message: 'Gagal mengambil data',
      data: { count: "0", result: null } 
    }
  }
})