<script setup lang="ts">
import Navbar from "./components/navbar.vue";

useSeoMeta({
  title: "FJKT48 - Portofolio Clone Web Resmi JKT48",
  description:
    "Proyek portofolio fan-made yang mereplikasi situs resmi JKT48 untuk kebutuhan belajar dan eksplorasi frontend.",
  ogTitle: "FJKT48 - Portofolio Clone Web Resmi JKT48",
  ogDescription:
    "Proyek portofolio fan-made yang mereplikasi situs resmi JKT48 untuk kebutuhan belajar dan eksplorasi frontend.",
  ogUrl: "https://jkt48recreate.pages.dev",
  ogType: "website",
});
</script>

<template>
  <div>
    <Navbar />
    <NuxtPage :keepalive="true" />
  </div>
</template>

<style>
@font-face {
  font-family: "PlusJakartaSans";
  src: url("/fonts/PlusJakartaSans-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PlusJakartaSans";
  src: url("/fonts/PlusJakartaSans-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

html {
  font-size: 16px;
}

body {
  font-family: "PlusJakartaSans";
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background: #e1001a;
  border-radius: 10px;
}

::-webkit-scrollbar-button {
  display: none;
}
</style>
