<script setup>
import Hls from "hls.js";

const route = useRoute();
const platformParam = route.params.platform; // 'idn' atau 'showroom'
const usernameParam = route.params.username.toString().toLowerCase();

const videoRef = ref(null);
let hlsInstance = null;

const { data: liveData, pending } = await useFetch("/api/idn-live");

// Cari data member yang sesuai berdasarkan parameter username di URL
const currentLive = computed(() => {
  if (!liveData.value?.data) return null;
  return liveData.value.data.find(
    (item) =>
      item.user.username.toLowerCase() === usernameParam &&
      item.platform === platformParam,
  );
});

// Fungsi untuk menyalakan mesin HLS Player
const initPlayer = () => {
  if (!videoRef.value || !currentLive.value?.stream_url) return;

  const video = videoRef.value;
  const streamUrl = currentLive.value.stream_url;

  // Jika browser mendukung HLS secara native (seperti Safari)
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
  }
  // Jika browser umum (Chrome, Firefox, Edge) menggunakan hls.js
  else if (Hls.isSupported()) {
    if (hlsInstance) hlsInstance.destroy(); // Bersihkan instance lama jika ada

    hlsInstance = new Hls({
      maxMaxBufferLength: 10, // Optimasi low-latency untuk live streaming
    });
    hlsInstance.loadSource(streamUrl);
    hlsInstance.attachMedia(video);
  }
};

// Jalankan player hanya ketika komponen sudah terpasang di client-side (OnMounted)
onMounted(() => {
  initPlayer();
});

// Bersihkan memory player jika user keluar dari halaman room agar laptop tidak berat
onUnmounted(() => {
  if (hlsInstance) {
    hlsInstance.destroy();
  }
});

const formatRelativeTime = (isoString) => {
  if (!isoString) return "Waktu tidak diketahui";

  const sekarang = new Date();
  const waktuLive = new Date(isoString);

  const selisihMilidetik = sekarang.getTime() - waktuLive.getTime();

  if (selisihMilidetik < 0) return "Baru saja dimulai";

  const totalDetik = Math.floor(selisihMilidetik / 1000);
  const totalMenit = Math.floor(totalDetik / 60);
  const totalJam = Math.floor(totalMenit / 60);

  if (totalDetik < 60) {
    return "Baru saja dimulai";
  } else if (totalMenit < 60) {
    return `${totalMenit} menit yang lalu`;
  } else if (totalJam < 24) {
    return `${totalJam} jam yang lalu`;
  }
};

const IDNLiveLink = computed(() => {
  if (!currentLive.value) return "#";

  const username = currentLive.value.user?.username;
  const slug = currentLive.value.slug;

  return `https://idn.app/${username}/live/${slug}`;
});

const otherLives = computed(() => {
  if (!liveData.value?.data) return [];

  const currentUsername = route.params.username?.toString().toLowerCase();

  return liveData.value.data.filter(
    (live) => live.user.username.toLowerCase() !== currentUsername,
  );
});
</script>

