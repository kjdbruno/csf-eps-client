<template>
  <q-layout view="lHh LpR lFf" class="page">
    <q-header reveal class="q-pt-sm q-pb-sm header" :class="$q.dark.isActive ? 'header-dark' : 'header-light'">
      <q-toolbar>
        <q-btn @click="left = !left" flat round dense icon="menu" class="q-mr-sm" />
        <q-avatar>
          <img src="~assets/logo/logo_only_white.png" />
        </q-avatar>
        <q-toolbar-title>
            Community Engagement Platform
        </q-toolbar-title>
        <q-btn class="q-ma-xs" flat unelevated round dense :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()" />
        <q-btn class="q-ma-xs" flat unelevated round dense :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.isActive = !$q.dark.isActive" />
        <q-btn class="q-ma-xs" round dense flat>
          <q-avatar size="30px">
            <img :src="authStore.avatar">
          </q-avatar>
          <q-menu class="menu" style="border-radius: 25px !important;">
            <q-card class="no-shadow q-pt-md q-pb-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-accent'">
              <q-card-section class="text-center">
                <div class="radius q-pt-lg q-pb-lg" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                  <div class="profile-container q-mb-md">
                    <q-img class="profile-pic" :src="authStore.avatar" />
                  </div>
                  <div class="text-uppercase text-h6">{{ authStore.name }}</div>
                  <div class="text-grey text-caption">{{ authStore.email }}</div>
                  <div class="text-grey text-caption">{{ authStore.position }}</div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-list bordered class="radius" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                  <q-item clickable v-close-popup @click="toMyAccount" class="top-radius">
                    <q-item-section avatar>
                      <q-icon :color="$q.dark.isActive ? 'white' : 'dark'" name="account_circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>My Account</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="toPassword">
                    <q-item-section avatar>
                      <q-icon :color="$q.dark.isActive ? 'white' : 'dark'" name="lock_reset" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Reset Password</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="logout" class="bottom-radius">
                    <q-item-section avatar>
                      <q-icon :color="$q.dark.isActive ? 'white' : 'dark'" name="power_settings_new" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Logout</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer class="left-navigation" show-if-above v-model="left" side="left" elevated >
      <div class="full-height drawer">
        <div class="full-height wrapper" :class="$q.dark.isActive ? 'drawer-dark' : 'drawer-light'">
          <div style="height: calc(100% - 117px); padding:10px;">
            <div class="text-center q-pt-md q-pb-md">
              <q-avatar>
                <img :src="authStore.avatar" style="border: 1px solid #fff;"/>
              </q-avatar>
              <div class="text-bold text-uppercase q-mt-sm">{{ authStore.name }}</div>
              <div class="tex-caption">{{ authStore.role }}</div>
              <div class="text-caption">{{ authStore.office }} {{ authStore.year }}</div>
            </div>
            <q-separator :color="$q.dark.isActive ? 'grey-8' : 'grey-5'" />
            <q-scroll-area style="height:100%;">
              <q-list padding>
                <q-item class="q-ma-sm navigation-item" :class="navStore.currentPage == 'HomePage' ? 'active' : null" clickable v-ripple @click="toHome">
                  <q-item-section avatar>
                      <!-- <q-icon name="dashboard" /> -->
                      <q-icon class="text-dark" size="sm">
                        <img src="~assets/tabs/home.png" />
                      </q-icon>
                  </q-item-section>
                  <q-item-section>Dashboard</q-item-section>
                </q-item>
                <q-item v-if="authStore.isAdmin || authStore.isSup" class="q-ma-sm navigation-item" :class="navStore.currentPage == 'OfficePreferencePage' ? 'active' : (navStore.currentPage == 'AccountPreferencePage' ? 'active' : (navStore.currentPage == 'PositionPreferencePage' ? 'active' : (navStore.currentPage == 'CategoryPreferencePage' ? 'active' : (navStore.currentPage == 'MessagePreferencePage' ? 'active' : (navStore.currentPage == 'OfficeCategoryPreferencePage' ? 'active' : (navStore.currentPage == 'YearPreferencePage' ? 'active' : null))))))" clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon class="text-dark" size="sm">
                      <img src="~assets/tabs/preference.png" />
                    </q-icon>
                  </q-item-section>
                  <q-item-section>Preferences</q-item-section>
                    <q-menu :offset="[-200, -48]" transition-show="jump-down" transition-hide="jump-up">
                      <q-list style="min-width: 100px">
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toYear" v-close-popup>
                          <q-item-section>Year</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toOffice" v-close-popup>
                          <q-item-section>Office</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toPosition" v-close-popup>
                          <q-item-section>Position</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin" dense clickable @click="toAccount" v-close-popup>
                          <q-item-section>Account</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toCategory" v-close-popup>
                          <q-item-section>Category</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toMessage" v-close-popup>
                          <q-item-section>Message</q-item-section>
                        </q-item>
                        <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable @click="toOfficeCategory" v-close-popup>
                          <q-item-section>Office - Category</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-item class="q-ma-sm navigation-item" clickable v-ripple :class="navStore.currentPage == 'FeedbackOverviewPage' ? 'active' : (navStore.currentPage == 'FeedbackDetailPage' ? 'active' : (navStore.currentPage == 'FeedbackEntryPage' ? 'active' : (navStore.currentPage == 'FeedbackKioskPage' ? 'active' : (navStore.currentPage == 'FeedbackKioskDetailPage' ? 'active' : null))))">
                    <q-item-section avatar>
                      <q-icon class="text-dark" size="sm">
                        <img src="~assets/tabs/feedback.png" />
                      </q-icon>
                    </q-item-section>
                    <q-item-section>Feedback</q-item-section>
                      <q-menu :offset="[-200, -48]" transition-show="jump-down" transition-hide="jump-up">
                        <q-list style="min-width: 100px">
                          <q-item dense clickable v-close-popup @click="toFeedbackOverview">
                            <q-item-section>Online</q-item-section>
                          </q-item>
                          <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable v-close-popup @click="toFeedbackKiosk">
                            <q-item-section>Kiosk</q-item-section>
                          </q-item>
                          <q-item v-if="authStore.isAdmin || authStore.isSup" dense clickable v-close-popup @click="toFeedbackEntry">
                            <q-item-section>Entry</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                  </q-item>
                  <q-item exact class="q-ma-sm navigation-item" clickable v-ripple :class="navStore.currentPage == 'DiscussionPage' ? 'active' : (navStore.currentPage == 'DiscussionDetailPage' ? 'active' : null)" @click="toDiscussion">
                    <q-item-section avatar>
                      <q-icon class="text-dark" size="sm">
                        <img src="~assets/tabs/discussion.png" />
                      </q-icon>
                    </q-item-section>
                    <q-item-section>Discussion & Poll</q-item-section>
                  </q-item>
                  <q-item v-if="authStore.isAdmin || authStore.isSup || authStore.isMgmt" exact class="q-ma-sm navigation-item" clickable v-ripple :class="navStore.currentPage == 'SummaryReportPage' ? 'active' : (navStore.currentPage == 'FeedbackReportPage' ? 'active' : (navStore.currentPage == 'DiscussionReportPage' ? 'active' : (navStore.currentPage == 'PollReportPage' ? 'active' : null)))">
                    <q-item-section avatar>
                      <q-icon class="text-dark" size="sm">
                        <img src="~assets/tabs/report.png" />
                      </q-icon>
                    </q-item-section>
                    <q-item-section>Report</q-item-section>
                    <q-menu :offset="[-200, -48]" transition-show="jump-down" transition-hide="jump-up">
                      <q-list style="min-width: 100px">
                        <q-item dense clickable @click="toSummaryReport" v-close-popup>
                          <q-item-section>Summary</q-item-section>
                        </q-item>
                        <q-item dense clickable @click="toFeedbackReport" v-close-popup>
                          <q-item-section>Feedback</q-item-section>
                        </q-item>
                        <q-item dense clickable @click="toDiscussionReport" v-close-popup>
                          <q-item-section>Discussion & Poll</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <q-page class="no-wrap" :class="$q.dark.isActive ? 'bg-color-dark' : 'bg-color-light'">
        <div class="q-pa-md">
          <component :is="components[navStore.currentPage]" :key="navStore.currentPage" />
        </div>
      </q-page>
    </q-page-container>
    <!--Account validation Dialog-->
    <q-dialog v-model="authStore.isVerified" position="top" persistent>
      <q-card class="bg-red-10 text-white">
        <q-card-section class="">
          <div class="text-h5 text-weight-bold">Your account is not verified!</div>
          <div class="text-body1 q-mb-sm">Please wait as the Administrator verify your account.</div>
          <q-btn size="sm" flat round icon="logout" @click="createLogout" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--Auth Dialog-->
    <q-dialog v-model="authStore.notAuthenticated" position="top" persistent>
      <q-card class="bg-red-10 text-white">
        <q-card-section class="">
          <div class="text-h5 text-weight-bold">Account is not authenticated!</div>
          <div class="text-body1 q-mb-sm">Please sign out and continue sign in. Thank You!</div>
          <q-btn size="sm" flat round icon="logout" @click="createLogout" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, reactive,watch } from 'vue'
