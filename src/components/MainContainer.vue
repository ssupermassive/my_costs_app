<template>
  <div class="me-MainContainer flexbox flex-column flex-grow-1 flex-shrink-1">
    <header class="me-MainContainer-header flexbox justify-content-between align-items-center flex-grow-0 flex-shrink-0">
      <h1 class="me-MainContainer-header-title">Мои Расходы</h1>
      <div class="mc-MainContainer-header-buttons flexbox">
        <b-icon
          title="Новый расход"
          v-b-modal.add-costs-modal
          class="me-MainContainer-header-button"
          icon="plus-circle-fill"
        />
        <b-icon
          title="Настройки"
          v-b-toggle.sidebar
          class="me-MainContainer-header-button"
          icon="gear-fill"
        />
      </div>
      <b-sidebar id="sidebar" bg-variant="dark" text-variant="light" title="Категории" right shadow backdrop>
        <template #title>
          <div class="me-CategoriesSitebar__title align-items-center">
            <b-icon
              variant="light"
              class="me-CategoriesSitebar__add"
              icon="plus-circle"
              title="+ Категория"
              @click="$addCategory()"
            />
            Категории
          </div>
        </template>
        <categories-list ref="categoriesList" />
      </b-sidebar>
      <costs-dialog id="add-costs-modal" />
    </header>
    <main class="me-MainContainer-content flexbox flex-grow-1 flex-shrink-1">
      <chart-layout />
    </main>
  </div>
</template>

<script>
import CategoriesList from "./categories/CategoriesList";
import { BIcon, BSidebar } from "bootstrap-vue";
import ChartLayout from "./statistics/ChartLayout.vue";
import CostsDialog from "./costs/CostsDialog";

export default {
  name: "main-container",
  components: {
    CategoriesList,
    ChartLayout,
    CostsDialog,
    BIcon,
    BSidebar,
  },
  methods: {
    $addCategory: function () {
      this.$refs.categoriesList.addCategory();
    },
  },
};
</script>

<style lang="scss" scoped>
.me-MainContainer {
  width: 100%;
  height: 100%;

  &-content {
    height: 100%;
    width: 100%;
    background-color: var(--dark);
  }

  &-header {
    height: 60px;
    background-color: var(--gray);
    color: var(--light);
    &-title {
      margin-left: 24px;
      margin-bottom: 0;
    }

    &-button {
      cursor: pointer;
      font-size: 2rem;
      margin-right: 24px;
    }
  }
}

.me-CategoriesSitebar {
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
