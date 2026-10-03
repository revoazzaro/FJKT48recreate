// server/api/showroom-live.ts
export default defineEventHandler(async (event) => {
  try {
    // 1. Tembak API resmi Showroom untuk list live
    const response: any = await $fetch("https://www.showroom-live.com/api/live/onlives", {
      method: "GET",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      }
    });

    // 2. Satukan semua data live dari tiap genre ke dalam satu array tunggal
    const allLives: any[] = [];
    if (response?.onlives) {
      for (const genre of response.onlives) {
        if (genre.lives && Array.isArray(genre.lives)) {
          allLives.push(...genre.lives);
        }
      }
    }

    if (allLives.length === 0) {
      return { status: true, live_count: 0, data: [] };
    }

    // 💡 SOLUSI UNTUK DATA GANDA: Buat penampung untuk mencatat room_id yang sudah diproses
    const seenRoomIds = new Set<number>();

    // 3. Filter member JKT48 + Saring agar tidak ada ID yang dobel
    const jkt48Lives = allLives
      .filter((room: any) => {
        const roomUrlKey = room.room_url_key?.toLowerCase() || '';
        const mainName = room.main_name?.toLowerCase() || '';
        
        // Cek apakah ini room JKT48
        const isJKT48 = roomUrlKey.includes('jkt48') || mainName.includes('jkt48');
        
        // Cek apakah room_id ini sudah pernah dimasukkan sebelumnya
        const isDuplicate = seenRoomIds.has(room.room_id);

        if (isJKT48 && !isDuplicate) {
          seenRoomIds.add(room.room_id); // Tandai room_id ini sebagai 'sudah ada'
          return true; // Lolos sensor, masukkan ke array hasil
        }

        return false; // Abaikan jika bukan JKT48 atau jika datanya duplikat
      })
      .map((room: any) => {
        const streamUrl = room.streaming_url_list?.[0]?.url || '';

        // 4. Normalisasi output agar 100% identik dengan API IDN Live milikmu
        return {
          platform: 'showroom',
          user: {
            id: String(room.room_id),
            name: room.main_name,
            username: room.room_url_key,
            avatar: room.image_square || room.image,
          },
          image: room.image,
          stream_url: streamUrl,
          title: room.liver_theme_title || `${room.main_name}`,
          slug: room.room_url_key,
          view_count: room.view_num || 0,
          live_at: room.started_at ? new Date(room.started_at * 1000).toISOString() : null,
        };
      });

    return {
      status: true,
      live_count: jkt48Lives.length, // Sekarang live_count akan akurat menghitung per kepala/member
      data: jkt48Lives
    };

  } catch (error: any) {
    console.error("Detail Error Terjadi di Server Showroom:", {
      message: error.message,
      statusCode: error.statusCode || error.status,
      responseData: error.data
    });

    return createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data Live Showroom: ${error.message}`,
    });
  }
});