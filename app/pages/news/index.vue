<script setup>
const route = useRoute();
const router = useRouter();
const currentPage = ref(parseInt(route.query.page) || 1);

const {
  data: newsData,
  pending,
  error,
} = await useFetch("/api/news", {
  query: {
    page: currentPage,
    limit: 6,
  },
  watch: [currentPage],
  key: `news-page-${currentPage.value}`,
  transform: (res) => {
    return {
      list: res.data || [],
      meta: res._meta || { total_page: 1 },
    };
  },
});

const goToPage = (page) => {
  if (newsData.value && page >= 1 && page <= newsData.value.meta.total_page) {
    currentPage.value = page;
    router.push({ query: { page } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// const featuredNews = computed(() => {
//   return currentPage.value === 1 && newsData.value?.list?.length > 0
//     ? newsData.value.list[0]
//     : null;
// });

// const regularNews = computed(() => {
//   if (!newsData.value?.list) return [];
//   return currentPage.value === 1
//     ? newsData.value.list.slice(1)
//     : newsData.value.list;
// });

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen">
    <div class="flex flex-col w-full mx-auto justify-center lg:pt-10 lg:px-14">
      <h1
        class="text-4xl lg:text-5xl w-fit font-bold mb-10 bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] text-transparent bg-clip-text"
      >
        Berita Terbaru
      </h1>

      <div v-if="pending" class="space-y-4">
        <div
          v-for="n in 5"
          :key="n"
          class="h-24 bg-gray-100 animate-pulse rounded-lg"
        ></div>
      </div>

      <!-- <div v-if="featuredNews" class="w-full mb-8 md:mb-10">
        <NuxtLink
          :to="'/news/' + featuredNews.link"
          class="w-full flex flex-col lg:flex-row gap-2 md:gap-4 cursor-pointer group transition-all duration-300 py-4"
        >
          <img
            :src="'https://wsrv.nl/?url=' + featuredNews.background_image"
            :class="[
              'lg:w-[60%] w-full h-full object-cover rounded-3xl group-hover:rounded-r-none transition-all duration-300',
              featuredNews.background_image === null ? 'hidden' : 'block',
            ]"
            alt="JKT48"
          />
          <div class="flex flex-col gap-1 md:gap-3">
            <div class="flex items-center gap-1 md:gap-2">
              <p
                class="text-sm md:text-base text-black-light font-normal bg-secondary px-4 py-1 rounded-full"
              >
                {{ featuredNews.category }}
              </p>
              <p
                class="text-base md:text-lg lg:text-base text-black-light font-medium"
              >
                {{ formatDate(featuredNews.valid_date_from) }}
              </p>
            </div>
            <h2
              class="font-semibold text-xl md:text-3xl px-2 group-hover:text-primary transition-colors duration-150"
            >
              {{ featuredNews.title }}
            </h2>
          </div>
        </NuxtLink>
      </div> -->

      <div
        class="grid grid-flow-row lg:grid-cols-2 gap-5 md:gap-7 lg:gap-8 border-b-2 border-gray-200 pb-8"
      >
        <NuxtLink
          :to="'/news/' + item.link"
          v-for="item in newsData.list"
          :key="item.news_id"
          class="flex group gap-2 md:gap-4 cursor-pointer mb-5 md:mb-7 lg:mb-8"
        >
          <img
            :src="item.background_image ? 'https://wsrv.nl/?url=' + item.background_image : 'https://wsrv.nl/?url=https://jkt48.com/api/v1/storages/media/news/migrated/jkt48logo.jpg'"
            class="w-[30%] h-full aspect-[4/4] object-cover rounded-xl text-lg"
            alt="JKT48-image"
          />
          <div class="flex flex-col gap-2 w-full bg-yelow-400">
            <div class="flex items-center gap-1">
              <p
                class="text-xs md:text-sm text-black-light font-medium bg-secondary px-2 py-1 rounded-full"
              >
                {{ item.category }}
              </p>
              <p class="text-sm md:text-base text-black-light font-medium">
                {{ formatDate(item.valid_date_from) }}
              </p>
            </div>
            <h2
              class="font-bold text-base md:text-xl group-hover:text-primary transition-colors duration-150 line-clamp-3 md:line-clamp-5 lg:line-clamp-4"
            >
              {{ item.title }}
            </h2>
          </div>
        </NuxtLink>
      </div>

      <div v-if="newsData && newsData.list">
        <div
          v-if="newsData.meta"
          class="flex items-center justify-between gap-4 mt-8"
        >
          <text
            class="flex flex-row gap-2 font-medium text-base md:text-lg text-black-light"
          >
            <span>Halaman</span>
            <span>{{ currentPage }}</span>
            <span>/</span>
            <span>{{ newsData.meta.total_page }}</span>
          </text>
          <div class="flex flex-row gap-3">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="flex text-primary items-center disabled:opacity-30"
            >
              <Icon name="mdi:chevron-left" class="size-9 md:size-10" />
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= newsData.meta.total_page"
              class="flex text-primary items-center disabled:opacity-30"
            >
              <Icon name="mdi:chevron-right" class="size-9 md:size-10" />
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="error" class="text-red-500">
        Gagal memuat berita. Silakan coba lagi nanti.
      </div>
    </div>
  </div>
</template>
