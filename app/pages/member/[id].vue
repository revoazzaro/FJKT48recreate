<script setup>
import IconInstagram from "~/components/iconInstagram.vue";
import IconTiktok from "~/components/iconTiktok.vue";
import IconTwitter from "~/components/iconTwitter.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const { data: member, pending, error } = await useFetch(`/api/member/${id}`);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const tabs = [
  {
    id: "All",
    label: "Semua",
  },
  {
    id: "JKT48",
    label: "Member",
  },
  {
    id: "TRAINEE",
    label: "Trainee",
  },
];

const activeType = ref("All");

const zodiacIcon = computed(() => {
  const zodiac = member.value?.data?.horoscope?.toLowerCase() || "";

  if (zodiac === "sagitarius") return "mdi:zodiac-sagittarius";

  return `mdi:zodiac-${zodiac}`;
});

const typeCapitalized = computed(() => {
  const type = member.value?.data?.type;
  if (type === "JKT48_VIRTUAL") return "JKT48V";

  const str = String(type).toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const nickName = computed(() => {
  const type = member.value?.data?.type;
  const nickname = member.value?.data?.nickname;

  return type === "JKT48_VIRTUAL" ? nickname + " JKT48V" : nickname + " JKT48";
});
const dailyVersion = new Date().toISOString().split("T")[0];

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
      <div class="relative w-full">
        <NuxtLink
          v-on:click="goBack"
          class="absolute left-0 gap-2 flex text-black/30 hover:text-primary transition-colors md:ml-4 cursor-pointer"
        >
          <Icon name="mdi:arrow-left" class="text-3xl" />
          <!-- <span class="hidden hover:text-primary"
            >Kembali ke Daftar Member</span -->
        </NuxtLink>
        <div class="flex flex-col">
          <p class="text-center text-base text-black-light">Detail Profil</p>
          <h1
            class="text-4xl/[48px] lg:text-5xl/[62px] -mt-2 font-bold mb-6 text-center bg-[linear-gradient(90deg,#e20514_16.5%,#ff3891_66.5%,#ff8514)] text-transparent bg-clip-text"
          >
            {{ nickName }}
          </h1>
        </div>
      </div>
      <div class="flex flex-col lg:flex-row items-center px-4">
        <div class="w-full justify-center lg:justify-end items-center flex">
          <NuxtImg
            :src="
              'https://wsrv.nl/?url=' +
              member.data.photo_1 +
              '&v=' +
              dailyVersion
            "
            :class="[
              'w-full md:w-[60%] h-full aspect-[3/4] object-cover rounded-3xl border-[6px] shadow-lg lg:mr-10 transition-colors duration-300',
              {
                'border-dream': member.data.type === 'DREAM',
                'border-passion': member.data.type === 'PASSION',
                'border-love': member.data.type === 'LOVE',
                'border-primary/75': !['DREAM', 'PASSION', 'LOVE'].includes(
                  member.data.type,
                ),
              },
            ]"
            placeholder
          />
        </div>
        <div class="w-full mt-6 md:mt-0 text-black-light">
          <!-- <p class="text-base lg:text-lg font-medium mb-1 lg:mb-0 text-left w-full text-black-light">
            {{ typeCapitalized }}
          </p> -->
          <div
            class="flex w-full lg:w-[80%] justify-between items-center pb-2 lg:pb-4 border-b-2 border-gray-300"
          >
            <h1 class="text-3xl lg:text-4xl text-left text-primary font-bold">
              {{ member.data.name }}
            </h1>
            <Icon :name="zodiacIcon" class="text-black-light text-4xl" />
          </div>
          <div class="flex mt-3 lg:mt-6">
            <div class="flex w-40 items-center gap-1">
              <Icon name="mdi:cake-variant" class="text-black-light text-2xl" />
              <p class="text-base font-medium tracking-wide">Tanggal lahir</p>
            </div>
            <p class="text-base font-medium">
              :
              {{ formatDate(member.data.birth_date) }}
            </p>
          </div>
          <div class="flex mt-3">
            <div class="flex w-40 items-center gap-1">
              <Icon name="mdi:water" class="text-black-light text-2xl" />
              <p class="text-base font-medium tracking-wide">Golongan Darah</p>
            </div>
            <p class="text-base font-medium">
              :
              {{ member.data.blood_type || "-" }}
            </p>
          </div>
          <div class="flex mt-3">
            <div class="flex w-40 items-center gap-1">
              <Icon name="mdi:human-female" class="text-black-light text-2xl" />
              <p class="text-base font-medium tracking-wide">Tinggi Badan</p>
            </div>
            <p class="text-base font-medium">
              :
              {{ member.data.body_height + " cm" }}
            </p>
          </div>
          <div class="flex mt-3">
            <div class="flex w-40 items-center gap-1">
              <Icon :name="zodiacIcon" class="text-black-light text-2xl" />
              <p class="text-base font-medium tracking-wide">Zodiac</p>
            </div>
            <p class="text-base font-medium">
              :
              {{ member.data.horoscope }}
            </p>
          </div>
          <div class="flex mt-3">
            <div class="flex w-40 items-center gap-1">
              <Icon
                name="mdi:account-group-outline"
                class="text-black-light text-2xl"
              />
              <p class="text-base font-medium tracking-wide">Tim</p>
            </div>
            <p class="text-base font-medium">
              :
              {{ typeCapitalized }}
            </p>
          </div>
          <div class="flex mt-6 gap-2 md:gap-4 w-full lg:w-[80%]">
            <a
              v-if="member.data.twitter_account"
              :href="`https://x.com/${member.data.twitter_account}`"
              target="_blank"
              class="bg-black py-1 mx-auto w-full text-center rounded-full flex items-center justify-center"
            >
              <IconTwitter class="md:size-[22px]" />
            </a>
            <a
              v-if="member.data.instagram_account"
              :href="`https://instagram.com/${member.data.instagram_account}`"
              target="_blank"
              class="bg-gradient-to-tr from-[#FFD600] via-[#FF0069] to-[#7638FA] py-1 mx-auto w-full flex text-center justify-center rounded-full"
            >
              <IconInstagram class="md:size-8" />
            </a>
            <a
              v-if="member.data.tiktok_account"
              :href="`https://tiktok.com/${member.data.tiktok_account}`"
              target="_blank"
              class="bg-gray-900 py-1 mx-auto w-full flex text-center justify-center rounded-full"
            >
              <IconTiktok class="md:size-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
