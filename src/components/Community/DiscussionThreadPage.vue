<template>
    <div>
        
        <!--START DESKTOP MODE-->
        <div class="desktop-only q-pa-md">
            <div class="row q-gutter-sm">
                <div class="col-5">
                    <div class="bg-white radius">
                        <div class="q-pa-md">
                            <div>
                                <q-input rounded outlined color="primary" label="Write a comment..." autogrow class="full-width" v-model="comment" :error-message="errors.comment.msg" :error="errors.comment.type"></q-input>
                                <q-btn color="primary" unelevated rounded label="save" class="full-width q-mt-sm" @click="createThread" :loading="saving">
                                <template v-slot:loading>
                                    <q-spinner-puff />&nbsp;Saving...
                                </template>
                                </q-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <!--Loading-->
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
                    <!--No thread-->
                    <div v-if="!threads.length && !loading">
                        <div class="bg-white radius">
                        <div class="q-pa-md">
                            <div class="text-center">
                            <q-img src="~assets/icons/no_data.png" width="100px" />
                                <div class="text-subtitle1 text-grey-6 q-mt-md">No thread yet.</div>
                                <div class="text-caption text-grey-6">Be the first to start a thread.</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <!--thread list-->
                    <div v-if="threads.length && !loading">
                        <div style="max-height: 50vh" class="radius scroll">
                            <div class="bg-white radius q-mt-sm" v-for="(data, index) in threads" :key="index">
                                <div class="q-pa-md">
                                    <q-item class="q-pa-none">
                                        <q-item-section avatar>
                                        <q-avatar>
                                            <img :src="data.avatar">
                                        </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{data.name}}</q-item-label>
                                            <q-item-label caption>{{data.office}}</q-item-label>
                                            <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="q-pl-none q-pr-none">
                                        <q-item-label class="text-dark">{{data.content}}</q-item-label>
                                    </q-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--END DESKTOP MODE-->

        <!--===========================================================================================================================================================================================-->

        <!--START MOBILE MODE-->
        <div class="mobile-only q-pa-md">
            <!--Loading-->
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
            <!--No thread-->
            <div v-if="!threads.length && !loading">
                <div class="bg-white radius">
                    <div class="q-pa-md">
                        <div class="text-center">
                        <q-img src="~assets/icons/no_data.png" width="100px" />
                            <div class="text-subtitle1 text-grey-6 q-mt-md">No thread yet.</div>
                            <div class="text-caption text-grey-6">Be the first to start a thread.</div>
                        </div>
                    </div>
                </div>
            </div>
            <!--Thread list-->
            <div v-if="threads.length && !loading">
                <div style="max-height: 78vh" class="radius scroll">
                    <div class="bg-white radius q-mt-sm" v-for="(data, index) in threads" :key="index">
                        <div class="q-pa-md">
                            <q-item class="q-pa-none">
                                <q-item-section avatar>
                                <q-avatar>
                                    <img :src="data.avatar">
                                </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{data.name}}</q-item-label>
                                    <q-item-label caption>{{data.office}}</q-item-label>
                                    <q-item-label caption>{{ moment(data.created_at).fromNow() }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item class="q-pl-none q-pr-none">
                                <q-item-label class="text-dark">{{data.content}}</q-item-label>
                            </q-item>
                        </div>
                    </div>
                </div>
            </div>
            <q-footer class="footer bg-white">
                <q-input rounded outlined bottom-slots label="Write a comment..." class="full-width" v-model="comment" color="primary" :error-message="errors.comment.msg" :error="errors.comment.type">
                    <template v-slot:after>
                        <q-btn v-if="!saving" round dense flat icon="send" class="q-pa-sm" @click="createThread" />
                        <q-spinner-puff v-if="saving" />
                    </template>
                </q-input>
            </q-footer>
        </div>
        <!--END MOBILE MODE-->
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

const threads = ref([])

const err = ref([])
const hasError = ref(false)

const comment = ref('')

/**
 * validation
 */
const errors = reactive({
  comment: {msg: null, type: null},
})

const validation = () => {
  let isError = false
  //comment
  if (comment.value.length < 1) {
    errors.comment.msg = 'Please enter your comment'
    errors.comment.type = true
    isError = true
  } else {
    errors.comment.msg = null
    errors.comment.type = null
  }

  return isError
}

/**
 * create thread
 */
const createThread = async () => {
    /**
     * disable error
     */
    hasError.value = false
    /** 
     * enable loading
     */
    saving.value = true
    try {
        const res = await server.put(`api/community/discussion/thread/${userStore.id}`, {
            discussionID: userStore.discussionID,
            content: comment.value
        })
        /**
         * disable loading
         */
        saving.value = false
        /**
         * reload thread
         */
        getAllThread()
        /**
         * empty form
         */
        comment.value = ''
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
const getAllThread = async () => {
    /**
   * enable loading
   */
    loading.value = true
    try {
    const res = await server.get(`api/community/discussion/${userStore.discussionID}`)
        threads.value = res.data
        /**
         * disable loading
         */
        loading.value = false
    } catch (error) {

    }
}

onMounted(() => {
    /**
     * generate response
     */
    getAllThread()
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