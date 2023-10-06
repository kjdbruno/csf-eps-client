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
            <q-input color="primary" outlined rounded v-model="oldPassword" :type="showPwd ? 'text' : 'password'" label="Old Password"  class="q-ma-xs" :error-message="errors.oldPassword.msg" :error="errors.oldPassword.type"/>
            <q-input color="primary" outlined rounded v-model="newPassword" :type="showPwd ? 'text' : 'password'" label="New Password"  class="q-ma-xs" :error-message="errors.newPassword.msg" :error="errors.newPassword.type"/>
            <q-input color="primary" outlined rounded v-model="confirmPassword" :type="showPwd ? 'text' : 'password'" label="Confirm Pasword"  class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
            <div class="q-mt-md">
                <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
            </div>
            
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

            <q-btn unelevated rounded color="primary" size="lg" class="q-mt-md full-width" label="submit" @click="resetPassword" :loading="innerLoading">
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
import { server } from 'src/boot/axios'
  
/**
 * declarations
 */
const $q = useQuasar()
const userStore = useUserStore()
const innerLoading = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showPwd = ref(false)

const err = ref([])
const hasError = ref(null)
  
/**
 * errors and validation
 */
const errors = reactive({
    oldPassword: {msg: null, type: null},
    newPassword: {msg: null, type: null},
    confirmPassword: {msg: null, type: null}
})

const resetValidation = () => {
    let isError = false
    // old password
    if (oldPassword.value.length < 1) {
        errors.oldPassword.msg = 'Please enter your old password'
        errors.oldPassword.type = true
        isError = true
    } else {
        errors.oldPassword.msg = null
        errors.oldPassword.type = null
    }
    // new password
    if (newPassword.value.length < 1) {
        errors.newPassword.msg = 'Please enter your new password'
        errors.newPassword.type = true
        isError = true
    } else {
        errors.newPassword.msg = null
        errors.newPassword.type = null
    }
    // confirm password
    if (confirmPassword.value.length < 1) {
        errors.confirmPassword.msg = 'Please enter your confirm password'
        errors.confirmPassword.type = true
        isError = true
    } else if (newPassword.value != confirmPassword.value) {
        errors.confirmPassword.msg = 'Password does not match'
        errors.confirmPassword.type = true
        isError = true
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

    innerLoading.value = true

    try {
        await server.put(`api/community/reset/${userStore.id}`, {
            oldPassword: oldPassword.value,
            password: newPassword.value,
            password_confirmation: confirmPassword.value
        })
        innerLoading.value = false
        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (error) {
        innerLoading.value = false
        err.value = error.response.data.errors
        hasError.value = true
    }
}
  
</script>

<style lang="scss" scoped>
.card
{
    border-radius: 25px;
    .profile-pic {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 10px solid #ecf0fc;
    }
}
</style>
  