<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">citizen's charter</div>
    <q-separator />
    <div class="q-mt-md">
      <div class="row q-gutter-sm">
        <div class="col-4">
          <q-card flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="text-h5 text-capitalize">{{ isEdit ? `modify citizen's charter` : `create citizen's charter` }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <q-input v-model="title" autogrow outlined color="grey" type="text" label="Title" stack-label :error-message="errors.title.msg" :error="errors.title.type" class="q-ma-xs" />
              <q-select emit-value map-options outlined v-model="officeId" stack-label use-input input-debounce="0" color="grey" label="Choose Office..." :options="preferenceStore.offices" @filter="filterOffice" behavior="menu" class="q-ma-xs" :error-message="errors.officeId.msg" :error="errors.officeId.type">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div v-if="!pdf" class="q-pa-xs">
                <q-btn unelevated outline color="positive" size="sm" label="upload PDF" @click="$refs.file.click()" class="text-capitalize full-width"/>
                <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
              </div>
              <div v-else class="q-pa-xs">
                <q-list bordered>
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon name="picture_as_pdf"/>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>Profile Photo</q-item-section>
                    <q-item-section side>
                      <q-btn round unelevated size="sm" icon="delete" @click="removePhoto" />
                    </q-item-section>
                  </q-item>
                </q-list>
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
            <q-separator  />
            <q-card-actions align="center" class="q-pa-md">
              <q-btn @click="cancel" color="negative" unelevated label="clear" class="btn-form"/>
              <q-btn @click="isEdit ? updatePreference() : createPreference()" color="positive" unelevated :label="isEdit ? 'update' : 'save'" class="btn-form"/>
            </q-card-actions>
            <q-inner-loading :showing="innerLoading">
              <q-spinner-ios size="25px" color="grey" />
            </q-inner-loading>
          </q-card>
        </div>
        <div class="col">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h5">List</div>
                </div>
                <div class="col-auto">
                  <q-input outlined dense debounce="500" color="grey" v-model="filter" placeholder="Search...">
                    <template v-slot:prepend>
                      <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                    <template v-if="filter" v-slot:append>
                      <q-icon @click="filter = ''" name="cancel" class="cursor-pointer" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-table flat :rows="lists" :columns="columns" :loading="tableLoading" no-data-label="I didn't find anything for you">
                <template v-slot:body-cell-active="props">
                  <q-td :props="props">
                    <q-badge :color="props.row.isActive ? 'positive' : 'negative'" rounded class="q-mr-sm" />{{props.row.isActive ? 'ACTIVE' : 'INACTIVE'}}
                  </q-td>
                </template>
                <template v-slot:body-cell-title="props">
                  <q-td :props="props">
                    <div class="text-uppercase my-table-details">
                      {{props.row.title}}
                    </div>
                    <div class="text-caption text-grey">
                      {{props.row.office}}
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn v-if="props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="visibility" class="q-mr-xs" @click="viewPDF(props.row)"/>
                    <q-btn v-if="props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" >
                      <q-menu cover auto-close>
                        <q-list>
                          <q-item dense clickable @click="modifyPreference(props.row)">
                            <q-item-section>Modify</q-item-section>
                          </q-item>
                          <q-item dense clickable @click="disablePreference(props.row)">
                            <q-item-section>Disable</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                    <q-btn v-if="!props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="enablePreference(props.row)" />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="pdfDialog" full-width full-height >
      <q-card>
        <q-card-section class="q-pa-none">
          <div v-if="file" class="myIframe"> 
            <iframe :src="file" height="100%" width="100%"></iframe>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerIos, debounce, is } from 'quasar'
import { server } from 'src/boot/axios'
import { useAuthStore } from 'src/store/auth-store'
import { usePreferenceStore } from 'src/store/preference-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const preferenceStore = usePreferenceStore()

const err = ref([])
const hasError = ref(false)
const isEdit = ref(false)

const id = ref('')
const title = ref('')
const officeId = ref('')
const pdf = ref('')

const lists = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'title', label: 'Title', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const tableLoading = ref(false)
const innerLoading = ref(false)

const filter = ref('')
const pdfDialog = ref(false)
const file = ref('')

const errors = reactive({
  title: {msg: null, type: null},
  officeId: {msg: null, type: null}
})

const validation = () => {
  let isError = false
  //office
  if (officeId.value.length < 1) {
    errors.officeId.msg = 'Please enter your office'
    errors.officeId.type = true
    isError = true
  } else {
    errors.officeId.msg = null
    errors.officeId.type = null
  }
  //title
  if (title.value.length < 1) {
    errors.title.msg = 'Please enter your title'
    errors.title.type = true
    isError = true
  } else {
    errors.title.msg = null
    errors.title.type = null
  }

  return isError
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
    const res = await server.post(`api/admin/cc`, {
      officeId: officeId.value,
      title: title.value,
      pdf: pdf.value
    })
    /**
     * response message
     */
    Swal.fire({
      title: 'Stored!',
      text: res.data.msg,
      icon: 'success',
      confirmButtonColor: '#0F9D58'
    })
    /**
     * reload list
     */
    getAllPreference()
    /**
     * clear form
     */
    officeId.value = ''
    title.value = ''
    pdf.value = ''
    /**
     * disable inner loading
     */
     innerLoading.value = false

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
  /**
   * populate form
   */
  id.value = data.id
  officeId.value = data.officeID
  title.value = data.title
  pdf.value = data.pdf
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
    const res = await server.put(`api/admin/cc/${id.value}`, {
      officeId: officeId.value,
      title: title.value,
      pdf: pdf.value
    })
    /**
     * response message
     */
    Swal.fire({
      title: 'Modified!',
      text: res.data.msg,
      icon: 'success',
      confirmButtonColor: '#0F9D58'
    })
    /**
     * reload list
     */
    getAllPreference()
    /**
     * clear form
     */
    id.value = ''
    officeId.value = ''
    title.value = ''
    pdf.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    /**
     * disable edit mode
     */
    isEdit.value = false

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
    text: `Disable ${data.title}. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0F9D58',
    cancelButtonColor: '#DB4437',
    confirmButtonText: 'Yes, disable it!'
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
    spinner: QSpinnerIos,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/admin/cc/disable/${id.value}`)
    /**
     * response message
     */
    Swal.fire({
      title: 'Disabled!',
      text: res.data.msg,
      icon: 'success',
      confirmButtonColor: '#0F9D58'
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
    text: `Enable ${data.title}. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0F9D58',
    cancelButtonColor: '#DB4437',
    confirmButtonText: 'Yes, enable it!'
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
    spinner: QSpinnerIos,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/admin/cc/enable/${id.value}`)
    /**
     * response message
     */
    Swal.fire({
      title: 'Enabled!',
      text: res.data.msg,
      icon: 'success',
      confirmButtonColor: '#0F9D58'
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
 * Cancel: Clear form
 */
 const cancel = () => {
  isEdit.value = false
  officeId.value = ''
  title.value = ''
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
    pdf.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
/**
 * remove photo
 */
const removePhoto = () => {
  pdf.value = ''
}

/**
 * get all preference
 */
const getAllPreference = async () => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/admin/cc`)
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
 * view pdf
 */
const viewPDF = (data) => {
  pdfDialog.value = true
  file.value = data.pdf
}

/**
 * search
 */
// search data
const searchList = debounce(async (val) => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/admin/cc?filter=${val}`)
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
   * get all preference: office
   */
  getAllPreference()
})

</script>

<style scoped>
.myIframe {
    position: relative;
    padding-bottom: 65.25%;
    padding-top: 30px;
    height: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

.myIframe iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>