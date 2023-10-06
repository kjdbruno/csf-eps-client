<template>
  <div>
    <q-layout view="lHh LpR lFf" class="bg-accent">
      <q-header class="header_normal q-pt-sm bg-white">
        <q-toolbar class="q-pt-sm q-pb-sm">
          <q-toolbar-title class="text-title">
            <q-img class="mobile-only" src="~assets/logo/logo_only_blue.png" width="50px" />
            <q-img class="desktop-only" src="~assets/logo/logo_only_blue.png" width="50px" />
            <span class="text-dark text-bold desktop-only">ePS. The Community Engagement Platform </span>
          </q-toolbar-title>
          
          <q-btn class="desktop-only q-ma-xs" round dense flat>
            <q-avatar>
              <img :src="userStore.avatar">
            </q-avatar>
            <q-menu class="menu" style="border-radius: 25px !important;">
              <q-card class="no-shadow q-pt-md q-pb-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-accent'">
                <q-card-section class="text-center">
                  <div class="radius q-pt-lg q-pb-lg" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                    <div class="profile-container q-mb-md">
                      <q-img class="profile-pic" :src="userStore.avatar" />
                    </div>
                    <div class="text-uppercase text-h6">{{ userStore.name }}</div>
                    <div class="text-grey text-caption">{{ userStore.email }}</div>
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

          <q-btn class="mobile-only q-ma-xs" round dense flat>
            <q-avatar>
              <img :src="userStore.avatar">
            </q-avatar>
            <q-menu class="menu">
              <q-list>
                <q-item clickable v-close-popup @click="toMyAccount">
                  <q-item-section>My Account</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="toPassword">
                  <q-item-section>Reset Password</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>
      <!-- <q-footer style="background-color: transparent !important;">

      </q-footer> -->
      <div class="mobile-only">
        <div class="footer">
          <div class="tabs">
            <div class="tabs__inner">
              <a class="tabs__item" :class="navStore.currentPage == 'FeedbackPage' ? 'tabs__item--active' : null" clickable @click="toFeedback">
                <q-icon class="text-dark" size="md">
                  <img src="~assets/icons/feedback.png" />
                </q-icon>
                <!-- <span class="tabs__tooltip">Feedback</span> -->
              </a>
              <a class="tabs__item" :class="navStore.currentPage == 'HomePage' ? 'tabs__item--active' : null" clickable @click="toHome">
                <q-icon class="text-dark" size="md">
                  <img src="~assets/icons/home.png" />
                </q-icon>
                <!-- <span class="tabs__tooltip">Home</span> -->
              </a>
              <a class="tabs__item" :class="navStore.currentPage == 'DiscussionPage' ? 'tabs__item--active' : null" clickable @click="toDiscussion">
                <q-icon class="text-dark" size="md">
                  <img src="~assets/icons/discussion.png" />
                </q-icon>
                <!-- <span class="tabs__tooltip">Discussion</span> -->
              </a>
              <!-- <a class="tabs__item" :class="navStore.currentPage == 'AccountPage' ? 'tabs__item--active' : null" clickable @click="toAccount">
                <q-icon class="text-dark" size="md">
                  <img src="~assets/icons/user.png" />
                </q-icon> -->
                <!-- <span class="tabs__tooltip">Account</span> -->
              <!-- </a> -->
            </div>
          </div>
        </div>
        <q-page-container>
          <q-page class="row no-wrap">
            <div class="col">
              <div class="full-height">
                <q-scroll-area class="col full-height">
                  <q-page class="q-pa-none">
                    <!-- <router-view /> -->
                    <component :is="components[navStore.currentPage]" :key="navStore.currentPage" />
                  </q-page>
                </q-scroll-area>
              </div>
            </div>
          </q-page>
        </q-page-container>
      </div>
      <div class="desktop-only">
        <q-page-container>
          <q-page class="row no-wrap">
            <div class="col-2">&nbsp;</div>
            <div class="col-3">
              <div class="q-mt-xl q-pa-md">
                <q-card class="card no-shadow">
                  <q-card-section class="text-center">
                    <div class="q-pt-lg q-pb-none">
                      <div class="profile-container q-mb-md">
                        <q-img v-if="userStore.avatar" class="profile-pic" :src="userStore.avatar" />
                        <q-img v-else class="profile-pic" src="~assets/account.png" />
                      </div>
                      <div class="text-uppercase text-h6">{{ userStore.name }}</div>
                      <div class="text-grey text-caption">{{ userStore.email }}</div>
                    </div>
                  </q-card-section>
                  <q-card-section class="q-pr-lg q-pl-lg q-pb-xl">
                    <q-list bordered class="border-radius" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                      <q-item clickable class="radius-top q-pt-md q-pb-md" @click="toHome">
                        <q-item-section avatar>
                          <q-icon class="text-dark" size="md">
                            <img src="~assets/icons/home.png" />
                          </q-icon>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Home</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="toFeedback" class="q-pt-md q-pb-md">
                        <q-item-section avatar>
                          <q-icon class="text-dark" size="md">
                            <img src="~assets/icons/feedback.png" />
                          </q-icon>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Feedback</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="toDiscussion" class="radius-bottom q-pt-md q-pb-md">
                        <q-item-section avatar>
                          <q-icon class="text-dark" size="md">
                            <img src="~assets/icons/discussion.png" />
                          </q-icon>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Discussion</q-item-label>
                        </q-item-section>
                      </q-item>
                      <!-- <q-item clickable class="radius-bottom q-pt-md q-pb-md" @click="toAccount">
                        <q-item-section avatar>
                          <q-icon class="text-dark" size="md">
                            <img src="~assets/icons/user.png" />
                          </q-icon>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Account</q-item-label>
                        </q-item-section>
                      </q-item> -->
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div class="col-5">
              <div class="q-mt-xl">
                <component :is="components[navStore.currentPage]" :key="navStore.currentPage" />
              </div>
            </div>
            <div class="col-2">&nbsp;</div>
          </q-page>
        </q-page-container>
      </div>
      
      <q-dialog v-model="verificationDialog" persistent>
        <q-card class="card-wrapper border-radius q-pt-md q-pb-md">
          <q-card-section class="">
            <div class="text-center">
              <div class="text-h6 text-dark text-uppercase">Profile is not updated and verified!</div>
              <div class="text-caption text-dark q-ma-none q-pa-none">Please complete the input below and type the verification code sent to your E-mail address.</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-select rounded emit-value map-options outlined v-model="sexID" :color="$q.dark.isActive ? 'white' : 'primary'" use-input input-debounce="0" label="Choose Sex..." :options="preferenceStore.sexes" @filter="filterSex" behavior="dialog" class="q-ma-xs" :error-message="errors.sexID.msg" :error="errors.sexID.type">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results</q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input rounded outlined v-model="number" :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Contact No." mask="###########" class="q-ma-xs" :error-message="errors.number.msg" :error="errors.number.type"/>
          </q-card-section>
          <q-separator class="q-mt-md q-mb-lg" />
          <card-section class="q-mt-md">
            <div class="text-caption text-uppercase text-center">verification code</div>
            <q-input borderless v-model="code" mask="######" fill-mask :input-style="{ textAlign: 'center', fontSize: '50px', letterSpacing: '5mm', color: 'grey' }"/>
          </card-section>
          <q-card-section class="q-mt-xl text-center">
            <q-btn size="md" unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" rounded label="verify" @click="verify" :loading="innerLoading">
              <template v-slot:loading>
                <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
              </template>
            </q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-layout>
  </div>
