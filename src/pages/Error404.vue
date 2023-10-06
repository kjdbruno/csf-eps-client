<template>
  <div class="fullscreen">
    <section class="page_404">
      <div class="container">
        <div class="row">	
          <div class="col-sm-12 ">
            <div class="col-sm-10 col-sm-offset-1  text-center">
              <div class="four_zero_four_bg"></div>
            
              <div class="contant_box_404">
                <h3 class="h2">Look like you're lost</h3>
                <p>the page you are looking for not avaible!</p>
                <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" size="lg" label="sign in" @click="logout" text-color="white" class="text-capitalize" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive,watch } from 'vue'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const logout = () => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Sign Out. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      createLogout()
    } else {
      id.value = ''
    }
  })
}
const createLogout = async () => {
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: '#000'
  })
  try {
    await authStore.logout()
    authStore.clearUser()
    router.push('/')
    $q.loading.hide()
  } catch (error) {
    console.log(error)
    $q.loading.hide()
  }
}

</script>

<style scoped>
.page_404{ padding:40px 0; background:#fff; font-family: 'Arvo', serif;
}

.page_404  img{ width:100%;}

.four_zero_four_bg{
 background-image: url('~assets/404-page.gif');
    height: 650px;
    background-position: center;
    background-repeat: no-repeat;
 }
 .four_zero_four_bg h1{
 font-size:80px;
 }
  .four_zero_four_bg h3{
			 font-size:80px;
			 }
			 
			 .link_404{			 
	color: #fff!important;
    padding: 10px 20px;
    background: #39ac31;
    margin: 20px 0;
    display: inline-block;}
	.contant_box_404{ margin-top:-50px;}
</style>