<template>
  <div class="me-CategoriesList">
    <categories-list-item
      v-if="isAdd"
      ref="list-item-add"
      :editMode="true"
      @editComplete="createCompleteHandler"
      @cancelEdit="cancelEdit"
    />
    <categories-list-item
      v-for="item in $store.state.categories.items"
      :ref="`list-item-${item.id}`"
      :item="item"
      :key="item.id"
      :editMode="editingItem === item"
      @editComplete="editCompleteHandler"
      @cancelEdit="cancelEdit"
      @deleteItem="deleteItem"
      @itemClick="itemClickHandler(item)"
    />
  </div>
</template>

<script>
import CategoriesListItem from "./CategoriesListItem";
import {
  DELETE_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY
} from "../../store/actionsType/categories";

export default {
  name: "categories-list",
  components: {
    CategoriesListItem
  },
  data: function() {
    return {
      editingItem: null,
      isAdd: false
    };
  },
  computed: {
    isEditing() {
      return !!(this.isAdd || this.editingItem)
    }
  },
  methods: {
    itemClickHandler(item) {
      if (this.canEditItem()) {
        this.editingItem = item;
        this.isAdd = false;
      }
    },
    cancelEdit() {
      this.isAdd = false;
      this.editingItem = null;
    },
    deleteItem(id) {
      this.$store.dispatch(DELETE_CATEGORY, id);
    },
    editCompleteHandler(item) {
      this.processingItem(item, UPDATE_CATEGORY);
    },
    createCompleteHandler(item) {
      this.processingItem(item, CREATE_CATEGORY);
    },
    processingItem(item, operation) {
      if (this.validateItem(item)) {
        this.$store.dispatch(operation, item).then(() => {
          this.cancelEdit();
        });
      }
    },
    addCategory() {
      if (this.canEditItem()) {
        this.isAdd = true;
        this.editingItem = null;
      }
    },
    getListItemRef(item) {
      const reference = this.$refs[`list-item-${(item && item.id) || "add"}`];

      // для динамически сформированных референсов тут почему то массив
      if (Array.isArray(reference)) {
        const [ref] = reference;
        return ref;
      }

      return reference;
    },
    validateItem(item) {
      const listItemRef = this.getListItemRef(item);
      return listItemRef && listItemRef.validate();
    },
    canEditItem() {
      if (this.isEditing) {
        return this.validateItem(this.editingItem);
      }

      return true;
    }
  }
};
</script>

