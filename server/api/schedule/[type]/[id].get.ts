// server/api/schedule/[type]/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const type = getRouterParam(event, "type");

  let remoteUrl = "";

  // Logic pemilihan URL Official JKT48
  switch (type) {
    case "show":
      remoteUrl = `https://jkt48.com/api/v1/theater-shows/${id}`;
      break;
    case "event":
      remoteUrl = `https://jkt48.com/api/v1/events/${id}`;
      break;
    case "exclusive":
      remoteUrl = `https://jkt48.com/api/v1/exclusives/${id}`;
      break;
    default:
      remoteUrl = `https://jkt48.com/api/v1/schedules/${id}`;
  }

  try {
    const data = await $fetch(remoteUrl, {
      params: { lang: "id" },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });
    return data;
  } catch (error) {
    throw createError({ statusCode: 404, message: "Detail tidak ditemukan" });
  }
});
