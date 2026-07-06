const devLog = (...args: any[]) => {
  if (import.meta.dev) {
    console.log(...args)
  }
}
interface ProxyContext {
  idnWs?: any
  hasJoined?: boolean
  chatRoomId?: string
}

export default defineWebSocketHandler({
  async open(peer) {
    devLog('\n==================================================')
    devLog('[PROXY BACKEND] Browser client terhubung ke Nuxt.')
    devLog('==================================================')

    try {
      const peerWithUrl = peer as any
      const rawUrl = peerWithUrl?.url || peerWithUrl?.request?.url || ''
      const requestUrl = new URL(rawUrl, 'http://localhost')
      const targetSlug = requestUrl.searchParams.get('slug')
      const targetUsername = requestUrl.searchParams.get('username')

      if (!targetSlug) {
        console.error('[PROXY ERROR] Batalkan koneksi: Frontend tidak mengirimkan slug!')
        peer.close(1008, 'Koneksi ditolak: Parameter slug wajib disertakan.')
        return
      }

      devLog(`[PROXY BACKEND] Target Room Slug: ${targetSlug}`)
      if (targetUsername) devLog(`[PROXY BACKEND] Target Username: ${targetUsername}`)

      let chatRoomId = ''
      try {
        const targetUrl = targetUsername 
          ? `https://www.idn.app/${targetUsername.toLowerCase()}/live/${targetSlug}`
          : `https://www.idn.app/embed-player/${targetSlug}`

        devLog(`[PROXY BACKEND] Membaca HTML dari: ${targetUrl}`)
        
        const htmlRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
          }
        })

        if (!htmlRes.ok) throw new Error(`HTTP Error! Status: ${htmlRes.status}`)
        
        const htmlText = await htmlRes.text()
        const regexPattern = /(arn:aws:ivschat:[a-z0-9-]+:\d+:room\/[A-Za-z0-9_-]+)/
        const match = htmlText.match(regexPattern)

        if (match && match[1]) {
          chatRoomId = match[1]
          devLog(`[PROXY SUCCESS] Berhasil mengekstrak ARN: ${chatRoomId}`)
        } else {
          throw new Error('Pola string arn:aws:ivschat:... tidak ditemukan sama sekali di dokumen HTML.')
        }
      } catch (scrapeError: any) {
        console.error('[PROXY ERROR] Gagal melakukan scraping ARN:', scrapeError.message)
        peer.close(1011, 'Gagal mengonfigurasi metadata room streaming.')
        return
      }

      let idnWs: any
      let isCloudflareNative = false
      const context = peer.context as ProxyContext

      try {
        const wsPackageName = 'ws'
        const NodeWebSocket = (await import(wsPackageName)).default
        
        idnWs = new NodeWebSocket('wss://chat.idn.app/', {
          headers: {
            'Origin': 'https://www.idn.app',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Referer': 'https://www.idn.app/'
          }
        })
        devLog('[PROXY BACKEND] Mesin Node.js "ws" aktif (Localhost Mode).')
      } catch (fallbackError) {
        isCloudflareNative = true
        devLog('[PROXY BACKEND] Native Fetch WebSocket aktif (Cloudflare Production Mode).')
        
        const idnRes = await globalThis.fetch('https://chat.idn.app/', {
          headers: {
            'Upgrade': 'websocket',
            'Origin': 'https://www.idn.app',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Referer': 'https://www.idn.app/'
          }
        })

        idnWs = (idnRes as any).webSocket
        if (!idnWs) throw new Error('Platform gagal menginisialisasi Native WebSockets via Fetch')
        
        idnWs.accept() // Buka gerbang koneksi Cloudflare
      }

      context.idnWs = idnWs
      context.hasJoined = false
      context.chatRoomId = chatRoomId

      const handleOpen = () => {
        devLog('[PROXY BACKEND] Terhubung ke IDN! Mengirimkan NICK & USER...')
        const guestId = Math.floor(1000 + Math.random() * 9000)
        idnWs.send(`NICK idn_guest_${guestId}`)
        idnWs.send(`USER idn_guest_${guestId} 0 * :IDN_Web_Client`)
      }

      const handleMessage = (eventOrData: any) => {
        const rawData = eventOrData.data !== undefined ? eventOrData.data : eventOrData
        const frameContent = rawData.toString()
        const lines = frameContent.split(/\r?\n/)

        for (let line of lines) {
          line = line.trim()
          if (!line) continue 

          if (line.startsWith('PING')) {
            const pongMsg = line.replace('PING', 'PONG')
            idnWs.send(pongMsg)
            continue
          }

          if ((line.includes(' 001 ') || line.includes(' 376 ')) && !context.hasJoined) {
            context.hasJoined = true
            devLog(`[PROXY BACKEND] Terautentikasi! Mengirimkan perintah JOIN ke: #${context.chatRoomId}`)
            idnWs.send(`JOIN #${context.chatRoomId}`)
            continue
          }

          if (line.includes('PRIVMSG')) {
            const jsonStartIndex = line.indexOf('{')
            if (jsonStartIndex !== -1) {
              try {
                const jsonString = line.substring(jsonStartIndex)
                const payload = JSON.parse(jsonString)

                if (payload.chat && payload.user) {
                  const cleanComment = {
                    chat_id: payload.chat.id,
                    user: {
                      uuid: payload.user.uuid,
                      username: payload.user.username,
                      name: payload.user.name,
                      avatar: payload.user.avatar_url,
                      level_tier: payload.user.level_tier
                    },
                    message: payload.chat.message,
                    timestamp: Date.now()
                  }
                  peer.send(JSON.stringify(cleanComment))
                  devLog(`[PROXY SUCCESS] Meneruskan chat dari: ${payload.user.name}`)
                }
              } catch (parseError) {
              }
            }
          }
        }
      }

      const handleClose = () => {
        devLog(`[PROXY BACKEND] Server IDN menutup koneksi hulu.`)
        try { peer.close(1000, 'Koneksi hulu selesai') } catch (e) {}
      }

      const handleError = (err: any) => {
        console.error('[PROXY BACKEND ERROR] Terjadi kendala teknis hulu:', err?.message || err)
      }

      if (isCloudflareNative) {
        handleOpen() 
        idnWs.addEventListener('message', handleMessage)
        idnWs.addEventListener('close', handleClose)
        idnWs.addEventListener('error', handleError)
      } else {
        idnWs.on('open', handleOpen)
        idnWs.on('message', handleMessage)
        idnWs.on('close', handleClose)
        idnWs.on('error', handleError)
      }

    } catch (criticalError: any) {
      console.error('[PROXY CRITICAL ERROR] Gagal mengamankan jembatan WebSocket:', criticalError.message || criticalError)
      peer.close(1011, 'Internal Server Error')
    }
  },

  close(peer) {
    const context = peer.context as ProxyContext
    if (context?.idnWs) {
      try {
        context.idnWs.close()
        devLog('[PROXY BACKEND] Browser client terputus. Sesi pipa websocket hulu sukses dibersihkan.')
      } catch (e) {}
    }
  }
})