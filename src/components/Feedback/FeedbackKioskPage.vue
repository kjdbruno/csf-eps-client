<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">feedback kiosk</div>
    <q-separator />
    <div class="q-mt-md">
      <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h5">List</div>
            </div>
            <div class="col-auto">
              <q-input outlined dense debounce="500" :color="$q.dark.isActive ? 'white' : 'primary'" v-model="filter" placeholder="Search...">
                <template v-slot:prepend>
                  <q-icon name="search" style="font-size: 1rem;" />
                </template>
                <template v-if="filter" v-slot:append>
                  <q-icon @click="filter = ''" name="cancel" class="cursor-pointer" />
                </template>
                <template v-slot:before>
                  <q-btn unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="add" @click="newPreference">
                    <q-tooltip anchor="bottom middle" self="center middle">New Preference</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-table flat :rows="lists" :columns="columns" row-key="name" :loading="tableLoading" no-data-label="I didn't find anything for you">
            <template v-slot:body-cell-active="props">
              <q-td :props="props">
                <q-badge :color="props.row.isActive ? 'positive' : 'negative'" rounded class="q-mr-sm" />{{props.row.isActive ? 'ACTIVE' : 'INACTIVE'}}
              </q-td>
            </template>
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 300px">
                  <q-item-section avatar class="q-pa-none">
                    <q-avatar>
                      <img v-if="props.row.photo" :src="props.row.photo">
                      <img v-else src="~assets/account.png">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-uppercase">{{ props.row.name }}</q-item-label>
                    <q-item-label caption>{{ props.row.office }}&nbsp;-&nbsp;{{ props.row.position }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-description="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 300px">
                  <q-item-section>
                    <q-item-label caption>{{ props.row.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-phy="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 50px">
                  <q-item-section>
                    <q-item-label class="text-bold">{{ props.row.kr_phy }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-ser="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 50px">
                  <q-item-section>
                    <q-item-label class="text-bold">{{ props.row.kr_ser }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-per="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 50px">
                  <q-item-section>
                    <q-item-label class="text-bold">{{ props.row.kr_per }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-ovr="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 50px">
                  <q-item-section>
                    <q-item-label class="text-bold">{{ props.row.kr_ovr }}%</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn v-if="props.row.isActive==true" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item dense clickable @click="viewPreference(props.row.id)">
                        <q-item-section>Details</q-item-section>
                      </q-item>
                      <q-item dense clickable @click="modifyPreference(props.row)">
                        <q-item-section>Modify</q-item-section>
                      </q-item>
                      <q-item dense clickable @click="disablePreference(props.row)">
                        <q-item-section>Disable</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn v-if="props.row.isActive==false" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" @click="enablePreference(props.row)"/>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="preferenceDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">{{isEdit ? 'modify Kiosk' : 'create Kiosk'}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none q-ma-xs" v-if="hasError">
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
          <q-input stack-label outlined v-model="name" :color="$q.dark.isActive ? 'white' : 'primary'" label="Name..." class="q-ma-xs" :error-message="errors.name.msg" :error="errors.name.type" />
            <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="officeID" stack-label use-input input-debounce="0" label="Choose Office..." :options="preferenceStore.offices" @filter="filterOffice" behavior="menu" class="q-ma-xs" :error-message="errors.officeID.msg" :error="errors.officeID.type">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                  No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="positionID" stack-label use-input input-debounce="0" label="Choose Position..." :options="preferenceStore.positions" @filter="filterPosition" behavior="menu" class="q-ma-xs" :error-message="errors.positionID.msg" :error="errors.positionID.type">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                  No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input autogrow stack-label outlined v-model="description" :color="$q.dark.isActive ? 'white' : 'primary'" label="Description..." class="q-ma-xs" :error-message="errors.description.msg" :error="errors.description.type" />
            <input type="file" @change="onPhotoChange"  ref="file" style="display: none" />
            <q-btn v-ripple v-if="!photo" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="Upload photo" class="q-ma-xs" size="sm" @click="$refs.file.click()" />
            <div v-if="photo" class="q-ma-xs">
              <q-list bordered>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="photo">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>Photo</q-item-section>
                  <q-item-section side>
                    <q-btn round unelevated size="sm" icon="delete" @click="removePhoto" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pt-md q-pb-md">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="isEdit ? updatePreference() : createPreference()" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated :label="isEdit ? 'update' : 'save'" class="btn-form text-capitalize" :loading="innerLoading">
            <template v-slot:loading>
              <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { usePreferenceStore } from 'src/store/preference-store'
import { useNavStore } from 'src/store/nav-store'
import { useFeedbackStore } from 'src/store/feedback-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const preferenceStore = usePreferenceStore()
const navStore = useNavStore()
const feedbackStore = useFeedbackStore()

const err = ref([])
const hasError = ref(false)
const isEdit = ref(false)
const innerLoading = ref(false)
const tableLoading = ref(false)

const id = ref('')
const name = ref('')
const officeID = ref('')
const positionID = ref('')
const description = ref('')
const photo = ref('')

const filter = ref('')
const preferenceDialog = ref(false)

const lists = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'name', label: 'Name', field: '', sortable: true, align: 'left'},
  {name: 'description', label: 'Description', field: '', sortable: true, align: 'left'},
  {name: 'phy', label: 'Physical Rating', field: '', sortable: true, align: 'left'},
  {name: 'ser', label: 'Service Rating', field: '', sortable: true, align: 'left'},
  {name: 'per', label: 'Personnel Rating', field: '', sortable: true, align: 'left'},
  {name: 'ovr', label: 'Overall Rating', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const errors = reactive({
  name: {msg: null, type: null},
  officeID: {msg: null, type: null},
  positionID: {msg: null, type: null},
  description: {msg: null, type: null},
})

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
  //office
  if (officeID.value.length < 1) {
    errors.officeID.msg = 'Please enter your office'
    errors.officeID.type = true
    isError = true
  } else {
    errors.officeID.msg = null
    errors.officeID.type = null
  }
  //position
  if (positionID.value.length < 1) {
    errors.positionID.msg = 'Please enter your position'
    errors.positionID.type = true
    isError = true
  } else {
    errors.positionID.msg = null
    errors.positionID.type = null
  }
  //description
  if (description.value.length < 1) {
    errors.description.msg = 'Please enter your description'
    errors.description.type = true
    isError = true
  } else {
    errors.description.msg = null
    errors.description.type = null
  }

  return isError
}

/**
 * new preference
 */
const newPreference = () => {
  isEdit.value = false
  preferenceDialog.value = true
  hasError.value = false
  id.value = ''
  name.value = ''
  officeID.value = ''
  positionID.value = ''
  description.value = ''
  photo.value = ''
}

/**
 * create preference
 */
const createPreference = async () => {
  /**
   * validate label and code
   */
  const isError = validation()
  if (isError) return false
  /**
   * enable inner loading
   */
  innerLoading.value = true
  /**
   * disable hasError
   */
  hasError.value = false

  try {
    /**
     * call to save
     */
    const res = await server.post(`api/kiosk`, {
      name: name.value,
      officeID: officeID.value,
      positionID: positionID.value,
      description: description.value,
      photo: photo.value
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
     * reload list
     */
    getAllPreference()
    /**
     * clear form
     */
    name.value = ''
    officeID.value = ''
    positionID.value = ''
    description.value = ''
    photo.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    preferenceDialog.value = false

  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
    innerLoading.value = false
  }
}

/**
* modify preference
*/
const modifyPreference = async (data) => {
  /**
   * enable edit mode
   */
  isEdit.value = true
  preferenceDialog.value = true
  hasError.value = false
  /**
   * populate form
   */
  id.value = data.id
  name.value = data.name
  officeID.value = data.officeID
  positionID.value = data.positionID
  description.value = data.description
  photo.value = data.photo
}

/**
* update preference
*/
const updatePreference = async () => {
  /**
   * validate label and code
   */
  const isError = validation()
  if (isError) return false
  /**
   * enable inner loading
   */
  innerLoading.value = true
  /**
   * disable hasError
   */
  hasError.value = false

  try {
    /**
     * call to update
     */
    const res = await server.put(`api/kiosk/${id.value}`, {
      name: name.value,
      officeID: officeID.value,
      positionID: positionID.value,
      description: description.value,
      photo: photo.value
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
     * reload list
     */
    getAllPreference()
    /**
     * clear form
     */
    id.value = ''
    name.value = ''
    officeID.value = ''
    positionID.value = ''
    description.value = ''
    photo.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    /**
     * disable edit mode
     */
    isEdit.value = false
    preferenceDialog.value = false

  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
    innerLoading.value = false
  }
}

/**
* disable preference
*/
const disablePreference = async (data) => {
  //
  id.value = data.id
  /**
   * confirmation dialog
   */
  Swal.fire({
    title: 'Are you sure?',
    text: `Disable this record. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes, disable it!',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      createDisable()
    } else {
      id.value = ''
    }
  })
}
const createDisable = async () => {
  /**
   * enable loading
   */
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/kiosk/disable/${id.value}`)
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
     * reload list
     */
    getAllPreference()
    /**
     * disbale loading
     */
    $q.loading.hide()
    /**
     * id value to default
     */
    id.value = ''
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
* enable preference
*/
const enablePreference = async (data) => {
  //
  id.value = data.id
  /**
   * confirmation dialog
   */
  Swal.fire({
    title: 'Are you sure?',
    text: `Enable this record. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
    confirmButtonText: 'Yes, enable it!',
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      createEnable()
    } else {
      id.value = ''
    }
  })
}
const createEnable = async () => {
  /**
   * enable loading
   */
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/kiosk/enable/${id.value}`)
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
     * reload list
     */
    getAllPreference()
    /**
     * disbale loading
     */
    $q.loading.hide()
    /**
     * id value to default
     */
    id.value = ''
  } catch (error) {
    /**
     * disable loading
     */
    $q.loading.hide()
  }
}

/**
 * 
 */
const viewPreference = async (id) => {
  navStore.feedbackID = id
  navStore.currentPage = 'FeedbackKioskDetailPage'
}

/**
* get all preference
*/
const getAllPreference = async () => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/kiosk/${authStore.id}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.isAuthenticated = false
    }
  }
}
/**
 * upload photo
 */
 const onPhotoChange = (e) => {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
    createPhoto(files[0]);
}
const createPhoto = (file) => {
  let image = new Image();
  let reader = new FileReader();

  reader.onload = (e) => {
    photo.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
/**
 * remove photo
 */
const removePhoto = () => {
  photo.value = ''
}
/**
 * filter office
 */
const filterOffice = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.offices = preferenceStore.optOffices
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.offices = preferenceStore.offices.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}
/**
 * filter position
 */
const filterPosition = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.positions = preferenceStore.optPositions
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.positions = preferenceStore.positions.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

// search data
const searchList = debounce(async (val) => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/kiosk/${authStore.id}?filter=${val}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
})
// watch search text
watch(() => filter.value, searchList)

/**
* load as mounted
*/
onMounted(() => {
/**
 * get all preference: position
 */
getAllPreference()
})


</script>