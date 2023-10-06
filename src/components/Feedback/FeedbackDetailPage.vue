<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'"><q-btn icon="arrow_back" flat round size="xs" @click="navStore.currentPage = 'FeedbackOverviewPage'" />&nbsp;feedback detail</div>
    <q-separator />
    <div class="q-mt-md">
      <div class="row q-gutter-xs">
        <div class="col-4">
          <q-card v-if="!userLoading" flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <div v-for="(data, index) in lists" :key="index">
              <q-card-section>
                <q-item class="q-pa-none">
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="data.avatar">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-uppercase">{{ data.complainant }}</q-item-label>
                    <q-item-label caption>{{ data.email }}</q-item-label>
                    <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top v-if="(authStore.isAdmin || authStore.isSup) && (data.status != 3 || data.isActive)">
                    <q-btn unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);">
                      <q-menu cover auto-close>
                        <q-list>
                          <q-item dense clickable @click="complete(data.id)">
                            <q-item-section>Complete</q-item-section>
                          </q-item>
                          <q-item dense clickable @click="cancel(data.id)">
                            <q-item-section>Cancel</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <div v-if="data.rating > 0" class="q-mt-md absolute text-caption text-bold" style="top: 50px; right: 12px;"><span>Rating: </span><spa>{{ data.rating }}%</spa></div>
              <q-card-section class="q-pt-none q-pb-none">
                <q-badge class="text-capitalize q-mr-xs" :color="data.status == 1 ? 'red-7': (data.status == 2 ? 'amber-7' : (data.status == 3 ? 'green-7' : (data.status == 4 ? 'purple-7' : null)))">{{ data.status == 1 ? 'pending': (data.status == 2 ? 'ongoing' : (data.status == 3 ? 'completed' : (data.status == 4 ? 'delay' : null))) }}</q-badge>
              </q-card-section>
              <q-card-section class="q-pt-none q-pb-none">
                <q-badge class="q-mr-xs" v-for="(off, index) in data.offices" :key="index" :color="off.isReceived ? 'green-7' : (!off.isReceived ? 'red-7' : null)">{{ off.office }}</q-badge>
              </q-card-section>
              <q-card-section class="q-pt-none q-pb-xs">
                <div>{{ data.content }}</div>
              </q-card-section>
              <q-img class="cursor-pointer" v-for="(dt, index) in data.photos" :key="index" :src="dt.evidence" :width="data.photos.length >= 2 ? '50%' : (data.photos.length == 1 ? '100%' : null)" @click="showEvidence(data.photos, dt.id)" />
            </div>
          </q-card>
          <q-card v-if="userLoading" flat class="no-shadow">
            <q-card-section class="text-center">
              <q-spinner-puff color="grey"  size="25px" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <div class="row q-gutter-sm">
            <div class="col-6">
              <q-card flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                <q-card-section class="q-pb-none q-ma-xs" v-if="hasError">
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
                </q-card-section>
                <q-card-section>
                  <q-input :disable="isDone" autogrow stack-label outlined v-model="content" :color="$q.dark.isActive ? 'white' : 'primary'" label="Content..." class="q-mt-xs" :error-message="errors.content.msg" :error="errors.content.type" />
                  <input type="file" @change="onPhotoChange"  ref="file" style="display: none" />
                  <q-btn :disable="isDone" v-ripple v-if="!evidence" size="xs" unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="Upload photo" class="q-mt-xs" @click="$refs.file.click()" />
                  <q-btn v-ripple v-if="evidence" size="xs" unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="remove photo" class="q-mt-xs" @click="removePhoto" />
                  <div class="q-mt-sm photo" v-if="evidence">
                      <q-img class="img" :src="evidence" />
                  </div>
                  <q-separator class="q-mt-md q-mb-md" />
                  <q-btn :disable="isDone" v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="submit" class="full-width" @click="createResponse" :loading="formLoading">
                    <template v-slot:loading>
                      <q-spinner-puff />&nbsp;Saving...
                    </template>
                  </q-btn>
                </q-card-section>
              </q-card>
            </div>
            <div class="col">
              <div v-if="!responseLoading && responses.length != 0" class="card-response">
                <q-card flat class="no-shadow q-mb-sm" v-for="(data, index) in responses" :key="index" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                  <q-card-section>
                    <q-item class="q-pa-none">
                      <q-item-section avatar>
                        <q-avatar>
                          <img :src="data.avatar">
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{data.name}}</q-item-label>
                        <q-item-label caption>{{data.email}}</q-item-label>
                        <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="data.roleID != 5">
                        <div v-if="data.rating"><q-icon :name="data.rating == 1 ? 'sentiment_very_dissatisfied' : (data.rating == 2 ? 'sentiment_neutral' : (data.rating == 3 ? 'sentiment_very_satisfied' : null))" :color="data.rating == 1 ? 'red' : (data.rating == 2 ? 'amber' : (data.rating == 3 ? 'green' : null))" size="sm" /></div>
                        <div class="text-caption" v-if="!data.rating">No rating yet!</div>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-section>{{ data.content }}</q-card-section>
                  <q-img v-if="data.file" :src="data.file" style="width: 100%;" />
                </q-card>
              </div>
              <q-card v-if="responseLoading" flat class="no-shadow">
                <q-card-section class="text-center">
                  <q-spinner-puff color="grey"  size="25px" />
                </q-card-section>
              </q-card>
              <div v-show="responses.length == 0 && !responseLoading" class="q-mb-sm">
                <q-card flat class="no-shadow">
                  <q-card-section>
                    <div class="text-center">
                      <q-img src="~assets/icons/no_data.png" width="75px" />
                        <div class="text-subtitle1 text-grey-6 q-mt-md">No response yet.</div>
                        <div class="text-caption text-grey-6">Be the first to respond.</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Photo-->
    <q-dialog v-model="photoDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="q-pa-none">
          <q-carousel swipeable animated v-model="slide" thumbnails infinite >
            <q-carousel-slide v-for="(dt, index) in img" :key="index" :name="dt.id" :img-src="dt.evidence" />
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { useNavStore } from 'src/store/nav-store'
import moment from 'moment'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()

