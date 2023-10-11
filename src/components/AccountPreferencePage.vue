<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">account preference</div>
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
                <q-badge :color="props.row.adm > 0 ? 'positive' : 'negative'" rounded class="q-mr-sm" />{{props.row.adm > 0 ? 'ACTIVE' : 'INACTIVE'}}
              </q-td>
            </template>
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item class="q-pa-none" style="max-width: 400px">
                  <q-item-section avatar class="q-pa-none">
                    <q-avatar>
                      <img v-if="props.row.avatar" :src="props.row.avatar">
                      <img v-else src="~assets/account.png">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-uppercase">{{props.row.name}}</q-item-label>
                    <q-item-label caption>{{ props.row.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
            <template v-slot:body-cell-office="props">
              <q-td :props="props">
                <div class="text-uppercase">
                  {{props.row.office}}
                </div>
                <div class="text-caption text-capitalize">
                  {{props.row.position}}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-role="props">
              <q-td :props="props">
                <div class="text-uppercase">
                  {{props.row.role}}
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn v-if="props.row.adm > 0" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="more_vert" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item dense clickable @click="modifyPreference(props.row)">
                        <q-item-section>Modify</q-item-section>
                      </q-item>
                      <q-item dense clickable @click="resetPreference(props.row.id)">
                        <q-item-section>Reset</q-item-section>
                      </q-item>
                      <q-item dense clickable @click="disablePreference(props.row)">
                        <q-item-section>Disable</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn v-if="props.row.adm == 0" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="check" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="enablePreference(props.row)" />
                <q-btn v-if="!props.row.isVerified" unelevated size="sm" round :color="$q.dark.isActive ? 'grey-9' : 'grey-2'" text-color="grey" icon="person" class="absolute" style="top: 12px; right: 12px; transform: translateY(0%);" @click="detailPreference(props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="newDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">create account</div>
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
          <div v-if="!avatar" class="q-pa-xs">
            <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="sm" label="upload profile photo" @click="$refs.file.click()" class="text-capitalize"/>
            <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
          </div>
          <div v-else class="q-pa-xs">
            <q-list bordered>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="avatar">
                  </q-avatar>
                </q-item-section>
                <q-item-section>Profile Photo</q-item-section>
                <q-item-section side>
                  <q-btn round unelevated size="sm" icon="delete" @click="removePhoto" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="roleID" stack-label use-input input-debounce="0" label="Choose Role..." :options="preferenceStore.roles" @filter="filterRole" behavior="menu" class="q-ma-xs" :error-message="errors.roleID.msg" :error="errors.roleID.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input v-model="name" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Name" stack-label :error-message="errors.name.msg" :error="errors.name.type" class="q-ma-xs" />
          <q-input v-model="email" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="E-mail" stack-label :error-message="errors.email.msg" :error="errors.email.type" class="q-ma-xs" />
          <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="password" :type="showPwd ? 'text' : 'password'" label="Password" stack-label class="q-ma-xs" :error-message="errors.password.msg" :error="errors.password.type"/>
          <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="confirmPassword" :type="showPwd ? 'text' : 'password'" label="Confirm Password" stack-label class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
          <div class="q-mt-md">
            <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pt-md q-pb-md">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="createPreference" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="save" class="btn-form text-capitalize" :loading="innerLoading">
            <template v-slot:loading>
              <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modifyDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">modify account</div>
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
          <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="roleID" stack-label use-input input-debounce="0" label="Choose Role..." :options="preferenceStore.roles" @filter="filterRole" behavior="menu" class="q-ma-xs" :error-message="errors.roleID.msg" :error="errors.roleID.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input v-model="name" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Name" stack-label :error-message="errors.name.msg" :error="errors.name.type" class="q-ma-xs" />
          <q-input v-model="email" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="E-mail" stack-label :error-message="errors.email.msg" :error="errors.email.type" class="q-ma-xs" />
          <q-input v-model="employeeID" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Employee ID" stack-label :error-message="errors.employeeID.msg" :error="errors.employeeID.type" class="q-ma-xs" />
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
          <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="yearID" stack-label use-input input-debounce="0" label="Choose Year..." :options="preferenceStore.years" @filter="filterYear" behavior="menu" class="q-ma-xs" :error-message="errors.yearID.msg" :error="errors.yearID.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <div v-if="!avatar" class="q-pa-xs">
            <q-btn unelevated :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" size="sm" label="upload profile photo" @click="$refs.file.click()" class="text-capitalize"/>
            <input id="file-upload" type="file" @change="onPhotoChange"  ref="file" style="display: none" />
          </div>
          <div v-else class="q-pa-xs">
            <q-list bordered>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="avatar">
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
        <q-separator />
        <q-card-actions align="right" class="q-pt-md q-pb-md">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="updatePreference" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="save" class="btn-form text-capitalize" :loading="innerLoading">
            <template v-slot:loading>
              <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="verifyDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">verify account</div>
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
          <q-input v-model="employeeID" outlined :color="$q.dark.isActive ? 'white' : 'primary'" type="text" label="Employee ID" stack-label :error-message="errors.employeeID.msg" :error="errors.employeeID.type" class="q-ma-xs" />
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
          <q-select emit-value map-options outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="yearID" stack-label use-input input-debounce="0" label="Choose Year..." :options="preferenceStore.years" @filter="filterYear" behavior="menu" class="q-ma-xs" :error-message="errors.yearID.msg" :error="errors.yearID.type">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pt-md q-pb-md">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="verifyPreference" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated :label="isEdit ? 'update' : 'save'" class="btn-form text-capitalize" :loading="innerLoading">
            <template v-slot:loading>
              <q-spinner-puff size="25px" :color="$q.dark.isActive ? 'primary' : 'white'" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="resetDialog" persistent>
      <q-card style="width: 500px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h5 text-capitalize">reset password</div>
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
          <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="password" :type="showPwd ? 'text' : 'password'" label="Password" stack-label class="q-ma-xs" :error-message="errors.password.msg" :error="errors.password.type"/>
          <q-input outlined :color="$q.dark.isActive ? 'white' : 'primary'" v-model="confirmPassword" :type="showPwd ? 'text' : 'password'" label="Confirm Password" stack-label class="q-ma-xs" :error-message="errors.confirmPassword.msg" :error="errors.confirmPassword.type"/>
          <div v-if="!isEdit" class="q-mt-md">
            <q-toggle v-model="showPwd" color="primary" :icon="showPwd ? 'visibility' : 'visibility_off'" :label="showPwd ? 'Hide Password' : 'Show Password'" size="lg"/>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pt-md q-pb-md">
          <q-btn v-close-popup size="md" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="close" class="btn-form text-capitalize"/>
          <q-btn @click="resetPasswordPreference" :color="$q.dark.isActive ? 'grey-9' : 'primary'" text-color="white" unelevated label="reset" class="btn-form text-capitalize" :loading="innerLoading">
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
import Swal from 'sweetalert2'

const $q = useQuasar()
const authStore = useAuthStore()
const preferenceStore = usePreferenceStore()

const err = ref([])
const hasError = ref(false)
const isEdit = ref(false)

const id = ref('')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const employeeID = ref('')
const roleID = ref('')
const officeID = ref('')
const positionID = ref('')
const yearID = ref('')
const avatar = ref('')

const showPwd = ref(false)

const filter = ref('')

const lists = ref([])
const columns = ref([
  {name: 'active', label: '', field: '', sortable: false, align: 'left'},
  {name: 'name', label: 'Name', field: '', sortable: true, align: 'left'},
  {name: 'office', label: 'Office', field: '', sortable: true, align: 'left'},
  {name: 'role', label: 'Role', field: '', sortable: true, align: 'left'},
  {name: 'action', label: '', field: 'Action', sortable: false, align: 'right'}
])

const tableLoading = ref(false)
const innerLoading = ref(false)

const newDialog = ref(false)
const modifyDialog = ref(false)
const verifyDialog = ref(false)
const resetDialog = ref(false)

const errors = reactive({
  name: {msg: null, type: null},
  email: {msg: null, type: null},
  password: {msg: null, type: null},
  confirmPassword: {msg: null, type: null},
  roleID: {msg: null, type: null},
  officeID: {msg: null, type: null},
  positionID: {msg:null, type: null},
  yearID: {msg: null, type: null},
  employeeID: {msg: null, type: null}
})

const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return !emailPattern.test(val)
}

const accountValidation = () => {
  let isError = false
  // role
  if (roleID.value.length < 1) {
    errors.roleID.msg = 'Please enter your role'
    errors.roleID.type = true
    isError = true
  } else {
    errors.roleID.msg = null
    errors.roleID.type = null
  }
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
  //password
  if (password.value.length < 1) {
    errors.password.msg = 'Please enter your password'
    errors.password.type = true
    isError = true
  } else if (password.value.length > 0 && password.value.length < 4) {
    errors.password.msg = 'The minimum password length is 4 character'
    errors.password.type = true
    isError = true
  } else {
    errors.password.msg = null
    errors.password.type = null
  }
  //confirm password
  if (confirmPassword.value.length < 1) {
    errors.confirmPassword.msg = 'Please enter your confirm Password'
    errors.confirmPassword.type = true
    isError = true
  } else if (confirmPassword.value.length > 0 && confirmPassword.value.length < 4) {
    errors.confirmPassword.msg = 'The minimum confirm password length is 4 character'
    errors.confirmPassword.type = true
    isError = true
  } else if (password.value != confirmPassword.value) {
    errors.confirmPassword.msg = 'The password you enter does not match'
    errors.confirmPassword.type = true
  } else {
    errors.confirmPassword.msg = null
    errors.confirmPassword.type = null
  }

  return isError
}

const updateValidation = () => {
  let isError = false
  // role
  if (roleID.value.length < 1) {
    errors.roleID.msg = 'Please enter your role'
    errors.roleID.type = true
    isError = true
  } else {
    errors.roleID.msg = null
    errors.roleID.type = null
  }
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
  // office
  if (officeID.value.length < 1) {
    errors.officeID.msg = 'Please enter your office'
    errors.officeID.type = true
    isError = true
  } else {
    errors.officeID.msg = null
    errors.officeID.type = null
  }
  // position
  if (positionID.value.length < 1) {
    errors.positionID.msg = 'Please enter your role'
    errors.positionID.type = true
    isError = true
  } else {
    errors.positionID.msg = null
    errors.positionID.type = null
  }
  // employee id number
  if (employeeID.value.length < 1) {
    errors.employeeID.msg = 'Please enter your employee identification numbe'
    errors.employeeID.type = true
    isError = true
  } else {
    errors.employeeID.msg = null
    errors.employeeID.type = null
  }

  return isError
}

const verificationValidation = () => {
  let isError = false
  // office
  if (officeID.value.length < 1) {
    errors.officeID.msg = 'Please enter your office'
    errors.officeID.type = true
    isError = true
  } else {
    errors.officeID.msg = null
    errors.officeID.type = null
  }
  // position
  if (positionID.value.length < 1) {
    errors.positionID.msg = 'Please enter your role'
    errors.positionID.type = true
    isError = true
  } else {
    errors.positionID.msg = null
    errors.positionID.type = null
  }
  // year
  if (yearID.value.length < 1) {
    errors.yearID.msg = 'Please enter your year'
    errors.yearID.type = true
    isError = true
  } else {
    errors.yearID.msg = null
    errors.yearID.type = null
  }
  // employee id number
  if (employeeID.value.length < 1) {
    errors.employeeID.msg = 'Please enter your employee identification number'
    errors.employeeID.type = true
    isError = true
  } else {
    errors.employeeID.msg = null
    errors.employeeID.type = null
  }

  return isError
}

const resetValidation = () => {
  let isError = false
  //password
  if (password.value.length < 1) {
    errors.password.msg = 'Please enter your password'
    errors.password.type = true
    isError = true
  } else if (password.value.length > 0 && password.value.length < 4) {
    errors.password.msg = 'The minimum password length is 4 character'
    errors.password.type = true
    isError = true
  } else {
    errors.password.msg = null
    errors.password.type = null
  }
  //confirm password
  if (confirmPassword.value.length < 1) {
    errors.confirmPassword.msg = 'Please enter your confirm Password'
    errors.confirmPassword.type = true
    isError = true
  } else if (confirmPassword.value.length > 0 && confirmPassword.value.length < 4) {
    errors.confirmPassword.msg = 'The minimum confirm password length is 4 character'
    errors.confirmPassword.type = true
    isError = true
  } else if (password.value != confirmPassword.value) {
    errors.confirmPassword.msg = 'The password you enter does not match'
    errors.confirmPassword.type = true
  } else {
    errors.confirmPassword.msg = null
    errors.confirmPassword.type = null
  }

  return isError
}

/**
 * new preference
 */
const newPreference = () => {
  newDialog.value = true
  roleID.value = ''
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

/**
 * create preference
 */
const createPreference = async () => {

  /**
   * validate firstname, lastname, email password, avatar
   */
  const isError = accountValidation()
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
    const res = await server.post(`api/account`, {
      roleID: roleID.value,
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      avatar: avatar.value
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
    roleID.value = ''
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    avatar.value = ''
    showPwd.value = false
    /**
     * disable inner loading
     */
     innerLoading.value = false
     newDialog.value = false

  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    } else {
      err.value = error.response.data.errors
      hasError.value = true
    }
    innerLoading.value = false
  }

}

/**
 * modify preference
 */
const modifyPreference = async (data) => {
  /**
   * enable
   */
  modifyDialog.value = true
  /**
   * populate form
   */
  id.value = data.id
  roleID.value = data.roleID
  name.value = data.name
  email.value = data.email
  avatar.value = data.avatar
  employeeID.value = data.employeeID
  roleID.value = data.roleID
  officeID.value = data.officeID
  positionID.value = data.positionID
  yearID.value = data.yearID
}

/**
 * update preference
 */
const updatePreference = async () => {
  /**
   * validate label and code
   */
   const isError = updateValidation()
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
    const res = await server.put(`api/account/${id.value}`, {
      name: name.value,
      email: email.value,
      avatar:avatar.value,
      employeeID: employeeID.value,
      roleID: roleID.value,
      officeID: officeID.value,
      positionID: positionID.value,
      yearID: yearID.value
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
    email.value = ''
    avatar.value = ''
    employeeID.value = ''
    roleID.value = ''
    officeID.value = ''
    positionID.value = ''
    avatar.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    /**
     * disable edit mode
     */
    isEdit.value = false
    modifyDialog.value = false

  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    } else {
      err.value = error.response.data.errors
      hasError.value = true
    }
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
    text: `Disable ${data.firstname} ${data.lastname}. You won't be able to revert this!`,
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
    const res = await server.post(`api/account/disable/${id.value}`)
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
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    }
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
    text: `Enable ${data.firstname} ${data.lastname}. You won't be able to revert this!`,
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
    const res = await server.post(`api/account/enable/${id.value}`)
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
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    }
    $q.loading.hide()
  }
}

