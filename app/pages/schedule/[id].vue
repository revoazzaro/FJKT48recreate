<script setup lang="ts">

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const type = (route.query.type as string)?.toLowerCase() || "";
const typeU = route.query?.type as string;

const { data: jadwal, pending: pendingJadwal } = await useFetch<any>(
  `/api/schedule/${type}/${id}`,
);

const { data: members, pending: pendingMembers } = await useFetch<any>(
  "/api/members",
  {
    transform: (response: any) => response.data,
  },
);

const scheduleDetail = computed(() => {
  const detail = jadwal.value?.data || {};
  const bdayNames = detail.birthday_member_name || [];

  if (detail.jkt48_member && members.value) {
    return {
      ...detail,
      jkt48_member: detail.jkt48_member.map((m: any) => {
        const match = members.value.find(
          (all: any) => all.jkt48_member_id === m.member_id,
        );
        const isBday = bdayNames.includes(m.name);
        return {
          ...m,
          photo: match?.photo || "",
          nickname: match?.nickname || "",
          isBirthday: isBday,
          memberid: match?.member_id || "",
        };
      }),
    };
  }
  return detail;
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (timeString: string) => {
  if (!timeString) return "-";
  return new Date(timeString)
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
    .replace(".", ":");
};

const getTypeClass = (type: string) => {
  if (!type) return "hidden";
  return "text-sm font-semibold px-2 py-0.5 rounded-md tracking-wide bg-slate-100 text-slate-500 border border-slate-200/50 uppercase";
};

const getMemberTypeClass = (type: string) => {
  if (!type) return "hidden";
  const classes: Record<string, string> = {
    LOVE: "text-love bg-love/5 border-love/20",
    PASSION: "text-passion bg-passion/5 border-passion/20",
    DREAM: "text-dream bg-dream/5 border-dream/20",
  };
  const colorClass =
    classes[type.toUpperCase() as keyof typeof classes] ||
    "text-primary bg-primary/5 border-primary/20";
  return `text-sm font-bold px-2 py-0.5 rounded-md border tracking-wide ${colorClass}`;
};

const purchaseLink = computed(() => {
  const baseUrl = "https://jkt48.com/purchase";
  let path = "";

  switch (typeU?.toUpperCase()) {
    case "SHOW":
      path = "/schedule/show";
      break;
    case "EVENT":
      path = "/schedule/event";
      break;
    case "EXCLUSIVE":
      path = "/exclusive";
      break;
    default:
      path = "/schedule";
  }

  return `${baseUrl}${path}?code=${id}`;
});

const dailyVersion = new Date().toISOString().split("T")[0];

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/schedule");
  }
};

const selectedDate = ref<string | undefined>("");