<template>
  <div class="pt-16 pb-8 bg-[#FAFAFA] min-h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:pt-5 lg:px-6">
      <div class="lg:col-span-2">
        <div
          v-if="pending"
          class="aspect-video bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-400"
        >
          Memeriksa status siaran...
        </div>

        <div
          v-else-if="!currentLive"
          class="aspect-video bg-neutral-900 rounded-xl flex flex-col items-center justify-center text-center p-6 border border-neutral-900"
        >
          <p class="text-xl font-bold text-neutral-400 mb-2">
            Member Sedang Offline
          </p>
          <p class="text-sm text-neutral-600">
            Siaran telah berakhir atau URL tidak valid.
          </p>
          <NuxtLink
            to="/live"
            class="mt-4 bg-red-600 hover:bg-red-700 text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Cari Live Lain
          </NuxtLink>
        </div>

        <div v-else class="">
          <div
            class="bg-black overflow-hidden aspect-auto shadow-2xl border border-neutral-900 relative group lg:rounded-lg"
          >
            <video
              ref="videoRef"
              controls
              autoplay
              playsinline
              class="h-full w-full object-cover md:object-contain lg:aspect-video"
            ></video>
          </div>

          <div class="flex flex-col gap-5 px-6 lg:px-0">
            <div class="flex flex-col mt-1">
              <h1 class="text-2xl font-bold mt-4 line-clamp-2">
                {{ currentLive.title }}
              </h1>

              <div class="flex items-center gap-1.5 mt-2">
                <p class="text-base font-medium text-neutral-600">
                  {{ currentLive.view_count }} Penonton
                </p>
                -
                <p class="text-base font-medium text-neutral-600">
                  {{ formatRelativeTime(currentLive.live_at) }}
                </p>
              </div>
            </div>

            <div
              class="flex flex-wrap items-center justify-between lg:justify-start gap-4 lg:gap-6 mt-2"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="currentLive.user.avatar"
                  alt="Avatar"
                  class="w-14 h-14 rounded-full border border-neutral-800 object-cover"
                />
                <div>
                  <h2 class="font-bold text-xl flex items-center gap-1.5">
                    {{ currentLive.user.name }}
                  </h2>
                  <p class="text-sm text-neutral-400">
                    @{{ currentLive.user.username }}
                  </p>
                </div>
              </div>

              <a
                :href="IDNLiveLink"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-primary text-white text-base lg:text-lg font-bold px-2.5 py-1 rounded-md tracking-wider uppercase"
              >
                {{ currentLive.platform }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 px-6 lg:px-0">
        <div>
          <!-- Judul Section -->
          <h1
            class="font-bold text-lg lg:text-xl text-neutral-400 border-b border-neutral-800 pb-2 mb-4"
          >
            Live lainnya
          </h1>

          <div
            v-if="otherLives.length > 0"
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-6"
          >
            <NuxtLink
              v-for="live in otherLives"
              :key="live.user.id"
              :to="`/live/${live.platform}/${live.user.username.toLowerCase()}`"
              class="group block bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden md:hover:ring-2 md:hover:ring-primary transition-all duration-200"
            >
              <div class="relative bg-white">
                <img
                  :src="live.image"
                  alt="Live Thumbnail"
                  class="w-full h-full object-cover"
                />

                <span
                  class="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded shadow"
                >
                  LIVE
                </span>
                <span
                  class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded backdrop-blur"
                >
                  {{ live.view_count }} Penonton
                </span>
                <span
                  class="absolute top-2 right-2 bg-secondary text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase"
                >
                  {{ live.platform }}
                </span>
              </div>

              <div class="px-2 py-4 flex gap-2 rounded-b-xl">
                <img
                  :src="live.user.avatar"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full border border-neutral-750 object-cover"
                />
                <div class="overflow-hidden">
                  <h3
                    class="font-semibold text-base text-black line-clamp-1 group-hover:text-primary transition"
                  >
                    {{ live.title || "-" }}
                  </h3>
                  <p class="text-sm text-neutral-400 line-clamp-1 font-medium">
                    {{ live.user.name }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div
            v-else
            class="text-center py-12 border border-dashed border-neutral-800 rounded-xl"
          >
            <p class="text-sm text-neutral-500 font-medium">
              Sedang tidak ada siaran live lainnya saat ini.
            </p>
          </div>
        </div>
        <!-- <div
          class="bg-white border border-neutral-900 p-4 rounded-xl h-[400px] lg:h-[500px] flex flex-col justify-between"
        >
          <p
            class="text-sm font-bold text-neutral-400 border-b border-neutral-800 pb-2"
          >
            Comment
          </p>
          <div class="text-center text-xs text-neutral-600 my-auto">
            Fitur Live Chat atau Informasi Teater dapat disematkan di kolom
            kanan ini di masa mendatang.
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
