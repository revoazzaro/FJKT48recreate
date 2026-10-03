<script setup>
const { data: idnLiveData, pending: idnLivePending } =
  await useFetch("/api/idn-live");
const { data: showroomLiveData, pending: showroomLivePending } =
  await useFetch("/api/showroom-live");

const getPlatformBadgeColor = (platform) => {
  return platform === "showroom"
    ? "bg-[#0052CC] text-white" // Warna khas Showroom (Biru)
    : "bg-primary text-white"; // Warna khas IDN Live (Merah)
};
</script>

<template>
  <div class="px-6 pt-20 pb-8 bg-[#FAFAFA] min-h-screen">
    <div class="flex flex-col w-full mx-auto justify-center lg:pt-5">
      <h1
        class="text-4xl lg:text-5xl w-fit font-bold mb-8 bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] text-transparent bg-clip-text"
      >
        Live Stream
      </h1>

      <div
        v-if="
          showroomLiveData?.data &&
          showroomLiveData.data.length === 0 &&
          idnLiveData?.data &&
          idnLiveData.data.length === 0
        "
        class="text-neutral-500 py-24 text-center"
      >
        Tidak ada member yang sedang live saat ini.
      </div>

      <div
        v-if="showroomLiveData?.data && showroomLiveData.data.length > 0"
        :class="[
          idnLiveData?.data && idnLiveData.data.length > 0
            ? 'border-b-2 border-gray-200 pb-4 mb-4'
            : '',
        ]"
      >
        <p class="text-xl font-semibold mb-2">Showroom Live</p>

        <div v-if="showroomLivePending" class="text-neutral-400">
          Memuat data live...
        </div>

        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <NuxtLink
            v-for="live in showroomLiveData.data"
            :key="live.user.id"
            :to="`/live/${live.platform}/${live.user.username.toLowerCase()}`"
            class="group block bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden md:hover:ring-2 md:hover:ring-[#0052CC] transition-all duration-200"
          >
            <div class="relative bg-white">
              <img
                :src="live.image"
                alt="Live Thumbnail"
                class="w-full h-full object-cover aspect-video"
              />

              <span
                class="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded shadow"
              >
                LIVE
              </span>
              <span
                class="absolute hidden lg:block bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded backdrop-blur"
              >
                {{ live.view_count.toLocaleString("id-ID") }} Penonton
              </span>
              <span
                :class="`absolute hidden lg:block top-2 right-2 ${getPlatformBadgeColor(live.platform)} text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase`"
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
                  class="font-semibold text-base text-black line-clamp-1 group-hover:text-[#0052CC] transition"
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
      </div>

      <div v-if="idnLiveData?.data && idnLiveData.data.length > 0">
        <p class="text-xl font-semibold mb-2">IDN Live</p>

        <div v-if="idnLivePending" class="text-neutral-400">
          Memuat data live...
        </div>

        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start"
        >
          <NuxtLink
            v-for="live in idnLiveData.data"
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
                {{ live.view_count.toLocaleString("id-ID") }} Penonton
              </span>
              <span
                :class="`absolute top-2 right-2 ${getPlatformBadgeColor(live.platform)} text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase`"
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
      </div>
    </div>
  </div>
</template>
