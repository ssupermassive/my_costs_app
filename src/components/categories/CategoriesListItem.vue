<template>
  <b-form
    :id="validationPopoverTarget"
    class="me-CategoriesListItem me-CategoriesListItem align-items-center"
    :class="{
      'me-CategoriesListItem__editMode': editMode,
      'me-CategoriesListItem__viewMode': !editMode,
    }"
    @click="$emit('itemClick')"
  >
    <b-icon
      class="me-CategoriesListItem-icon flex-grow-0 flex-shrink-0 h2"
      :style="{color: iconColor}"
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
      v-if="editMode"
      class="me-CategoriesListItem__editingButtons justify-content-end align-items-center"
    >
      <b-icon
        @click.stop
        @click="editComplete()"
        title="Сохранить"
        variant="success"
        class="me-CategoriesListItem__editingButtons-ok"
        icon="check-circle-fill"
      />
      <b-icon
        @click.stop
        @click="cancelEdit()"
        title="Отмена"
        class="me-CategoriesListItem__editingButtons-cancel"
        icon="x-circle"
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
      <category-icons-list @itemClick="iconChanged"/>
    </b-popover>
    <b-popover :target="validationPopoverTarget" placement="top" :delay="{show: 50, hide: 50}"
    :show.sync="validationState.popoverShow"
    :disabled.sync="validationState.popoverDisabled" >
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
      itemData: {},
      validationState: {
        inputValid: null,
        popoverShow: false,
        popoverDisabled: true,
        message: ''
      }
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
    validationPopoverTarget() {
      return `validation-popever-target-${this.item.id}`;
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
    updateItemData(itemData) {
      this.itemData = itemData;
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
          message: hasText ? 'Выберите иконку' : 'Укажите название'
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
          message: ''
        });
    }
  },
  created: function () {
    this.updateItemData({ ...this.item });
  },
  watch: {
    item(newValue) {
      this.updateItemData({ ...newValue });
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
    background-color: #AAA;
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
    padding: 4px 0;
    position: absolute;
    bottom: -32px;
    right: 0;
    display: flex;
    font-size: 1.5rem;
    z-index: 1;
    border-radius: 0 0 0 24px;
    background: inherit;

    &-ok {
      margin: 0 12px;
    }

    &-cancel {
      margin-right: 12px;
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