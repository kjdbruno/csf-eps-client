<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">reset password</div>
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
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="text-h5 text-capitalize">reset my password</div>
            </q-card-section>
            <q-separator/>
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
              <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="password" :type="showPwd ? 'text' : 'password'" label="Password" class="q-ma-xs" :error-message="errors.password.msg" :error="errors.password.type"/>
              <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="confirmPassword" :type="showPwd ? 'text' : 'password'" label="Confirm Password" class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
              <div class="q-mt-md">
                <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="lg" label="reset my password" @click="resetPassword" class="text-capitalize full-width" :loading="submitting">
                <template v-slot:loading>
                  <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
                </template>
              </q-btn>
            </q-card-section>
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
import { server } from 'src/boot/axios'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')

const submitting = ref(false)

const showPwd = ref(false)

const err = ref([])
const hasError = ref(false)

const errors = reactive({
  password: {msg: null, type: null},
  confirmPassword: {msg:null, type: null},
})

const resetValidation = () => {
  let isError = false
  //password
  if (password.value.length < 1) {
    errors.password.msg = 'Please enter your password'
    errors.password.type = true
    isError = true
  } else if (password.value.length > 0 && password.value.length < 4) {
    errors.password.msg = 'The minimum password length is 4 character'
    errors.password.type = true
    isError = true
  } else {
    errors.password.msg = null
    errors.password.type = null
  }
  //confirm password
  if (confirmPassword.value.length < 1) {
    errors.confirmPassword.msg = 'Please enter your confirm Password'
    errors.confirmPassword.type = true
    isError = true
  } else if (confirmPassword.value.length > 0 && confirmPassword.value.length < 4) {
    errors.confirmPassword.msg = 'The minimum confirm password length is 4 character'
    errors.confirmPassword.type = true
    isError = true
  } else if (password.value != confirmPassword.value) {
    errors.confirmPassword.msg = 'The password you enter does not match'
    errors.confirmPassword.type = true
  } else {
    errors.confirmPassword.msg = null
    errors.confirmPassword.type = null
  }

  return isError
}

/**
 * reset password
 */
const resetPassword = async () => {

  hasError.value = false
  
  const isError = resetValidation()
  if (isError) return false

  submitting.value = true

  try {
    const res = await server.put(`api/my/reset/${authStore.id}`, {
      password: password.value,
      password_confirmation: confirmPassword.value
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
    submitting.value = false
    password.value = ''
    confirmPassword.value = ''
  } catch (error) {
    err.value = error.response.data.errors
    hasError.value = true
    submitting.value = false
  }

}

onMounted(() => {

})
</script>

<style scoped>
.profile-pic {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 10px solid #ecf0fc;
}
</style>
