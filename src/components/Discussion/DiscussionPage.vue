<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">discussion & poll overview</div>
    <q-separator />
    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalDiscussion }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Discussion/Poll</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_discussion.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalActive }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Active</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_active.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalInactive }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Inactive</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_inactive.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
          </q-inner-loading>
        </q-card>
      </div>
      <div class="col-md-3 col-lg-3 col-sm-12 col-xs-12 box_1">
        <q-card class="no-shadow q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
          <q-item class="q-pb-none q-pt-xs">
            <q-item-section>
              <q-item-label class="text-h3 text-white" style="font-weight: 500;letter-spacing: 3px;">{{ totalJoiner }}</q-item-label>
              <q-item-label class="text-uppercase text-bold text-subtitle1 text-grey-3" style="letter-spacing: 1px;">Joiner</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-img src="~assets/icons/d_join.png" width="60px" />
            </q-item-section>
          </q-item>
          <q-inner-loading :showing="innerLoading">
            <q-spinner-puff size="25px" color="grey" />
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
                  <div class="text-h6">Discussion/Poll</div>
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
                      <q-btn v-if="authStore.isAdmin || authStore.isSup" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="add" @click="newDiscussion">
                        <q-tooltip anchor="bottom middle" self="center middle">New Discussion</q-tooltip>
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
                    <div class="text-caption text-grey">
                      {{props.row.expiry_on}}
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
                <template v-slot:body-cell-office="props">
                  <q-td :props="props">
                    <q-badge color="primary" class="q-ml-xs" v-for="(dt, index) in props.row.offices" :key="index">{{ dt.office }}</q-badge>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div v-if="(authStore.isAdmin || authStore.isSup || authStore.isMgmt)">
                      <q-btn v-if="props.row.isActive==true" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert">
                        <q-menu cover auto-close>
                          <q-list>
                            <q-item dense clickable @click="print(props.row.id)">
                              <q-item-section>Print</q-item-section>
                            </q-item>
                            <q-item dense clickable @click="thread(props.row.id)">
                              <q-item-section>Thread</q-item-section>
                            </q-item>
                            <q-item dense clickable @click="modifyDiscussion(props.row)">
                              <q-item-section>Modify</q-item-section>
                            </q-item>
                            <q-item dense clickable @click="disableDiscussion(props.row)">
                              <q-item-section>Disable</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                      <q-btn v-if="props.row.isActive==false" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" @click="enableDiscussion(props.row)"/>
                    </div>
                    <div v-if="authStore.isEncoder">
                      <q-btn v-if="props.row.isActive==true" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" @click="thread(props.row.id)"/>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
            <q-card-section>
              <div class="text-h6">Top Discussions</div>
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
              <q-spinner-puff size="25px" color="grey" />
            </q-inner-loading>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="discussionDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Discussion/Poll</div>
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
          <q-input stack-label outlined v-model="title" :color="$q.dark.isActive ? 'white' : 'primary'" label="Title..." class="q-ma-xs" :error-message="errors.title.msg" :error="errors.title.type" />
          <q-input autogrow stack-label outlined v-model="content" :color="$q.dark.isActive ? 'white' : 'primary'" label="Content..." class="q-ma-xs" :error-message="errors.content.msg" :error="errors.content.type" />
          <q-select emit-value map-options :color="$q.dark.isActive ? 'white' : 'primary'" outlined v-model="categoryID" use-input input-debounce="0" label="Choose Category..." stack-label :options="preferenceStore.categories" @filter="filterCategory" class="q-ma-xs" :error-message="errors.categoryID.msg" :error="errors.categoryID.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input stack-label outlined v-model="day" :color="$q.dark.isActive ? 'white' : 'primary'" label="Day..." class="q-ma-xs" :error-message="errors.day.msg" :error="errors.day.type" />
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
        <q-card-actions align="right">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="isEdit ? updateDiscussion() : createDiscussion()" size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated :label="isEdit ? 'update' : 'save'" class="btn-form text-capitalize" :loading="saveLoading">
            <template v-slot:loading>
              <q-spinner-puff />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="reportDialog" full-height full-width>
      <q-card>
        <q-btn icon="close" class="fixed bg-white" round dense v-close-popup style="top: 25px; right: 10px; transform: translateY(-50%); z-index: 999;" />
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
import { useQuasar, QSpinnerPuff, debounce, is } from 'quasar'
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

const err = ref([])
const hasError = ref(false)

const totalDiscussion = ref(0)
const totalActive = ref(0)
const totalInactive = ref(0)
const totalJoiner = ref(0)

const discussionDialog = ref(false)

