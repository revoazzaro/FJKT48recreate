export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const roomId = query.room_id;

  if (!roomId) {
    return createError({
      statusCode: 400,
      statusMessage: "room_id wajib diisi",
    });
  }

  try {
    const response: any = await $fetch(
      `https://www.showroom-live.com/api/live/comment_log?room_id=${roomId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        }
      }
    );

    return {
      status: true,
      comments: response?.comment_log || []
    };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil chat Showroom: ${error.message}`,
    });
  }
});