<template>
  <div>
    <div class="flex justify-between mobile">
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <div class="top-collection-controls buttons items-start pt-2">
        <NeoButton
          v-for="{ value, label } in timeRanges"
          :key="value"
          class="control column p-0 has-fixed-width px-4 mobile-padding"
          :active="state.timeRange === value"
          :label="`${$t(`topCollections.timeFrames.${label}`)}`"
          @click="setTimeRange(value)" />
      </div>
      <div></div>
    </div>

    <div class="top-collections-grid mb-5">
      <div v-for="(collection, index) in data" :key="index">
        <TopCollectionsItem
          :collection="collection"
          :index="index + 1"
          :time-range="state.timeRange" />
      </div>
    </div>

    <div v-if="loading" class="top-collections-grid">
      <div
        v-for="index in limit"
        :key="index"
        class="top-collections-item py-2 flex items-center justify-between">
        <div class="flex items-center">
          <div class="p-4 has-text-weight-bold">
            {{ index }}
          </div>
          <div>
            <BasicImage custom-class="is-48x48 image-outline" rounded />
          </div>
        </div>
        <div class="px-2" style="width: 60%">
          <NeoSkeleton width="70%" />
          <NeoSkeleton width="20%" size="small" />
        </div>
        <div class="is-pulled-right has-text-right px-4" style="width: 20%">
          <NeoSkeleton width="80%" position="right" />
          <NeoSkeleton width="70%" size="small" position="right" />
        </div>
      </div>
    </div>

    <nuxt-link
      v-show="urlPrefix === 'rmrk' || urlPrefix === 'bsx'"
      to="/series-insight"
      class="link">
      {{ $t('helper.seeMore') }} >
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { TimeRange, TimeRangeOption } from '@/components/series/types'
import BasicImage from '@/components/shared/view/BasicImage.vue'
import { NeoButton, NeoSkeleton } from '@kodadot1/brick'
import TopCollectionsItem from './TopCollectionsItem.vue'
import { useTopCollections } from './utils/useTopCollections'
import { useFiatStore } from '@/stores/fiat'

const { urlPrefix } = usePrefix()
const fiatStore = useFiatStore()

const limit = 12
const { data, loading } = useTopCollections(limit)

const state = reactive<{ timeRange: TimeRange }>({ timeRange: 'All' })

const timeRanges: TimeRangeOption[] = [
  { value: 'Week', label: 'week' },
  { value: 'Month', label: 'month' },
  { value: 'Quarter', label: 'quarter' },
  { value: 'All', label: 'all' },
]

const setTimeRange = (timeRange: TimeRange) => {
  state.timeRange = timeRange
}

onMounted(() => {
  if (fiatStore.getCurrentKSMValue) {
    fiatStore.fetchFiatPrice()
  }
})
</script>
