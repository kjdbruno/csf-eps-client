<template>
  <q-page class="page">
    <div class="limiter">
      <div class="container-login100">
        <div class="wrap-login100">
          <div class="login100-pic js-tilt" data-tilt>
              <img src="~assets/logo.png" alt="IMG">
          </div>
          <div class="login100-form">
            <q-input outlined v-model="firstname" label="Firstname" color="grey" class="full-width q-mb-xs" :error-message="errors.firstname.msg" :error="errors.firstname.type"/>
            <q-input outlined v-model="lastname" label="Lastname" color="grey" class="full-width q-mb-xs" :error-message="errors.lastname.msg" :error="errors.lastname.type" />
            <q-input outlined v-model="email" type="email" label="E-mail" color="grey" class="full-width q-mb-xs" :error-message="errors.email.msg" :error="errors.email.type"/>
            <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Password" color="grey" class="full-width q-mb-md" :error-message="errors.password.msg" :error="errors.password.type">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" style="font-size: 1.2rem;" />
              </template>
            </q-input>
            <q-btn unelevated color="primary" size="lg" label="register" @click="register" class="text-white text-capitalize full-width">
              <template v-slot:loading>
                <q-spinner-puff />
              </template>
            </q-btn>
            <div class="q-mt-md" v-if="hasError">
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
            <div class="q-mt-lg text-center">
              <q-btn unelevated flat color="primary" size="sm" label="login" to="/" class="text-capitalize"/>
            </div>
          </div>
        </div>
      </div>
      <div id="overlay"></div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, QSpinnerIos } from 'quasar'
import { useAuthStore } from 'src/store/auth-store'
import { useNavStore } from 'src/store/nav-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()
const navStore = useNavStore()

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')

const err = ref([])
const hasError = ref(false)

const isPwd = ref(true)

const errors = reactive({
  firstname: {msg: null, type: null},
  lastname: {msg: null, type: null},
  email: {msg: null, type: null},
  password: {msg: null, type: null}
})

const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return !emailPattern.test(val)
}

const registerValidation = () => {
  let isError = false
  //firstname
  if (firstname.value < 1) {
    errors.firstname.msg = 'Please enter your firstname'
    errors.firstname.type = true
    isError = true
  } else {
    errors.firstname.msg = null
    errors.firstname.type = null
  }
  //lastname
  if (lastname.value < 1) {
    errors.lastname.msg = 'Please enter your lastname'
    errors.lastname.type = true
    isError = true
  } else {
    errors.lastname.msg = null
    errors.lastname.type = null
  }
  //email
  if (email.value.length < 1) {
    errors.email.msg = 'Please enter your email'
    errors.email.type = true
    isError = true
  } else if (email.value.length > 0 && isValidEmail(email.value)) {
    errors.email.msg = 'The email you entered is not valid'
    errors.email.type = true
    isError = true
  } else {
    errors.email.msg = null
    errors.email.type = null
  }
  //password
  if (password.value.length < 1) {
    errors.password.msg = 'Please enter your password'
    errors.password.type = true
    isError = true
  } else if (password.value.length > 0 && password.value.length < 8) {
    errors.password.msg = 'The minimum password length is 8 character'
    errors.password.type = true
    isError = true
  } else {
    errors.password.msg = null
    errors.password.type = null
  }

  return isError
}

/**
 * Register function
 */
const register = async () => {

  const isError = registerValidation()
  if (isError) return false

  $q.loading.show({
    spinner: QSpinnerIos,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })

  try {
    await authStore.getSanctumCookie()
    await authStore.register(firstname.value, lastname.value, email.value, password.value)
    $q.loading.hide()
    router.push('/')
  } catch (error) {
    err.value = error.response.data.errors
    hasError.value = true
    $q.loading.hide()
  }

}


</script>

<style scoped>
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
  background: url('~assets/bg1.jpg') no-repeat top center / cover;
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
  width: 760px;
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
background-color: rgba(0,0,0,0.3);
z-index: 1;
cursor: pointer;
}
</style>
