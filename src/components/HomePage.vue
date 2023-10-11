<template>
  <div class="home-page">
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">Dashboard</div>
    <q-separator />
    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-9">
        <div class="row q-col-gutter-sm">
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 box_1">
            <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalRegistrant }}</q-item-label>
                  <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Registrants</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-img src="~assets/icons/d_registrant.png" width="60px" />
                </q-item-section>
              </q-item>
              <q-inner-loading :showing="innerLoading">
                <q-spinner-puff size="25px" color="grey" />
              </q-inner-loading>
            </q-card>
          </div>
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 box_1">
            <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalFeedback }}</q-item-label>
                  <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Feedbacks</q-item-label>
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
          <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12 box_1">
            <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalDiscussion }}</q-item-label>
                  <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Discussion/Poll</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-img src="~assets/icons/d_discussion.png" width="60px" />
                </q-item-section>
              </q-item>
              <q-inner-loading :showing="innerLoading">
                <q-spinner-puff size="25px" color="grey" />
              </q-inner-loading>
            </q-card>
          </div>
        </div>
        <!--GRAPH-->
        <div class="q-mt-sm">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div><span class="text-h6 text-uppercase text-bold">overview</span>&nbsp;<span class="text-caption">{{ authStore.yr }}</span></div>
                </div>

                <div class="col-auto">
                  <q-tabs v-model="tab" dense class="text-grey" active-color="white" :indicator-color="$q.dark.isActive ? 'dark' : 'white'" align="right" narrow-indicator :active-bg-color="$q.dark.isActive ? 'primary' : 'primary'" >
                    <q-tab name="registrant" label="Registrants" />
                    <q-tab name="feedback" label="Feedbacks" />
                  </q-tabs>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-tab-panels v-model="tab" animated transition-next="fade" transition-prev="fade">
                <q-tab-panel name="registrant">
                  <div class="row q-col-gutter-xs">
                    <div class="col-8">
                      <ApexCharts width="100%" height="250px" type="bar" :options="registrantOptions" :series="registrantSeries"></ApexCharts>
                    </div>
                    <div class="col">
                      <ApexCharts width="100%" height="250px" type="pie" :options="demographicOptions" :series="demographicSeries"></ApexCharts>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel name="feedback">
                  <div class="row q-col-gutter-xs">
                    <div class="col-5">
                      <ApexCharts width="100%" height="250px" type="line" :options="monthlyOptions" :series="monthlySeries"></ApexCharts>
                    </div>
                    <div class="col">
                      <ApexCharts width="100%" height="250px" type="bar" :options="officeOptions" :series="officeSeries"></ApexCharts>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
            <q-inner-loading :showing="innerLoading">
              <q-spinner-puff size="25px" color="grey" />
            </q-inner-loading>
          </q-card>
          <q-card class="no-shadow q-mt-sm" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div><span class="text-h6 text-uppercase text-bold">Feedback Per Day</span>&nbsp;<span class="text-caption">{{ authStore.yr }}</span></div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <ApexCharts width="100%" height="300px" type="line" :options="periodOptions" :series="periodSeries"></ApexCharts>
            </q-card-section>
            <q-inner-loading :showing="innerLoading">
              <q-spinner-puff size="25px" color="grey" />
            </q-inner-loading>
          </q-card>
        </div>
      </div>
      <div class="col">
        <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
          <q-card-section>
            <div><span class="text-h6 text-uppercase text-bold">satisfaction Rating</span>&nbsp;<span class="text-caption">{{ authStore.yr }}</span></div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">overall rating</q-item-label>
                <q-item-label class="text-caption text-bold text-capitalize" :class="cy_ovr > py_ovr ? 'text-green' : 'text-red'">{{ cy_ovr > py_ovr ? 'increase' : 'decrease' }} by <span>{{ per_ovr }}</span><span>%</span></q-item-label>

              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ cy_ovr }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">feedback rating</q-item-label>
                <q-item-label class="text-caption text-bold text-capitalize" :class="cy_fb > py_fb ? 'text-green' : 'text-red'">{{ cy_fb > py_fb ? 'increase' : 'decrease' }} by <span>{{ per_fb }}</span><span>%</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ cy_fb }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">kiosk rating</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-caption" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">physical</q-item-label>
                <q-item-label class="text-caption">The work environment is clean & orderly</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ krphy }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-caption" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">services</q-item-label>
                <q-item-label class="text-caption">Your concern is addressed promptly & appropriately</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ krser }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-caption" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">personnel</q-item-label>
                <q-item-label class="text-caption">The employee was courteous & accomodating</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ krper }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-uppercase text-bold text-caption" :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'" style="letter-spacing: 1px;">overall rating</q-item-label>
                <q-item-label class="text-caption">How satisfied are you with the quality of service?</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label :class="$q.dark.isActive ? 'text-white' : 'text-grey-7'"><span class="text-h5 text-bold">{{ krovr }}</span><span class="text-h5">%</span></q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
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
import ApexCharts from "vue3-apexcharts";

const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()
const preferenceStore = usePreferenceStore()

const totalRegistrant = ref(0)
const totalFeedback = ref(0)
const totalDiscussion = ref(0)

const cy_ovr = ref(0)
const py_ovr = ref(0)
const per_ovr = ref(0)

const cy_fb = ref(0)
const py_fb = ref(0)
const per_fb = ref(0)

const krphy = ref(0)
const krser = ref(0)
const krper = ref(0)
const krovr = ref(0)

const registrant = ref(false)
const feedback = ref(false)

const tab = ref('feedback')

const innerLoading = ref(false)

/**
 * registrant
 */
