<template>
  <div class="me-CategoriesList">
    <categories-list-item
      v-if="isAdd"
      ref="list-item-add"
      :editMode="true"
      @editComplete="$createCompleteHandler"
      @cancelEdit="$cancelEdit"
    />
    <categories-list-item
      v-for="item in $store.state.categories.items"
      :ref="`list-item-${item.id}`"
      :item="item"
      :key="item.id"
      :editMode="editingItem === item"
      @editComplete="$editCompleteHandler"
      @cancelEdit="$cancelEdit"
      @deleteItem="$deleteItem"
      @itemClick="$itemClickHandler(item)"
    />
  </div>
</template>

<script>
import CategoriesListItem from "./CategoriesListItem";

export default {
  name: "categories-list",
  components: {
    CategoriesListItem,
  },
  data: function () {
    return {
      editingItem: null,
      isAdd: false,
    };
  },
  methods: {
    $itemClickHandler(item) {
      if (this.canEditItem()) {
        this.editingItem = item;
        this.isAdd = false;
      }
    },
    $cancelEdit() {
      this.isAdd = false;
      this.editingItem = null;
    },
    $deleteItem(id) {
      this.$store.dispatch('deleteCategory', id);
    },
    $editCompleteHandler(item) {
      if (this.checkValidation(item)) {
        this.$store.dispatch("updateCategory", item).then(() => {
          this.$cancelEdit();
        });
      }
    },
    $createCompleteHandler(item) {
      if (this.checkValidation(item)) {
        this.$store.dispatch("createCategory", item).then(() => {
          this.$cancelEdit();
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

      // ToDo для динамически сформированных референсов тут почему то массив
      const reference =  this.$refs[`list-item-${(item && item.id) || "add"}`];

      if (Array.isArray(reference)) {
          const [ref] = reference;
          return ref;
      }

      return reference;
    },
    checkValidation(item) {
      const listItemRef = this.getListItemRef(item);
      return listItemRef && listItemRef.validate();
    },
    canEditItem() {
      if (this.isAdd || this.editingItem) {
        return this.checkValidation(this.editingItem);
      }

      return true;
    },
  },
};
</script>

