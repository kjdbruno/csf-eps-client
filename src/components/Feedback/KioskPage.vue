<template>
    <div>
        
      <q-stepper v-model="step" ref="stepper" done-color="green" active-color="secondary" :inactive-color="$q.dark.isActive ? 'grey-7' : 'grey'" animated class="no-shadow" transition-prev="jump-left" transition-next="jump-right">
            
        <q-step :name="1" title="OFFICE" :done="step > 1" >
          <div class="text-center">
            <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">what office and who will you rate?</div>
            <div>
              <q-select :color="$q.dark.isActive ? 'white' : 'primary'" emit-value map-options outlined v-model="officeID" use-input input-debounce="0" label="Choose Office..." :options="preferenceStore.offices" @filter="filterOffice" behavior="menu" class="full-width" :error-message="errors.officeID.msg" :error="errors.officeID.type" @popup-hide="preferenceStore.fetchPersonnel(officeID)">
                <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> No results</q-item-section>
                </q-item>
                </template>
              </q-select>
              <!-- <q-select :color="$q.dark.isActive ? 'white' : 'primary'" emit-value map-options outlined v-model="personnelID" use-input input-debounce="0" label="Choose Personnel..." :options="preferenceStore.personnels" @filter="filterPersonnel" behavior="menu" class="full-width q-mt-sm" :error-message="errors.personnelID.msg" :error="errors.personnelID.type">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey"> No results</q-item-section>
                  </q-item>
                </template>
              </q-select> -->
              <q-select :color="$q.dark.isActive ? 'white' : 'primary'" outlined v-model="personnelID" :options="preferenceStore.personnels" label="Choose Personnel..."  use-input input-debounce="0" @filter="filterPersonnel" :error-message="errors.personnelID.msg" :error="errors.personnelID.type" class="full-width q-mt-xs">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label>{{ scope.opt.office }} - {{ scope.opt.position }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-step>

        <q-step :name="2" title="PHYSICAL" :done="step > 2" >
          <div class="text-center">
            <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">the work environment is clean and orderly</div>
            <div>
              <q-rating v-model="phyRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
            </div>
          </div>
        </q-step>

        <q-step :name="3" title="SERVICES" :done="step > 3" >
          <div class="text-center">
            <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">your concern is addressed promply and appropriately</div>
            <div>
              <q-rating v-model="serRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
            </div>
          </div>
        </q-step>

        <q-step :name="4" title="PERSONNEL" :done="step > 4" >
          <div class="text-center">
            <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">the employee was courteous and accomodating</div>
            <div>
              <q-rating v-model="perRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
            </div>
          </div>
        </q-step>

        <q-step :name="5" title="OVERALL RATING" :done="step > 5" >
          <div class="text-center">
            <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">how satisfied are you with the quality of service provided?</div>
            <div>
              <q-rating v-model="ovrRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
            </div>
          </div>
        </q-step>

        <q-step :name="6" title="SUGGESTIONS" :done="step > 6" >
          <div class="text-center">
            <div class="text-h4 text-uppercase" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">suggestions/comments/commendations</div>
            <q-input class="q-mt-md" v-model="suggestion" outlined type="textarea" :color="$q.dark.isActive ? 'white' : 'primary'" />
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation class="q-mt-lg text-center">
            <q-btn size="md" unelevated v-if="step > 1" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" @click="$refs.stepper.previous()" label="Back" class="q-mr-sm" />
            <q-btn size="md" unelevated @click="step === 6 ? createRating() : $refs.stepper.next()" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" :label="step === 6 ? 'Finish' : 'Continue'" :loading="innerLoading">
              <template v-slot:loading>
                <q-spinner-puff />
              </template>
            </q-btn>
          </q-stepper-navigation>
        </template>
      </q-stepper>

      <div class="q-pa-sm" v-if="hasError">
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

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { server } from 'src/boot/axios'
import { usePreferenceStore } from 'src/store/preference-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const preferenceStore = usePreferenceStore()

const officeID = ref('')
const personnelID = ref('')
const phyRadio = ref(0)
const serRadio = ref(0)
const perRadio = ref(0)
const ovrRadio = ref(0)
const suggestion = ref('')

const innerLoading = ref(false)

const step = ref(1)

const icons = ref([
  'sentiment_dissatisfied',
  'sentiment_neutral',
  'sentiment_satisfied'
])
const iconSelected = ref([
  'sentiment_very_dissatisfied',
  'sentiment_neutral',
  'sentiment_very_satisfied'
])
const colors = ref([
  'red-10',
  'amber-10',
  'green-10'
])

const err = ref([])
const hasError = ref(false)

const errors = reactive({
  officeID: { msg: null, type: null },
  personnelID: {msg: null, text: null}
})

const validation = () => {
  let isError = false
  //office
  if (officeID.value.length < 1) {
    errors.officeID.msg = 'Please enter your office'
    errors.officeID.type = true
    isError = true
  } else {
    errors.officeID.msg = null
    errors.officeID.type = null
  }
  //personnel
  if (personnelID.value.length < 1) {
    errors.personnelID.msg = 'Please enter your personnel'
    errors.personnelID.type = true
    isError = true
  } else {
    errors.personnelID.msg = null
    errors.personnelID.type = null
  }

  return isError
}

/**
 * 
 */
const filterOffice = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.offices = preferenceStore.optOffices
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.offices = preferenceStore.offices.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

/**
 * 
 */
 const filterPersonnel = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.personnels = preferenceStore.optPersonnels
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.personnels = preferenceStore.personnels.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

/**
 * create ratng
 */
const createRating = async () => {
  /**
   * validate label and code
   */
  const isError = validation()
  if (isError) {
    step.value = 1
    return false
  }
  // if (isError) return false
  //
  innerLoading.value = true
  hasError.value = false

  const personnel = personnelID.value

  try {
    const res = await server.post('api/feedback/entry/kiosk', {
      officeID: officeID.value,
      personnelID: personnel.id,
      phyRating: phyRadio.value,
      serRating: serRadio.value,
      perRating: perRadio.value,
      ovrRating: ovrRadio.value,
      suggestion: suggestion.value
    })
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
    $q.loading.hide()
    officeID.value = ''
    personnelID.value = ''
    phyRadio.value = 0
    serRadio.value = 0
    perRadio.value = 0
    ovrRadio.value = 0
    suggestion.value = ''
    step.value = 1
    //
    innerLoading.value = false
  } catch (error) {
    innerLoading.value = false
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    // //
    step.value = 1
    
  }
}

</script>