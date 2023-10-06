<template>
    <div>
      <!--MOBILE MODE-->
      <q-page class="signup-page bg-primary mobile-only">
        <q-header class="bg-primary q-pt-md q-pb-md">
          <q-toolbar class="bg-primary">
            <q-btn round unelevated icon="arrow_back" class="bg-blue-9" @click="navStore.currentPage = 'WelcomePage'" />
            <q-toolbar-title class="text-h5 title text-capitalize">Sign up</q-toolbar-title>
            <q-space />
            <q-avatar>
              <!-- <img src="~assets/logo_only_white.png"> -->
            </q-avatar>
          </q-toolbar>
        </q-header>
        <card class="bg-white card-wrapper fixed-center">
          <q-card-section>
            <q-input rounded outlined v-model="name" color="primary" type="text" label="Name" class="q-ma-xs" :error-message="errors.name.msg" :error="errors.name.type"/>
            <q-separator class="q-mt-sm q-mb-sm" />
            <q-input rounded outlined v-model="email" color="primary" type="email" label="E-mail" class="q-ma-xs" :error-message="errors.email.msg" :error="errors.email.type" />
            <q-input rounded outlined v-model="password" color="primary" :type="showPwd ? 'text' : 'password'" label="Password" class="q-ma-xs" :error-message="errors.password.msg" :error="errors.password.type"/>
            <q-input rounded outlined v-model="confirmPassword" color="primary" :type="showPwd ? 'text' : 'password'" label="Confirm Password" class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
            <div class="q-mt-md">
              <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
            </div>
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
            <q-btn rounded unelevated size="lg" label="Sign Up" class="full-width text-capitalize text-white" color="primary" @click="register" />
          </q-card-section>
        </card>
      </q-page>
      <!--DESKTOP MODE-->
      <q-page class="signup-page bg-primary desktop-only">
        <q-header class="bg-primary q-pt-md q-pb-md">
          <q-toolbar class="bg-primary">
            <q-btn round unelevated icon="arrow_back" class="bg-blue-9" @click="navStore.currentPage = 'WelcomePage'" />
            <q-toolbar-title class="text-h5 title text-capitalize">Sign up</q-toolbar-title>
            <q-space />
            <q-avatar>
              <!-- <img src="~assets/logo_only_white.png"> -->
            </q-avatar>
          </q-toolbar>
        </q-header>
        <card class="bg-white card-wrapper fixed-center">
          <q-card-section>
            <q-input rounded outlined v-model="name" color="primary" type="text" label="Name" class="q-ma-xs" :error-message="errors.name.msg" :error="errors.name.type"/>
            <q-separator class="q-mt-sm q-mb-sm" />
            <q-input rounded outlined v-model="email" color="primary" type="email" label="E-mail" class="q-ma-xs" :error-message="errors.email.msg" :error="errors.email.type" />
            <q-input rounded outlined v-model="password" color="primary" :type="showPwd ? 'text' : 'password'" label="Password" class="q-ma-xs" :error-message="errors.password.msg" :error="errors.password.type"/>
            <q-input rounded outlined v-model="confirmPassword" color="primary" :type="showPwd ? 'text' : 'password'" label="Confirm Password" class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
            <div class="q-mt-md">
              <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
            </div>
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
            <q-btn rounded unelevated size="lg" label="Sign Up" class="full-width text-capitalize text-white" color="primary" @click="register" />
          </q-card-section>
        </card>
      </q-page>
      <q-dialog v-model="termsDialog" persistent>
        <q-card class="card-wrapper">
          <q-card-section class="row items-center">
            <div class="text-h6">Terms of Use and Data Privacy</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
  
          <q-separator />
  
          <q-card-section style="max-height: 50vh" class="scroll">
            <div>
              <div class="text-subtitle2 text-weight-bold">Terms of Use</div>
              <div class="text-caption text-justify">Welcome to the e-Participation System – a community engagement platform where you can freely raise your concerns, join in the community discussions and answer poll to achieve an inclusive People’s City by 2025.</div>
              <div class="text-caption text-justify q-mt-sm">Read the following Terms of Use and Privacy Policy carefully. By continuing to access or use the e-Participation System, you understand and agree, without limitation or qualification, to these terms.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Your Use of the Application</div>
              <div class="text-caption text-justify">Upon downloading ePS (e-Participation System) from our official website at sanfernandocity.gov.ph or goggle drive, you agree to access and use the system for lawful purposes only. You are responsible for the knowledge of and adherence to any and all laws, executive orders, ordinances, resolutions pertaining to the use of ePS.</div>
              <div class="text-caption text-justify q-mt-sm">By making use of the system, you agree that you will not:</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to commit or encourage the conduct of any criminal offense or civil liability.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS for political reasons which may tarnish the credibility of the City Government</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS as a platform for inappropriate actions such as: use the platform for business, for cyber-bullying, for creating fraud accounts</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to discriminate any individual or group based on the account of age, sex, sexual orientation and gender identity, civil status, disability, religion, ethnicity, or political affiliation.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to impersonate other individuals, parties or entities</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to upload any content that contains software virus or any other files or computer codes that may disrupt and/or alter the functionality of the system</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to publish content that you do not have the right to share or disseminate or to delete and alter any content published on the system</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;use the ePS to disrupt the City Government, and claim a relationship or represent the City Government without proper authorization and authentication</div>
              <div class="text-caption text-justify q-mt-sm">The City Government of San Fernando, La Union reserves the right make necessary actions to accounts that are being used for any of the prohibited acts enumerated above.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Your Password and Account Security</div>
              <div class="text-caption text-justify">By creating an account under the e-Participation System, you understand and agree that you are completely responsible for the security and confidentiality of your passwords in associated with any account you use of the system. Any activity or occurrence in your account is solely your responsibility.</div>
              <div class="text-caption text-justify q-mt-sm">If you notice any irregularity in your account activity, please contact the City Government of San Fernando e-Participation System here: eps.csflu@gmail.com. </div>
              <div class="text-caption text-justify q-mt-sm">The City Government of San Fernando, La Union reserves the right to suspend your account if we notice unnecessary use and performance of prohibited acts stated above.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Information You Provide</div>
              <div class="text-caption text-justify">In order to maximize the use of the e-Participation system, you may be required to provide your personal information. All the information you provide must be correct and up to date. With this, you give consent to the City Government of San Fernando to properly use your personal information in accordance with the RA 10173 or the Data Privacy Act of 2012. </div>
              <div class="text-caption text-justify q-mt-sm">To know more about how we use the information you provide, please check the ePS Privacy Policy below.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Intellectual Property</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union values and respects the intellectual property of others. We demand you to do the same. </div>
              <div class="text-caption text-justify q-mt-sm">All other content, design, information, graphics, images, pages, interfaces, links, software and other materials contained, published and displayed on eps.sanfernandocity.gov.ph, including the selection, are property of the City Government of San Fernando, La Union.</div>
              <div class="text-caption text-justify q-mt-sm">If you feel that any content that has been published and copied belongs to you, you may submit a Takedown Request sent to eps.csflu@gmail.com.</div>
              <div class="text-caption text-justify q-mt-sm">If you wish to use any content published on eps.sanfernandocity.gov.ph, please practice proper citation.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Disclaimer</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union is not responsible for damages of any kind that may arise from the use of, or the inability to use eps.sanfernandocity.gov.ph or any of the materials contained on eps.sanfernandocity.gov.ph whether the materials contained on eps.sanfernandocity.gov.ph are from the City Government of San Fernando, La Union or a third party.</div>
              <div class="text-caption text-justify q-mt-sm">Amendments and/or periodical changes to the executive orders, resolutions, ordinances and other laws, as well as changes in schedules in events, projects, programs and activities may or may not be immediately reflected in the system.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Miscellaneous Terms</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union reserves the right to revise or amend these terms without notice. Any amendment in these terms is effective immediately upon posting, unless stated otherwise.</div>
              <div class="text-caption text-justify q-mt-sm">Your continued use of ePS following the publishing of the amendments automatically means your acceptance of the amendments. You are advised to review the Terms of Use from time to time. </div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Purpose</div>
              <div class="text-caption text-justify">As we have always valued your privacy, we continue to push for ways to uphold your privacy that is why it is important for us to let you know the data we collect from you, how we use it and how we want you to have meaningful control over it.</div>
              <div class="text-caption text-justify q-mt-sm">Our privacy policy explains how the e-Participation System – a community engagement platform of the City Government of San Fernando, La Union collects, uses and discloses information about you. This will also describe your options with regards to the use of, access to, updating and correcting your Personal Information.</div>
              <div class="text-caption text-justify q-mt-sm">We are committed to maintaining your confidence and trust in us, that is why we pledge the following:</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Keeping you informed: We will keep you informed with our privacy practices as well as update you with changes in these practices, if the need arises.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Keeping your information safe: We have designed a system that will safeguard your information in accordance with the Data Privacy Act of 2012.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Scope</div>
              <div class="text-caption text-justify">This privacy policy applies to all Personal Information we collect when you use or access the ePS.</div>
              <div class="text-caption text-justify q-mt-sm">Personal Information, as defined through Republic Act 10173 or the Data Privacy Act 2012, refers to any information, whether recorded in material form or not, from which the identity of an individual is apparent or can be reasonably and directly ascertained by the entity holding the information, or when put together with other information would directly and certainly identify an individual.</div>
              <div class="text-caption text-justify q-mt-sm">All individuals whose responsibilities include the processing of personal information through the e-Participation System on behalf of the City Government of San Fernando, La Union are expected to protect these data by adhering to this policy.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Types of Information We Collect</div>
              <div class="text-caption text-justify">&bull;&nbsp;Information you Provied Us</div>
              <div class="text-caption text-justify q-ml-sm">We collect information you provide to us directly through the following:</div>
              <div class="text-caption text-justify q-ml-md">&bull;&nbsp;Account Registration: To access the services of the ePS, you as a user is asked to provide to the system you will be asked to provide your name, birthday, address and contact number.</div>
              <div class="text-caption text-justify q-ml-md">&bull;&nbsp;Feedback Processing: When you use the report service function by reporting a concern or sharing a feedback with a certain service provided by the City Government of San Fernando, La Union, we may collect information from you such as your name, email address, home address and contact number for easier verification of information as well as immediate and appropriate action.</div>
              <div class="text-caption text-justify q-ml-md">&bull;&nbsp;Discussions and Polls: Discussions and polls may be conducted from time to time to improve our service delivery systems. If you decide to participate in these, you may be asked to provide personal information. Note that participation in discussions and/or polls are voluntary, therefore all information you provide to us is voluntary and given with consent.</div>
  
              <div class="text-caption text-justify">&bull;&nbsp;Information We Collect Automatically</div>
              <div class="text-caption text-justify q-ml-md">&bull;&nbsp;Location Information: Information about your device location may be collected each time you access or use the e-Participation System or otherwise consent to the collection of this information.</div>
              <div class="text-caption text-justify q-ml-md">&bull;&nbsp;Analytics: We may use our analytics to collect information regarding client and visitor behavior and demographics which will be used in the development of the content produced through the e-Participation System as well as the development of other City Government of San Fernando, La Union produced content. This however is not tied to any form of personal information.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Use of Information</div>
              <div class="text-caption text-justify">The personal information we collect, acquire and hold is used for the following reasons:</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Help the City Government of San Fernando, La Union respond to any concern, feedback or request which is not readily available on the e-Participation System.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Investigate a problem reported to the City Government through the e-Participation System.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Help the City Government improve on the delivery of services to the public.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Dissemination informational and key development updates on topics such as, but not limited to, public benefits and services and well as upcoming City projects, programs and events. If the user does not agree to receive further information through email and online marketing, the City Government will not send such information. If the user however agrees to receive further information, the City Government of San Fernando, La Union will only send information in categories that are authorized by the user.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Sharing information within the departments in the City Government or other government agencies with the sole purpose of facilitating services and benefits, in accordance with all national and local laws and regulations.</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union does not in any way rent out or sell personally identifiable information provided by the client/citizen. The City would not exchange or trade information to third parties without the ultimate consent of the information owner.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Sharing of Information</div>
              <div class="text-caption text-justify">The information we have acquired, collected and held may be shared if the following reason/s arise:</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;The information provided may be disclosed if a request is made under the Freedom of Information Law or court order, if such information is not protected by national or local law.</div>
              <div class="text-caption text-justify q-ml-sm">&bull;&nbsp;Using the e-Participation System constitutes the user’s consent to the City’s monitoring of all uses of the system. However, if such monitoring reveals possible evidence of criminal activity or any other unauthorized use, the individuals responsible for monitoring the e-Participation System may provide your information and report such activity to authorized law enforcement agencies such as but not limited to the Philippine National Police.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Retention</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union retains the personal information we collected (as identified in this policy) for as long as the use of our services are necessary to fulfil the purpose/s by which it was collected.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Monitoring and Security</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union will always integrate the protection of personal information into the design, implementation and day-to-day operations of the e-Participation System. </div>
              <div class="text-caption text-justify q-mt-sm">For instances that provides an opportunity for a user to receive or create a password to access or submit personally identifiable information, the user must not disclose or divulge his/her password to anyone. </div>
              <div class="text-caption text-justify q-mt-sm">The City Government, and the individuals responsible for the management of the e-Participation System is strictly prohibited to ask or demand to a user for a password through a telephone call, e-mail. direct message via social media sites or other forms of unsolicited information. </div>
              <div class="text-caption text-justify q-mt-sm">To ensure maximum cyber safety, once a user finishes using an application or applications which are password protected, they must exit the relevant page/s. If the server is publicly-accessible and owned, the user must close or shut down the entire session as well as flush any temporary caches down the entire session and log-out all of the applications.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Children's Privacy Protection</div>
              <div class="text-caption text-justify">The City Government of San Fernando, La Union does not knowingly collect, maintain and/or use personal information from minors (children 18 years and below). Should you have learned that your child has provided personal information, you may inform us through eps.csflu@gmail.com.</div>
              <div class="text-caption text-justify q-mt-sm">Should personal information be collected from minors (children 18 years old and below), we will promptly take steps to delete such information.</div>
            </div>
            <div class="q-mt-md">
              <div class="text-subtitle2 text-weight-bold">Other Right and Important Information</div>
              <div class="text-caption text-justify">Amendments to the Privacy Policy: Amendments to the Privacy Policy may be done for the improvement of the system. If you continue to visit and use the e-Participation System after changes in the policy has been made, you automatically provide your consent to the changes.</div>
              <div class="text-caption text-justify q-mt-sm">Publishing Amendments to the Privacy Policy: Significant changes to the policy would mean publishing of the amended policy through the e-Participation System, through email or as otherwise required by law. Any published amendment of the policy will take effect immediately upon publishing.</div>
              <div class="text-caption text-justify q-mt-sm">New Uses of Personal Information: Before using your personal information for any new reason or purpose not stated above, the City Government of San Fernando, La Union will provide information regarding the new purpose and ask for your consent. Failure to give consent will automatically mean we cannot process your personal information for any new or additional purpose.</div>
            </div>
            <div class="q-mt-md row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-bold">I have read and agree to the Terms and Privacy Policy</div>
              </div>
  
              <div class="col-auto">
                <q-toggle v-model="policy" color="primary" :icon="policy ? 'check' : 'times'" size="lg"/>
              </div>
            </div>
          </q-card-section>
  
          <q-separator />
  
          <q-card-section>
            <q-btn rounded unelevated size="lg" label="Continue" class="full-width text-capitalize" color="primary" @click="signup" :disable="!policy" :loading="saving">
              <template v-slot:loading>
                <q-spinner-puff />&nbsp;Signing up...
              </template>
            </q-btn>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useQuasar, QSpinnerIos } from 'quasar'
  import { useUserStore } from 'src/store/user-store';
  import { useRouter } from 'vue-router'
  import { useNavStore } from 'src/store/nav-store'
  
  const $q = useQuasar()
  const userStore = useUserStore()
  const navStore = useNavStore()
  const router = useRouter()
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  const saving = ref(false)
  const showPwd = ref(false)
  
  const err = ref([])
  const hasError = ref(false)
  
  const policy = ref(false)
  const agree = ref(false)
  const termsDialog = ref(false)
  
  const errors = reactive({
    name: {msg: null, type: null},
    email: {msg: null, type: null},
    password: {msg: null, type: null},
    confirmPassword: {msg: null, type: null}
  })
  
  const isValidEmail = (val) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
    return !emailPattern.test(val)
  }
  
  const validation = () => {
    let isError = false
    //name
    if (name.value.length < 1) {
      errors.name.msg = 'Please enter your name'
      errors.name.type = true
      isError = true
    } else {
      errors.name.msg = null
      errors.name.type = null
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
  
  const register = async () => {
  
    const isError = validation()
    if (isError) return false
  
    termsDialog.value = true
  }
  
  const signup = async() => {
  
    hasError.value = false
  
    saving.value = true
  
    try {
      await userStore.getSanctumCookie()
      const auth = await userStore.register(
        name.value,
        email.value,
        password.value,
        confirmPassword.value
      )
      const res = await userStore.fetchUser()
      userStore.setUser(res.data[0])
      userStore.token = auth.config.headers
      saving.value = false
      router.push('/workplace')
      navStore.currentPage = 'HomePage'
    } catch (error) {
      err.value = error.response.data.errors
      hasError.value = true
      saving.value = false
      termsDialog.value = false
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
  
  .card-wrapper
  {
    border-radius: 25px;
  }
  </style>