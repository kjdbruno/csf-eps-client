<template>
    <div>
      <q-page class="signin-page bg-primary mobile-only">
        <q-header class="bg-primary q-pt-md q-pb-md">
          <q-toolbar class="bg-primary">
            <q-btn round unelevated icon="arrow_back" class="bg-blue-9" @click="navStore.currentPage = 'WelcomePage'" />
            <q-toolbar-title class="text-h5 title text-capitalize">Sign in</q-toolbar-title>
            <q-space />
            <q-avatar>
              <!-- <img src="~assets/ask_logo_white.png"> -->
            </q-avatar>
          </q-toolbar>
        </q-header>
        <card class="bg-white card-wrapper fixed-center">
          <q-card-section>
            <q-input rounded outlined v-model="email" type="email" label="E-mail" class="q-ma-xs" :error-message="errors.email.msg" :error="errors.email.type" color="primary" />
            <q-input rounded outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Password" :error-message="errors.password.msg" :error="errors.password.type" color="primary">
              <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" style="font-size: 1.2rem;" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section v-if="hasError">
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
            <q-btn rounded unelevated color="primary" size="lg" label="Sign In" class="full-width text-capitalize" @click="login" :loading="saving">
              <template v-slot:loading>
                <q-spinner-puff />
              </template>
            </q-btn>
          </q-card-section>
        </card>
      </q-page>
      <q-page class="signin-page bg-primary desktop-only">
        <q-header class="bg-primary q-pt-md q-pb-md">
          <q-toolbar class="bg-primary">
            <q-btn round unelevated icon="arrow_back" class="bg-blue-9" @click="navStore.currentPage = 'WelcomePage'" />
            <q-toolbar-title class="text-h5 title text-capitalize">Sign in</q-toolbar-title>
            <q-space />
            <q-avatar>
              <!-- <img src="~assets/ask_logo_white.png"> -->
            </q-avatar>
          </q-toolbar>
        </q-header>
        <card class="bg-white card-wrapper fixed-center">
          <q-card-section>
            <q-input rounded outlined v-model="email" type="email" label="E-mail" class="q-ma-xs" :error-message="errors.email.msg" :error="errors.email.type" color="primary" />
            <q-input rounded outlined v-model="password" :type="isPwd ? 'password' : 'text'" label="Password" :error-message="errors.password.msg" :error="errors.password.type" color="primary">
              <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" style="font-size: 1.2rem;" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section v-if="hasError">
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
            <q-btn rounded unelevated color="primary" size="lg" label="Sign In" class="full-width text-capitalize" @click="login" :loading="saving">
              <template v-slot:loading>
                <q-spinner-puff />&nbsp;Signing in...
              </template>
            </q-btn>
          </q-card-section>
        </card>
      </q-page>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useQuasar, QSpinnerPuff } from 'quasar'
  import { useUserStore } from 'src/store/user-store';
  import { useRouter } from 'vue-router'
  import { useNavStore } from 'src/store/nav-store'
  
  const $q = useQuasar()
  const userStore = useUserStore()
  const navStore = useNavStore()
  const router = useRouter()
  
  const email = ref('')
  const password = ref('')
  
  const saving = ref(false)
  const isPwd = ref(true)
  
  const err = ref([])
  const hasError = ref(false)
  
  const errors = reactive({
    email: { msg: null, type: null },
    password: { msg: null, type: null },
  })
  
  const isValidEmail = (val) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
    return !emailPattern.test(val)
  }
  
  const validation = () => {
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
      errors.password.msg = 'The minimum password length is 8 character'
      errors.password.type = true
      isError = true
    } else {
      errors.password.msg = null
      errors.password.type = null
    }
  
    return isError
  }
  
  const login = async () => {
  
    hasError.value = false
  
    const isError = validation()
    if (isError) return false
  
    saving.value = true
  
    try {
      await userStore.getSanctumCookie()
      const auth = await userStore.login(email.value, password.value)
      const user = await userStore.fetchUser()
      userStore.setUser(user.data[0])
      userStore.token = auth.config.headers
      navStore.currentPage = 'HomePage'
      router.push('/workplace')
      saving.value = false
    } catch (error) {
      err.value = error.response.data.errors
      hasError.value = true
      saving.value = false
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .mobile-only
  {
    .card-wrapper
    {
      width: 90%;
      border-radius: 50px;
      padding: 50px 0px 50px 0px;
      max-height: 80%;
      overflow: auto;
    }
  }
  
  .desktop-only
  {
    .card-wrapper
    {
      width: 40%;
      border-radius: 50px;
      padding: 50px 0px 50px 0px;
      max-height: 80%;
      overflow: auto;
    }
  }
  </style>