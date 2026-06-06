<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  document.querySelectorAll(".reveal-card").forEach((el) => {
    observer.observe(el);
  });
});
interface JKT48Member {
  id: string | number;
  name: string;
  photo: string;
  type: string;
  jkt48_member_id: string;
}

const {
  data: members,
  pending,
  error,
} = await useFetch<JKT48Member[]>("/api/members", {
  transform: (response: any) => response.data,
});

const tabs = [
  {
    id: "All",
    label: "Semua",
  },
  {
    id: "DREAM",
    label: "Dream",
  },
  {
    id: "PASSION",
    label: "Passion",
  },
  {
    id: "LOVE",
    label: "Love",
  },
  {
    id: "TRAINEE",
    label: "Trainee",
  },
  {
    id: "JKT48_VIRTUAL",
    label: "JKT48V",
  },
];

const activeType = ref("All");

const filteredMembers = computed(() => {
  if (activeType.value === "All") {
    return members.value;
  } else {
    return members.value?.filter((member) => member.type === activeType.value);
  }
});

// Tambahkan .split('T')[0] untuk hasil "YYYY-MM-DD"
const dailyVersion = new Date().toISOString().split('T')[0];
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen">
    <div class="flex flex-col w-full mx-auto justify-center lg:pt-10">
      <p class="text-center text-base">Profil</p>
      <h1
        class="text-4xl/[48px] lg:text-5xl/[62px] -mt-3 font-bold mb-6 text-center bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] text-transparent bg-clip-text"
      >
        Member JKT48
      </h1>
      <div class="flex flex-wrap justify-center mb-6 gap-2">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeType = tab.id"
          :class="[
            'py-2 px-7 rounded-full cursor-pointer border border-primary transition-colors duration-150 text-sm md:text-base',
            activeType === tab.id
              ? `bg-primary border-primary text-white ${tab.label === 'Dream' ? 'bg-dream border-dream' : ''}`
              : 'bg-white hover:bg-primary hover:text-white text-primary',
          ]"
        >
          {{ tab.label }}
        </div>
      </div>

      <div
        v-if="pending"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="h-64 bg-gray-200 animate-pulse rounded-xl"
        ></div>
      </div>

      <div v-else-if="error" class="bg-red-100 text-primary p-4 rounded-lg">
        Gagal memuat data member.
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="(member, index) in filteredMembers"
          :key="member.id"
          class="group rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
        >
          <NuxtLink :to="'/member/' + member.jkt48_member_id">
            <div class="relative overflow-hidden aspect-[3/4]">
              <NuxtImg
                :src="'https://wsrv.nl/?url=' + member.photo + '&v=' + dailyVersion"
                class="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                :alt="member.name"
                loading="lazy"
              />
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent h-[30%] md:group-hover:translate-y-24 transition-transform duration-500"
              >
                <h3
                  class="flex p-3 font-bold text-white text-sm tracking-wide h-full items-end text-center justify-center"
                >
                  {{ member.name }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal-card {
  transition:
    opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(30px);
  opacity: 0;
}

.reveal-card.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
