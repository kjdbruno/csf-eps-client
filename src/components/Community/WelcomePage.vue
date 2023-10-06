<template>
    <div>
          <!--mobile-->
         <q-page class="mobile">
             <div class="h-wrapper">
                 <q-img src="~assets/logo/logo_blue.png" class="logo" />
             </div>
             <div class="f-wrapper">
                 <div class="wrapper bg-primary">
                     <div class="title text-h5 text-capitalize text-white q-ma-none q-pa-none">welcome!</div>
                     <div class="text-h6 text-white q-ma-none q-pa-none">eParticipation System</div>
                     <div class="text-caption text-white q-ma-none q-pa-none text-justify">An online engagement platform where you can report your concerns, discuss what's trending in the City, and answer poll for the People's City.</div>
                     <q-card-actions class="q-mt-xl" align="center">
                         <q-btn rounded unelevated size="md" label="Sign In" class="button text-capitalize bg-secondary text-white" @click="navStore.currentPage = 'SigninPage'" />
                         <q-btn rounded unelevated size="md" label="Sign Up" class="button text-capitalize bg-secondary text-white" @click="navStore.currentPage = 'SignupPage'" />
                     </q-card-actions>
                 </div>
             </div>
         </q-page>
         <!--desktop-->
         <q-page class="desktop">
             <q-card class="card fixed-center">
                 <q-card-section class="text-center q-pt-xl">
                     <q-img src="~assets/logo/logo_blue.png" class="logo q-mt-xl q-mb-xl" />
                     <div class="text-caption text-grey q-ma-none q-pa-none text-center">An online engagement platform where you can report your concerns, discuss what's trending in the City, and answer poll for the People's City.</div>
                 </q-card-section>
 
                 <q-card-actions align="center" class="q-pb-xl">
                     <q-btn rounded unelevated size="md" label="Sign In" class="button text-capitalize bg-primary text-white" @click="navStore.currentPage = 'SigninPage'" />
                     <q-btn rounded unelevated size="md" label="Sign Up" class="button text-capitalize bg-primary text-white" @click="navStore.currentPage = 'SignupPage'" />
                 </q-card-actions>
             </q-card>
             <div class="overlay"></div>
         </q-page>
    </div>
 </template>
 
 <script setup>
 import { ref } from 'vue'
 import { useNavStore } from 'src/store/nav-store';
 
 const navStore = useNavStore()
 
 </script>
 
 <style lang="scss" scoped>
 .mobile-only
 {
     .h-wrapper
     {
         text-align: center;
     }
     .h-wrapper 
     {
         .logo
         {
             min-width: 100px;
             max-width: 250px;
             margin-top: 125px;
         }
     }
     .f-wrapper
     {
         width: 100%;
         position: absolute;
         bottom: 0;
     }
     .f-wrapper .wrapper{
         border-top-left-radius: 25px;
         border-top-right-radius: 25px;
         padding: 40px 15px 25px 15px;
     }
     .f-wrapper .wrapper .button
     {
         width: 110px;
     }
 
 }
 
 .desktop-only
 {
     background: url('~assets/bg.png') no-repeat top center / cover;
     height: 100vh;
 
     .overlay {
         position: fixed;
         display: block;
         width: 100%;
         height: 100%;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background-color: rgba(0,0,0,0.6);
         z-index: 1;
     }
     .card
     {
         z-index: 999;
         width: 600px; 
         max-width: 80vw;
         border-radius: 50px;
         .logo{
             min-width: 100px;
             max-width: 250px;
         }
         .button
         {
             width: 110px;
         }
     }
 }
 
 </style>
 
 