import { onMounted } from 'vue-demi'
import { useAuthStore } from 'src/store/auth-store';
import { useNavStore } from 'src/store/nav-store';
import { useUserStore } from 'src/store/user-store';
import { usePreferenceStore } from 'src/store/preference-store'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import HomePage from 'src/components/HomePage.vue'
import MyAccountPage from 'src/components/MyAccountPage.vue'
import ResetPasswordPage from 'src/components/PasswordResetPage.vue'

import YearPreferencePage from 'src/components/YearPreferencePage'
import OfficePreferencePage from 'src/components/OfficePreferencePage.vue'
import AccountPreferencePage from 'src/components/AccountPreferencePage.vue'
import PositionPreferencePage from 'src/components/PositionPreferencePage.vue'
import CategoryPreferencePage from 'src/components/CategoryPreferencePage.vue'
import MessagePreferencePage from 'src/components/MessagePreferencePage.vue'
import OfficeCategoryPreferencePage from 'src/components/OfficeCategoryPreferencePage.vue'
// Feedback
import FeedbackOverviewPage from 'src/components/Feedback/FeedbackPage'
import FeedbackDetailPage from 'src/components/Feedback/FeedbackDetailPage'
import FeedbackEntryPage from 'src/components/Feedback/FeedbackEntryPage'
import FeedbackKioskPage from 'src/components/Feedback/FeedbackKioskPage'
import FeedbackKioskDetailPage from 'src/components/Feedback/FeedbackKioskDetailPage'
// Discussion
import DiscussionPage from 'src/components/Discussion/DiscussionPage'
import DiscussionDetailPage from 'src/components/Discussion/DiscussionDetailPage'
// Poll
import PollPage from 'src/components/Poll/PollPage'
import PollDetailPage from 'src/components/Poll/PollDetailPage'
// Report
import SummaryReportPage from 'src/components/Report/SummaryPage'
import FeedbackReportPage from 'src/components/Report/FeedbackPage'
import DiscussionReportPage from 'src/components/Report/DiscussionPage'
import PollReportPage from 'src/components/Report/PollPage'
// CC
import CitizenCharterPage from 'src/components/CitizenCharterPage'
// Announcement
import AnnouncementPage from 'src/components/AnnouncementPage.vue'