const lists = ref([])
const joiner = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'title', label: 'Title', field: '', sortable: true, align: 'left'},
  {name: 'category', label: 'Category', field: '', sortable: true, align: 'left'},
  {name: 'office', label: 'Office', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const id = ref('')
const title = ref('')
const content = ref('')
const categoryID = ref('')
const day = ref('')
const photo = ref('')

const filter = ref('')

const file = ref('')
const reportDialog = ref(false)

const errors = reactive({
  title: {msg: null, type: null},
  content: {msg: null, type: null},
  categoryID: {msg: null, type: null},
  day: {msg: null, type: null},
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
  if (categoryID.value.length < 1) {
    errors.categoryID.msg = 'Please enter your label'
    errors.categoryID.type = true
    isError = true
  } else {
    errors.categoryID.msg = null
    errors.categoryID.type = null
  }
  //expire on
  if (day.value.length < 1) {
    errors.day.msg = 'Please enter your day'
    errors.day.type = true
    isError = true
  } else {
    errors.day.msg = null
    errors.day.type = null
  }

  return isError
}

/**
 * new discussion
 */
const newDiscussion = () => {
  isEdit.value = false
  discussionDialog.value = true
  title.value = ''
  content.value = ''
  categoryID.value = ''
  day.value = ''
  photo.value = ''
}

/**
 * create discussion
 */
const createDiscussion = async () => {
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
    const res = await server.post(`api/discussion`, {
      title: title.value,
      content: content.value,
      categoryID: categoryID.value,
      day: day.value,
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
     * get all discussion
     */
    getAllDiscussion()
    getAllDiscussionList()
    /**
     * empty form
     */
    title.value = ''
    content.value = ''
    categoryID.value = ''
    day.value = ''
    photo.value = ''
    /**
     * disable loading
     */
    saveLoading.value = false
    /**
     * disable edit mode, dialog
     */
    isEdit.value = false
    discussionDialog.value = false
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
 * modify preference
 */
const modifyDiscussion = (data) => {
  isEdit.value = true
  discussionDialog.value = true
  //
  id.value = data.id
  title.value = data.title
  content.value = data.content
  categoryID.value = data.categoryID
  day.value = data.day
  photo.value = data.file
}

/**
 * update
 */
const updateDiscussion = async () => {
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
    const res = await server.put(`api/discussion/${id.value}`, {
      title: title.value,
      content: content.value,
      categoryID: categoryID.value,
      day: day.value,
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
    getAllDiscussion()
    getAllDiscussionList()
    /**
     * clear form
     */
    id.value = ''
    title.value = ''
    content.value = ''
    categoryID.value = ''
    day.value = ''
    photo.value = ''
    /**
     * disable inner loading
     */
    saveLoading.value = false
    /**
     * disable edit mode, dialog
     */
    isEdit.value = false
    discussionDialog.value = false
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
const disableDiscussion = async (data) => {
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
    const res = await server.post(`api/discussion/disable/${id.value}`)
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
    getAllDiscussion()
    getAllDiscussionList()
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
const enableDiscussion = async (data) => {
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
    const res = await server.post(`api/discussion/enable/${id.value}`)
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
    getAllDiscussion()
    getAllDiscussionList()
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
 * thread
 */
const thread = (data) => {
  navStore.discussionID = data
  navStore.currentPage = 'DiscussionDetailPage'
}

/**
 * get desicussion overview
 */
 const getAllDiscussion = async () => {
  /**
   * enable inner loading
   */
  innerLoading.value = true
  joinerLoading.value = true
  try {
    const res = await server.get(`api/discussion/overview/${authStore.id}`)
    /**
     * get listd
     */
    joiner.value = res.data.joiner
    /**
     * total discussion, active, inactive, joiner
     */
    totalDiscussion.value = res.data.totalDiscussion
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
 * get desicussion list
 */
 const getAllDiscussionList = async () => {
  /**
   * enable table
   */
  tableLoading.value = true
  try {
    const res = await server.get(`api/discussion/list/${authStore.id}`)
    /**
     * get listd
     */
    lists.value = res.data
    /**
     * disable table
     */
    tableLoading.value = false
  } catch (error) {

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
    const res = await server.get(`api/discussion/list/${authStore.id}?filter=${val}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
})
// watch search text
watch(() => filter.value, searchList)

/**
 * generate discussion
 */
 const print = async (id) => {
  
  $q.loading.show({
    spinner: QSpinnerPuff,
    spinnerColor: 'white',
    spinnerSize: 25,
    backgroundColor: 'dark'
  })
  
  try {
    const res = await server.get(`api/discussion/report/${id}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    })
    const blob = new Blob([res.data], {type: 'application/pdf'});
    const pdfurl = window.URL.createObjectURL(blob)+"#view=FitW";
    file.value = pdfurl
    reportDialog.value = true
    $q.loading.hide()
  } catch (error) {
    $q.loading.hide()
  }
}

onMounted(() => {
  /**
   * get all discussion
   */
  getAllDiscussion()
  /**
   * get discussion list
   */
  getAllDiscussionList()
})
</script>