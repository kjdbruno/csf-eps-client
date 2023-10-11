<template>
    <div>
      <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'"><q-btn icon="arrow_back" flat round size="xs" @click="navStore.currentPage = 'FeedbackKioskPage'" />&nbsp;feedback kiosk details</div>
      <q-separator />
      <div class="q-mt-md">
        <div class="row q-gutter-xs">
          <div class="col-4">
            <q-card flat class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
              <q-card-section class="q-pa-none">
                <div class="profile-container text-center">
                  <q-img class="profile-pic" :src="photo" @click="$refs.file.click()" />
                  <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
                </div>
                <q-separator class="q-mt-md q-mb-md" />
                <div class="text-center">
                  <div class="text-h5 q-pa-none q-ma-none">{{ name }}</div>
                  <div class="text-caption q-pa-none q-ma-none">{{ office }}</div>
                  <div class="text-caption q-pa-none q-ma-none">{{ position }}</div>
                  <div class="text-caption q-pa-none q-ma-none">{{ description }}</div>
                </div>
              </q-card-section>
              <q-card-section>
                <q-list bordered>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="positive" name="check_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-uppercase">physical rating</q-item-label>
                            <q-item-label caption>The work environment is clean and orderly</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{ phyRating }}%</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="positive" name="check_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-uppercase">services rating</q-item-label>
                            <q-item-label caption>Your concern is addressed promptly and appropriately</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{ serRating }}%</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="positive" name="check_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-uppercase">personnel rating</q-item-label>
                            <q-item-label caption>The employee was courteous and accomodating</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{ perRating }}%</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-item-section avatar>
                            <q-icon color="positive" name="check_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-uppercase">overall rating</q-item-label>
                            <q-item-label caption>How satisfied are you with the quality of service provided</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{ ovrRating }}%</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
              </q-card-section>
              <q-inner-loading :showing="loading">
                <q-spinner-puff size="25px" color="grey" />
              </q-inner-loading>
            </q-card>
          </div>
          <div class="col">
            <q-card flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
                <q-table  title="List" flat :rows="list" :columns="columns" no-data-label="I didn't find anything for you" :loading="loading">
                    <template v-slot:body-cell-phy="props">
                        <q-td :props="props">
                            <div>
                                <q-icon :name="props.row.phyRating == 1 ? 'sentiment_very_dissatisfied' : (props.row.phyRating == 2 ? 'sentiment_neutral' : (props.row.phyRating == 3 ? 'sentiment_very_satisfied' : null)) " :color="props.row.phyRating == 1 ? 'red-10' : (props.row.phyRating == 2 ? 'amber-10' : (props.row.phyRating == 3 ? 'green-10' : null))" size="2em" />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-ser="props">
                        <q-td :props="props">
                            <div>
                                <q-icon :name="props.row.serRating == 1 ? 'sentiment_very_dissatisfied' : (props.row.serRating == 2 ? 'sentiment_neutral' : (props.row.serRating == 3 ? 'sentiment_very_satisfied' : null)) " :color="props.row.serRating == 1 ? 'red-10' : (props.row.serRating == 2 ? 'amber-10' : (props.row.serRating == 3 ? 'green-10' : null))" size="2em" />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-per="props">
                        <q-td :props="props">
                            <div>
                                <q-icon :name="props.row.perRating == 1 ? 'sentiment_very_dissatisfied' : (props.row.perRating == 2 ? 'sentiment_neutral' : (props.row.perRating == 3 ? 'sentiment_very_satisfied' : null)) " :color="props.row.perRating == 1 ? 'red-10' : (props.row.perRating == 2 ? 'amber-10' : (props.row.perRating == 3 ? 'green-10' : null))" size="2em" />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-ovr="props">
                        <q-td :props="props">
                            <div>
                                <q-icon :name="props.row.ovrRating == 1 ? 'sentiment_very_dissatisfied' : (props.row.ovrRating == 2 ? 'sentiment_neutral' : (props.row.ovrRating == 3 ? 'sentiment_very_satisfied' : null)) " :color="props.row.ovrRating == 1 ? 'red-10' : (props.row.ovrRating == 2 ? 'amber-10' : (props.row.ovrRating == 3 ? 'green-10' : null))" size="2em" />
                            </div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-action="props">
                        <q-td :props="props">
                            <q-btn unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="print" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="generateRating(props.row.id)" :loading="innerLoading && id == props.row.id">
                                <template v-slot:loading>
                                    <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
                                </template>
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </q-card>
          </div>
        </div>
      </div>
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
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { useNavStore } from 'src/store/nav-store'
import { server } from 'src/boot/axios'
import Swal from 'sweetalert2'

const $q = useQuasar()
const navStore = useNavStore()

const id = ref('')
const name = ref('')
const office = ref('')
const position = ref('')
const description = ref('')
const photo = ref('')
const phyRating = ref('')
const serRating = ref('')
const perRating = ref('')
const ovrRating = ref('')
const list = ref([])
  
const columns = ref([
  {name: 'phy', label: 'Physical Rating', field: '', sortable: true, align: 'center'},
  {name: 'ser', label: 'Service Rating', field: '', sortable: true, align: 'center'},
  {name: 'per', label: 'Personnel Rating', field: '', sortable: true, align: 'center'},
  {name: 'ovr', label: 'Overall Rating', field: '', sortable: true, align: 'center'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const loading = ref(false)
const innerLoading = ref(false)
const reportDialog = ref(false)
const file = ref('')

/**
 * 
 */
const getDetail = async () => {
    loading.value = true
    try {
        const res = await server.get(`api/kiosk/detail/${navStore.feedbackID}`)
        name.value = res.data.detail[0].name
        office.value = res.data.detail[0].office
        position.value = res.data.detail[0].position
        description.value = res.data.detail[0].description
        photo.value = res.data.detail[0].photo
        phyRating.value = res.data.rating[0].phyRating
        serRating.value = res.data.rating[0].serRating
        perRating.value = res.data.rating[0].perRating
        ovrRating.value = res.data.rating[0].ovrRating
        //
        list.value = res.data.list
        //
        loading.value = false
    } catch (error) {
        loading.value = false
    }
}

const generateRating = async (data) => {

    id.value = data
    innerLoading.value = true
  
  try {
    const res = await server.get(`api/kiosk/report/${data}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    })
    const blob = new Blob([res.data], {type: 'application/pdf'});
    const pdfurl = window.URL.createObjectURL(blob)+"#view=FitW";
    file.value = pdfurl
    reportDialog.value = true
    innerLoading.value = false
  } catch (error) {

  }
}

  
onMounted(() => {
    getDetail()
})
</script>
  
<style scoped>
.profile-pic 
{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 10px solid #ecf0fc;
}
.wrapper
{
    padding-left: 25%;
    padding-right: 25%;
}
</style>
  