const registrantOptions = ref({
  xaxis: {
    categories: []
  },
  colors: ['#224488', '#FFCB08']
})
const registrantSeries = ref([{
  data: []
}])
/**
 * demographic
 */
const demographicSeries = ref([])
const demographicOptions = ref({
  labels: [],
  colors: ['#224488', '#FFCB08']
  // theme: {
  //   palette: 'palette7'
  // }
})
/**
 * monthly feedback
 */
const monthlyOptions = ref({
  chart: {
    id: 'Monthly',
    zoom: {
      enabled: false
    },
  },
  stroke: {
    curve: 'stepline',
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: 'Number of Feedback'
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    offsetY: 0
  },
  colors: ['#224488', '#FFCB08'] 
})
const monthlySeries = ref([])
/**
 * per day
 */
/**
 * monthly feedback
 */
 const periodOptions = ref({
  chart: {
    id: 'Monthly',
    zoom: {
      enabled: false
    },
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: 'Feedback per Day'
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    offsetY: 0
  },
  colors: ['#224488', '#FFCB08']
})
const periodSeries = ref([])
/**
 * Per Office
 */
 const officeOptions = ref({
  chart: {
    id: 'Office',
    stacked: true,
  },
  xaxis: {
    categories: []
  },
  yaxis: {
    title: {
      text: 'Feedback per Office'
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    offsetY: 0
  },
})
const officeSeries = ref([])
/**
 * view registrant
 */
const viewRegistrant = () => {
  registrant.value = true
  feedback.value = false
}

/**
 * view feedback
 */
const viewFeedback = () => {
  registrant.value = false
  feedback.value = true
}

/**
 * get dashboard data
 */
const getDashboard = async () => {
  /**
   * enable loading
   */
  innerLoading.value = true
  try {
    const res = await server.get(`api/overview/${authStore.id}`)
    const dt = res.data
    //
    totalRegistrant.value = res.data.totalRegistrant
    totalFeedback.value = res.data.totalFeedback
    totalDiscussion.value = res.data.totalDiscussion
    // totalPoll.value = res.data.totalPoll
    //overall rating
    cy_ovr.value = res.data.or_current
    py_ovr.value = res.data.or_prev
    per_ovr.value = res.data.or_percent
    //feedback rating
    cy_fb.value = res.data.fb_current
    py_fb.value = res.data.fb_prev
    per_fb.value = res.data.fb_percent
    // kiosk rating
    krphy.value = res.data.kr_phy
    krser.value = res.data.kr_ser
    krper.value = res.data.kr_per
    krovr.value = res.data.kr_ovr
    //
    const rOption = []
    const rSeries = []
    dt.registrant.forEach(val => {
      rOption.push(val.label)
      rSeries.push(val.count)
    });
    registrantOptions.value = {
      xaxis: {
        categories: rOption
      },
      colors: ['#224488', '#FFCB08']
    }
    registrantSeries.value = [{
      data: rSeries
    }]
    //
    const dOption = []
    const dSeries = []
    dt.demographic.forEach(val => {
      dOption.push(val.label)
      dSeries.push(val.count)
    });
    demographicSeries.value = dSeries
    demographicOptions.value = {
      labels: dOption,
      colors: ['#224488', '#FFCB08']
    }
    //
    const mOption = []
    const mSeries = []
    dt.monthlyFeedback.forEach(val => {
      mOption.push(val.label)
      mSeries.push(val.count)
    });
    monthlyOptions.value = {
      chart: {
        id: 'Monthly',
        zoom: {
          enabled: false
        },
      },
      stroke: {
        curve: 'stepline',
      },
      xaxis: {
        categories: mOption
      },
      yaxis: {
        title: {
          text: 'Number of Feedback'
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        offsetY: 0
      },
      colors: ['#224488', '#FFCB08']
    }
    monthlySeries.value = [
      {
        name: 'Feedback Count',
        data: mSeries
      },
    ]
    //
    const pOption = []
    const pSeries = []
    dt.periodFeedback.forEach(val => {
      pOption.push(val.date)
      pSeries.push(val.count)
    });
    periodOptions.value = {
      chart: {
        id: 'Monthly',
        zoom: {
          enabled: false
        },
      },
      xaxis: {
        categories: pOption
      },
      yaxis: {
        title: {
          text: 'Feedback per Day'
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        offsetY: 0
      },
      colors: ['#224488', '#FFCB08']
    }
    periodSeries.value = [
      {
        name: 'Feedback Count',
        data: pSeries
      },
    ]
    //
    const oOption = []
    const opSeries = []
    const ooSeries = []
    const ocSeries = []
    dt.officeFeedback.forEach(val => {
      oOption.push(val.label)
      opSeries.push(val.pending)
      ooSeries.push(val.ongoing)
      ocSeries.push(val.completed)
    });
    officeOptions.value = {
      chart: {
        id: 'Per Office',
        stacked: true,
      },
      xaxis: {
        categories: oOption
      },
      legend: {
        position: 'top',
        offsetY: 0
      },
      colors: ['#e53935', '#ffb300', '#43a047'], 
    }
    officeSeries.value = [
      {
        name: 'Pending',
        data: opSeries
      }, 
      {
        name: 'Ongoing',
        data: ooSeries
      }, 
      {
        name: 'Completed',
        data: ocSeries
      },
    ]
    /**
     * disbale loading
     */
    innerLoading.value = false
  } catch (error) {
    innerLoading.value = false
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    }
  }
}

/**
 * load as mounted
 */
onMounted(() => {
  /**
   * enable default view
   */
  registrant.value = true
  /**
   * get data
   */
  getDashboard()
})
</script>

<style lang="scss" scoped>

</style>