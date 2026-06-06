<script setup lang="ts">
import Navbar from './components/navbar.vue';

</script>

<template>
  <div>
    <Navbar />
    <NuxtPage :keepalive="true"/>
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
  font-family: 'PlusJakartaSans';
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