const components = {
  HomePage,
  MyAccountPage, ResetPasswordPage,
  YearPreferencePage, OfficePreferencePage, AccountPreferencePage, PositionPreferencePage, CategoryPreferencePage, MessagePreferencePage, OfficeCategoryPreferencePage,
  FeedbackOverviewPage, FeedbackDetailPage, FeedbackEntryPage, FeedbackKioskPage, FeedbackKioskDetailPage,
  DiscussionPage, DiscussionDetailPage,
  PollPage, PollDetailPage,
  SummaryReportPage, FeedbackReportPage, DiscussionReportPage, PollReportPage,
  CitizenCharterPage,
  AnnouncementPage
}

const $q = useQuasar()
const router = useRouter()

const authStore = useAuthStore()
const navStore = useNavStore()
const preferenceStore = usePreferenceStore()
const userStore = useUserStore()

const left = ref(false)

const toHome = () => {
  navStore.currentPage = 'HomePage'
}

const toMyAccount = () => {
  navStore.currentPage = 'MyAccountPage'
}

const toPassword = () => {
  navStore.currentPage = 'ResetPasswordPage'
}

const toYear = () => {
  navStore.currentPage = 'YearPreferencePage'
}

const toOffice = () => {
  navStore.currentPage = 'OfficePreferencePage'
}