const lists = ref([])
const userLoading = ref(false)
const formLoading = ref(false)
const responseLoading = ref(false)

const responses = ref([])

const content = ref('')
const evidence = ref('')

const id = ref('')
const completeDialog = ref(false)
const cancelDialog = ref(false)

const err = ref([])
const hasError = ref(false)

const photoDialog = ref(false)
const slide = ref(1)
const img = ref([])

const isDone = ref(false)

const errors = reactive({
  content: {msg: null, type: null}
})

const validation = () => {
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
 * get feedback detail based on feedback id
 */
const getFeedback = async () => {
  /**
   * enable user loading
   */
   userLoading.value = true
  try {
    const res = await server.get(`api/feedback/detail/${navStore.feedbackId}`)
    lists.value = res.data
    if (res.data[0].status == 3) {
      isDone.value = true
    }
    /**
     *
     */
    userLoading.value = false
  } catch (error) {

  }
}
/**
 * get response
 */
const getResponse = async () => {
  /**
   * enable response loading
   */
  responseLoading.value = true
  try {
    const res = await server.get(`api/feedback/response/${navStore.feedbackId}`)
    /**
     * populate data
     */
    responses.value = res.data
    /**
     * disable loading
     */
    responseLoading.value = false
  } catch (error) {

  }
}

/**
 * create response/comments
 */
const createResponse = async () => {
  /**
   * disbale error
   */
  hasError.value = false
  /**
   * validate form
   */
  const isError = validation()
  if (isError) return false
  /**
   * enable form loading
   */
  formLoading.value = true
  try {
    const res = await server.put(`api/feedback/response/${authStore.id}`, {
      feedbackID: navStore.feedbackId,
      content: content.value,
      file: evidence.value
    })
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
     * reload response
     */
    getResponse()
    /**
     * disbale loading
     */
    formLoading.value = false
    /**
     * empty form
     */
    content.value = ''
    evidence.value = ''

  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
     formLoading.value = false
  }
}

/**
 * upload photo
 */
const onPhotoChange = (e) => {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
    createPhoto(files[0]);
}
const createPhoto = (file) => {
  let image = new Image();
  let reader = new FileReader();

  reader.onload = (e) => {
    evidence.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
/**
 * remove photo
 */
const removePhoto = () => {
  evidence.value = ''
}
/**
 * complete
 */
const complete = (data) => {
  /**
   * 
   */
  id.value = data
  /**
   * confirmation dialog
   */
  Swal.fire({
    title: 'Are you sure?',
    text: `Complete this feedback. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes, complete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      createComplete()
    } else {
      id.value = ''
    }
  })
}
const createComplete = async () => {
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
    const res = await server.put(`api/feedback/complete/${authStore.id}`, {
      feedbackID: id.value
    })
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
     * load detail & response
     */
    getFeedback()
    getResponse()
    /**
     * disbale loading & complete dialog
     */
    $q.loading.hide()
    completeDialog.value = false
  } catch (error) {
    /**
     * disbale loading & complete dialog
     */
     $q.loading.hide()
     completeDialog.value = false
  }
}
/**
 * cancel
 */
const cancel = (data) => {
  /**
   * 
   */
  id.value = data
   /**
   * confirmation dialog
   */
  Swal.fire({
    title: 'Are you sure?',
    text: `Cancel this feedback. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes, cancel it!'
  }).then((result) => {
    if (result.isConfirmed) {
      createCancel()
    } else {
      id.value = ''
    }
  })
}
const createCancel = async () => {
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
    const res = await server.put(`api/feedback/cancel/${id.value}`)
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
     * disbale loading & dialog
     */
    $q.loading.hide()
    cancelDialog.value = false
    /**
     * return to feedback
     */
    navStore.currentPage = 'FeedbackOverviewPage'
  } catch (error) {
    /**
     * disbale loading
     */
     $q.loading.hide()
     cancelDialog.value = false
  }
}

/**
 * show evidence
 */
const showEvidence = (p, idx) => {
  img.value = p
  slide.value = idx
  photoDialog.value = true
}

onMounted(() => {
  /**
   * get details
   */
  getFeedback()
   /**
    * get response
    */
  getResponse()
})
</script>

<style scoped>
.profile-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 10px solid #ecf0fc;
}
.card-border {
  border: 1px solid #ecf0fc;
  border-radius: 5px;
}
.card-wrapper {
  max-height: 600px;
  overflow: auto;
}
.card-response {
  height: 80vh;
  overflow-y: scroll;
}
.card-response::-webkit-scrollbar {
    display: none;
}
.card-response {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
}
</style>
