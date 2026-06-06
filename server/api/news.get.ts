export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page || 1;
  const limit = query.limit || 6;

  try {
    const response = await $fetch(`https://jkt48.com/api/v1/news?lang=id`, {
      method: "GET",
      params: {
        page: page,
        limit: limit,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    return response;
  } catch (error) {
    console.error("Proxy Error:", error);
    return {
      status: false,
      message: "Gagal mengambil data news",
      data: [],
    };
  }
});
