export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Pastikan default value ada jika user akses /api/schedules tanpa query
  const month = query.month || new Date().getMonth() + 1;
  const year = query.year || new Date().getFullYear();
  // const type = query.type || "ALL";

  interface JKT48ScheduleResponse {
    status: boolean;
  }

  try {
    const response = await $fetch<JKT48ScheduleResponse>(
      `https://jkt48.com/api/v1/schedules`,
      {
        params: {
          lang: "id",
          month: month,
          year: year,
          // type: type !== "ALL" ? type : undefined, 
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        },
      },
    );
    return response;
  } catch (error) {
    return { status: false, data: [] };
  }
});
