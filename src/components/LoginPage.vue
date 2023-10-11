<template>
    <q-page class="page">
      <div class="limiter">
        <div class="container-login100">
          <div class="wrap-login100" :class="$q.dark.isActive ? 'bg-dark' : 'bg-light'">
            <div class="login100-pic js-tilt" data-tilt>
              <img v-if="!$q.dark.isActive" src="~assets/logo/logo_blue.png" alt="IMG">
              <img v-if="$q.dark.isActive" src="~assets/logo/logo_white.png" alt="IMG">
            </div>
            <div class="login100-form">
              <q-input outlined v-model="email" type="email" label="E-mail" :color="$q.dark.isActive ? 'white' : 'primary'" class="full-width q-mb-xs" :error-message="errors.email.msg" :error="errors.email.type">
                <template v-slot:prepend>
                  <q-icon name="person" style="font-size: 1rem;" />
                </template>
              </q-input>
              <q-input outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Password" :color="$q.dark.isActive ? 'white' : 'primary'" class="full-width q-mb-md" :error-message="errors.password.msg" :error="errors.password.type">
                <template v-slot:prepend>
                  <q-icon name="lock" style="font-size: 1rem;" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" style="font-size: 1.2rem;" />
                </template>
              </q-input>
              <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" size="lg" label="sign in" @click="login" text-color="white" class="text-capitalize full-width" :loading="loading">
                <template v-slot:loading>
                  <q-spinner-puff :color="$q.dark.isActive ? 'primary' : 'white'" />&nbsp;Signing in...
                </template>
              </q-btn>
              <q-btn flat label="Kiosk" size="sm" class="q-mt-md" color="primary" @click="navStore.currentPage = 'KioskPage'"/>
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
            </div>
          </div>
        </div>
        <div id="overlay" :class="$q.dark.isActive ? 'overlay-dark' : 'overlay-light'"></div>
      </div>
      <q-btn v-if="$q.platform.is.desktop" unelevated round color="dark" icon="arrow_back" class="absolute" size="md" style="top: 35px; left: 15px; transform: translateY(-50%); z-index: 5;" @click="navStore.currentPage = 'WelcomePage'" />
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
  
  const email = ref('')
  const password = ref('')
  
  const err = ref([])
  const hasError = ref(false)
  
  const isPwd = ref(true)
  
  const loading = ref(false)
  
  const errors = reactive({
    email: {msg: null, type: null},
    password: {msg: null, type: null}
  })
  
  const isValidEmail = (val) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
    return !emailPattern.test(val)
  }
  
  const loginValidation = () => {
    let isError = false
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
    } else if (password.value.length > 0 && password.value.length < 4) {
      errors.password.msg = 'The minimum password length is 4 character'
      errors.password.type = true
      isError = true
    } else {
      errors.password.msg = null
      errors.password.type = null
    }
  
    return isError
  }
  
  /**
   * Login function
   */
  const login = async () => {
  
    const isError = loginValidation()
    if (isError) return false
  
    loading.value = true
  
    try {
      await authStore.getSanctumCookie()
      const auth = await authStore.login(email.value, password.value)
      const user = await authStore.fetchUser()
      authStore.setUser(user.data[0])
      authStore.token = auth.config.headers
      navStore.currentPage = 'HomePage'
      router.push('/admin/workplace')
      loading.value = false
    } catch (error) {
      err.value = error.response.data.errors
      hasError.value = true
      loading.value = false
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
  /* background-color: rgba(0,0,0,0.3); */
  z-index: 1;
  cursor: pointer;
  }
  .overlay-dark{
    background-color: rgba(29, 29, 29, 0.7);
  }
  .overlay-light{
    background-color: rgba(0,0,0,0.6);
  }
  </style>
  