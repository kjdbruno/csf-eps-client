<template>
    <div>
      
      <!--START DESKTOP MODE-->
      <div class="desktop-only q-pa-md">
        <div class="row q-gutter-sm">
          <div class="col-5">
            <div class="bg-white radius">
              <div class="q-pa-md">
                <div>
                  <q-input rounded outlined color="primary" label="Write a comment..." autogrow class="full-width" v-model="comment" :error-message="errors.comment.msg" :error="errors.comment.type"></q-input>
                  <q-btn color="primary" unelevated rounded label="save" class="full-width q-mt-sm" @click="createResponse" :loading="saving">
                    <template v-slot:loading>
                      <q-spinner-puff />&nbsp;Saving...
                    </template>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div v-if="loading">
              <div class="bg-white radius">
                <div class="q-pa-md">
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
                </div>
              </div>
            </div>
            <div v-if="!responses.length && !loading">
              <div class="bg-white radius">
                <div class="q-pa-md">
                  <div class="text-center">
                    <q-img src="~assets/icons/no_data.png" width="100px" />
                      <div class="text-subtitle1 text-grey-6 q-mt-md">No response yet.</div>
                      <div class="text-caption text-grey-6">Be the first to respond.</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="responses.length && !loading">
              <div style="max-height: 50vh" class="radius scroll">
                <div class="bg-white radius q-mt-sm" v-for="(rs, index) in responses" :key="index">
                  <div class="q-pa-md">
                    <q-item class="q-pa-none">
                      <q-item-section avatar>
                        <q-avatar>
                          <img :src="rs.avatar">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{rs.name}}</q-item-label>
                        <q-item-label caption>{{rs.office}}</q-item-label>
                        <q-item-label caption>{{ moment(rs.created_at).fromNow() }}</q-item-label>
                      </q-item-section>
                      <q-item-section side top v-if="rs.roleID != 5">
                        <!-- <q-btn v-if="rs.rating == null || rs.rating == 0" unelevated rounded color="primary" label="rate" size="sm" @click="rate(rs.id)" /> -->
                        <q-rating v-if="rs.rating == null || rs.rating == 0" v-model="rating" :max="3" size="3em" :color="colors" :icon="icons" @update:model-value="createRate(rs.id)"/>
                        <div v-else><q-icon :name="rs.rating == 1 ? 'sentiment_very_dissatisfied' : (rs.rating == 2 ? 'sentiment_neutral' : (rs.rating == 3 ? 'sentiment_very_satisfied' : null))" :color="rs.rating == 1 ? 'red' : (rs.rating == 2 ? 'amber' : (rs.rating == 3 ? 'green' : null))" size="sm"/></div>
                      </q-item-section>
                    </q-item>
                    <q-item class="q-pl-none q-pr-none">
                      <q-item-label class="text-dark">{{rs.content}}</q-item-label>
                    </q-item>
                    <q-item v-if="rs.file" class="q-pa-none">
                      <q-img class="cursor-pointer" :src="rs.file"/>
                    </q-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--END DESKTOP MODE-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE-->
      <div class="mobile-only q-pa-md">
        <div v-if="loading">
          <div class="bg-white radius">
            <div class="q-pa-md">
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
            </div>
          </div>
        </div>
        <div v-if="!responses.length && !loading">
          <div class="bg-white radius">
            <div class="q-pa-md">
              <div class="text-center">
                <q-img src="~assets/icons/no_data.png" width="100px" />
                  <div class="text-subtitle1 text-grey-6 q-mt-md">No response yet.</div>
                  <div class="text-caption text-grey-6">Be the first to respond.</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="responses.length && !loading">
          <div style="max-height: 78vh" class="scroll">
            <div class="bg-white radius q-mt-sm" v-for="(rs, index) in responses" :key="index">
              <div class="q-pa-md">
                <q-item class="q-pa-none">
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="rs.avatar">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{rs.name}}</q-item-label>
                    <q-item-label caption>{{rs.office}}</q-item-label>
                    <q-item-label caption>{{ moment(rs.created_at).fromNow() }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top v-if="rs.roleID != 5">
                    <q-rating v-if="rs.rating == null || rs.rating == 0" v-model="rating" :max="3" size="3em" :color="colors" :icon="icons" @update:model-value="createRate(rs.id)"/>
                    <div v-else><q-icon :name="rs.rating == 1 ? 'sentiment_very_dissatisfied' : (rs.rating == 2 ? 'sentiment_neutral' : (rs.rating == 3 ? 'sentiment_very_satisfied' : null))" :color="rs.rating == 1 ? 'red' : (rs.rating == 2 ? 'amber' : (rs.rating == 3 ? 'green' : null))" size="sm"/></div>
                  </q-item-section>
                </q-item>
                <q-item class="q-pl-none q-pr-none">
                  <q-item-label class="text-dark">{{rs.content}}</q-item-label>
                </q-item>
                <q-item v-if="rs.file" class="q-pa-none">
                  <q-img class="cursor-pointer" :src="rs.file"/>
                </q-item>
              </div>
            </div>
          </div>
        </div>
        <q-footer class="footer bg-white">
          <q-input rounded outlined bottom-slots label="Write a comment..." class="full-width" v-model="comment" color="grey" :error-message="errors.comment.msg" :error="errors.comment.type">
            <template v-slot:after>
              <q-btn v-if="!saving" round dense flat icon="send" class="q-pa-sm" @click="createResponse" />
              <q-spinner-puff v-if="saving" />
            </template>
          </q-input>
        </q-footer>
      </div>
      <!--END MOBILE MODE-->
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { onMounted } from 'vue-demi'
  import { useQuasar, QSpinnerPuff } from 'quasar'
  import { useFeedbackStore } from 'src/store/feedback-store'
  import { useUserStore } from 'src/store/user-store'
  import { server } from 'src/boot/axios'
  import moment from 'moment'
  
  const $q = useQuasar()
  const feedbackStore = useFeedbackStore()
  const userStore = useUserStore()
  
  const loading = ref(false)
  const saving = ref(false)
  
  const responses = ref([])
  
  const feedbackId = ref('')
  const comment = ref('')
  const responseId = ref('')
  
  const expanded = ref(false)
  const rating = ref(0)
  
  const icons = ref([
    'sentiment_very_dissatisfied',
    'sentiment_neutral',
    'sentiment_very_satisfied'
  ])
  
  const colors = ref([
    'red-10',
    'amber-10',
    'green-6'
  ])
  
  const err = ref([])
  const hasError = ref(false)
  
  const errors = reactive({
    comment: {msg: null, type: null},
  })
  
  const validation = () => {
    let isError = false
    //comment
    if (comment.value.length < 1) {
      errors.comment.msg = 'Please enter your comment'
      errors.comment.type = true
      isError = true
    } else {
      errors.comment.msg = null
      errors.comment.type = null
    }
    return isError
  }
  
  /**
   * get responses
   */
  const getResponse = async () => {
    /**
     * return responses to zero/empty
     */
    responses.value = ([])
    /**
     * enable response loading
     */
    loading.value = true
    try {
      const res = await server.get(`api/community/feedback/response/${feedbackStore.id}`)
      /**
       * populate responses
       */
      responses.value = res.data
      /**
       * disable response loading
       */
      loading.value = false
    } catch (error) {
      /**
       * diable response loading
       */
      loading.value = false
    }
  }
  
  /**
   * create response
   */
  const createResponse = async () => {
    /**
     * validate form
     */
    const isError = validation()
    if (isError) return false
    /**
     * enable loading
     */
    saving.value = true
    try {
      const res = await server.put(`api/community/feedback/response/${userStore.id}`, {
        feedbackID: feedbackStore.id,
        content: comment.value
      })
      saving.value = false
      /**
        * reload response
        */
      getResponse()
      //
      comment.value = ''
      /**
     * disable loading
     */
      saving.value = false
    } catch (error) {
      console.log(error)
    }
  }
  
  /**
   * rate
   */
  const rate = (idx) => {
    responseId.value = idx
    expanded.value = !expanded.value
    rating.value = 0
  }
  
    /**
   * save rating
   */
  const createRate = async (id) => {
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
      const res = await server.put(`api/community/feedback/rating/${userStore.id}`, {
        responseID: id,
        rating: rating.value
      })
      /**
       * reload response
       */
      getResponse()
      /**
       * disable loading
       */
      $q.loading.hide()
      //
      rating.value = 0

    } catch (error) {
      err.value = error.response.data.errors
      hasError.value = true
      /**
       * disable loading
       */
      $q.loading.hide()
    }
  }
  
  onMounted(() => {
    /**
     * generate response
     */
    getResponse()
  })
  </script>
  
  <style lang="scss" scoped>
  .desktop-only
  {
    .radius
    {
      border-radius: 25px;
  
      .btn
      {
        width: 100px;
      }
    }
  }
  
  .mobile-only
  {
    .radius
    {
      border-radius: 25px;
    }
    .footer
    {
      padding: 15px 10px 0px 10px;
    }
  }
  </style>