<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'"><q-btn icon="arrow_back" flat round size="xs" @click="navStore.currentPage = 'DiscussionPage'" />&nbsp;discussion thread & poll</div>
    <q-separator />
    <div class="q-mt-md">
      <div class="row q-gutter-xs">
        <div class="col-4">
          <q-card v-if="!userLoading" flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <div v-for="(data, index) in detail" :key="index">
              <q-card-section>
                <q-item class="q-pa-none">
                  <q-item-section>
                    <q-item-label class="text-uppercase text-bold">{{ data.category }}</q-item-label>
                    <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-item-section side top v-if="(authStore.isAdmin || authStore.isSup) && (data.levelID != 3 || data.isActive)">
                <q-btn unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="print" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="generateDiscussion" :loading="rLoading">
                  <template v-slot:loading>
                    <q-spinner-puff />
                  </template>
                </q-btn>
              </q-item-section>
              <q-card-section class="q-pt-none q-pb-xs">
                <div class="text-bold">{{ data.title }}</div>
                <div class="text-grey">{{ data.content }}</div>
              </q-card-section>
              <q-img class="cursor-pointer" :src="data.file" style="width: 100%;" />
            </div>
          </q-card>
          <q-card v-if="userLoading" class="no-shadow">
            <q-card-section class="text-center">
              <q-spinner-puff color="grey"  size="25px" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">Discussion Thread & Poll</div>
                </div>

                <div class="col-auto">
                  <q-tabs v-model="tab" dense class="text-grey" active-color="white" :indicator-color="$q.dark.isActive ? 'dark' : 'white'" align="right" narrow-indicator :active-bg-color="$q.dark.isActive ? 'primary' : 'primary'" >
                    <q-tab name="thread" label="Thread" />
                    <q-tab name="poll" label="Poll" />
                  </q-tabs>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>

              <q-tab-panels v-model="tab" animated transition-next="fade" transition-prev="fade">
                <q-tab-panel name="thread">
                  <div class="row q-gutter-sm">
                    <div class="col-5">
                      <div class="t-card">
                        <div v-if="hasError">
                          <div class="q-pa-md div-error">
                            <div v-for="(errorArray, idx) in err" :key="idx">
                              <div v-for="(allErrors, idx) in errorArray" :key="idx">
                                <span class="text-red">
                                  <q-icon name="cancel" />
                                  {{ allErrors}}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <q-input autogrow stack-label outlined v-model="comment" :color="$q.dark.isActive ? 'white' : 'primary'" label="Content..." class="q-mt-xs" :error-message="errors.comment.msg" :error="errors.comment.type" />
                          <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="submit" class="q-mt-sm full-width" @click="createThread" :loading="tfLoading">
                            <template v-slot:loading>
                              <q-spinner-puff />
                            </template>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div v-if="!threadLoading && thread.length != 0" class="card-response">
                        <div class="t-card" v-for="(data, index) in thread" :key="index">
                          <div class="q-pa-md">
                            <q-item class="q-pa-none">
                              <q-item-section avatar>
                                <q-avatar>
                                  <img :src="data.avatar">
                                </q-avatar>
                              </q-item-section>
                              <q-item-section>
                                <q-item-label class="text-capitalize">{{data.name}}</q-item-label>
                                <q-item-label caption>{{data.office}}</q-item-label>
                                <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                              </q-item-section>
                              <q-item-section side>
                                <q-btn v-if="data.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="delete" @click="disableThread(data.id)"/>
                                <q-btn v-if="!data.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" @click="enableThread(data.id)"/>
                              </q-item-section>
                            </q-item>
                          </div>
                          <div class="q-pt-none q-pr-md q-pb-md q-pl-md">
                            <div class="text-grey-7">{{ data.content }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-if="threadLoading">
                        <div class="t-card">
                          <div class="text-center">
                            <q-spinner-puff color="grey"  size="25px" />
                          </div>
                        </div>
                      </div>
                      <div v-if="thread.length == 0 && !threadLoading">
                        <div class="t-card">
                          <div class="text-center">
                            <q-img src="~assets/icons/no_data.png" width="50px" />
                              <div class="text-caption text-grey-6 q-mt-xs">No thread yet.</div>
                              <div class="text-caption text-grey-6">Be the first to create thread.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel name="poll">
                  <div class="row q-gutter-sm" v-if="(authStore.isAdmin || authStore.isSup || authStore.isMgmt)">
                    <div class="col-5">
                      <div class="t-card">
                        <div v-if="hasError">
                          <div class="q-pa-md div-error">
                            <div v-for="(errorArray, idx) in err" :key="idx">
                              <div v-for="(allErrors, idx) in errorArray" :key="idx">
                                <span class="text-red">
                                  <q-icon name="cancel" />
                                  {{ allErrors}}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <q-input autogrow stack-label outlined v-model="content" :color="$q.dark.isActive ? 'white' : 'primary'" label="Content..." class="q-mt-xs" :error-message="errors.content.msg" :error="errors.content.type" />
                          <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="submit" class="q-mt-sm full-width" @click="createAnswer" :loading="afLoading">
                            <template v-slot:loading>
                              <q-spinner-puff />
                            </template>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div v-if="!answerLoading && answer.length != 0">
                        <div class="t-card">
                          <q-list>
                            <q-item v-for="(data, index) in answer" :key="index">
                              <q-item-section class="text-uppercase">{{ data.label }}</q-item-section>
                              <q-item-section avatar>
                                <div>{{ data.count }}</div>
                              </q-item-section>
                              <q-item-section side>
                                <q-btn v-if="data.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="delete" @click="disableAnswer(data.id)"/>
                                <q-btn v-if="!data.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" @click="enableAnswer(data.id)"/>
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </div>
                        <div class="t-card">
                          <ApexCharts width="100%" height="250px" type="pie" :options="answerOptions" :series="answerSeries"></ApexCharts>
                        </div>
                      </div>
                      <div v-if="answerLoading">
                        <div class="t-card">
                          <div class="text-center">
                            <q-spinner-puff color="grey"  size="25px" />
                          </div>
                        </div>
                      </div>
                      <div v-if="answer.length == 0 && !answerLoading">
                        <div class="t-card">
                          <div class="text-center">
                            <q-img src="~assets/icons/no_data.png" width="50px" />
                              <div class="text-caption text-grey-6 q-mt-xs">No answer yet.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row q-gutter-sm" v-if="authStore.isEncoder">
                    <div class="col-6">
                      <div class="t-card">
                        <q-list>
                          <q-item v-for="(data, index) in answer" :key="index">
                            <q-item-section class="text-uppercase">{{ data.label }}</q-item-section>
                            <q-item-section avatar>
                              <div>{{ data.count }}</div>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                    <div class="col">
                      <div class="t-card">
                        <ApexCharts width="100%" height="250px" type="pie" :options="answerOptions" :series="answerSeries"></ApexCharts>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
              
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="reportDialog" full-height full-width>
      <q-card>
        <q-card-section class="q-pa-none">
          <div v-if="file" class="myIframe"> 
            <iframe :src="file" height="100%" width="100%"></iframe>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { useNavStore } from 'src/store/nav-store'
import { usePreferenceStore } from 'src/store/preference-store'
import Swal from 'sweetalert2'
import moment from 'moment'
import ApexCharts from "vue3-apexcharts";

const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()

const userLoading = ref(false)
const tfLoading = ref(false)
const threadLoading = ref(false)
const afLoading = ref(false)
const answerLoading = ref(false)

const detail = ref([])
const thread = ref([])
const answer = ref([])

const err = ref([])
const hasError = ref(false)

const comment = ref('')
const content = ref('')

const tab = ref('thread')

const rLoading = ref(false)
const file = ref('')
const reportDialog = ref(false)

/**
 * answer
 */
 const answerSeries = ref([])
const answerOptions = ref({
  labels: [],
  theme: {
    palette: 'palette7' // upto palette10
  }
})

const errors = reactive({
  comment: {msg: null, type: null},
  content: {msg: null, type: null}
})

const threadValidation = () => {
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

const answerValidation = () => {
  let isError = false
  //content
  if (content.value.length < 1) {
    errors.content.msg = 'Please enter your content'
    errors.content.type = true
    isError = true
  } else {
    errors.content.msg = null
    errors.content.type = null
  }

  return isError
}

/**
 * get detail
 */
const getDiscussion = async () => {
  /**
   * enable loading
   */
  userLoading.value = true
  try {
    const res = await server.get(`api/discussion/detail/${navStore.discussionId}`)
    detail.value = res.data
    userLoading.value = false
  } catch (error) {
    userLoading.value = false
  }
}

/**
 * get thread
 */
const getThread = async () => {
  /**
   * enable loading
   */
  threadLoading.value = true
  try {
    const res = await server.get(`api/discussion/thread/${navStore.discussionId}`)
    thread.value = res.data
    threadLoading.value = false
  } catch (error) {
    threadLoading.value = false
  }
}

/**
 * get answer
 */
 const getAnswer = async () => {
  /**
   * enable loading
   */
  answerLoading.value = true
  try {
    const res = await server.get(`api/discussion/answer/${navStore.discussionId}`)
    answer.value = res.data
    //
    const aOption = []
    const aSeries = []
    res.data.forEach(val => {
      aOption.push(val.label)
      aSeries.push(val.count)
    });
    answerSeries.value = aSeries
    answerOptions.value = {
      labels: aOption,
      theme: {
        palette: 'palette1' // upto palette10
      }
    }
    answerLoading.value = false
  } catch (error) {
    answerLoading.value = false
  }
}

/**
 * create thread
 */
const createThread = async () => {
  /**
   * disable error
   */
  hasError.value = false
  /**
   * validate form
   */
  const isError = threadValidation()
  if (isError) return false
  /**
   * enable loading
   */
  tfLoading.value = true
  try {
    const res = await server.put(`api/discussion/thread/${authStore.id}`, {
      discussionID: navStore.discussionId,
      content: comment.value
    })
    /**
     * response msg
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload thread
     */
    getThread()
    /**
     * disable loading
     */
    tfLoading.value = false
    /**
     * emplty form
     */
    comment.value = ''
  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
    tfLoading.value = false
  }

}

/**
 * 
 */
const disableThread = async (id) => {
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
    /**
     * call to disable
     */
    const res = await server.post(`api/discussion/thread/disable/${id}`)
    /**
     * response message
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload list
     */
    getThread()
    /**
     * disbale loading
     */
    $q.loading.hide()
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
 * 
 */
 const enableThread = async (id) => {
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
    /**
     * call to disable
     */
    const res = await server.post(`api/discussion/thread/enable/${id}`)
    /**
     * response message
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload list
     */
    getThread()
    /**
     * disbale loading
     */
    $q.loading.hide()
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
 * create answer
 */
const createAnswer = async () => {
  /**
   * disable error
   */
   hasError.value = false
  /**
   * validate form
   */
  const isError = answerValidation()
  if (isError) return false
  /**
   * enable loading
   */
  afLoading.value = true
  try {
    const res = await server.post(`api/discussion/answer`, {
      discussionID: navStore.discussionId,
      content: content.value
    })
    /**
     * response msg
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload thread
     */
    getAnswer()
    /**
     * disable loading
     */
     afLoading.value = false
    /**
     * emplty form
     */
    content.value = ''
  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
    afLoading.value = false
  }
}

/**
 * 
 */
 const disableAnswer = async (id) => {
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
    /**
     * call to disable
     */
    const res = await server.post(`api/discussion/answer/disable/${id}`)
    /**
     * response message
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload list
     */
    getAnswer()
    /**
     * disbale loading
     */
    $q.loading.hide()
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
 * 
 */
 const enableAnswer = async (id) => {
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
    /**
     * call to disable
     */
    const res = await server.post(`api/discussion/answer/enable/${id}`)
    /**
     * response message
     */
    Swal.fire({
      icon: 'success',
      title: res.data.msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    /**
     * reload list
     */
    getAnswer()
    /**
     * disbale loading
     */
    $q.loading.hide()
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
 * generate discussion
 */
const generateDiscussion = async () => {
  /**
   * enable loading
   */
  rLoading.value = true
  
  try {
    const res = await server.get(`api/report/discussion/detail?id=${navStore.discussionId}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    })
    const blob = new Blob([res.data], {type: 'application/pdf'});
    const pdfurl = window.URL.createObjectURL(blob)+"#view=FitW";
    file.value = pdfurl
    reportDialog.value = true
    rLoading.value = false
  } catch (error) {

  }
}
/**
 * load as mounted
 */
onMounted(() => {
  /**
   * get detail, thread, answer
   */
  getDiscussion()
  getThread()
  getAnswer()
})
</script>

<style scoped>
.card-response {
  height: 700px;
  overflow-y: scroll;
}
.card-response::-webkit-scrollbar {
    display: none;
}
.card-response {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
}
.t-card
{
  padding: 15px;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  margin-bottom: 5px;
}

.myIframe {
  position: relative;
  padding-bottom: 65.25%;
  padding-top: 30px;
  height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.myIframe iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>