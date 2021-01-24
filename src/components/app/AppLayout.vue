<template>
  <div
    class="me-AppLayout flexbox flex-column align-items-center flex-grow-1 flex-shrink-1"
  >
    <header
      class="me-AppLayout-header flexbox justify-content-between align-items-center flex-grow-0 flex-shrink-0"
    >
      <h1 class="me-AppLayout-header-title">Мои Расходы</h1>
      <div class="mc-AppLayout-header-buttons flexbox align-items-center">
        <b-button
          v-if="demoDataButtonVisible"
          pill
          variant="light"
          class="me-AppLayout-header-button"
          title="Заполнить демо - данными"
          @click="applyDemoData"
          >Заполнить</b-button
        >
        <b-icon
          title="Новый расход"
          v-b-modal.add-costs-modal
          class="me-AppLayout-header-button me-AppLayout-header-button-round"
          icon="plus-circle-fill"
        />
        <b-icon
          title="Настройки"
          v-b-toggle.settings
          class="me-AppLayout-header-button me-AppLayout-header-button-round"
          icon="gear-fill"
        />
      </div>
      <app-settings id="settings" />
      <costs-dialog id="add-costs-modal" />
    </header>
    <main class="me-AppLayout-content flexbox flex-grow-1 flex-shrink-1">
      <chart-layout />
    </main>
  </div>
</template>

<script>
import ChartLayout from "../statistics/ChartLayout.vue";
import CostsDialog from "../costs/CostsDialog";
import AppSettings from "./AppSettings";

const MC_DEMO_DATA_APPLIED = "MC_IS_DEMO_DATA";

export default {
  name: "app-layout",
  components: {
    AppSettings,
    ChartLayout,
    CostsDialog,
  },
  data() {
    return {
      demoDataButtonVisible: !JSON.parse(localStorage.getItem(MC_DEMO_DATA_APPLIED))
    }
  },
  methods: {
    applyDemoData() {
      this.$bvModal.msgBoxConfirm(
        "Использовать демо - данные для наполнения?",
        {
          title: 'Подтвердите действие',
          cancelTitle: 'Отмена',
          okTitle: 'Да',
          headerTextVariant: "light",
          headerBgVariant: "secondary",
          headerBorderМariant: "secondary",
          footerBorderVariant: 'light',
          bodyClass: 'me-AppLayout__confirmation'
        }
      ).then(async (result) => {
        if (result) {
          await this.$store.dispatch('applyDemoCategories');
          await this.$store.dispatch('applyDemoCosts');
          localStorage.setItem(MC_DEMO_DATA_APPLIED, true); 
          this.demoDataButtonVisible = false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.me-AppLayout {
  width: 100%;
  height: 100%;
  max-width: 1024px;

  &-content {
    height: 100%;
    width: 100%;
    background-color: var(--dark);
  }

  &-header {
    height: 60px;
    width: 100%;
    background-color: var(--gray);
    color: var(--light);
    &-title {
      margin-left: 24px;
      margin-bottom: 0;
    }

    &-button {
      cursor: pointer;
      margin-right: 24px;

      &-round {
        font-size: 2rem;
      }
    }
  }

  &__confirmation {
    font-size: 1.2rem;
  }
}
</style>
