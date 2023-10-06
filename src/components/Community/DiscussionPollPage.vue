<template>
    <div>
        
        <!--START DESKTOP MODE-->
        <div class="q-pa-md">
            <div v-if="loading">
                <div class="bg-white radius">
                    <div class="q-pa-md">
                        <q-item>
                            <q-item-section avatar>
                                <q-skeleton type="QAvatar" animation="fade" />
                            </q-item-section>
                            <q-item-section>
                                <q-item-label>
                                <q-skeleton type="text" animation="fade" />
                                </q-item-label>
                                <q-item-label caption>
                                <q-skeleton type="text" animation="fade" />
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-skeleton height="200px" square animation="fade" />
                        <q-card-section>
                            <q-skeleton type="text" class="text-subtitle2" animation="fade" />
                            <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
                        </q-card-section>
                    </div>
                </div>
            </div>
            
            <div v-if="!answers.length && !loading">
                <div class="bg-white radius">
                <div class="q-pa-md">
                    <div class="text-center">
                    <q-img src="~assets/icons/no_data.png" width="100px" />
                        <div class="text-subtitle1 text-grey-6 q-mt-md">No poll yet.</div>
                    </div>
                </div>
                </div>
            </div>

            <div v-if="answers.length && !loading">
                <div style="max-height: 50vh" class="radius scroll">
                    <div v-if="!isDone" class="bg-white radius q-mt-sm">
                        <div class="q-pa-md">
                            <q-list>
                                <q-item class="radius" tag="label" v-ripple v-for="(data, index) in answers" :key="index">
                                    <q-item-section avatar>
                                        <q-radio v-model="answerID" :val="data.id" />
                                    </q-item-section>
                                    <q-item-section>
                                    <q-item-label>{{ data.label }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                            <q-separator class="q-ma-sm" />
                            <div>
                                <q-btn color="primary" unelevated rounded label="save" class="full-width q-mt-sm" @click="createPoll" :loading="saving">
                                    <template v-slot:loading>
                                        <q-spinner-puff />&nbsp;Saving...
                                    </template>
                                </q-btn>
                            </div>
                        </div>
                    </div>
                    <div v-if="isDone" class="bg-white radius q-mt-sm">
                        <div class="q-pa-md">
                            <div class="text-center">
                                <div>
                                    <q-icon name="check_circle" size="6em" color="green" />
                                </div>
                                <div class="q-pa-sm">
                                    <div class="text-h5 text-uppercase">{{ pollMsg }}</div>
                                </div>
                                <div class="q-mt-md">
                                    <q-btn unelevated color="primary" label="okay" class="q-ma-xs" @click="emit('input-visible', false)"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--END DESKTOP MODE-->

        <!--===========================================================================================================================================================================================-->

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onMounted } from 'vue-demi'
import { useQuasar, QSpinnerPuff } from 'quasar'
import { useUserStore } from 'src/store/user-store'
import { server } from 'src/boot/axios'
import moment from 'moment'

const userStore = useUserStore()

const loading = ref(false)
const saving = ref(false)

const answers = ref([])

const err = ref([])
const hasError = ref(false)

const answerID = ref('')

const isDone = ref(false)
const pollMsg = ref('')


/**
 * create thread
 */
const createPoll = async () => {
    /**
     * disable error
     */
    hasError.value = false
    /** 
     * enable loading
     */
    saving.value = true
    try {
        const res = await server.put(`api/community/discussion/poll/${userStore.id}`, {
            discussionID: userStore.discussionID,
            answerID: answerID.value
        })
        /**
         * disable loading
         */
        saving.value = false
        /**
         * reload thread
         */
    } catch (error) {
        err.value = error.response.data.errors
        hasError.value = true
        /**
         * disable loading
         */
        saving.value = false
    }
}

/**
 * get thread
 */
const getAllAnswer = async () => {
    /**
   * enable loading
   */
    loading.value = true
    try {
    const res = await server.get(`api/community/discussion/poll/${userStore.discussionID}/${userStore.id}`)
        answers.value = res.data.list
        loading.value = false
        if (res.data.isDone) {
            isDone.value = true
            pollMsg.value = res.data.msg
        }
    } catch (error) {
        loading.value = false
    }
}

const emit = defineEmits(['input-visible'])

onMounted(() => {
    /**
     * generate response
     */
    getAllAnswer()
})
</script>

<style lang="scss" scoped>
.desktop-only
{

}
.mobile-only
{
    .footer
    {
        padding: 15px 10px 0px 10px;
    }
}
</style>