<template>
    <q-page class="q-pa-md">
  
      <!--===========================================================================================================================================================================================-->
      <!--START DESKTOP MODE-->
  
      <div class="desktop-only">
        <q-card class="card-wrapper no-shadow">
          <q-card-section class="q-pt-lg">
            <q-input outlined bottom-slots label="Write a feedback..." color="secondary" rounded autogrow class="full-width cursor-pointer" @click="newPost" readonly>
              <template v-slot:before>
                  <q-avatar>
                    <img :src="userStore.avatar">
                  </q-avatar>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <!--NO POST YET-->
        <div v-if="!feedbacks.length && !loading">
          <q-card class="card-wrapper no-shadow q-mt-lg">
            <q-card-section class="q-pa-xl">
              <div class="text-center">
                <q-img src="~assets/icons/no_data.png" width="100px" />
                  <div class="text-subtitle1 text-grey-6 q-mt-md">No feedback yet.</div>
                  <div class="text-caption text-grey-6">Be the first to post feedback.</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--LOADING CARD-->
        <div v-if="loading">
          <q-card class="card-wrapper no-shadow q-mt-lg">
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-skeleton height="200px" square animation="fade" />
            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </div>
        <!--FEEDBACK LIST-->
        <div v-if="!loading">
          <div style="max-height: 70vh" class="radius scroll q-mt-md">
            <div v-for="(fb, index) in feedbacks" :key="index">
              <q-card class="card-wrapper no-shadow q-mb-sm">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="fb.avatar">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-capitalize">{{fb.name}}</q-item-label>
                      <q-item-label caption>
                          {{ moment(fb.created_at).fromNow() }}
                      </q-item-label>
                    </q-item-section>
                    <!-- <q-item-section side top>
                      <q-badge :color="fb.levelId == 1 && fb.isActive == true ? 'red-7' : (fb.levelId == 2 && fb.isActive == true ? 'amber-7' : (fb.levelId == 3 && fb.isActive == true ? 'green-7' : (fb.isActive == false ? 'grey-7' : null)))" rounded class="q-mr-sm q-mb-xs" />
                      <q-btn-dropdown v-if="fb.levelId == 3 || fb.isActive == false" dropdown-icon="more_horiz" class="q-pa-xs" size="sm" flat rounded dense>
                        <q-list>
                          <q-item clickable v-close-popup @click="archieveFeedback(fb.id)">
                            <q-item-section>
                              <q-item-label>Archieve</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </q-item-section> -->
                  </q-item>
                </q-card-section>
                <q-card-section>
                  <div class="text-caption text-grey"> {{ fb.content }}</div>
                </q-card-section>
                <q-img class="cursor-pointer" v-for="(data, index) in fb.photos" :key="index" :src="data.evidence" :width="fb.photos.length >= 2 ? '50%' : (fb.photos.length == 1 ? '100%' : null)" @click="showEvidence(fb.photos, data.id)" />
                <q-card-actions>
                  <q-btn unelevated flat rounded label="view response" color="grey" class="full-width" size="lg" clickable @click="viewResponse(fb.id)" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </div>
  
      <!--END DESKTOP MODE-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE-->
  
      <div class="mobile-only">
        <q-card class="card-wrapper no-shadow">
          <q-card-section class="q-pt-lg">
            <q-input outlined bottom-slots label="Write a feedback..." color="secondary" rounded autogrow class="full-width" @click="newPost" readonly>
              <template v-slot:before>
                  <q-avatar>
                    <img :src="userStore.avatar">
                  </q-avatar>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <!--NO POST YET-->
        <div v-if="!feedbacks.length && !loading">
          <q-card class="card-wrapper no-shadow q-mt-lg">
            <q-card-section class="q-pa-xl">
              <div class="text-center">
                <q-img src="~assets/icons/no_data.png" width="100px" />
                  <div class="text-subtitle1 text-grey-6 q-mt-md">No feedback yet.</div>
                  <div class="text-caption text-grey-6">Be the first to post feedback.</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--LOADING CARD-->
        <div v-if="loading">
          <q-card class="card-wrapper no-shadow q-mt-lg">
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-skeleton height="200px" square animation="fade" />
            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </div>
        <!--FEEDBACK LIST-->
        <div v-if="!loading" class="list">
          <div v-for="(fb, index) in feedbacks" :key="index">
            <q-card class="card-wrapper no-shadow q-mt-lg">
              <q-card-section>
                <q-item>
                  <q-item-section avatar>
                      <q-avatar>
                          <img :src="fb.avatar">
                      </q-avatar>
                  </q-item-section>
                  <q-item-section>
                      <q-item-label class="text-capitalize">{{fb.name}}</q-item-label>
                      <q-item-label caption>
                          {{ moment(fb.created_at).fromNow() }}
                      </q-item-label>
                  </q-item-section>
                  <!-- <q-item-section side top>
                      <q-badge :color="fb.levelId == 1 && fb.isActive == true ? 'red-7' : (fb.levelId == 2 && fb.isActive == true ? 'amber-7' : (fb.levelId == 3 && fb.isActive == true ? 'green-7' : (fb.isActive == false ? 'grey-7' : null)))" rounded class="q-mr-sm q-mb-xs" />
                      <q-btn-dropdown v-if="fb.levelId == 3 || fb.isActive == false" dropdown-icon="more_horiz" class="q-pa-xs" size="sm" flat rounded dense>
                          <q-list>
                              <q-item clickable v-close-popup @click="archieveFeedback(fb.id)">
                                  <q-item-section>
                                      <q-item-label>Archieve</q-item-label>
                                  </q-item-section>
                              </q-item>
                          </q-list>
                      </q-btn-dropdown>
                  </q-item-section> -->
                </q-item>
              </q-card-section>
              <q-card-section>
                <div class="text-caption text-grey"> {{ fb.content }}</div>
              </q-card-section>
              <q-img class="cursor-pointer" v-for="(data, index) in fb.photos" :key="index" :src="data.evidence" :width="fb.photos.length >= 2 ? '50%' : (fb.photos.length == 1 ? '100%' : null)" @click="showEvidence(fb.photos, data.id)" />
              <q-card-actions>
                <q-btn unelevated flat rounded label="view response" color="grey" class="full-width" size="lg" clickable @click="viewResponse(fb.id)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
  
      <!--END MOBILE MODE-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START DESKTOP MODE - POST DIALOG-->
      
      <q-dialog class="desktop-only" v-model="postDialog" transition-show="fade" transition-hide="fade">
        <q-card class="card-wrapper bg-accent" style="width: 900px; max-width: 80vw;">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">
                  Back
              </q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">Create feedback</q-toolbar-title>
          </q-toolbar>
          <feedback-post-page v-if="postDialog" @input-visible="disablePost"/>
        </q-card>
      </q-dialog>
  
      <!--END DESKTOP MODE - POST DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE - POST DIALOG-->
      
      <q-dialog class="mobile-only" v-model="postDialog" maximized transition-show="slide-up" transition-hide="slide-left">
        <q-card class="card-wrapper bg-accent">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">
                  Back
              </q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">Create feedback</q-toolbar-title>
          </q-toolbar>
          <feedback-post-page v-if="postDialog" @input-visible="disablePost"/>
        </q-card>
      </q-dialog>
  
      <!--END MOBILE MODE - POST DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
      
      <!--START PHOTO DIALOG-->
  
      <q-dialog class="mobile-only" v-model="photoDialog" full-width>
        <q-card>
          <q-card-section class="q-pa-none">
            <q-carousel swipeable animated v-model="slide" thumbnails infinite >
              <q-carousel-slide v-for="(dt, index) in img" :key="index" :name="dt.id" :img-src="dt.evidence" />
            </q-carousel>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <q-dialog class="desktop-only" v-model="photoDialog">
        <q-card  style="width: 900px; max-width: 80vw;">
          <q-card-section class="q-pa-none">
            <q-carousel swipeable animated v-model="slide" thumbnails infinite >
              <q-carousel-slide v-for="(dt, index) in img" :key="index" :name="dt.id" :img-src="dt.evidence" />
            </q-carousel>
          </q-card-section>
        </q-card>
      </q-dialog>
  
      <!--END PHOTO DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START DESKTOP MODE - RESPONSE DIALOG-->
  
      <q-dialog class="desktop-only" v-model="responseDialog" transition-show="fade" transition-hide="fade">
        <q-card class="card-wrapper bg-accent" style="width: 900px; max-width: 80vw;">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">Responses & comments</q-toolbar-title>
          </q-toolbar>
          <feedback-detail-page v-if="responseDialog" @input-visible="disableResponse"/>
        </q-card>
      </q-dialog>
  
      <!--END DESKTOP MODE - RESPONSE DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE - RESPONSE DIALOG-->
  
      <q-dialog class="mobile-only" v-model="responseDialog" maximized transition-show="slide-up" transition-hide="slide-left">
        <q-card class="card-wrapper bg-accent">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">responses & comments</q-toolbar-title>
          </q-toolbar>
          <feedback-detail-page v-if="responseDialog" @input-visible="disableResponse"/>
        </q-card>
      </q-dialog>
  
      <!--END MOBILE MODE - RESPONSE DIALOG-->
  
    </q-page>
  </template>
  
  <script setup>
    import { ref, reactive } from 'vue'
    import { onMounted } from 'vue-demi'
    import { useQuasar, QSpinnerIos } from 'quasar'
    import { useFeedbackStore } from 'src/store/feedback-store'
    import { useUserStore } from 'src/store/user-store'
    import { usePreferenceStore } from 'src/store/preference-store'
    import { useNavStore } from 'src/store/nav-store'
    import { useRouter } from 'vue-router'
    import { server } from 'src/boot/axios'
    import moment from 'moment'
    import VueEasyLightbox from 'vue-easy-lightbox'
  
    import FeedbackPostPage from './FeedbackPostPage.vue'
    import FeedbackDetailPage from './FeedbackDetailPage.vue'
  
    const $q = useQuasar()
    const feedbackStore = useFeedbackStore()
    const userStore = useUserStore()
    const preferenceStore = usePreferenceStore()
    const navStore = useNavStore()
    const router = useRouter()
  
    const feedbacks = ref([])
  
    const loading = ref(false)
  
    const isMobile = ref(false)
  
    const postDialog = ref(false)
    const responseDialog = ref(false)
  
    const photoDialog = ref(false)
    const slide = ref(1)
    const img = ref([])
  
    const newPost = () => {
      postDialog.value = true
      preferenceStore.fetchCategory()
    }
  
    const disablePost = (data) => {
      getFeedback()
      postDialog.value = data
    }
  
    const viewResponse = async (id) => {
      feedbackStore.id = id
      responseDialog.value = true
    }
  
    const disableResponse = (data) => {
      responseDialog.value = data
    }
  
    const getFeedback = async () => {
      loading.value = true
      try {
        const res = await server.get(`api/community/feedback/${userStore.id}`)
        feedbacks.value = res.data
        loading.value = false
      } catch (error) {
        loading.value = false
      }
    }
    
    const showEvidence = (p, idx) => {
      img.value = p
      slide.value = idx
      photoDialog.value = true
    }
  
    onMounted(() => {
      /**
       * generate feedback
       */
      getFeedback()
      /**
       * validate if mobile/browser/desktop
       */
      if ($q.platform.is.mobile) {
        isMobile.value = true
      }
      /**
       * device ready for mobile
       */
      document.addEventListener('deviceready', () => {}, false)
    })
  
  </script>
  
  <style lang="scss" scoped>
  .desktop-only
  {
    .card-wrapper
    {
      border-radius: 25px;
    }
  }
  
  .mobile-only
  {
    .card-wrapper
    {
      border-radius: 25px;
    }
    .list
    {
      margin-bottom: 100px;
    }
  }
  </style>
  