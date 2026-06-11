<script setup>
const typeSchedule = [
  {
    id: "ALL",
    label: "Semua",
  },
  {
    id: "SHOW",
    label: "Show",
  },
  {
    id: "EVENT",
    label: "Event",
  },
];

const route = useRoute();
const router = useRouter();

const month = computed(
  () => parseInt(route.query.month) || new Date().getMonth() + 1,
);
const year = computed(
  () => parseInt(route.query.year) || new Date().getFullYear(),
);
const type = computed(() => route.query.type || "ALL");

const currentYear = new Date().getFullYear();
const startYear = 2011;
const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i,
).reverse();

const handleParamChange = () => {
  router.push({
    query: {
      month: month.value,
      year: year.value,
    },
  });
};

const namaBulan = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const { data: jadwal, pending } = await useFetch("/api/schedule", {
  query: { month, year, type },
});

// const formatDate = (dateString) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString("id-ID", {
//     day: "2-digit",
//     month: "short",
//     // year: "numeric",
//   });
// };

const isYearOpen = ref(false);
const yearRef = ref(null);

const selectedYear = computed(() => parseInt(route.query.year) || currentYear);

const selectYear = (y) => {
  isYearOpen.value = false;
  router.push({
    query: { ...route.query, year: y },
  });
};

if (process.client) {
  window.addEventListener("click", (e) => {
    if (yearRef.value && !yearRef.value.contains(e.target)) {
      isYearOpen.value = false;
    }
    {
      if (typeRef.value && !typeRef.value.contains(e.target)) {
        isTypeOpen.value = false;
      }
    }
  });
}

const isTypeOpen = ref(false);
const typeRef = ref(null);

const selectedType = computed(() => route.query.type || "ALL");

const selectedTypeLabel = computed(() => {
  const found = typeSchedule.find((t) => t.id === selectedType.value);
  return found ? found.label : "Semua";
});

const selectType = (type) => {
  isTypeOpen.value = false;
  router.push({
    query: { ...route.query, type: type.id },
  });
};

const filteredSchedule = computed(() => {
  const originalData = jadwal.value?.data || [];

  if (selectedType.value === "ALL") {
    return { data: originalData };
  } else {
    const filtered = originalData.filter((item) => {
      return item.type === selectedType.value;
    });
    return { data: filtered };
  }
});

const scrollContainer = ref(null);
const monthRefs = ref([]);

const selectMonth = (m) => {
  router.push({ query: { ...route.query, month: m } });
};