</template>
  
<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useUserStore } from '../store/user-store'
import { usePreferenceStore } from 'src/store/preference-store'
import { useNavStore } from 'src/store/nav-store'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { server } from 'src/boot/axios'
import { useRouter } from 'vue-router'

import HomePage from 'src/components/Community/HomePage.vue'
import FeedbackPage from 'src/components/Community/FeedbackPage.vue'
// import FeedbackDetailPage from 'src/components/Community/FeedbackDetailPage.vue'
// import FeedbackPostPage from 'src/components/Community/FeedbackPostPage'
import DiscussionPage from 'src/components/Community/DiscussionPage.vue'
// import PollPage from 'src/components/Community/PollPage.vue'
import AccountPage from 'src/components/Community/AccountPage.vue'
import ResetPage from 'src/components/Community/ResetPage.vue'

const components = {
  HomePage, 
  FeedbackPage,
  // FeedbackDetailPage, FeedbackPostPage, 
  DiscussionPage, 
  // PollPage, 
  AccountPage,
  ResetPage
}
  
const userStore = useUserStore()
const router = useRouter()
const preferenceStore = usePreferenceStore()
const navStore = useNavStore()
const $q = useQuasar()

const avatar = ref('')
const email = ref('')
const code = ref('')
const sexID = ref('')
const number = ref('')

const err = ref([])
const hasError = ref(null)
const verificationDialog = ref(false)
const innerLoading = ref(false)

