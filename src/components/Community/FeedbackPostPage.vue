<template>
    <div>
  
      <!--START DESKTOP MODE-->
      <div class="desktop-only q-pa-md">
        <div v-if="!isDone" class="bg-white radius">
          <div class="q-pa-md">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="userStore.avatar">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-uppercase">{{ userStore.name }}</q-item-label>
                <q-item-label caption>{{ userStore.email }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn  unelevated rounded color="primary" label="post" size="md" @click="createFeedback" :loading="saving">
                  <template v-slot:loading>
                    <q-spinner-puff />
                  </template>
                </q-btn>
              </q-item-section>
            </q-item>
            <div class="q-mt-lg">
              <q-select outlined rounded emit-value map-options v-model="categoryID" use-input input-debounce="0" label="Choose category" color="primary" :options="preferenceStore.categories" @filter="filterCategory" behavior="menu" class="q-ma-xs">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input autogrow outlined rounded label="What's on your mind?" v-model="content" color="primary" class="q-ma-xs" />
              <q-list class="q-ma-xs">
                <q-item class="radius" clickable v-ripple @click="$refs.file.click()">
                  <q-item-section avatar>
                    <q-icon color="info" name="image" />
                  </q-item-section>
                  <q-item-section>Upload a photo</q-item-section>
                  <input id="file-upload" type="file" @change="onPhotoChange" multiple ref="file" style="display: none" />
                </q-item>
              </q-list>
              <div class="q-mt-sm">
                <q-img v-for="data in photos" :key="data" :src="data.photo" :width="photos.length >= 2 ? '50%' : (photos.length == 1 ? '100%' : null)" height="auto" @click="showEvidence(data.id)"/>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isDone" class="bg-white radius">
          <div class="q-pa-xl">
            <div class="text-center">
                <div>
                    <q-icon name="check_circle" size="6em" color="green" />
                </div>
                <div class="q-pa-sm">
                    <div class="text-h5 text-uppercase">Feedback successfully saved!</div>
                </div>
                <div class="q-mt-md">
                    <q-btn unelevated color="primary" label="okay" class="q-ma-xs" @click="emit('input-visible', false)"/>
                </div>
            </div>
          </div>
        </div>
      </div>
      <!--END DESKTOP MODE-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MOBILE MODE-->
      <div class="mobile-only q-pa-md">
        <div class="bg-white radius">
          <div class="q-pa-md">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="userStore.avatar">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-capitalize">{{ userStore.name }}</q-item-label>
                <q-item-label caption>{{ userStore.email }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn  unelevated rounded color="primary" label="post" size="md" @click="createFeedback" :loading="saving">
                  <template v-slot:loading>
                    <q-spinner-puff />
                  </template>
                </q-btn>
              </q-item-section>
            </q-item>
            <div class="q-mt-lg">
              <q-select outlined rounded emit-value map-options v-model="categoryID" use-input input-debounce="0" label="Choose category" color="primary" :options="preferenceStore.categories" @filter="filterCategory" behavior="dialog" class="q-ma-xs">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">No results</q-item-section>
                  </q-item>
                </template>
              </q-select>
              <q-input autogrow outlined rounded label="What's on your mind?" v-model="content" color="primary" class="q-ma-xs" />
              <q-list class="q-ma-xs">
                <q-item class="radius" clickable v-ripple @click="$refs.file.click()">
                  <q-item-section avatar>
                    <q-icon color="info" name="image" />
                  </q-item-section>
                  <q-item-section>Upload a photo</q-item-section>
                  <input id="file-upload" type="file" @change="onPhotoChange" multiple ref="file" style="display: none" />
                </q-item>
              </q-list>
              <div class="q-mt-sm">
                <q-img v-for="data in photos" :key="data" :src="data.photo" :width="photos.length >= 2 ? '50%' : (photos.length == 1 ? '100%' : null)" height="auto" @click="showEvidence(data.id)"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--END MOBILE MODE-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START PHOTO DIALOG-->
      <q-dialog class="mobile-only" v-model="photoDialog" full-width>
        <q-card>
          <q-card-section class="q-pa-none">
            <q-carousel swipeable animated v-model="slide" thumbnails infinite >
              <q-carousel-slide v-for="(dt, index) in photos" :key="index" :name="dt.id" :img-src="dt.photo" />
            </q-carousel>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog class="desktop-only" v-model="photoDialog">
        <q-card style="width: 900px; max-width: 80vw;">
          <q-card-section class="q-pa-none">
            <q-carousel swipeable animated v-model="slide" thumbnails infinite >
              <q-carousel-slide v-for="(dt, index) in photos" :key="index" :name="dt.id" :img-src="dt.photo" />
            </q-carousel>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!--END PHOTO DIALOG-->
  
      <!--===========================================================================================================================================================================================-->
  
      <!--START MESSAGE BOX-->
      <q-dialog v-model="successDialog" persistent>
        <q-card class="card-wrapper q-pa-xl">
          <q-card-section class="text-center q-pt-lg q-pb-lg">
            <q-icon name="check_circle" size="7em" color="positive" />
          </q-card-section>
  
          <q-card-section class="q-pa-none text-center">
            <div class="text-h4 text-capitalize">Success!</div>
            <div class="text-body">{{ msg }}</div>
            <div class="q-mt-lg">
              <q-btn unelevated color="primary" label="close" class="q-ma-xs" @click="emit('input-visible', false)"/>
            </div>
          </q-card-section>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-ios size="25px" color="primary" />
          </q-inner-loading>
        </q-card>
      </q-dialog>
      <!--END MESSAGE BOX-->
    </div>
  </template>
  
<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerIos } from 'quasar'
import { useFeedbackStore } from 'src/store/feedback-store'
import { useUserStore } from 'src/store/user-store'
import { usePreferenceStore } from 'src/store/preference-store'
import { useNavStore } from 'src/store/nav-store'
import { useRouter } from 'vue-router'
import { server } from 'src/boot/axios'
import moment from 'moment'
import Swal from 'sweetalert2'

const $q = useQuasar()
const feedbackStore = useFeedbackStore()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()
const navStore = useNavStore()
const router = useRouter()

const categoryID = ref('')
const content = ref('')
const photos = ref([])

const photoDialog = ref(false)
const slide = ref('')

const successDialog = ref(false)
const msg = ref('')

const saving = ref(false)
const err = ref([])
const hasError = ref(false)

const isDone = ref(false)
  
/**
 * validation
 */
const errors = reactive({
    categoryID: {msg: null, type: null},
    content: {msg: null, type: null},
})
  
const validation = () => {
    let isError = false
    //category
    if (categoryID.value.length < 1) {
        errors.categoryID.msg = 'Please enter your category'
        errors.categoryID.type = true
        isError = true
    } else {
        errors.categoryID.msg = null
        errors.categoryID.type = null
    }
    //content
    if (content.value.length < 1) {
        errors.content.msg = 'Please enter your content'
        errors.content.type = true
        isError = true
    } else {
        errors.content.msg = null
        errors.content.type = null
    }

    return isError
}
  
/**
 * filter category
 */
const filterCategory = (val, update) => {
    if (val === '') {
        update(() => {
        preferenceStore.categories = preferenceStore.optCategories
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        preferenceStore.categories = preferenceStore.categories.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
    })
}

/**
 * upload image/photo
 */
const onPhotoChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length)
        return;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        createPhoto(file, i);
    }
}
const createPhoto = (file, i) => {
    let image = new Image();
    let reader = new FileReader();

    reader.onload = (e) => {
        photos.value.push({ 'id': i, 'photo': e.target.result })
    };
    reader.readAsDataURL(file);
}

/**
 * show evidemce
 */
const showEvidence = (idx) => {
    slide.value = idx
    photoDialog.value = true
}

/**
 * create feedback
 */
const createFeedback = async () => {

    //validate form
    hasError.value = false

    const isError = validation()
    if (isError) return false
    //enable loading
    saving.value = true

    try {
        const res = await server.post('api/community/feedback', {
            userID: userStore.id,
            categoryID: categoryID.value,
            content: content.value,
            photos: photos.value
        })
        /**
         * disable loading
         */
        saving.value = false
        /**
         * 
         */
        isDone.value = true
    } catch (error) {
        err.value = error.response.data.errors
        hasError.value = true
        saving.value = false
    }

}
  
/**
 * define emits
 */
const emit = defineEmits(['input-visible'])

</script>
  
  <style lang="scss">
  .desktop-only
  {
    .radius
    {
      border-radius: 25px;
  
      .btn
      {
        width: 100px;
      }
    }
  }
  
  .mobile-only
  {
    .radius
    {
      border-radius: 25px;
    }
  }
  </style>