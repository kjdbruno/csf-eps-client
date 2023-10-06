<template>
    <q-page>
      <div class="q-pa-md">
        <q-card class="card bg-white no-shadow">
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="userStore.avatar">
                </q-avatar>
              </q-item-section>
  
              <q-item-section>
                <q-item-label class="text-h6 text-bold text-dark text-uppercase">{{ userStore.name }}</q-item-label>
                <q-item-label caption>{{ userStore.email }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
  
          <q-separator />
          
          <div class="q-pl-md q-pr-md q-pt-lg">
            <div class="profile-container text-center">
                <q-img class="profile-pic" :src="avatar" @click="$refs.file.click()" />
                <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
            </div>
            <div class="text-center">
                <q-btn unelevated rounded color="primary" label="Upload profile photo" class="q-mt-sm q-mb-sm" size="sm" @click="$refs.file.click()" />
            </div>
            <q-input color="primary" outlined rounded v-model="name" type="text" label="Name" class="q-ma-xs" :error-message="errors.name.msg" :error="errors.name.type"/>
            <q-select color="primary" emit-value map-options outlined rounded v-model="sexID" use-input standout="bg-blue-grey-1 text-grey-7" input-debounce="0" label="Choose Sex..." :options="preferenceStore.sexes" @filter="filterSex" behavior="menu" class="q-ma-xs" :error-message="errors.sexID.msg" :error="errors.sexID.type">
                <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                </q-item>
                </template>
            </q-select>
            <q-input color="primary" outlined rounded v-model="number" type="text" label="Contact No." mask="###########" class="q-ma-xs" :error-message="errors.number.msg" :error="errors.number.type"/>

            <div class="q-pa-xs q-mb-sm" v-if="hasError">
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

            <q-btn unelevated rounded color="primary" size="lg" class="q-mt-md full-width" label="submit" @click="updateProfile" :loading="innerLoading">
                <template v-slot:loading>
                    <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
                </template>
            </q-btn>
        </div>

        </q-card>
      </div>
    </q-page>
  </template>
  
<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerIos } from 'quasar'
import { useUserStore } from 'src/store/user-store'
import { usePreferenceStore } from 'src/store/preference-store'
import { server } from 'src/boot/axios'
import { useRouter } from 'vue-router'
  
/**
 * declarations
 */
const $q = useQuasar()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()

const innerLoading = ref(false)

const name = ref('')
const sexID = ref('')
const number = ref('')
const avatar = ref('')

const err = ref([])
const hasError = ref(null)
  
/**
 * errors and validation
 */
const errors = reactive({
    name: {msg: null, type: null},
    sexID: {msg: null, type: null},
    number: {msg: null, type: null},
    avatar: {msg: null, type: null},
})
  
const updateValidation = () => {
    let isError = false
    // name
    if (name.value.length < 1) {
    errors.name.msg = 'Please enter your name'
    errors.name.type = true
    isError = true
    } else {
    errors.name.msg = null
    errors.name.type = null
    }
    // sex id
    if (sexID.value.length < 1) {
    errors.sexID.msg = 'Please enter your sex'
    errors.sexID.type = true
    isError = true
    } else {
    errors.sexID.msg = null
    errors.sexID.type = null
    }
    // contact number
    if (number.value.length < 1) {
    errors.number.msg = 'Please enter your contact number'
    errors.number.type = true
    isError = true
    } else {
    errors.number.msg = null
    errors.number.type = null
    }
    // avatar
    if (avatar.value.length < 1) {
    errors.avatar.msg = 'Please enter your avatar'
    errors.avatar.type = true
    isError = true
    } else {
    errors.avatar.msg = null
    errors.avatar.type = null
    }

    return isError
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
    avatar.value = e.target.result;
    };
    reader.readAsDataURL(file);
}
  
/**
 * update profile
 */
const updateProfile = async () => {

    const isError = updateValidation()
    if (isError) return false

    innerLoading.value = true
    hasError.value = false

    try {
        await server.put(`api/community/update/${userStore.id}`, {
            name: name.value,
            sexID: sexID.value,
            number: number.value,
            avatar: avatar.value
        })
        // fetch account and store account to account store -> src/store/user-store.js
        const res = await userStore.fetchUser()
        userStore.setUser(res.data[0])
        // retrieve aithorized account from account stoe -> src/store/account-store.js
        retrieveAccount()
        innerLoading.value = false
    } catch (error) {
        innerLoading.value = false
        err.value = error.response.data.errors
        hasError.value = true
    }

}
/**
 * fiter sex
 */
const filterSex = (val, update) => {
    if (val === '') {
    update(() => {
        preferenceStore.sexes = preferenceStore.optSexes
    })
    return
    }
    update(() => {
    const needle = val.toLowerCase()
    preferenceStore.sexes = preferenceStore.sexes.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
    })
}
/**
 * retrieve account details from account store -> src/store/account-store.js
 */
const retrieveAccount = () => {
    name.value = userStore.name
    sexID.value = userStore.sexID
    number.value = userStore.number
    avatar.value = userStore.avatar
}
  
onMounted(() => {
/**
 * get account detail from account store
 */
retrieveAccount()
})
  
  </script>
  
  <style scoped>
  .card{
    border-radius: 25px;
  }
  .profile-pic {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 10px solid #ecf0fc;
  }
  </style>
  