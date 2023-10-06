<template>
    <q-page class="q-pa-md">
      <!--START DESKTOP MODE-->
      <!--===========================================================================================================================================================================================-->
      <div class="desktop-only">
        <!--No Discussion-->
        <div v-if="!discussions.length && !loading">
          <q-card class="card-wrapper no-shadow">
            <q-card-section class="q-pa-xl">
              <div class="text-center">
                <q-img src="~assets/icons/no_data.png" width="100px" />
                  <div class="text-subtitle1 text-grey-6 q-mt-md">No discussion yet.</div>
                  <div class="text-caption text-grey-6">Stay tune.</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--Loading-->
        <div v-if="loading">
          <q-card class="card-wrapper no-shadow">
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
        <!--Discussion-->
        <div v-if="!loading">
          <div style="max-height: 80vh" class="radius scroll">
            <div v-for="(data, index) in discussions" :key="index">
              <q-card class="card-wrapper no-shadow q-mb-sm">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <!-- <img src="~assets/seal.png"> -->
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-capitalize text-bold">{{data.category}}</q-item-label>
                      <q-item-label caption>
                          {{ moment(data.created_at).fromNow() }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-card-section>
                  <div class="text-capitalize text-bold">{{data.title}}</div>
                  <div class="text-caption text-grey"> {{ data.content }}</div>
                </q-card-section>
                <q-img class="cursor-pointer" :src="data.file" width="100%" />
                <q-card-section>
                  <q-btn-group spread flat rounded unelevated>
                    <q-btn flat label="comment" color="grey" size="lg" @click="join(data.id)" />
                    <q-btn flat label="vote" color="grey" size="lg" @click="poll(data.id)" />
                  </q-btn-group>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <!--===========================================================================================================================================================================================-->
      <!--END DESKTOP MODE-->
  
      <!--START MOBILE MODE-->
      <!--===========================================================================================================================================================================================-->
      <div class="mobile-only q-pa-md">
        <!--No Discussion-->
        <div v-if="!discussions.length && !loading">
          <q-card class="card-wrapper no-shadow q-mt-lg">
            <q-card-section class="q-pa-xl">
              <div class="text-center">
                <q-img src="~assets/icons/no_data.png" width="100px" />
                  <div class="text-subtitle1 text-grey-6 q-mt-md">No discussion yet.</div>
                  <div class="text-caption text-grey-6">Stay tune.</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!--Loading-->
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
        <!--Discussion-->
        <div v-if="!loading">
          <div style="max-height: 70vh" class="radius scroll q-mt-md">
            <div v-for="(data, index) in discussions" :key="index">
              <q-card class="card-wrapper no-shadow q-mb-sm">
                <q-card-section>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <!-- <img src="~assets/seal.png"> -->
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-capitalize text-bold">{{data.category}}</q-item-label>
                      <q-item-label caption>
                          {{ moment(data.created_at).fromNow() }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-card-section>
                  <div class="text-capitalize text-bold">{{data.title}}</div>
                  <div class="text-caption text-grey"> {{ data.content }}</div>
                </q-card-section>
                <q-img class="cursor-pointer" :src="data.file" width="100%" />
                <q-card-section>
                  <q-btn-group spread flat rounded unelevated>
                    <q-btn flat label="comment" color="grey" size="lg" @click="join(data.id)" />
                    <q-btn flat label="vote" color="grey" size="lg" @click="poll(data.id)" />
                  </q-btn-group>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
      <!--===========================================================================================================================================================================================-->
      <!--END MOBILE MODE-->
  
      <!--START DESKTOP MODE - THREAD DIALOG-->
      <q-dialog class="desktop-only" v-model="discussionDialog" transition-show="fade" transition-hide="fade">
        <q-card class="card-wrapper bg-accent" style="width: 900px; max-width: 80vw;">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">thread</q-toolbar-title>
          </q-toolbar>
          <discussion-thread-page v-if="discussionDialog" @input-visible="disableThread"/>
        </q-card>
      </q-dialog>
      <!--END DESKTOP MODE - THREAD DIALOG-->
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE - THREAD DIALOG-->
      <q-dialog class="mobile-only" v-model="discussionDialog" maximized transition-show="slide-up" transition-hide="slide-left">
        <q-card class="card-wrapper bg-accent">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">thread</q-toolbar-title>
          </q-toolbar>
          <discussion-thread-page v-if="discussionDialog" @input-visible="disableThread"/>
        </q-card>
      </q-dialog>
      <!--END MOBILE MODE - THREAD DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START DESKTOP MODE - VOTE -->
      <q-dialog class="desktop-only" v-model="pollDialog" transition-show="fade" transition-hide="fade">
        <q-card class="card-wrapper bg-accent" style="width: 900px; max-width: 80vw;">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">Vote</q-toolbar-title>
          </q-toolbar>
          <discussion-poll-page v-if="pollDialog" @input-visible="disableVote"/>
        </q-card>
      </q-dialog>
      <!--END DESKTOP MODE - VOTE -->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE - VOTE-->
      <q-dialog class="mobile-only" v-model="pollDialog" maximized transition-show="slide-up" transition-hide="slide-left">
        <q-card class="card-wrapper bg-accent">
          <q-toolbar class="bg-white q-pa-md">
            <q-btn flat round dense icon="arrow_back" v-close-popup>
              <q-tooltip anchor="top middle" self="top middle">Back</q-tooltip>
            </q-btn>
            <q-toolbar-title class="text-capitalize">Vote</q-toolbar-title>
          </q-toolbar>
          <discussion-poll-page v-if="pollDialog" @input-visible="disableVote"/>
        </q-card>
      </q-dialog>
      <!--END MOBILE MODE - VOTE-->
  
    </q-page>
  
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { onMounted } from 'vue-demi'
  import { useQuasar, QSpinnerPuff } from 'quasar'
  import { useUserStore } from 'src/store/user-store'
  import { server } from 'src/boot/axios'
  import moment from 'moment'
  
  import DiscussionThreadPage from './DiscussionThreadPage.vue'
  import DiscussionPollPage from './DiscussionPollPage.vue'
  
  const $q = useQuasar()
  const userStore = useUserStore()
  
  const loading = ref(false)
  
  const discussions = ref([])
  const discussionDialog = ref(false)
  
  const id = ref('')
  
  const pollId = ref('')
  
  const pollDialog = ref(false)
  /**
   * get discussion
   */
  const getAllDiscussion = async () => {
    /**
     * enable loading
     */
    loading.value = true
    try {
      const res = await server.get(`api/community/discussion`)
      discussions.value = res.data
      /**
       * disable loading
       */
      loading.value = false
    } catch (error) {
  
    }
  }
  
  /**
   * join discussion
   */
  const join = (data) => {
    userStore.discussionID = data
    discussionDialog.value = true
  }
  
  /**
   * answer poll
   */
  const poll = (data) => {
    userStore.discussionID = data
    pollDialog.value = true
  }
  /**
   * 
   */
  const disableThread = (data) => {
    discussionDialog.value = data
  }
  
  /**
   * 
   */
   const disableVote = (data) => {
    pollDialog.value = data
  }
  
  /**
   * 
   */
  const createAnswer = async () => {
    /** 
     * enable loading
    */
    $q.loading.show({
      spinner: QSpinnerPuff,
      spinnerColor: 'white',
      spinnerSize: 25,
      backgroundColor: 'dark'
    })
  
    try {
      const res = await server.post(`api/discussion/answer`, {
        discussionId: id.value,
        userId: userStore.id,
        pollId: pollId.value
      })
      /**
       * disable loading
       */
       $q.loading.hide()
      /**
       * empty form
       */
      pollId.value = ''
    } catch (error) {
      $q.loading.hide()
    }
  }
  
  onMounted(() => {
      /**
       * generate discussion
       */
      getAllDiscussion()
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
    .list
    {
      margin-bottom: 100px;
    }
  }
  </style>
  <!-- <style scoped>
  .footer
  {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px;
  }
  .wrapper
  {
    margin: 25px 0px 25px 0px;
  }
  </style> -->