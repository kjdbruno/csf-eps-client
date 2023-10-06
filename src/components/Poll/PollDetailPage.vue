<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'"><q-btn icon="arrow_back" flat round size="xs" @click="navStore.currentPage = 'PollPage'" />&nbsp;poll details</div>
    <q-separator />
    <div class="q-mt-md">
      <div class="row q-gutter-xs">
        <div class="col-4">
          <q-card v-if="!userLoading" flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <div v-for="(data, index) in detail" :key="index">
              <q-card-section>
                <q-item class="q-pa-none">
                  <q-item-section>
                    <q-item-label class="text-uppercase">{{ data.category }}</q-item-label>
                    <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-card-section>
              <q-card-section class="q-pt-none q-pb-xs">
                <div class="text-bold">{{ data.title }}</div>
                <div class="text-grey">{{ data.content }}</div>
              </q-card-section>
              <q-img class="cursor-pointer" :src="data.file" style="width: 100%;" />
            </div>
          </q-card>
          <q-card v-if="userLoading" class="no-shadow">
            <q-card-section class="text-center">
              <q-spinner-ios color="grey"  size="25px" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <div class="row q-gutter-xs">
            <div class="col-5">
              <q-card v-if="!formLoading" class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                <q-card-section class="q-pb-none" v-if="hasError">
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
                  <q-input autogrow stack-label outlined v-model="content" color="grey" label="Content..." class="q-mt-xs" :error-message="errors.content.msg" :error="errors.content.type" />
                  <q-btn v-ripple unelevated color="positive" label="submit" class="q-mt-md full-width" @click="createThread" />
                </q-card-section>
              </q-card>
              <q-card v-if="formLoading" class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                <q-card-section class="text-center">
                  <q-spinner-ios color="grey"  size="25px" />
                </q-card-section>
              </q-card>
            </div>
            <div class="col">
              <div v-if="!answerLoading && answer.length != 0" class="card-response">
                <q-card flat class="no-shadow q-mb-sm" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                  <q-card-section>
                    <div class="text-h6">Answer</div>
                  </q-card-section>
                  <q-separator />
                  <q-list>
                    <q-item v-for="(data, index) in answer" :key="index">
                      <q-item-section class="text-capitalize">{{ data.label }}</q-item-section>
                        <q-item-section avatar>
                          {{ data.count }}
                        </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
              <q-card v-if="answerLoading" flat class="no-shadow">
                <q-card-section class="text-center">
                  <q-spinner-ios color="grey"  size="25px" />
                </q-card-section>
              </q-card>
              <div v-show="answer.length == 0 && !answerLoading" class="q-mb-sm">
                <q-card flat class="no-shadow">
                  <q-card-section>
                    <div class="text-h6 text-grey">No answer found</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerIos, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { useNavStore } from 'src/store/nav-store'
import { usePreferenceStore } from 'src/store/preference-store'
import Swal from 'sweetalert2'
import moment from 'moment'

const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()

const userLoading = ref(false)
const formLoading = ref(false)
const answerLoading = ref(false)

const detail = ref([])
const answer = ref([])

const err = ref([])
const hasError = ref(false)

const content = ref('')

const errors = reactive({
  content: {msg: null, type: null}
})

/**
 * get detail
 */
const getPoll = async () => {
  /**
   * enable loading
   */
  userLoading.value = true
  try {
    const res = await server.get(`api/admin/poll/detail?id=${navStore.pollId}`)
    detail.value = res.data
    userLoading.value = false
  } catch (error) {
    userLoading.value = false
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
    const res = await server.get(`api/admin/poll/answer?id=${navStore.pollId}`)
    answer.value = res.data
    answerLoading.value = false
  } catch (error) {
    answerLoading.value = false
  }
}

/**
 * create answer
 */
const createThread = async () => {
  /**
   * disable has error
   */
  hasError.value = false
  /**
   * enable loading
   */
  formLoading.value = true
  try {
    const res = await server.post(`api/admin/poll/answer`, {
      questionId: navStore.pollId,
      content: content.value
    })
    /**
     * response msg
     */
    Swal.fire({
      title: 'Stored!',
      text: res.data.msg,
      icon: 'success',
      confirmButtonColor: '#0F9D58'
    })
    /**
     * reload answer
     */
    getAnswer()
    /**
     * disable loading
     */
    formLoading.value = false
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
    formLoading.value = false
  }
}

/**
 * load as mounted
 */
onMounted(() => {
  /**
   * get detail, thread
   */
  getPoll()
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
</style>