const toAccount = () => {
  navStore.currentPage = 'AccountPreferencePage'
}

const toPosition = () => {
  navStore.currentPage = 'PositionPreferencePage'
}

const toCategory = () => {
  navStore.currentPage = 'CategoryPreferencePage'
}

const toMessage = () => {
  navStore.currentPage = 'MessagePreferencePage'
}

const toOfficeCategory = () => {
  navStore.currentPage = 'OfficeCategoryPreferencePage'
}

const toFeedbackOverview = () => {
  navStore.currentPage = 'FeedbackOverviewPage'
}

const toFeedbackEntry = () => {
  navStore.currentPage = 'FeedbackEntryPage'
}

const toFeedbackKiosk = () => {
  navStore.currentPage = 'FeedbackKioskPage'
}

const toDiscussion = () => {
  navStore.currentPage = 'DiscussionPage'
}

const toPoll = () => {
  navStore.currentPage = 'PollPage'
}

const toSummaryReport = () => {
  navStore.currentPage = 'SummaryReportPage'
}

const toFeedbackReport = () => {
  navStore.currentPage = 'FeedbackReportPage'
}

const toDiscussionReport = () => {
  navStore.currentPage = 'DiscussionReportPage'
}

const logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Sign Out. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      createLogout()
    } else {
      id.value = ''
    }
  })
}
const createLogout = async () => {
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: '#000'
  })
  try {
    await authStore.logout()
    authStore.clearUser()
    userStore.clearUser()
    navStore.clearNav()
    navStore.currentPage = 'LoginPage'
    router.push('/')
    $q.loading.hide()
  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.clearUser()
      userStore.clearUser()
      navStore.clearNav()
      navStore.currentPage = 'LoginPage'
      router.push('/')
    }
    console.log(error)
    $q.loading.hide()
  }
}

onMounted(() => {
  preferenceStore.fetchYear()
  preferenceStore.fetchSex()
  preferenceStore.fetchRole()
  preferenceStore.fetchPosition()
  preferenceStore.fetchOffice()
  preferenceStore.fetchCategory()
})

</script>

<style lang="scss" scoped>
.page
{
  .header-light
  {
    background: linear-gradient(145deg, #224488 15%, #1D1D1D 70%);
  }
  .header-dark
  {
    background: linear-gradient(145deg, #193366 15%, #1D1D1D 70%);
  }
  .drawer
  {
    background-image: url("~assets/sidebar.jpg") !important;
    background-size: cover !important;
    background-position: center;
    .wrapper
    {
      .navigation-item
      {
        border-radius: 5px;
        color: #fff;
      }
      .active
      {
        background-color: rgba(255, 255, 255, .1);
        color: #ffffff !important;
        font-weight: bold;
      }
    }
    .drawer-light
    {
      background-color: rgba(29, 29, 29, 0.8);
      color: #ffffff;
    }
    .drawer-dark
    {
      background-color: rgba(0, 0, 0, 0.9);
      color: #ffffff;
    }
  }
}
.menu
{
 .q-card
 {
  width: 450px;
  border-radius: 25px !important;
  .profile-pic 
  {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 10px solid #ecf0fc;
  }
  .radius
  {
    border-radius: 25px;
    .top-radius
    {
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
    }
    .bottom-radius
    {
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
    }
  }
 } 
}
</style>
