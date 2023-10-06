<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">poll overview</div>
    <q-separator />
    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-blue-10' : 'bg-blue-8'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalPoll }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Poll</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_poll.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-ios size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-green-10' : 'bg-green-8'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalActive }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Active</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_active.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-ios size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-red-10' : 'bg-red-8'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalInactive }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Inactive</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_inactive.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-ios size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-indigo-10' : 'bg-indigo-8'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalJoiner }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Total Joiner</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_join.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-ios size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>
    <div class="q-mt-md">
      <div class="row q-col-gutter-sm">
        <div class="col-9">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">Poll</div>
                </div>
                <div class="col-auto">
                  <q-input outlined dense debounce="500" color="grey" v-model="filter" placeholder="Search...">
                    <template v-slot:prepend>
                      <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                    <template v-if="filter" v-slot:append>
                      <q-icon @click="filter = ''" name="cancel" class="cursor-pointer" />
                    </template>
                    <template v-slot:before>
                      <q-btn v-if="authStore.isAdmin || authStore.isSup" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="add" @click="newPoll">
                        <q-tooltip anchor="bottom middle" self="center middle">New Poll</q-tooltip>
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
                <template v-slot:body-cell-category="props">
                  <q-td :props="props">
                    <div class="text-caption">
                      {{props.row.category}}
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-title="props">
                  <q-td :props="props">
                    <div class="text-uppercase text-caption">
                      {{props.row.title}}
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn v-if="props.row.isActive==true" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert">
                      <q-menu cover auto-close>
                        <q-list>
                          <q-item dense clickable @click="detail(props.row.id)">
                            <q-item-section>Detail</q-item-section>
                          </q-item>
                          <q-item dense clickable @click="modifyPoll(props.row)">
                            <q-item-section>Modify</q-item-section>
                          </q-item>
                          <q-item dense clickable @click="disablePoll(props.row)">
                            <q-item-section>Disable</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                    <q-btn v-if="props.row.isActive==false" unelevated size="sm" round color="grey-1" text-color="grey" icon="check" @click="enablePoll(props.row)"/>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="text-h6">Top Polls</div>
            </q-card-section>
            <q-separator />
            <q-list>
              <q-item v-for="(data, index) in joiner" :key="index">
                <q-item-section class="text-capitalize">{{ data.title }}</q-item-section>
                <q-item-section avatar>
                  {{ data.count }}
                </q-item-section>
              </q-item>
            </q-list>
            <q-inner-loading :showing="joinerLoading">
              <q-spinner-ios size="25px" color="grey" />
            </q-inner-loading>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="pollDialog" >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Poll</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input stack-label outlined v-model="title" color="grey" label="Title..." class="q-mt-xs" :error-message="errors.title.msg" :error="errors.title.type" />
          <q-input autogrow stack-label outlined v-model="content" color="grey" label="Content..." class="q-mt-xs" :error-message="errors.content.msg" :error="errors.content.type" />
          <q-select emit-value map-options color="grey" outlined v-model="categoryId" use-input input-debounce="0" label="Choose Category..." stack-label :options="preferenceStore.categories" @filter="filterCategory" class="q-mt-xs" :error-message="errors.categoryId.msg" :error="errors.categoryId.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input stack-label outlined color="grey" label="Expire on..." class="q-mt-xs" v-model="expireOn">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="expireOn">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <input type="file" @change="onPhotoChange"  ref="file" style="display: none" />
          <q-btn v-ripple v-if="!photo" outline color="positive" label="Upload photo" class="q-mt-xs full-width" @click="$refs.file.click()" />
          <q-btn v-ripple v-if="photo" outline color="negative" label="remove photo" class="q-mt-xs full-width" @click="removePhoto" />
          <div v-if="photo" class="q-mt-xs">
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
        <q-separator />
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn v-close-popup size="md" color="grey" unelevated label="close"/>
          <q-btn v-if="!isEdit" @click="createPoll" size="md" color="positive" unelevated label="save"/>
          <q-btn v-if="isEdit" @click="updatePoll" size="md" color="positive" unelevated label="update"/>
        </q-card-actions>
        <q-inner-loading :showing="saveLoading">
          <q-spinner-ios size="25px" color="grey" />
        </q-inner-loading>
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
import { useNavStore } from 'src/store/nav-store'
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const preferenceStore = usePreferenceStore()
const navStore = useNavStore()

const innerLoading = ref(false)
const tableLoading = ref(false)
const saveLoading = ref(false)
const joinerLoading = ref(false)
const isEdit = ref(false)
const pollDialog = ref(false)

const err = ref([])
const hasError = ref(false)

const totalPoll = ref(0)
const totalActive = ref(0)
const totalInactive = ref(0)
const totalJoiner = ref(0)

