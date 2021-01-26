<template>
  <b-form
    :id="formId"
    @mouseover="mouseoverHandler($event)"
    @mouseout="mouseoutHandler($event)"
    class="me-CategoriesListItem me-CategoriesListItem align-items-center"
    :class="{
      'me-CategoriesListItem__editMode': editMode,
      'me-CategoriesListItem__viewMode': !editMode,
    }"
    @click="$emit('itemClick')"
  >
    <b-icon
      class="me-CategoriesListItem-icon flex-grow-0 flex-shrink-0 h2"
      :style="{ color: iconColor }"
      :id="iconPopoverTarget"
      :title="iconTitle"
      :icon="icon"
    />
    <b-form-input
      autofocus
      autocomplete="off"
      :state="validationState.inputValid"
      class="me-CategoriesListItem-input"
      v-if="editMode"
      v-model="itemData.name"
      placeholder="Название..."
      required
    />
    <div v-else class="me-CategoriesListItem-text text-truncate">
      {{ itemData.name }}
    </div>
    <div
      v-if="editMode || showActionsButtons"
      class="me-CategoriesListItem__editingButtons justify-content-end align-items-center"
    >
      <b-icon
        v-if="editMode"
        @click.stop
        @click="editComplete()"
        title="Сохранить"
        variant="success"
        class="me-CategoriesListItem__editingButtons-button"
        icon="check-circle-fill"
      />
      <b-icon
        v-if="itemData.id"
        @click.stop
        @click="deleteItem()"
        title="Удалить"
        variant="danger"
        class="me-CategoriesListItem__editingButtons-button"
        icon="x-circle"
      />
      <b-icon
        v-if="editMode"
        @click.stop
        @click="cancelEdit()"
        title="Отмена"
        class="me-CategoriesListItem__editingButtons-button"
        icon="x"
      />
    </div>
    <b-popover
      :show.sync="showPopover"
      :target="iconPopoverTarget"
      placement="bottom"
    >
      <template #title>
        <span
          @click="togglePopover"
          class="me-CategoriesListItem__popover-close close"
          aria-hidden="true"
        >
          &times;
        </span>
        Выберите иконку
      </template>
      <category-icons-list @itemClick="iconChanged" />
    </b-popover>
    <b-popover
      :target="formId"
      placement="top"
      :delay="{ show: 50, hide: 50 }"
      :show.sync="validationState.popoverShow"
      :disabled.sync="validationState.popoverDisabled"
    >
      <div>{{ validationState.message }}</div>
    </b-popover>
  </b-form>
</template>

<script>
import { BIcon, BForm, BFormInput, BPopover } from "bootstrap-vue";
import CategoryIconsList from "./CategoryIconsList";

export default {
  name: "categories-list-item",
  components: {
    BIcon,
    BForm,
    BFormInput,
    BPopover,
    CategoryIconsList,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          id: null,
          name: "",
          icon: null,
        };
      },
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      showPopover: false,
      itemData: {...this.item},
      showActionsButtons: false,
      validationState: {
        inputValid: null,
        popoverShow: false,
        popoverDisabled: true,
        message: "",
      },
    };
  },
  computed: {
    icon() {
      return this.itemData.icon ? this.itemData.icon.value : "question-circle";
    },
    iconTitle() {
      if (this.editMode) {
        return this.itemData.icon ? "" : "Выберите иконку";
      }
      return "";
    },
    iconPopoverTarget() {
      return `icon-popever-target-${this.item.id}`;
    },
    iconColor() {
      return this.itemData.icon ? this.itemData.icon.color : "#CCC";
    },
    formId() {
      return `form-${this.item.id}`;
    },
  },
  methods: {
    editComplete() {
      this.$emit("editComplete", this.itemData);
    },
    cancelEdit() {
      this.$emit("cancelEdit");
      this.itemData = { ...this.item };
      this.resetValidationState();
    },
    togglePopover() {
      this.showPopover = !this.showPopover;
    },
    iconChanged(icon) {
      this.itemData.icon = icon;
      this.togglePopover();
    },
    validate() {
      const { name, icon } = this.itemData;
      const hasText = !!name.trim();
      const hasIcon = !!icon;

      if (hasText && hasIcon) {
        this.resetValidationState();
        return true;
      }

      this.updateValidationState({
        inputValid: hasText ? null : false,
        popoverDisabled: false,
        popoverShow: true,
        message: hasText ? "Выберите иконку" : "Укажите название",
      });

      return false;
    },
    updateValidationState(state) {
      this.validationState = state;
    },
    resetValidationState() {
      this.updateValidationState({
        inputValid: null,
        popoverDisabled: true,
        popoverShow: false,
        message: "",
      });
    },
    deleteItem() {
      this.$emit('deleteItem', this.itemData.id);
    },
    mouseoverHandler() {
      this.showActionsButtons = true;
    },
    mouseoutHandler(event) {

        if (!event.relatedTarget) {
          this.showActionsButtons = false;
          return;
        }

        const closes = event.relatedTarget.closest('.me-CategoriesListItem');
        this.showActionsButtons = closes && closes.attributes['id'].value === this.formId;
    }
  },
  watch: {
    item(newValue) {
      this.itemData = {...newValue};
    },
  },
};
</script>

<style lang="scss" scoped>
.me-CategoriesListItem {
  display: flex;
  height: 3.8rem;
  position: relative;

  &:hover {
    background-color: #aaa;
    cursor: pointer;

    & .me-CategoriesListItem-text {
      color: black;
    }
  }

  &__editMode {
    background-color: var(--gray);
  }

  &-icon {
    margin: 0 12px;
  }

  &-text,
  &-input {
    font-size: 1.5rem;
    margin-right: 0.75rem;
  }

  &-text {
    color: var(--white);
    margin-left: calc(0.75rem + 1px);
  }

  &__editingButtons {
    padding: 0.25rem 0.5rem 0.25rem 0;
    position: absolute;
    bottom: -1.7rem;
    right: 0;
    display: flex;
    font-size: 1.5rem;
    z-index: 1;
    border-radius: 0 0 0 24px;
    background: inherit;

    &-button {
      margin-left: 12px;
    }
  }

  &__popover {
    &-close {
      cursor: pointer;
      margin-top: -2px;
    }
  }
}
</style>