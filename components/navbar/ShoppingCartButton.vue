<template>
  <div class="navbar-item flex items-center" @click="toggleShoppingCartModal">
    <span v-if="props.showLabel">{{ $t('shoppingCart.label') }}</span>
    <div class="is-relative icon" :class="{ 'ml-2': showLabel }">
      <NeoIcon
        class="icon"
        icon="fa-shopping-cart-outline-sharp"
        pack="fa-kit fa-fw"
        size="medium" />
      <ActiveCount
        v-if="numberOfItems"
        :count="numberOfItems"
        rounded
        class="count-position is-size-7" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'
import ActiveCount from '../explore/ActiveCount.vue'
import { ModalCloseType } from './types'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import {
  isShoppingCartOpen,
  openShoppingCart,
} from '@/components/common/shoppingCart/ShoppingCartModalConfig'

const { urlPrefix } = usePrefix()
const { neoModal } = useProgrammatic()
const shoppingCartStore = useShoppingCartStore()
const numberOfItems = computed(
  () => shoppingCartStore.getItemsByPrefix(urlPrefix.value).length,
)

const props = defineProps<{
  showLabel: boolean
}>()

const emit = defineEmits(['closeBurgerMenu'])
const isMobile = ref(window.innerWidth < 1024)
const isMobileWithoutTablet = ref(window.innerWidth < 768)

const toggleShoppingCartModal = () => {
  if (isMobile.value) {
    emit('closeBurgerMenu')
  }

  neoModal.closeAll()

  // can use the function in ShoppingCartModalConfig
  if (!isShoppingCartOpen()) {
    openShoppingCart({
      onClose: (type: ModalCloseType) => {
        if (isMobile.value && type === ModalCloseType.BACK) {
          emit('closeBurgerMenu')
        }
      },
      ...(isMobileWithoutTablet.value ? { animation: 'none' } : {}),
    })
  }
}
</script>

<style scoped lang="scss">
.count-position {
  right: -0.75rem;
  top: -0.75rem;
  left: unset;
  bottom: unset;
}

.align {
  display: inline-flex;
  vertical-align: middle;
}
</style>