const lists = ref([])
const joiner = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'title', label: 'Title', field: '', sortable: true, align: 'left'},
  {name: 'category', label: 'Category', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const id = ref('')
const title = ref('')
const content = ref('')
const categoryId = ref('')
const expireOn = ref('')
const photo = ref('')

const filter = ref('')

const errors = reactive({
  title: {msg: null, type: null},
  content: {msg: null, type: null},
  categoryId: {msg: null, type: null},
  expireOn: {msg: null, type: null},
  photo: {msg: null, type: null}
})

const validation = () => {
  let isError = false
  //title
  if (title.value.length < 1) {
    errors.title.msg = 'Please enter your label'
    errors.title.type = true
    isError = true
  } else {
    errors.title.msg = null
    errors.title.type = null
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
  //category
  if (categoryId.value.length < 1) {
    errors.categoryId.msg = 'Please enter your label'
    errors.categoryId.type = true
    isError = true
  } else {
    errors.categoryId.msg = null
    errors.categoryId.type = null
  }
  //expire on
  if (expireOn.value.length < 1) {
    errors.expireOn.msg = 'Please enter your expiry date'
    errors.expireOn.type = true
    isError = true
  } else {
    errors.expireOn.msg = null
    errors.expireOn.type = null
  }
  //
  if (photo.value.length < 1) {
    errors.photo.msg = 'Please enter your photo'
    errors.photo.type = true
    isError = true
  } else {
    errors.photo.msg = null
    errors.photo.type = null
  }

  return isError
}

/**
 * get poll overview
 */
const getAllPoll = async () => {
  /**
   * enable, inner loading
   */
  innerLoading.value = true
  joinerLoading.value = true
  try {
    const res = await server.get(`api/admin/poll?id=${authStore.year}`)
    /**
     * get listd
     */
    joiner.value = res.data.joiner
    /**
     * total poll, active, inactive, joiner
     */
    totalPoll.value = res.data.totalPoll
    totalActive.value = res.data.totalActive
    totalInactive.value = res.data.totalInactive
    totalJoiner.value = res.data.totalJoiner
    /**
     * disable inner loading
     */
    innerLoading.value = false
    joinerLoading.value = false
  } catch (error) {

  }
}

/**
 * get poll overview
 */
 const getAllPollList = async () => {
  /**
   * enable table
   */
  tableLoading.value = true
  try {
    const res = await server.get(`api/admin/poll/list?id=${authStore.year}`)
    /**
     * get listd
     */
    lists.value = res.data
    /**
     * disable table, inner loading
     */
    tableLoading.value = false
  } catch (error) {

  }
}

/**
 * new poll
 */
const newPoll = () => {
  isEdit.value = false
  pollDialog.value = true
  //
  title.value = ''
  content.value = ''
  categoryId.value = ''
  expireOn.value = ''
  photo.value = ''
}

/**
 * create poll
 */
const createPoll = async () => {
  /**
   * validate form
   */
  const isError = validation()
  if (isError) return false
  /**
   * enable loading
   */
  saveLoading.value = true
  try {
    const res = await server.post(`api/admin/poll`, {
      title: title.value,
      content: content.value,
      categoryId: categoryId.value,
      expireOn: expireOn.value,
      photo: photo.value
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
     * get all discussion
     */
    getAllPoll()
    getAllPollList()
    /**
     * empty form
     */
    title.value = ''
    content.value = ''
    categoryId.value = ''
    expireOn.value = ''
    photo.value = ''
    /**
     * disable loading
     */
    saveLoading.value = false
    /**
     * disable edit mode, dialog
     */
    isEdit.value = false
    pollDialog.value = false
  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable loading
     */
     saveLoading.value = false
  }
}

/**
 * modify
 */
const modifyPoll = (data) => {
  isEdit.value = true
  pollDialog.value = true
  //
  id.value = data.id
  title.value = data.title
  content.value = data.content
  categoryId.value = data.categoryID
  expireOn.value = data.expire_on
  photo.value = data.file
}

/**
 * update
 */
const updatePoll = async () => {
  /**
   * validate label and code
   */
   const isError = validation()
  if (isError) return false
  /**
   * enable inner loading
   */
  saveLoading.value = true
  /**
   * disable hasError
   */
  hasError.value = false

  try {
    /**
     * call to update
     */
    const res = await server.put(`api/admin/poll/${id.value}`, {
      title: title.value,
      content: content.value,
      categoryId: categoryId.value,
      expireOn: expireOn.value,
      photo: photo.value
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
    getAllPoll()
    getAllPollList()
    /**
     * clear form
     */
    id.value = ''
    title.value = ''
    content.value = ''
    categoryId.value = ''
    expireOn.value = ''
    photo.value = ''
    /**
     * disable inner loading
     */
    saveLoading.value = false
    /**
     * disable edit mode
     */
    isEdit.value = false
    pollDialog.value = false
  } catch (error) {
    /**
     * display error
     */
    err.value = error.response.data.errors
    hasError.value = true
    /**
     * disable inner loading
     */
    saveLoading.value = false
  }
}

/**
 * disable
 */
const disablePoll = async (data) => {
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
    const res = await server.post(`api/admin/poll/disable/${id.value}`)
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
    getAllPoll()
    getAllPollList()
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
 * enable
 */
const enablePoll = async (data) => {
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
    const res = await server.post(`api/admin/poll/enable/${id.value}`)
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
    getAllPoll()
    getAllPollList()
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
 * detail
 */
const detail = (data) => {
  navStore.pollId = data
  navStore.currentPage = 'PollDetailPage'
}

/**
 * cancel
 */
const cancel = () => {
  isEdit.value = false
  id.value = ''
  title.value = ''
  content.value = ''
  categoryId.value = ''
  expireOn.value = ''
  photo.value = ''
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

// search data
const searchList = debounce(async (val) => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/admin/poll/list?id=${authStore.year}&filter=${val}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
})
// watch search text
watch(() => filter.value, searchList)

onMounted(() => {
  /**
   * get all discussion
   */
  getAllPoll()
  /**
   * 
   */
  getAllPollList()
})
</script>