<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">discussion & poll report</div>
    <q-separator />
    <q-card class="no-shadow q-mt-md" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-3">
            <q-date v-model="date" range :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" />
          </div>
          <div class="col-3">
            <div class="q-mb-md">
              <div class="text-h5">Date Start:</div>
              <div class="text-h6">{{ moment(date.from).format("dddd, MMMM Do YYYY") }}</div>
            </div>
            <div class="q-mb-md">
              <div class="text-h5">Date End:</div>
              <div class="text-h6">{{ moment(date.to).format("dddd, MMMM Do YYYY") }}</div>
            </div>
            <div>
              <q-btn @click="generateSummary" size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="summary" class="q-mr-xs q-mt-xs"/>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="reportDialog" full-height full-width>
      <q-card>
        <q-btn icon="close" class="fixed bg-white" round dense v-close-popup style="top: 25px; right: 10px; transform: translateY(-50%); z-index: 999;" />
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
import { ref, reactive, watch } from 'vue'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import moment from 'moment'

const $q = useQuasar()

const date = ref('')
const file = ref('')
const reportDialog = ref(false)

/**
 * summary
 */
const generateSummary = async () => {
  
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: '#000'
  })

  const dt = date.value
  const from = moment(dt.from).format("YYYY-MM-DD")
  const to = moment(dt.to).format("YYYY-MM-DD")
  try {
    const res = await server.get(`api/report/discussion/summary?from=${from}&to=${to}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    })
    const blob = new Blob([res.data], {type: 'application/pdf'});
    const pdfurl = window.URL.createObjectURL(blob)+"#view=FitW";
    file.value = pdfurl
    reportDialog.value = true
    $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
  }
}

</script>

<style scoped>
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