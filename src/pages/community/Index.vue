<template>
    <div>
      <component :is="components[navStore.currentPage]" :key="navStore.currentPage" />
    </div>
  </template>
  
<script setup>
import { onMounted } from 'vue-demi'
import { useNavStore } from 'src/store/nav-store'
import { useQuasar, QSpinnerIos } from 'quasar'

import WelcomePage from 'src/components/Community/WelcomePage.vue'
import SigninPage from 'src/components/Community/SigninPage.vue'
import SignupPage from 'src/components/Community/SignupPage.vue'

import LoginPage from 'src/components/LoginPage.vue'
import KioskPage from 'src/components/KioskPage.vue'

const navStore = useNavStore()
const $q = useQuasar()

const components = {
    WelcomePage, SigninPage, SignupPage, LoginPage, KioskPage
}

onMounted(() => {
  if (navStore.currentPage == '') {
    navStore.currentPage = 'WelcomePage'
  } else if ($q.platform.is.electron) {
    navStore.currentPage = 'LoginPage'
  }
})
</script>
  