const toHome = () => {
  navStore.currentPage = "HomePage"
}

const toFeedback = () => {
  navStore.currentPage = "FeedbackPage"
}

const toDiscussion = () => {
  navStore.currentPage = "DiscussionPage"
}

const toPoll = () => {
  navStore.currentPage = "PollPage"
}

const toMyAccount = () => {
  navStore.currentPage = "AccountPage"
}

const toPassword = () => {
  navStore.currentPage = "ResetPage"
}

const returnPage = () => {
  navStore.isMain = true
  navStore.currentPage = 'FeedbackPage'
}

const errors = reactive({
  email: {msg: null, type: null},
  code: {msg: null, type: null},
  sexID: {msg: null, type: null},
  number: {msg: null, type: null}
})
  
const verifyValidation = () => {
  let isError = false
  //verification code
  if (code.value.length < 1) {
    errors.code.msg = 'Please enter your verification code'
    errors.code.type = true
    isError = true
  } else {
    errors.code.msg = null
    errors.code.type = null
  }
  // sex
  if (sexID.value.length < 1) {
    errors.sexID.msg = 'Please enter your sex'
    errors.sexID.type = true
    isError = true
  } else {
    errors.sexID.msg = null
    errors.sexID.type = null
  }
  //contact number
  if (number.value.length < 1) {
    errors.number.msg = 'Please enter your contact number'
    errors.number.type = true
    isError = true
  } else if (number.value < 11 && number.value > 11) {
    errors.number.msg = 'Contact number must be 11 digits'
    errors.number.type = true
    isError = true
  } else {
    errors.number.msg = null
    errors.number.type = null
  }

  return isError
}
  
const verify = async () => {

  const isError = verifyValidation()
  if (isError) return false

  innerLoading.value = true

  try {
    await server.put(`/api/community/verify/${userStore.id}`, {
      code: code.value,
      number: number.value,
      sexID: sexID.value
    })
    const user = await userStore.fetchUser()
    userStore.setUser(user.data[0])
    innerLoading.value = false
    verificationDialog.value = false
  } catch (error) {
    err.value = error.response.data.errors
    hasError.value = true
  }

}
  
const filterSex = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.sexes = preferenceStore.optSexes
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.sexes = preferenceStore.sexes.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

const logout = async () => {
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: '#000'
  })
  try {
    await userStore.logout()
    userStore.clearUser()
    router.push('/')
    $q.loading.hide()
  } catch (error) {
    console.log(error)
    $q.loading.hide()
  }
}

onMounted(() => {
  if (!userStore.isVerified) {
    verificationDialog.value = true
  }
  //
  preferenceStore.fetchSex()
})
</script>

<style lang="scss" scoped>
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
.mobile-only
{
  .footer {
    bottom: 0;
    text-align: center;
    position: fixed;
    z-index: 2;
    width: 100%;
    .tabs {
      padding: 10px;
      border-radius: 25px;
      /* margin-bottom: 5px; */
      /* background: linear-gradient(-45deg, #FFAA01, #1A8738, #D91604, #512314); */
      .tabs__inner {
        display: flex;
        width: auto;
        min-width: 360px;
        justify-content: space-evenly;
        align-items: center;
        background-color: #fff;
        padding: 15px;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(229, 232, 239, 0.3);
        .tabs__item {
          color: white;
          text-decoration: none;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 55px;
          width: 55px;
          transition: 0.2s ease;
          border-radius: 16px;
          position: relative;
          .tabs__tooltip {
            background-color: #222233;
            border-radius: 10px;
            color: #ccc;
            padding: 0.4rem;
            font-size: 14px;
            display: block;
            width: auto;
            min-width: 80px;
            text-align: center;
            position: absolute;
            user-select: none;
            bottom: 50%;
            opacity: 0;
            transform: scale(0.4);
            transition: 0.2s ease;
          }
          .tabs__item:hover .tabs__tooltip {
            transform: scale(1);
            opacity: 1;
            bottom: calc(100% + 0.4rem + 4px + 4px);
          }
        }
        .tabs__item:hover, .tabs__item.tabs__item--active {
          background-color: rgba(200, 200, 200, 0.4);
        }
      }
    }
  }
}

.desktop-only
{
  .card
  {
    border-radius: 25px;
    .profile-pic
    {
      width: 100px;
    }

    .border-radius
    {
      border-radius: 25px;
    }
    .radius-top
    {
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
    }
    .radius-bottom
    {
      border-bottom-left-radius: 25px;
      border-bottom-right-radius: 25px;
    }
  }
}
</style>