<template>
    <q-page class="page">
      <div class="fixed-center wrap">
        <q-card class="no-shadow q-pt-lg q-pb-lg q-mb-md card-wrapper">
          <q-card-section><div class="text-h3 text-center text-uppercase" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">your experience matters to us</div></q-card-section>
        </q-card>
        <q-card class="no-shadow card-wrapper">
          <q-card-section>
            <q-stepper v-model="step" ref="stepper" done-color="green" active-color="secondary" :inactive-color="$q.dark.isActive ? 'grey-7' : 'grey'" animated class="no-shadow" transition-prev="jump-left" transition-next="jump-right">
            
                <q-step :name="1" title="CLIENT" :done="step > 1" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">who are you?</div>
                    <div>
                    <q-input class="q-mt-xs" label="Name" v-model="name" outlined :color="$q.dark.isActive ? 'white' : 'primary'" />
                    <q-input class="q-mt-xs" label="Contact Number" v-model="number" outlined :color="$q.dark.isActive ? 'white' : 'primary'" />
                    <q-input class="q-mt-xs" label="E-mail" v-model="email" outlined :color="$q.dark.isActive ? 'white' : 'primary'" :error-message="errors.email.msg" :error="errors.email.type" />
                    </div>
                </div>
                </q-step>
        
                <q-step :name="2" title="OFFICE" :done="step > 2" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">what office and who will you rate?</div>
                    <div>
                    <q-select :color="$q.dark.isActive ? 'white' : 'primary'" emit-value map-options outlined v-model="officeID" use-input input-debounce="0" label="Choose Office..." :options="offices" @filter="filterOffice" behavior="menu" class="full-width" :error-message="errors.officeID.msg" :error="errors.officeID.type" @popup-hide="getPersonnel(officeID)">
                        <template v-slot:no-option>
                        <q-item>
                        <q-item-section class="text-grey"> No results</q-item-section>
                        </q-item>
                        </template>
                    </q-select>
                    <q-select :color="$q.dark.isActive ? 'white' : 'primary'" outlined v-model="personnelID" :options="personnels" label="Choose Personnel..."  use-input input-debounce="0" @filter="filterPersonnel" :error-message="errors.personnelID.msg" :error="errors.personnelID.type" class="full-width q-mt-xs">
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
        
                <q-step :name="3" title="PHYSICAL" :done="step > 3" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">the work environment is clean and orderly</div>
                    <div>
                    <q-rating v-model="phyRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
                    </div>
                </div>
                </q-step>
        
                <q-step :name="4" title="SERVICES" :done="step > 4" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">your concern is addressed promply and appropriately</div>
                    <div>
                    <q-rating v-model="serRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
                    </div>
                </div>
                </q-step>
        
                <q-step :name="5" title="PERSONNEL" :done="step > 5" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">the employee was courteous and accomodating</div>
                    <div>
                    <q-rating v-model="perRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
                    </div>
                </div>
                </q-step>
        
                <q-step :name="6" title="OVERALL RATING" :done="step > 6" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase q-mb-lg" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">how satisfied are you with the quality of service provided?</div>
                    <div>
                    <q-rating v-model="ovrRadio" max="3" size="10em" :color="colors" :icon="icons" :icon-selected="iconSelected" />
                    </div>
                </div>
                </q-step>
        
                <q-step :name="7" title="SUGGESTIONS" :done="step > 7" >
                <div class="text-center">
                    <div class="text-h4 text-uppercase" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">suggestions/comments/commendations</div>
                    <q-input class="q-mt-md" v-model="suggestion" outlined type="textarea" :color="$q.dark.isActive ? 'white' : 'primary'" />
                </div>
                </q-step>
        
                <template v-slot:navigation>
                <q-stepper-navigation class="q-mt-lg text-center">
                    <q-btn size="xl" unelevated v-if="step > 1" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" @click="$refs.stepper.previous()" label="Back" class="q-mr-sm" />
                    <q-btn size="xl" unelevated @click="step === 7 ? createRating() : $refs.stepper.next()" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" :label="step === 7 ? 'Finish' : 'Continue'" :loading="innerLoading">
                    <template v-slot:loading>
                        <q-spinner-puff />
                    </template>
                    </q-btn>
                </q-stepper-navigation>
                </template>
            </q-stepper>
          </q-card-section>
          <q-card-section v-if="hasError">
            <div class="q-pa-md div-error">
              <div v-for="(errorArray, idx) in err" :key="idx">
                <div v-for="(allErrors, idx) in errorArray" :key="idx">
                  <span class="text-h5 text-red">
                    <q-icon name="cancel" />
                    {{ allErrors}}
                  </span>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="50px" color="dark" />
          </q-inner-loading>
        </q-card>
      </div>
      <div id="overlay" :class="$q.dark.isActive ? 'overlay-dark' : 'overlay-light'"></div>
      <q-btn v-if="$q.platform.is.desktop" unelevated round color="dark" icon="verified_user" class="absolute" size="md" style="top: 35px; left: 15px; transform: translateY(-50%); z-index: 5;" @click="navStore.currentPage = 'LoginPage'" />
    </q-page>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { onMounted } from 'vue-demi'
  import { useQuasar, QSpinnerPuff } from 'quasar'
  import { server } from 'src/boot/axios'
  import { useNavStore } from 'src/store/nav-store'
  import Swal from 'sweetalert2'
  
  const $q = useQuasar()
  const navStore = useNavStore()

  const name = ref('')
  const number = ref('')
  const email = ref('')
  const officeID = ref('')
  const personnelID = ref('')
  const phyRadio = ref(0)
  const serRadio = ref(0)
  const perRadio = ref(0)
  const ovrRadio = ref(0)
  const suggestion = ref('')
  
  const offices = ref([])
  const optOffices = ref([])
  const personnels = ref([])
  const optPersonnels = ref([])
  
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
    'blue-10',
    'green-10'
  ])
  
  const err = ref([])
  const hasError = ref(false)
  
  const errors = reactive({
    name: { msg: null, type: null },
    number: { msg: null, type: null },
    email: { msg: null, type: null },
    officeID: { msg: null, type: null },
    personnelID: {msg: null, text: null}
  })
  
  /**
   * get office
   */
  const getOffice = async () => {
    try {
      const res = await server.get('api/endpoint/getOffice')
      offices.value = res.data
      optOffices.value = res.data
    } catch (error) {
  
    }
  }
  
  const getPersonnel = async () => {
    try {
      const res = await server.get(`api/endpoint/getPersonnel/${officeID.value}`)
      personnels.value = res.data
      optPersonnels.value = res.data
    } catch (error) {
  
    }
  }
  
  /**
   * 
   */
  const filterOffice = (val, update) => {
    if (val === '') {
      update(() => {
        offices.value = optOffices.value
      })
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      offices.value = offices.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
    })
  }
  
  /**
   * 
   */
   const filterPersonnel = (val, update) => {
    if (val === '') {
      update(() => {
        personnels.value = optPersonnels.value
      })
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      personnels.value = personnels.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
    })
  }
  
  /**
   * create ratng
   */
  const createRating = async () => {
    //
    innerLoading.value = true
    hasError.value = false
    try {
        const personnel = personnelID.value
      const res = await server.post('api/endpoint/kiosk', {
        name: name.value,
        number: number.value,
        email: email.value,
        officeID: officeID.value,
        personnelID: personnel.id,
        phyRating: phyRadio.value,
        serRating: serRadio.value,
        perRating: perRadio.value,
        ovrRating: ovrRadio.value,
        suggestion: suggestion.value
      })
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: res.data.msg,
        showConfirmButton: false,
        timer: 1500
      })
      $q.loading.hide()
      name.value = ''
      number.value = ''
      email.value = ''
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
      //
      step.value = 1
    }
  }
  
  onMounted(() => {
    getOffice()
  })
  
  </script>
  <style scoped>
  .wrap
  {
    z-index: 999;
    width: 75%;
  }
  .footer
  {
    border-color: none;
    position: absolute;
    bottom: 0;
  }
  .logo
  {
    width: 500px;
    height: auto;
  }
  
  .page {
    background: url('~assets/bg.png') no-repeat top center / cover;
  height: 100vh;
  /* opacity: 0.8; */
  }
  
  .limiter {
    width: 100%;
    margin: 0 auto;
  }
  
  .container-login100 {
    width: 100%;
    min-height: 100vh;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
  
  }
  
  .wrap-login100 {
    width: 90%;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 50px;
    z-index: 3;
  }
  
  .login100-pic {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 316px;
  }
  
  .login100-pic img {
    max-width: 80%;
  }
  
  .login100-form {
    width: 290px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  
  #overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: rgba(0,0,0,0.3); */
  z-index: 1;
  cursor: pointer;
  }
  .overlay-dark{
    background-color: rgba(29, 29, 29, 0.7);
  }
  .overlay-light{
    background-color: rgba(158,158,158, 0.7);
  }
  
  .radio-buttons
  {
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  
  .custom-radio input
  {
    display: none;
  }
  
  .radio-btn
  {
    margin: 10px;
    width: 180px;
    height: 200px;
    border: 3px solid transparent;
    display: inline-block;
    border-radius: 10px;
    position: relative;
    text-align: center;
    box-shadow: 0 0 20px #c3c3c367;
    cursor: pointer;
  }
  
  .radio-btn > i {
    color: #ffffff;
    background-color: #DB4437;
    font-size: 20px;
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%) scale(2);
    border-radius: 50px;
    padding: 3px;
    transition: 0.5s;
    pointer-events: none;
    opacity: 0;
  }
  
  .radio-btn .hobbies-icon
  {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .radio-btn .hobbies-icon img
  {
    display:block;
    width:100%;
    margin-bottom:20px;
  
  }
  .radio-btn .hobbies-icon i
  {
    color: #DB4437;
    line-height: 80px;
    font-size: 60px;
  }
  
  .radio-btn .hobbies-icon h3
  {
    color: #555;
    font-size: 18px;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing:1px;
  }
  
  .custom-radio input:checked + .radio-btn
  {
    border: 2px solid #DB4437;
  }
  
  .custom-radio input:checked + .radio-btn > i
  {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  
  .card-wrapper
  {
    width: 100%;
  }
  
  </style>
  