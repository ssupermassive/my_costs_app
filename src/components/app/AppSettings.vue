<template>
  <b-sidebar
    :id="$attrs.id"
    bg-variant="dark"
    text-variant="light"
    title="Категории"
    right
    shadow
    backdrop
  >
    <template #title>
      <div class="me-AppSettings__title align-items-center">
        <b-icon
          variant="light"
          class="me-AppSettings__add"
          icon="plus-circle"
          title="+ Категория"
          @click="$addCategory()"
        />
        Категории
      </div>
    </template>
    <categories-list ref="categoriesList" />
  </b-sidebar>
</template>

<script>
import CategoriesList from "../categories/CategoriesList";

export default {
  components: {
    CategoriesList,
  },
  methods: {
    $addCategory: function () {
      this.$refs.categoriesList.addCategory();
    },
  },
};
</script>

<style lang="scss" scoped>
.me-AppSettings {
  &__title {
    color: var(--light);
    display: flex;
  }

  &__add {
    font-size: 2rem;
    margin-right: 12px;
    cursor: pointer;
  }
}
</style>