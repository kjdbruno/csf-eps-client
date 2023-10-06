<template>
  <div>
    <div class="q-pa-xs" v-if="hasError">
      <div class="q-pa-md div-error">
        <div v-for="(errorArray, idx) in err" :key="idx">
          <div v-for="(allErrors, idx) in errorArray" :key="idx">
            <span class="text-red">
              <q-icon name="cancel" /> {{ allErrors}} </span>
          </div>
        </div>
      </div>
    </div>
    <div class="row q-gutter-xs">
      <div class="col-4">
        <q-input v-model="name" :color="$q.dark.isActive ? 'white' : 'primary'" outlined type="text" label="Name" stack-label :error-message="errors.name.msg" :error="errors.name.type" class="q-ma-xs" />
        <q-input v-model="email" :color="$q.dark.isActive ? 'white' : 'primary'" outlined type="email" label="E-mail" stack-label :error-message="errors.email.msg" :error="errors.email.type" class="q-ma-xs" />
        <q-input v-model="number" :color="$q.dark.isActive ? 'white' : 'primary'" outlined type="text" label="Contact No." stack-label :error-message="errors.number.msg" :error="errors.number.type" class="q-ma-xs" />
        <q-select emit-value map-options :color="$q.dark.isActive ? 'white' : 'primary'" outlined v-model="sexID" use-input input-debounce="0" label="Choose Sex..." stack-label :options="preferenceStore.sexes" @filter="filterSex" class="q-ma-xs" :error-message="errors.sexID.msg" :error="errors.sexID.type">
          <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results</q-item-section>
          </q-item>
          </template>
        </q-select>
      </div>
      <div class="col">
        <q-select emit-value map-options :color="$q.dark.isActive ? 'white' : 'primary'" outlined v-model="categoryID" use-input input-debounce="0" label="Choose Category..." stack-label :options="preferenceStore.categories" @filter="filterCategory" class="q-ma-xs" :error-message="errors.categoryID.msg" :error="errors.categoryID.type">
          <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results</q-item-section>
          </q-item>
          </template>
        </q-select>
        <q-input v-model="content" :color="$q.dark.isActive ? 'white' : 'primary'" outlined autogrow type="text" label="Content..." stack-label :error-message="errors.content.msg" :error="errors.content.type" class="q-ma-xs" />
        <div class="q-pa-xs">
          <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="Upload photo" class="q-mt-xs" size="sm" @click="$refs.file.click()" />
        </div>
        <input id="file-upload" type="file" @change="onPhotoChange" multiple ref="file" style="display: none" />
        <div class="q-pa-xs">
          <q-img class="cursor-pointer" v-for="(dt, index) in photos" :key="index" :src="dt.photo" :width="photos.length >= 4 ? '25%' : (photos.length == 3 ? '33.33%' : (photos.length <= 2 ? '50%' : null))" @click="showEvidence(photos, dt.id)" />
        </div>
        <q-separator class="q-mb-sm" />
        <div class="q-pa-xs">
          <q-btn v-ripple unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" label="submit" class="full-width" size="lg" @click="createFeedback" :loading="innerLoading">
            <template v-slot:loading>
              <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
            </template>
          </q-btn>
        </div>
      </div>
    </div>
    <!--Photo-->
    <q-dialog v-model="photoDialog">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="q-pa-none">
          <q-carousel swipeable animated v-model="slide" thumbnails infinite >
            <q-carousel-slide v-for="(dt, index) in photos" :key="index" :name="dt.id" :img-src="dt.photo" />
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { usePreferenceStore } from 'src/store/preference-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const preferenceStore = usePreferenceStore()

const name = ref('')
const email = ref('')
const number = ref('')
const sexID = ref('')
const categoryID = ref('')
const content = ref('')
const photos = ref([])

const photoDialog = ref(false)
const slide = ref(1)

const err = ref([])
const hasError = ref(false)

const innerLoading = ref(false)

const errors = reactive({
  name: {msg: null, type: null},
  email: {msg: null, type: null},
  number: {msg: null, type: null},
  sexID: {msg: null, type: null},
  categoryID: {msg: null, type: null},
  content: {msg: null, type: null}
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
    errors.email.msg = 'Please enter your e-mail'
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
  //number
  if (number.value.length < 1) {
    errors.number.msg = 'Please enter your contact number'
    errors.number.type = true
    isError = true
  } else if (number.value.length != 11) {
    errors.number.msg = 'The number you entered is not valid. It should be 11 digits.'
    errors.number.type = true
    isError = true
  } else {
    errors.number.msg = null
    errors.number.type = null
  }
  //sex
  if (sexID.value.length < 1) {
    errors.sexID.msg = 'Please enter your sex'
    errors.sexID.type = true
    isError = true
  } else {
    errors.sexID.msg = null
    errors.sexID.type = null
  }
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
 * create feedback
 */
const createFeedback = async () => {
  /**
   * disbale error
   */
  hasError.value = false
  /**
   * validate form
   */
  // const isError = validation()
  // if (isError) return false
  /**
   * enable loading
   */
  innerLoading.value = true
   
  try {
    const res = await server.post('api/feedback/entry/offline', {
      name: name.value,
      email: email.value,
      number: number.value,
      sexID: sexID.value,
      categoryID: categoryID.value,
      content: content.value,
      photos: photos.value
    })
    /**
     * response message
     */
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
    /**
     * disable loading
     */
    innerLoading.value = false
    /**
     * clear form
     */
    name.value = ''
    email.value = ''
    number.value = ''
    sexID.value = ''
    categoryID.value = ''
    content.value = ''
    photos.value = []
  } catch (error) {
    /**
     * display error
     */
    if (error.response.data.isAdmin) {
      Swal.fire({
        icon: 'error',
        title: error.response.data.msg,
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
    } else {
      err.value = error.response.data.errors
      hasError.value = true
    }
    /**
     * disable loading
     */
    innerLoading.value = false
  }
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
  console.log(photos.value)
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
 * show evidence
 */
const showEvidence = (p, idx) => {
  photos.value = p
  slide.value = idx
  photoDialog.value = true
}

/**
 * filter sex
 */
const filterSex = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.sexes = preferenceStore.optSexes
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.sexes = preferenceStore.sexes.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
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
</script>