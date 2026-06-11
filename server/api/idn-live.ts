export default defineEventHandler(async (event) => {
  try {
    const response: any = await $fetch("https://api.idn.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        
      },
      body: {
        query: 'query SearchLivestream { searchLivestream(query: "", limit: 100) { next_cursor result { slug title image_url view_count playback_url room_identifier status live_at end_at scheduled_at gift_icon_url category { name slug } creator { uuid username name avatar bio_description following_count follower_count is_follow } } }}'
      }
    });

    const data = response?.data?.searchLivestream?.result;

    if (!data || data.length === 0) {
      return { status: true, live_count: 0, data: [] };
    }

    const jkt48Lives = data
      .filter((i: any) => {
        const username = i.creator?.username?.toLowerCase() || '';
        const name = i.creator?.name?.toLowerCase() || '';
        return username.includes('jkt48') || name.includes('jkt48');
      })
      .map((i: any) => {
        return {
          platform: 'idn',
          user: {
            id: i.creator?.uuid,
            name: i.creator?.name,
            username: i.creator?.username,
            avatar: i.creator?.avatar,
          },
          image: i.image_url,
          stream_url: i.playback_url,
          title: i.title,
          slug: i.slug,
          view_count: i.view_count,
          live_at: i.live_at ? new Date(i.live_at).toISOString() : null,
        };
      });

    return {
      status: true,
      live_count: jkt48Lives.length,
      data: jkt48Lives
    };

  } catch (error: any) {
    console.error("Detail Error Terjadi di Server:", {
      message: error.message,
      statusCode: error.statusCode || error.status,
      responseData: error.data
    });

    return createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data Live IDN: ${error.message}`,
    });
  }
});