const uniqueDates = computed(() => {
  const allDates: string[] =
    scheduleDetail.value.session?.map((s: any) => s.date) || [];

  const dates = [...new Set(allDates)].sort((a: string, b: string) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (dates.length > 0 && !selectedDate.value) {
    selectedDate.value = dates[0];
  }

  return dates;
});

const filteredSessions = computed(() => {
  return (
    scheduleDetail.value.session?.filter(
      (s: any) => s.date === selectedDate.value,
    ) || []
  );
});
</script>

<template>
  <div class="px-4 pt-20 pb-8 bg-[#FAFAFA] min-h-screen w-full">
    <div class="flex flex-col w-full mx-auto justify-center lg:pt-10">
      <div
        v-if="pendingJadwal || pendingMembers"
        class="animate-pulse text-center p-20"
      >
        Loading content...
      </div>

      <div v-if="jadwal && !pendingJadwal" class="flex flex-col gap-4">
        <NuxtLink
          v-on:click="goBack"
          class="w-fit gap-2 flex text-black/30 hover:text-primary transition-colors lg:ml-4 cursor-pointer"
        >
          <Icon name="mdi:arrow-left" class="text-3xl" />
        </NuxtLink>

        <div class="w-full lg:w-[75%] justify-center mx-auto">
          <h1
            class="bg-gradient-to-r from-[#e20514] via-[#ff3891] to-[#ff8514] bg-clip-text text-transparent text-4xl/[125%] lg:text-5xl/[130%] font-bold mb-2"
          >
            {{ scheduleDetail.title }}
          </h1>

          <DetailExclusive
            v-if="typeU === 'EXCLUSIVE'"
            class="flex flex-col gap-2 mb-3"
          >
            <div class="flex items-center gap-2 mb-5">
              <p :class="getTypeClass(typeU)">{{ typeU }}</p>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex justify-center">
                <NuxtImg
                  v-if="
                    scheduleDetail.thumbnail_image || scheduleDetail.preview_image
                  "
                  :src="
                    'https://wsrv.nl/?url=' + scheduleDetail.thumbnail_image ||
                    scheduleDetail.preview_image
                  "
                  class="w-full h-full md:w-[60%] md:h-[60%] object-cover rounded-xl md:mb-1"
                />
              </div>

              <div
                v-if="scheduleDetail.content_body"
                class="flex flex-col gap-5"
              >
                <div class="flex flex-col items-start">
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Deskripsi:
                  </p>
                  <p
                    class="text-slate-600 text-base lg:text-lg indent-6 md:indent-7 lg:indent-8"
                  >
                    {{ scheduleDetail.content_body }}
                  </p>
                </div>
              </div>

              <div
                v-if="scheduleDetail.sales_period?.length"
                class="flex flex-col"
              >
                <p class="font-medium text-black-light text-lg lg:text-xl">
                  Periode Pembelian:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                  <div
                    v-for="sales in scheduleDetail.sales_period"
                    :key="sales.label"
                    class="flex flex-col items-start"
                  >
                    <p class="font-medium text-black-light text-lg lg:text-xl">
                      {{ sales.label }}
                    </p>
                    <p class="text-slate-600 ml-2 text-base lg:text-lg">
                      {{ formatDate(sales.start_date) }},
                      {{ formatTime(sales.start_date) }} -
                      {{ formatDate(sales.end_date) }},
                      {{ formatTime(sales.end_date) }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="uniqueDates.length" class="flex flex-col gap-4 mt-4">
                <div class="flex gap-3 overflow-x-auto custom-scrollbar">
                  <button
                    v-for="date in uniqueDates"
                    :key="date"
                    @click="selectedDate = date"
                    :class="[
                      'px-6 py-2 rounded-xl text-sm font-bold transition-all border shrink-0',
                      selectedDate === date
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50',
                    ]"
                  >
                    {{ formatDate(date) }}
                  </button>
                </div>

                <div class="flex flex-col gap-4">
                  <div
                    v-for="session in filteredSessions"
                    :key="session.label"
                    class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <h3 class="font-black text-slate-800 uppercase">
                          {{ session.label }}
                        </h3>
                        <p class="text-sm text-slate-400 font-medium">
                          {{
                            session.start_time?.split(":").slice(0, 2).join(":")
                          }}
                          -
                          {{
                            session.end_time?.split(":").slice(0, 2).join(":")
                          }}
                          WIB
                        </p>
                      </div>
                    </div>

                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      <div
                        v-for="lane in session.session_detail"
                        :key="lane.jkt48_member_name"
                        class="p-3 rounded-xl border border-slate-50 bg-slate-50/50 flex justify-between items-center"
                      >
                        <div class="flex flex-col">
                          <span
                            class="text-xs font-bold text-primary uppercase leading-none"
                          >
                            {{ lane.label }}
                          </span>
                          <span class="font-bold text-slate-700 text-base md:text-lg">
                            {{ lane.jkt48_member_name }}
                          </span>
                        </div>

                        <div
                          v-if="lane.available_quota === 0"
                          class="text-xs font-black bg-red-100 text-red-600 px-2 py-1 rounded-md"
                        >
                          HABIS
                        </div>
                        <div
                          v-else
                          class="text-xs md:text-sm font-bold text-slate-400"
                        >
                          Sisa: 
                          <span class="text-slate-800">{{
                            lane.available_quota
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DetailExclusive>

          <DetailShow v-else class="flex flex-col gap-2 mb-3">
            <NuxtImg
              v-if="scheduleDetail.background_image"
              :src="'https://wsrv.nl/?url=' + scheduleDetail.background_image"
              class="w-full h-full object-cover rounded-3xl md:mb-1"
            />

            <div class="flex items-center gap-2 mb-5">
              <p :class="getTypeClass(typeU)">{{ typeU }}</p>
              <div
                v-if="scheduleDetail.birthday_member"
                class="flex items-center gap-0.5 px-2 py-0.5 rounded-md border border-gray-100 bg-white text-gray-600 font-semibold shadow-sm"
              >
                <Icon
                  name="mdi:cake-variant-outline"
                  class="text-sm font-semibold"
                />
                <p class="text-sm tracking-wide">
                  {{ scheduleDetail.birthday_member }}
                </p>
              </div>
              <p :class="getMemberTypeClass(scheduleDetail.jkt48_member_type)">
                {{ scheduleDetail.jkt48_member_type }}
              </p>
            </div>

            <div class="flex flex-col gap-6 lg:gap-8">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="flex flex-col items-start md:items-center">
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Tanggal Show:
                  </p>
                  <p class="text-slate-600 text-base lg:text-lg">
                    {{ formatDate(scheduleDetail.date) }}
                  </p>
                </div>
                <div
                  v-if="scheduleDetail.start_time"
                  class="flex flex-col items-start md:items-center"
                >
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Waktu Show:
                  </p>
                  <p class="text-slate-600 text-base lg:text-lg">
                    {{ scheduleDetail.start_time }} -
                    {{ scheduleDetail.end_time }} WIB
                  </p>
                </div>
                <div
                  v-for="birthday in scheduleDetail.birthday_member_name"
                  class="flex flex-col items-start md:items-center"
                >
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Ulang Tahun:
                  </p>
                  <p class="text-slate-600 text-base lg:text-lg">
                    {{ birthday }}
                  </p>
                </div>
              </div>

              <div
                v-if="scheduleDetail.content_body"
                class="flex flex-col gap-5"
              >
                <div class="flex flex-col items-start">
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Deskripsi Show:
                  </p>
                  <!-- <p
                    class="text-slate-600 text-base lg:text-lg indent-6 md:indent-7 lg:indent-8"
                  >
                    {{ scheduleDetail.content_body }}
                  </p> -->
                  <div
                    v-html="scheduleDetail.content_body"
                    class="text-slate-600 text-base lg:text-lg indent-6 md:indent-7 lg:indent-8"
                  ></div>
                </div>
              </div>

              <div
                v-if="scheduleDetail.jkt48_member?.length"
                class="flex flex-col gap-4"
              >
                <p class="font-medium text-black-light text-lg lg:text-xl">
                  Member yang Tampil:
                </p>

                <div
                  class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
                >
                  <div
                    v-for="member in scheduleDetail.jkt48_member"
                    :key="member.member_id"
                    class="flex flex-col items-center gap-2"
                  >
                    <NuxtLink
                      :to="`/member/${member.member_id}`"
                      :class="[
                        'w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden',
                        member.isBirthday
                          ? 'border-yellow-400 scale-105 border-[3px]'
                          : 'border-slate-200 border-2',
                      ]"
                    >
                      <NuxtImg
                        v-if="member.photo"
                        :src="
                          'https://wsrv.nl/?url=' +
                          member.photo +
                          '&v=' +
                          dailyVersion
                        "
                        class="w-full h-full object-cover object-top"
                        placeholder
                      />
                    </NuxtLink>

                    <div class="text-center">
                      <p
                        class="text-sm lg:text-base font-bold text-slate-800 leading-tight"
                      >
                        {{ member.nickname || member.name.split(" ")[0] }}
                      </p>
                      <p class="text-xs font-semibold text-slate-400">
                        {{ member.type }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="scheduleDetail.sales_period?.length"
                class="flex flex-col"
              >
                <p class="font-medium text-black-light text-lg lg:text-xl">
                  Periode Pembelian Tiket:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                  <div
                    v-for="sales in scheduleDetail.sales_period"
                    :key="sales.label"
                    class="flex flex-col items-start"
                  >
                    <p class="font-medium text-black-light text-lg lg:text-xl">
                      {{ sales.label }}
                    </p>
                    <p class="text-slate-600 ml-2 text-base lg:text-lg">
                      {{ formatDate(sales.start_date) }},
                      {{ formatTime(sales.start_date) }} -
                      {{ formatDate(sales.end_date) }},
                      {{ formatTime(sales.end_date) }}
                    </p>
                    <div
                      v-for="salesPricing in sales.pricing"
                      :key="salesPricing.label"
                      class="flex gap-2 ml-2"
                    >
                      <p class="text-black-light text-base lg:text-lg/5">
                        Kuota Tiket: {{ salesPricing.quota }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="scheduleDetail.reception_start_time"
                class="flex flex-col gap-5"
              >
                <div class="flex flex-col items-start">
                  <p class="font-medium text-black-light text-lg lg:text-xl">
                    Waktu Penukaran Tiket:
                  </p>
                  <p class="text-slate-600 text-base lg:text-lg">
                    {{
                      scheduleDetail.reception_start_time
                        ?.split(":")
                        .slice(0, 2)
                        .join(":")
                    }}
                    WIB
                  </p>
                </div>
                <div class="flex w-full">
                  <a
                    :href="purchaseLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex w-full justify-center"
                  >
                    <button
                      class="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center w-full md:w-[70%] lg:w-[40%] items-center gap-2 group"
                    >
                      <Icon
                        name="mdi:ticket-confirmation"
                        class="text-xl group-hover:rotate-12 transition-transform"
                      />
                      Beli Tiket di Official Website JKT48
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </DetailShow>
        </div>
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