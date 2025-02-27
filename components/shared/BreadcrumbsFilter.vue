<template>
  <NeoField grouped group-multiline>
    <div class="flex flex-wrap gap-3">
      <template v-for="(value, key) in breads" :key="key">
        <NeoTag
          v-if="key === 'search'"
          key="search"
          class="control"
          :variant="isCollectionSearchMode ? 'k-blue' : undefined"
          closable
          @close="removeBread('search')">
          {{ `${$t('general.search')}: ${value}` }}
        </NeoTag>
        <NeoTag
          v-else-if="key === 'min'"
          key="min"
          class="control"
          closable
          @close="removeBread('min')">
          {{ `${$t('Min')}:` }}
          <CommonTokenMoney :value="value" />
        </NeoTag>
        <NeoTag
          v-else-if="key === 'max'"
          key="max"
          class="control"
          closable
          @close="removeBread('max')">
          {{ `${$t('Max')}:` }}
          <CommonTokenMoney :value="value" />
        </NeoTag>
        <template v-else-if="key === 'collections'">
          <NeoTag
            v-for="item in collections"
            :key="`${key}-${item.id}`"
            class="control"
            closable
            @close="removeCollection(item.id)">
            {{ item.meta.name }}
          </NeoTag>
        </template>

        <NeoTag
          v-else
          :key="key"
          class="control"
          closable
          @close="closeTag(String(key))">
          {{ queryMapTranslation[String(key)] }}
        </NeoTag>
      </template>
      <div
        v-if="isAnyFilterActive"
        class="control py-1 is-clickable"
        @click="clearAllFilters">
        <span>{{ $t('sort.clearAll') }}</span>
      </div>
    </div>
  </NeoField>
</template>

<script lang="ts" setup>
import NeoTag from '@/components/shared/gallery/NeoTag.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import {
  Collection,
  collectionArray,
} from '@/composables/popularCollections/usePopularCollections'
import useActiveRouterFilters from '@/composables/useActiveRouterFilters'
import { NeoField } from '@kodadot1/brick'
import { useCollectionSearch } from '../search/utils/useCollectionSearch'

const route = useRoute()
const isCollectionActivityTab = computed(
  () => route.name === 'prefix-collection-id-activity',
)
const { replaceUrl } = useReplaceUrl({
  resetPage: !isCollectionActivityTab.value,
})
const { $i18n } = useNuxtApp()
const isItemsExplore = computed(() => route.path.includes('/explore/items'))

const breads = useActiveRouterFilters()

const collectionIdList = computed(
  () => breads.value.collections?.split(',') || [],
)

const collections = computed<Collection[]>(
  () =>
    collectionArray.value?.filter(
      (collection) =>
        collectionIdList.value?.find((id) => collection.id === id),
    ),
)

const { isCollectionSearchMode } = useCollectionSearch()
const removeCollection = (id: string) => {
  const ids = collections.value
    .filter((collection) => collection.id !== id)
    .map((collection) => collection.id)
  replaceUrl({ collections: ids.join(',') })
}

const isAnyFilterActive = computed(() =>
  Boolean(Object.keys(breads.value).length),
)

const clearAllFilters = () => {
  const clearedFilters = Object.keys(breads.value).reduce((filters, key) => {
    if (['search', 'min', 'max'].includes(key)) {
      return { ...filters, [key]: undefined }
    }
    return { ...filters, [key]: isCollectionActivityTab ? undefined : 'false' }
  }, {})

  replaceUrl(clearedFilters)
}

const queryMapTranslation = {
  listed: $i18n.t('sort.listed'),
  owned: $i18n.t('sort.own'),
  art_view: $i18n.t('filters.artView'),
  sale: $i18n.t('filters.sale'),
  offer: $i18n.t('filters.offer'),
  listing: $i18n.t('filters.listing'),
  mint: $i18n.t('filters.mint'),
  transfer: $i18n.t('filters.transfer'),
}

onMounted(() => {
  if (isItemsExplore.value && route.query.listed == undefined) {
    replaceUrl({ listed: 'true' })
  }
})

const closeTag = (key: string) => {
  replaceUrl({ [key]: false })
}

const removeBread = (key: string) => {
  replaceUrl({ [key]: undefined })
}
</script>
