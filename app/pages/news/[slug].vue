<script setup>
const route = useRoute();
const router = useRouter();
const slug = route.params.slug;

const { data: berita, pending, error } = await useFetch(`/api/news/${slug}`);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// const isLandscape = ref(true);

// const onImageLoad = (event) => {
//   if (event?.target?.naturalWidth) {
//     isLandscape.value = event.target.naturalWidth > event.target.naturalHeight;
//     console.log('Image loaded. Orientasi:', isLandscape.value ? 'Landscape' : 'Portrait')
//   }
// }

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/news");
  }
};
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen w-full">
    <div class="flex flex-col w-full mx-auto justify-center lg:pt-10">
      <div v-if="pending" class="animate-pulse">Loading content...</div>

      <div v-else-if="berita" class="flex flex-col gap-4">
        <NuxtLink
          v-on:click="goBack"
          class="w-fit gap-2 flex text-black/30 hover:text-primary transition-colors md:ml-4 cursor-pointer"
        >
          <Icon name="mdi:arrow-left" class="text-3xl" />
          <!-- <span class="hidden hover:text-primary"
            >Kembali ke Daftar Berita</span
          > -->
        </NuxtLink>
        <div class="w-full lg:w-[75%] justify-center mx-auto">
          <h1
            class="bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] bg-clip-text text-transparent text-3xl lg:text-4xl/[45px] font-bold mb-4"
          >
            {{ berita.data.result[0].title }}
          </h1>
          <div class="flex flex-col gap-2 mb-3">
            <NuxtImg
              v-if="berita?.data?.result[0]?.background_image"
              :src="
                'https://wsrv.nl/?url=' + berita.data.result[0].background_image
              "
              class="w-full h-full object-cover rounded-3xl md:mb-1"
            />
            <div class="flex items-center gap-1">
              <p
                class="text-xs md:text-sm text-black-light font-medium bg-secondary px-2 py-1 rounded-full"
              >
                {{ berita.data.result[0].category }}
              </p>
              <p class="text-xs md:text-base text-black-light font-medium">
                {{ formatDate(berita.data.result[0].valid_date_from) }}
              </p>
            </div>
          </div>
          <div v-html="berita.data.result[0].content_body" class=""></div>
        </div>
      </div>
    </div>
  </div>
</template>
