<template>
    <div>
      <component :is="components[navStore.currentPage]" :key="navStore.currentPage" />
    </div>
  </template>
  
<script setup>
import { onMounted } from 'vue-demi'
import { useNavStore } from 'src/store/nav-store'

import WelcomePage from 'src/components/Community/WelcomePage.vue'
import SigninPage from 'src/components/Community/SigninPage.vue'
import SignupPage from 'src/components/Community/SignupPage.vue'

const navStore = useNavStore()

const components = {
    WelcomePage, SigninPage, SignupPage
}

onMounted(() => {
    navStore.currentPage = 'WelcomePage'
})
</script>
  