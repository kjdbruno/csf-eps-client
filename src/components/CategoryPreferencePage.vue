<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">category preference</div>
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
          <q-table flat :rows="lists" :columns="columns" :loading="tableLoading" no-data-label="I didn't find anything for you">
            <template v-slot:body-cell-active="props">
              <q-td :props="props">
                <q-badge :color="props.row.isActive ? 'positive' : 'negative'" rounded class="q-mr-sm" />{{props.row.isActive ? 'ACTIVE' : 'INACTIVE'}}
              </q-td>
            </template>
            <template v-slot:body-cell-label="props">
              <q-td :props="props">
                <div class="text-uppercase text-caption">
                  {{props.row.label}}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn v-if="props.row.isActive" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);">
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
    <q-dialog v-model="preferenceDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">{{isEdit ? 'modify category' : 'create category'}}</div>
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
          <q-input v-model="label" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Label" stack-label :error-message="errors.label.msg" :error="errors.label.type" class="q-ma-xs" />
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
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()

const err = ref([])
const hasError = ref(false)
const isEdit = ref(false)

const id = ref('')
const label = ref('')

const preferenceDialog = ref(false)

const lists = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'label', label: 'Label', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const tableLoading = ref(false)
const innerLoading = ref(false)

const filter = ref('')

const errors = reactive({
  label: {msg: null, type: null}
})

const validation = () => {
  let isError = false
  //label
  if (label.value.length < 1) {
    errors.label.msg = 'Please enter your label'
    errors.label.type = true
    isError = true
  } else {
    errors.label.msg = null
    errors.label.type = null
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
  label.value = ''
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
    const res = await server.post(`api/category`, {
      label: label.value
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
    label.value = ''
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
  label.value = data.label
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
    const res = await server.put(`api/category/${id.value}`, {
      label: label.value
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
    label.value = ''
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
    text: `Disable ${data.label}. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
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
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/category/disable/${id.value}`)
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
    text: `Enable ${data.label}. You won't be able to revert this!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#224488',
    cancelButtonColor: '#224488',
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
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  try {
    /**
     * call to disable
     */
    const res = await server.post(`api/category/enable/${id.value}`)
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
 * get all preference
 */
const getAllPreference = async () => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/category`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.auth = true
    }
  }
}

/**
 * search
 */
// search data
const searchList = debounce(async (val) => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/category?filter=${val}`)
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