/**
 * enable & disbale verification, edit, reset mode
 */
const detailPreference = (data) => {
  verifyDialog.value = true
  id.value = data
}

/**
 * verify account: employee id, role, office, position
 */
const verifyPreference = async () => {
  /**
   * validate firstname, lastname, email password, avatar
   */
   const isError = verificationValidation()
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
    const res = await server.put(`api/account/verify/${id.value}`, {
      employeeID: employeeID.value,
      roleID: roleID.value,
      officeID: officeID.value,
      positionID: positionID.value,
      yearID: yearID.value
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
    employeeID.value = ''
    roleID.value = ''
    officeID.value = ''
    positionID.value = ''
    yearID.value = ''
    avatar.value = ''
    id.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    verifyDialog.value = false

  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    } else {
      err.value = error.response.data.errors
      hasError.value = true
    }
    
    /**
     * disable inner loading
     */
     innerLoading.value = false
  }
}

/**
 * enable & disbale reset, edit, verification
 */
const resetPreference = (data) => {
  id.value = data
  resetDialog.value = true
}

/**
 * reset password
 */
const resetPasswordPreference = async () => {
  /**
   * validate password, confirm password
   */
   const isError = resetValidation()
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
    const res = await server.put(`api/account/reset/${id.value}`, {
      password: password.value,
      password_confirmation: confirmPassword.value,
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
    password.value = ''
    confirmPassword.value = ''
    id.value = ''
    /**
     * disable inner loading
     */
    innerLoading.value = false
    resetDialog.value = false

  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    } else {
      err.value = error.response.data.errors
      hasError.value = true
    }

    innerLoading.value = false
  }
}

/**
 * get all preference
 */
const getAllPreference = async () => {
  tableLoading.value = true
  try {
    const res = await server.get(`api/account`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
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
    const res = await server.get(`api/account?filter=${val}`)
    lists.value = res.data
    tableLoading.value = false
  } catch (error) {
    if (error.response.status == 401 && error.response.data.message == 'Unauthenticated.') {
      authStore.notAuthenticated = true
    }
    tableLoading.value = false
  }
})
// watch search text
watch(() => filter.value, searchList)

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
    avatar.value = e.target.result;
  };
  reader.readAsDataURL(file);
}
/**
 * remove photo
 */
const removePhoto = () => {
  avatar.value = ''
}
/**
 * filter role
 */
const filterRole = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.roles = preferenceStore.roles
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.roles = preferenceStore.roles.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
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
/**
 * filter year
 */
const filterYear = (val, update) => {
  if (val === '') {
    update(() => {
      preferenceStore.years = preferenceStore.optYears
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    preferenceStore.years = preferenceStore.years.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

/**
 * load as mounted
 */
 onMounted(() => {
  /**
   * get all preference: account
   */
  getAllPreference()
  /**
   * get preferences on mount:
   */

})

</script>
