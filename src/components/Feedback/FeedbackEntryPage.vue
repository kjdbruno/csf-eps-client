<template>
  <div>
    <div class="text-h5 text-capitalize" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">feedback entry</div>
    <q-separator />
    <div class="q-mt-md">
      <q-card flat class="no-shadow" :class="$q.dark.isActive ? 'card-border-dark' : 'card-border-light'">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h5 text-capitalize">Entries</div>
            </div>

            <div class="col-auto">
              <q-tabs v-model="tab" dense class="text-grey" active-color="white" :indicator-color="$q.dark.isActive ? 'dark' : 'white'" align="right" narrow-indicator :active-bg-color="$q.dark.isActive ? 'primary' : 'primary'" >
                <q-tab name="entry" label="Entry" />
                <q-tab name="kiosk" label="Kiosk" />
              </q-tabs>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-tab-panels v-model="tab" animated transition-next="fade" transition-prev="fade">
            <q-tab-panel name="entry">
              <entry-page />
            </q-tab-panel>
            <q-tab-panel name="kiosk">
              <kiosk-page />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import KioskPage from './KioskPage.vue'
import EntryPage from './EntryPage.vue'

const tab = ref('entry')

</script>