const scrollToActiveMonth = () => {
  const activeEl = monthRefs.value[month.value - 1];
  if (activeEl) {
    activeEl.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
};

onMounted(() => {
  setTimeout(scrollToActiveMonth, 500);
});

watch(month, () => {
  scrollToActiveMonth();
});

const getMemberTypeClass = (type) => {
  if (!type) return "hidden";
  const classes = {
    LOVE: "text-love bg-love/5 border-love/20",
    PASSION: "text-passion bg-passion/5 border-passion/20",
    DREAM: "text-dream bg-dream/5 border-dream/20",
  };
  const colorClass =
    classes[type] || "text-primary bg-primary/5 border-primary/20";
  return `text-xs font-bold px-2 py-0.5 rounded-md border tracking-wide ${colorClass}`;
};
const getTypeClass = (type) => {
  if (!type) return "hidden";
  return "text-xs font-semibold px-2 py-0.5 rounded-md tracking-wide bg-slate-100 text-slate-500 border border-slate-200/50 uppercase";
};
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen">
    <div
      class="flex flex-col w-full mx-auto justify-center lg:pt-10 lg:px-14 gap-6 lg:gap-8"
    >
      <div
        class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
      >
        <h1
          class="text-4xl lg:text-5xl w-fit font-bold bg-gradient-to-r from-[#e20514] from-[16.5%] via-[#ff3891] via-[66.5%] to-[#ff8514] text-transparent bg-clip-text"
        >
          Jadwal Terbaru
        </h1>
        <div class="flex gap-4 w-full lg:w-auto">
          <div class="relative" ref="yearRef">
            <button
              @click="isYearOpen = !isYearOpen"
              class="flex items-center gap-2 px-4 py-2 text-base bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 active:scale-95"
            >
              <span class="font-semibold text-black-light">{{
                selectedYear
              }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400 transition-transform"
                :class="{ 'rotate-180': isYearOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition ease-in duration-300"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              name="fade-slide"
            >
              <div
                v-if="isYearOpen"
                class="absolute left-0 mt-2 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 overflow-hidden"
              >
                <div
                  class="text-xs font-bold text-gray-400 uppercase mb-3 px-2"
                >
                  Pilih Tahun
                </div>
                <div
                  class="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  <button
                    v-for="y in years"
                    :key="y"
                    @click="selectYear(y)"
                    class="py-2 text-sm rounded-lg transition-colors"
                    :class="
                      y === selectedYear
                        ? 'bg-primary text-white font-bold'
                        : 'hover:bg-primary/5 hover:text-primary text-gray-600'
                    "
                  >
                    {{ y }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div class="relative" ref="typeRef">
            <button
              @click="isTypeOpen = !isTypeOpen"
              class="flex items-center gap-2 px-4 py-2 text-base bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 active:scale-95"
            >
              <span class="font-semibold text-black-light">{{
                selectedTypeLabel
              }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-black/70 transition-transform"
                :class="{ 'rotate-180': isTypeOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition ease-in duration-300"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              name="fade-slide"
            >
              <div
                v-if="isTypeOpen"
                class="absolute left-0 lg:right-0 lg:left-auto mt-2 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 z-50 overflow-hidden"
              >
                <div
                  class="text-xs font-bold text-gray-400 uppercase mb-3 px-2"
                >
                  Jenis Jadwal
                </div>
                <div
                  class="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  <button
                    v-for="type in typeSchedule"
                    :key="type"
                    @click="selectType(type)"
                    class="py-2 text-sm rounded-lg transition-colors"
                    :class="
                      type.id === selectedType
                        ? 'bg-primary text-white font-bold'
                        : 'hover:bg-primary/5 hover:text-primary text-gray-600'
                    "
                  >
                    {{ type.label }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- <div class="flex items-center gap-3">
        <select
          :value="month"
          @change="
            (e) => {
              router.push({ query: { ...route.query, month: e.target.value } });
            }
          "
          class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none"
        >
          <option v-for="(m, index) in namaBulan" :key="m" :value="index + 1">
            {{ m }}
          </option>
        </select>
      </div> -->

      <div class="flex w-full bg-[#F3F5F8] sticky top-0 z-40 rounded-full">
        <div
          class="flex overflow-x-auto w-full overflow-y-hidden whitespace-nowrap custom-scrollbar items-center"
          ref="scrollContainer"
        >
          <button
            v-for="(bulan, index) in namaBulan"
            :key="bulan"
            :ref="
              (el) => {
                if (index + 1 === month) monthRefs[index] = el;
              }
            "
            @click="selectMonth(index + 1)"
            class="flex w-full text-sm lg:text-base font-semibold transition-all duration-300 relative px-5 py-2 md:px-[18px] lg:px-[33px] rounded-full"
            :class="
              month === index + 1
                ? 'bg-primary text-[#FAFAFA]'
                : 'text-gray-400 hover:text-gray-600'
            "
          >
            {{ bulan }}
            <!-- <div
              v-if="month === index + 1"
              class="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-full"
            ></div> -->
          </button>
        </div>
      </div>

      <div v-if="pending" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="h-24 bg-gray-100 animate-pulse rounded-2xl"
        ></div>
      </div>

      <div
        v-else-if="filteredSchedule?.data"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <NuxtLink
          v-for="item in filteredSchedule.data"
          :key="item.id"
          :to="{
            path: `/schedule/${item.reference_code || item.link}`,
            query: { type: item.type },
          }"
          class="border p-4 rounded-xl shadow-sm items-center flex hover:shadow-md md:hover:translate-x-1 md:hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div class="flex gap-4 w-full items-center">
            <div class="flex flex-col items-center justify-center p-2">
              <p class="text-sm uppercase font-bold text-gray-400">
                {{
                  new Date(item.date).toLocaleDateString("id-ID", {
                    month: "short",
                  })
                }}
              </p>
              <p class="text-2xl font-black text-primary leading-none">
                {{
                  new Date(item.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                  })
                }}
              </p>
            </div>
            <div class="flex flex-col w-full gap-0.5">
              <div class="flex w-full gap-1">
                <p
                  v-if="item.jkt48_member_type"
                  :class="getMemberTypeClass(item.jkt48_member_type)"
                >
                  {{ item.jkt48_member_type }}
                </p>
                <div
                  v-if="item.birthday_member"
                  class="flex items-center gap-0.5 px-2 py-0.5 rounded-md border border-gray-100 bg-white text-gray-600 font-semibold shadow-sm"
                >
                  <Icon
                    name="mdi:cake-variant-outline"
                    class="text-xs font-semibold"
                  />
                  <p class="text-xs tracking-wide">
                    {{ item.birthday_member }}
                  </p>
                </div>
                <p v-if="item.type" :class="getTypeClass(item.type)">
                  {{ item.type }}
                </p>
              </div>
              <p
                class="font-black text-base lg:text-lg leading-tight text-black-light"
              >
                {{ item.title }}
              </p>
              <div
                v-if="item.start_time"
                class="flex gap-1 items-center font-medium"
              >
                <Icon
                  name="mdi:clock-time-three-outline"
                  class="text-gray-500 text-sm"
                />
                <p class="text-xs text-gray-500">
                  {{ item.start_time?.split(":").slice(0, 2).join(":") }} -
                  {{ item.end_time?.split(":").slice(0, 2).join(":") }} WIB
                </p>
                <!-- <p class="text-sm text-gray-500">
                  {{ item.end_time?.split(":").slice(0, 2).join(":") }}
                </p> -->
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div
        v-else
        class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed"
      >
        <p class="text-black font-medium">
          Tidak ada data jadwal untuk periode ini.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
