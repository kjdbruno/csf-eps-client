<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">my account</div>
    <q-separator />
    <div class="q-mt-md">
      <div class="row q-gutter-xs">
        <div class="col-4">
          <q-card flat class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section class="q-pa-none">
              <div class="profile-container text-center">
                <q-img class="profile-pic" :src="authStore.avatar" @click="$refs.file.click()" />
                <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
              </div>
              <q-separator class="q-mt-md q-mb-md" />
              <div class="text-center">
                <div class="text-h5 q-pa-none q-ma-none">{{ authStore.name }}</div>
                <div class="text-caption q-pa-none q-ma-none">{{ authStore.email }}</div>
                <div class="text-caption q-pa-none q-ma-none">{{ authStore.role }}</div>
                <div class="text-caption q-pa-none q-ma-none">{{ authStore.office }}</div>
                <div class="text-caption q-pa-none q-ma-none">{{ authStore.position }}</div>
              </div>
              <div class="wrapper q-mt-lg">
                <q-select :color="$q.dark.isActive ? 'white' : 'primary'" emit-value map-options outlined v-model="yearID" stack-label use-input input-debounce="0" label="Choose Year..." :options="preferenceStore.years" @filter="filterYear" behavior="menu" class="q-ma-xs" :error-message="errors.yearID.msg" :error="errors.yearID.type">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                      No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <div class="q-pa-xs">
                  <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="sm" label="active year" @click="setYear" class="text-capitalize full-width" :loading="yrSumitting">
                    <template v-slot:loading>
                      <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
                    </template>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <div class="text-h5 text-capitalize">edit my account</div>
            <q-separator/>
            <div class="q-mt-sm">
              <q-input v-model="name" outlined type="text" label="Name" :color="$q.dark.isActive ? 'white' : 'dark'" stack-label :error-message="errors.name.msg" :error="errors.name.type" class="q-ma-xs" />
              <q-input v-model="email" outlined type="email" label="E-mail" :color="$q.dark.isActive ? 'white' : 'dark'" stack-label :error-message="errors.email.msg" :error="errors.email.type" class="q-ma-xs" readonly />
              <q-input v-model="role" outlined type="text" label="Role" :color="$q.dark.isActive ? 'white' : 'dark'" stack-label class="q-ma-xs" readonly />
              <q-input v-model="office" outlined type="text" label="Office" :color="$q.dark.isActive ? 'white' : 'dark'" stack-label class="q-ma-xs" readonly />
              <q-input v-model="position" outlined type="text" label="Position" :color="$q.dark.isActive ? 'white' : 'dark'" stack-label class="q-ma-xs" readonly />
              <div v-if="!avatar" class="q-pa-xs">
                <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="sm" label="upload profile photo" @click="$refs.file.click()" class="text-capitalize"/>
              </div>
              <div v-else class="q-pa-xs">
                <q-list bordered>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <img :src="avatar">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>Profile Photo</q-item-section>
                    <q-item-section side>
                      <q-btn round unelevated size="sm" icon="delete" @click="removePhoto" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <q-separator class="q-mt-md q-mb-md" />
              <div class="q-pa-xs">
                <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="lg" label="update my account" @click="updateAccount" class="text-capitalize full-width" :loading="usrSubmitting">
                  <template v-slot:loading>
                      <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
                    </template>
                </q-btn>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerIos } from 'quasar'
import { useAuthStore } from 'src/store/auth-store'
import { usePreferenceStore } from 'src/store/preference-store'
import { server } from 'src/boot/axios'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const preferenceStore = usePreferenceStore()

const avatar = ref('')
const name = ref('')
const email = ref('')
const role = ref('')
const office = ref('')
const position = ref('')
const yearID = ref('')

const yrSumitting = ref(false)
const usrSubmitting = ref(false)

const err = ref([])
const hasError = ref(false)

const errors = reactive({
  name: {msg:null, type: null},
  email: {msg: null, type: null},
  avatar: {msg: null, type: null},
  yearID: {msg:null, type:null}
})

const accountValidation = () => {
  let isError = false
  //name
  if (name.value < 1) {
    errors.name.msg = 'Please enter your name'
    errors.name.type = true
    isError = true
  } else {
    errors.name.msg = null
    errors.name.type = null
  }

  return isError
}

const yearValidation = () => {
  let isError = false
  //year
  if (yearID.value < 1) {
    errors.yearID.msg = 'Please enter your year'
    errors.yearID.type = true
    isError = true
  } else {
    errors.yearID.msg = null
    errors.yearID.type = null
  }

  return isError
}

/**
 * aupdate my account
 */
const updateAccount = async () => {

  const isError = accountValidation()
  if (isError) return false

  usrSubmitting.value = true

  try {
    const res = await server.put(`api/my/account/${authStore.id}`, {
      name: name.value,
      avatar: avatar.value
    })
    const user = await authStore.fetchUser()
    authStore.setUser(user.data[0])
    usrSubmitting.value = false
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
  } catch (error) {
    err.value = error.response.data.errors
    hasError.value = true
    usrSubmitting.value = false
  }

}
/**
 * set year
 */
const setYear = async () => {
  /**
   * validate form
   */
   const isError = yearValidation()
  if (isError) return false
  /**
   * enable loading
   */
   yrSumitting.value = true

  try {
    const res = await server.put(`api/my/setting/${authStore.id}`, {
      yearID: yearID.value
    })
    yrSumitting.value = false
    const user = await authStore.fetchUser()
    authStore.setUser(user.data[0])
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
  } catch (error) {
    err.value = error.response.data.errors
    hasError.value = true
    yrSumitting.value = false
  }
}

const getUser = () => {
  name.value = authStore.name
  email.value = authStore.email
  role.value = authStore.role
  office.value = authStore.office
  position.value = authStore.position
  avatar.value = authStore.avatar
  yearID.value = authStore.yearID
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
 * remove photo
 */
const removePhoto = () => {
  avatar.value = ''
}
/**
 * filter year
 */
const filterYear = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.years = preferenceStore.optYears
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.years = preferenceStore.years.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

onMounted(() => {
  /**
   * populate user
   */
  getUser()
})
</script>

<style scoped>
.profile-pic {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 10px solid #ecf0fc;
}
.wrapper{
  padding-left: 25%;
  padding-right: 25%;
}
</style>
