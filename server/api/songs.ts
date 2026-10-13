import allSongs from '../data/songs.json'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const search = (query.q as string || '').toLowerCase().trim()
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '24')

    let filteredSongs = [...allSongs]

    if (search) {
      filteredSongs = filteredSongs.filter(song => 
        song.title.toLowerCase().includes(search) || 
        song.subtitle.toLowerCase().includes(search)
      )
    }

    const totalItems = filteredSongs.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const paginatedSongs = filteredSongs.slice(startIndex, endIndex)

    return {
      status: true,
      meta: {
        total_songs: totalItems,
        total_pages: totalPages,
        current_page: page,
        limit: limit
      },
      data: paginatedSongs
    }

  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: `Gagal memproses data lagu: ${error.message}`
    })
  }
})