<script setup>
const sidebarOpen = ref(false);

const toogleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

const route = useRoute();
const isScroll = ref(false);

const pathHome = computed(() => {
  return route.path === "/";
});

const handleScroll = () => {
  isScroll.value = window.scrollY > 30;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 w-full justify-center z-50 transition-all duration-300 ',
      pathHome ? 'bg-transparent' : 'bg-white',
      isScroll
        ? 'backdrop-blur-lg bg-opacity-80 shadow-lg'
        : 'bg-opacity-100 shadow-none',
    ]"
  >
    <div class="flex justify-between py-3 lg:py-4 px-4 md:px-6 lg:px-8">
      <button @click="toogleSidebar" class="md:hidden">
        <Icon
          name="mdi:menu"
          :class="['text-4xl', pathHome ? 'text-white' : 'text-primary']"
        />
      </button>

      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="sidebarOpen"
            class="fixed inset-0 z-[60] backdrop-blur-sm md:backdrop-blur-none"
            @click="closeSidebar"
          ></div>
        </Transition>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
        >
          <aside
            v-if="sidebarOpen"
            class="fixed top-0 left-0 w-[85%] h-full bg-gradient-to-br from-[#76869F] to-[#D14D72] z-[70] shadow-2xl px-6 py-8 border-r border-white/20 md:hidden"
          >
            <div class="flex justify-between items-center mb-16">
              <img
                src="https://jkt48.com/logo-white.png"
                class="h-9 w-auto"
                alt="Logo"
              />
              <button @click="closeSidebar" class="text-secondary">
                <Icon name="mdi:close" class="text-4xl" />
              </button>
            </div>

            <nav class="flex flex-col gap-6 text-lg font-medium text-secondary">
              <NuxtLink
                @click="closeSidebar"
                to="/"
                class="hover:border-b border-gray-200 pb-2"
                >Home</NuxtLink
              >
              <NuxtLink
                @click="closeSidebar"
                to="/member"
                class="hover:border-b border-gray-200 pb-2"
                >Members</NuxtLink
              >
              <NuxtLink
                @click="closeSidebar"
                to="/news"
                class="hover:border-b border-gray-200 pb-2"
                >News</NuxtLink
              >
              <NuxtLink
                @click="closeSidebar"
                to="/schedule"
                class="hover:border-b border-gray-200 pb-2"
                >Schedule</NuxtLink
              >
              <NuxtLink
                @click="closeSidebar"
                to="/live"
                class="hover:border-b border-gray-200 pb-2"
                >Live</NuxtLink
              >

              <!-- <div class="mt-4 pt-6 border-t border-gray-200 flex gap-4">
                <button @click="setLocale('id')" class="text-xs">ID</button>
                <button @click="setLocale('jp')" class="text-xs">JP</button>
              </div> -->
            </nav>
          </aside>
        </Transition>
      </Teleport>

      <a href="/"
        ><!-- Logo Putih jika berada di Home -->
        <NuxtImg
          v-if="pathHome"
          src="https://jkt48.com/logo-white.png"
          class="max-w-20 md:max-w-28 lg:w-36 hidden md:block"
          alt="Logo-JKT48-White" />

        <!-- Logo Merah jika di luar Home (Ukurannya bisa diset berbeda) -->
        <NuxtImg
          v-else
          src="https://jkt48.com/logo-red.png"
          class="max-w-16 md:max-w-24 lg:max-w-28 hidden md:block"
          alt="Logo-JKT48-Red"
      /></a>
      <div>
        <ul
          :class="[
            'hidden md:flex space-x-8 h-full items-center text-base lg:text-lg font-medium',
            pathHome ? 'text-white/60' : 'text-black-light',
          ]"
        >
          <li>
            <NuxtLink
              to="/"
              :class="[
                'relative cursor-pointer group transition-colors pb-1',
                pathHome ? 'hover:text-white' : 'hover:text-primary',
              ]"
              >Home
              <span
                :class="[
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                  pathHome ? 'bg-white' : 'bg-primary',
                ]"
              ></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/member"
              :class="[
                'relative cursor-pointer group transition-colors pb-1',
                pathHome ? 'hover:text-white' : 'hover:text-primary',
              ]"
              >Members
              <span
                :class="[
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                  pathHome ? 'bg-white' : 'bg-primary',
                ]"
              ></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/news"
              :class="[
                'relative cursor-pointer group transition-colors pb-1',
                pathHome ? 'hover:text-white' : 'hover:text-primary',
              ]"
              >News
              <span
                :class="[
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                  pathHome ? 'bg-white' : 'bg-primary',
                ]"
              ></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/schedule"
              :class="[
                'relative cursor-pointer group transition-colors pb-1',
                pathHome ? 'hover:text-white' : 'hover:text-primary',
              ]"
              >Schedule
              <span
                :class="[
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                  pathHome ? 'bg-white' : 'bg-primary',
                ]"
              ></span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/live"
              :class="[
                'relative cursor-pointer group transition-colors pb-1',
                pathHome ? 'hover:text-white' : 'hover:text-primary',
              ]"
              >Live
              <span
                :class="[
                  'absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full',
                  pathHome ? 'bg-white' : 'bg-primary',
                ]"
              ></span>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <!-- <div
        class="flex items-center gap-1 bg-black/20 py-1 lg:py-2 px-5 lg:px-6 rounded-full text-base md:text-lg font-medium cursor-pointer"
      >
        <Icon name="mdi:theme-light-dark" class="text-white size-5" />
        <p class="text-white">Dark</p>
      </div> -->
      <a href="/"
        ><NuxtImg
          :src="
            pathHome
              ? 'https://res.cloudinary.com/dlydxsbfj/image/upload/v1780727161/JKT48_FIGHT_LOVE_DREAM_PASSION_vxunb3.webp'
              : 'https://res.cloudinary.com/dlydxsbfj/image/upload/v1780727784/JKT48_FIGHT_LOVE_DREAM_PASSION_RED_ycfrmm.webp'
          "
          alt="Logo-JKT48"
          class="max-w-16 lg:max-w-20 hidden md:block"
      /></a>
    </div>
  </nav>
</template>
