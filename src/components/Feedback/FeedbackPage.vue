<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">feedback overview</div>
    <q-separator />
    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalFeedback }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Feedback</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_feedback.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalPending }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Pending</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/f_pending.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalOngoing }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Ongoing</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/f_ongoing.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalCompleted }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Completed</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/f_completed.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-sm q-col-gutter-sm">
      <div class="col-md-3 col-lg-3 col-sm-3 col-xs-12">
        <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
          <q-card-section>
            <div class="text-h5">Preview</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-item class="q-pb-sm q-pt-sm">
              <q-item-section>
                <q-item-label class="text-h4" style="font-weight: 500;letter-spacing: 3px;">{{ rating }}&nbsp;%</q-item-label>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">Satisfaction Rating</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="tag_faces" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-item class="q-mt-lg q-pb-sm q-pt-sm">
              <q-item-section>
                <q-item-label class="text-h4" style="font-weight: 500;letter-spacing: 3px;">{{ totalDelayed }}</q-item-label>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">Delayed</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="hourglass_empty" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-item class="q-mt-lg q-pb-sm q-pt-sm">
              <q-item-section>
                <q-item-label class="text-h4" style="font-weight: 500;letter-spacing: 3px;">{{ totalCancelled }}</q-item-label>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">Cancelled</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="close" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'" size="60px"></q-icon>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-9 col-lg-9 col-sm-9 col-xs-12">
        <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h5">List</div>
              </div>
              <div class="col-auto">
                <q-input outlined dense debounce="500" :color="$q.dark.isActive ? 'white' : 'primary'" v-model="filter" placeholder="Search...">
                  <template v-slot:prepend>
                    <q-icon name="search" style="font-size: 1rem;" />
                  </template>
                  <template v-if="filter" v-slot:append>
                    <q-icon @click="filter = ''" name="cancel" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-table flat :rows="lists" :columns="columns" row-key="name" :loading="tableLoading" no-data-label="I didn't find anything for you">
              <template v-slot:body-cell-active="props">
                <q-td :props="props">
                  <q-badge :color="props.row.isActive ? 'positive' : 'negative'" rounded class="q-mr-sm" />{{props.row.isActive ? 'ACTIVE' : 'INACTIVE'}}
                </q-td>
              </template>
              <template v-slot:body-cell-category="props">
                <q-td :props="props">
                  <div class="text-uppercase text-caption">
                    {{props.row.category}}
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-complainant="props">
                <q-td :props="props">
                  <q-item class="q-pa-none" style="max-width: 400px">
                    <q-item-section avatar class="q-pa-none">
                      <q-avatar>
                        <img :src="props.row.avatar">
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-uppercase">{{ props.row.complainant }}</q-item-label>
                      <q-item-label caption>{{ props.row.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-td>
              </template>
              <template v-slot:body-cell-office="props">
                <q-td :props="props">
                  <div style="max-width: 120px;">
                    <q-badge v-for="(dt, index) in props.row.offices" :key="index" :color="dt.isReceived && !dt.isDelayed ? 'green' : (!dt.isReceived && !dt.isDelayed ? 'red' : (dt.isDelayed ? 'purple' : null))" class="q-mr-xs q-mt-xs">{{ dt.office }}</q-badge>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip>
                    <q-avatar :color="props.row.status == 1 ? 'red-7' : props.row.status == 2 ? 'amber-7' : props.row.status == 3 ? 'green-7' : props.row.status == 4 ? 'purple-7': null" text-color="white" :icon="props.row.status == 1 ? 'pending' : props.row.status == 2 ? 'model_training' : props.row.status == 3 ? 'verified' : props.row.status == 4 ? 'hourglass_empty': null" />
                    <span class="text-caption text-uppercase">{{props.row.status == 1 ? 'Pending' : props.row.status == 2 ? 'Ongoing' : props.row.status == 3 ? 'Completed' : props.row.status == 4 ? 'Delayed': null}}</span>
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div v-if="(authStore.isAdmin || authStore.isSup || authStore.isMgmt)">
                    <q-btn v-if="props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="detail(props.row.id)">
                      <q-tooltip anchor="top middle" self="top middle">Details</q-tooltip>
                    </q-btn>
                  </div>
                  <div v-if="authStore.isEncoder">
                    <q-btn v-if="props.row.rCount <= 0 && props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="downloading" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="receive(props.row.id)">
                      <q-tooltip anchor="top middle" self="top middle">Receive</q-tooltip>
                    </q-btn>
                    <q-btn v-if="props.row.rCount > 0 && props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="detail(props.row.id)">
                      <q-tooltip anchor="top middle" self="top middle">Details</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { useNavStore } from 'src/store/nav-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()

const lists = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'complainant', label: 'Client', field: '', sortable: true, align: 'left'},
  {name: 'category', label: 'Category', field: '', sortable: true, align: 'left'},
  {name: 'office', label: 'Office/s', field: '', sortable: true, align: 'left'},
  {name: 'status', label: 'Status', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const tableLoading = ref(false)
const innerLoading = ref(false)

const totalFeedback = ref('')
const totalPending = ref('')
const totalOngoing = ref('')
const totalCompleted = ref('')
const rating = ref('')
const totalDelayed = ref('')
const totalCancelled = ref('')

const id = ref('')

const filter = ref('')
/**
 * get feedback overview
 */
const getAllFeedback = async () => {
  /**
   * enable table, inner loading
   */
  tableLoading.value = true
  innerLoading.value = true
  try {
    const res = await server.get(`api/feedback/overview/${authStore.id}`)
    /**
     * get listd
     */
    // lists.value = res.data.list
    /**
     * total feedback, pending, ongoing, completed, satisfaction, delayed, cancelled
     */
    totalFeedback.value = res.data.totalFeedback
    totalPending.value = res.data.totalPending
    totalOngoing.value = res.data.totalOngoing
    totalCompleted.value = res.data.totalCompleted
    totalDelayed.value = res.data.totalDelayed
    totalCancelled.value = res.data.totalCancelled
    rating.value = res.data.satisfactionRate
    /**
     * disable table, inner loading
     */
    tableLoading.value = false
    innerLoading.value = false
  } catch (error) {

  }
}
/**
 * view detail
 */
const detail = (id) => {
  navStore.feedbackId = id
  navStore.currentPage = 'FeedbackDetailPage'
}

/**
 * receive feedback
 */
const receive = (data) => {

  id.value = data
  /**
   * confirmation dialog
   */
   Swal.fire({
    title: 'Are you sure?',
    text: `Receive feedback. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes, receive it!'
  }).then((result) => {
    if (result.isConfirmed) {
      receiveFeedback()
    } else {
      id.value = ''
    }
  })
}

/**
 * receive feedback function: save/update
 */
const receiveFeedback = async () => {
  /**
   * enable save loading
   */
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    const res = await server.put(`api/feedback/receive/${authStore.id}`, {
      feedbackID: id.value
    })
    /**
     * disable save loading
     */
     $q.loading.hide()
    /**
     *
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
     * get feedback
     */
    getAllFeedback()
    getAllFeedbackList()
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
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
  }
}
/**
 * get feedback list
 */
 const getAllFeedbackList = async () => {
  /**
   * enable table loading
   */
  tableLoading.value = true
  try {
    const res = await server.get(`api/feedback/list/${authStore.id}`)
    /**
     * get listd
     */
    lists.value = res.data
    /**
     * disable table loading
     */
    tableLoading.value = false
  } catch (error) {

  }
}
// search data
const searchList = debounce(async (val) => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/feedback/list/${authStore.id}?filter=${val}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
})
// watch search text
watch(() => filter.value, searchList)

onMounted(() => {
  /**
   * get all feedback
   */
  getAllFeedback()
   /**
    * get feedback list
    */
  getAllFeedbackList()
})
</script>
