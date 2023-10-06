<template>
    <div class="q-pa-md">
      <q-card class="q-mb-md q-mt-sm q-pa-sm no-shadow q-pt-md q-pb-md tile-header bg-primary">
        <q-card-section>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="userStore.avatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-mb-none"><span class="text-white text-h6 text-weight-bold text-uppercase">{{ userStore.name }}</span></q-item-label>
              <q-item-label class="text-white q-mt-none" caption>{{ userStore.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
  
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from 'src/store/user-store';
  
  const userStore = useUserStore()
  
  </script>
  
  <style scoped>
  .tile-header
  {
      border-radius: 25px;
      /* background: linear-gradient(-45deg, #FFAA01, #1A8738, #D91604, #512314);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite; */
  }
  .radius-top
  {
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
  .radius-bottom
  {
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }
  .slide-img
  {
    height: 175px;
  }
  /* @keyframes gradientBG {
      0% {
          background-position: 0% 50%;
      }
      50% {
          background-position: 100% 50%;
      }
      100% {
          background-position: 0% 50%;
      }
  } */
  
  /* .large-header {
     position: relative;
     width: 100%;
     background: #111;
     overflow: hidden;
     background-size: cover;
     background-position: center center;
     z-index: 1;
  }
  
  .demo .large-header {
     background-color: #000000;
  }
  
  .main-title {
     position: absolute;
     margin: 0;
     padding: 0;
     color: #F9F1E9;
     text-align: center;
     top: 50%;
     left: 50%;
     -webkit-transform: translate3d(-50%, -50%, 0);
     transform: translate3d(-50%, -50%, 0);
  }
  
  .demo .main-title {
     text-transform: uppercase;
     font-size: 4.2em;
     letter-spacing: 0.1em;
  }
  
  .main-title .thin {
     font-weight: 200;
  }
  
  @media only screen and (max-width: 768px) {
     .demo .main-title {
        font-size: 3em;
     }
  } */
  </style>
  