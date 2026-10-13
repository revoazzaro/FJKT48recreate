<script setup>
const route = useRoute();
const searchInput = ref("");

const currentPage = ref(parseInt(route.query.page || "1"));

const { data: songResponse, pending } = await useFetch("/api/songs", {
  query: {
    q: searchInput,
    page: currentPage,
    limit: 24,
  },
  watch: [searchInput, currentPage],
});

const changePage = (pageNumber) => {
  if (pageNumber < 1 || pageNumber > songResponse.value?.meta?.total_pages)
    return;

  currentPage.value = pageNumber;

  navigateTo({
    query: {
      ...route.query,
      page: pageNumber,
    },
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

watch(searchInput, () => {
  currentPage.value = 1;
  navigateTo({
    query: {
      ...route.query,
      page: 1,
    },
  });
});

watch(
  () => route.query.page,
  (newQueryPage) => {
    if (newQueryPage) {
      currentPage.value = parseInt(newQueryPage);
    }
  },
);
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen">
    <div
      class="flex flex-col w-full mx-auto justify-center lg:pt-10 gap-6 lg:gap-8"
    >
      <div
        class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
      >
        <h1
          class="text-4xl/[130%] lg:text-5xl/[130%] w-fit font-bold bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] text-transparent bg-clip-text"
        >
          Lagu-lagu JKT48
        </h1>
        <div class="flex gap-4 w-full lg:w-auto">
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search..."
            class="border p-2 px-4 rounded-xl w-full text-base lg:w-80 focus:outline-none border-slate-400 bg-white"
          />
        </div>
      </div>

      <div v-if="pending" class="text-neutral-400 py-10 text-center">
        Memuat daftar lagu...
      </div>

      <div
        v-else-if="!songResponse?.data || songResponse.data.length === 0"
        class="text-neutral-500 py-10 text-center"
      >
        Lagu tidak ditemukan.
      </div>

      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            v-for="song in songResponse?.data"
            :key="song.title"
            :href="song.youtube"
            target="_blank"
            class="cursor-pointer rounded-lg hover:shadow-lg transition-all duration-300 bg-white group border border-slate-100"
          >
            <img
              :src="song.image"
              :alt="song.title"
              class="w-full rounded-lg group-hover:rounded-b-none transition-all duration-500 aspect-video object-cover"
            />
            <div class="p-3">
              <h3
                class="font-semibold text-base group-hover:text-primary transition line-clamp-2"
              >
                {{ song.title }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2">{{ song.subtitle }}</p>
            </div>
          </a>
        </div>

        <div v-if="songResponse && songResponse.data">
          <div
            v-if="songResponse.meta && songResponse.meta.total_pages > 1"
            class="flex items-center justify-between gap-4 mt-8 lg:px-14 border-t-2 border-gray-200 pt-8"
          >
            <text
              class="flex flex-row gap-2 font-medium text-base md:text-lg text-black-light"
            >
              <span>Halaman</span>
              <span>{{ currentPage }}</span>
              <span>/</span>
              <span>{{ songResponse.meta.total_pages }}</span>
            </text>

            <div class="flex flex-row gap-3">
              <button
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="flex text-primary items-center disabled:opacity-30"
              >
                <Icon name="mdi:chevron-left" class="size-9 md:size-10" />
              </button>

              <button
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= songResponse.meta.total_pages"
                class="flex text-primary items-center disabled:opacity-30"
              >
                <Icon name="mdi:chevron-right" class="size-9 md:size-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
