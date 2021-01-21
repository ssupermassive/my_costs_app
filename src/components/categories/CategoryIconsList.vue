<template>
  <div class="me-IconView">
    <b-icon
      @click="itemClick(icon)"
      class="me-IconView-icon border h1 p-1"
      v-for="icon in $store.state.categories.icons"
      :key="icon.id"
      :icon="icon.value"
      :style="{color: icon.color}"
    />
  </div>
</template>

<script>
import { BIcon } from "bootstrap-vue";

export default {
  name: "category-icons-list",
  components: {
    BIcon
  },
  methods: {
    itemClick(item) {
      this.$emit('itemClick', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.me-IconView {
  width: 240px;

  &-icon {
    margin: 4px;
    cursor: pointer;

    &:hover {
      background-color: lightblue;
    }
  }
}

</style>