<template>
  <div
    class="mc-CategoryCosts flexbox flex-column align-items-center"
    :title="item.name"
  >
    <b-icon
      class="mc-CategoryCosts__icon"
      :icon="item.icon.value"
      :style="{ color: item.icon.color }"
    />
    <div class="mc-CategoryCosts__part">
      {{ item.part ? `${item.part}%` : " " }}
    </div>
  </div>
</template>

<script>
export default {
  name: "category-costs",
  props: {
    item: Object,
  },
};
</script>

<style lang="scss" scoped>
.mc-CategoryCosts {
  &__icon {
    font-size: 5rem;
    position: relative;
    top: 4px;
  }
  &__part {
    padding: 4px 0;
    font-weight: bold;
    text-align: center;
    min-height: 24px;
    height: 24px;
    color: var(--light);
    font-size: 1.5rem;
  }
}
</style>