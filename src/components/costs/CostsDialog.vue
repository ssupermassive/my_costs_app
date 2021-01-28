<template>
  <b-modal
    @hide="resetItemData"
    body-bg-variant="dark"
    header-text-variant="light"
    header-bg-variant="secondary"
    header-border-variant="secondary"
    :id="$attrs.id"
    :hide-footer="true"
    title="Новый расход"
  >
    <b-form @submit="submitHandler">
      <b-form-datepicker
        class="mc-CostsDialog__input"
        v-model="itemData.date"
        size="lg"
      ></b-form-datepicker>
      <b-form-select
        required
        class="mc-CostsDialog__input"
        v-model="itemData.category"
        size="lg"
        :options="$store.state.categories.items"
        value-field="id"
        text-field="name"
      >
        <template #first>
          <b-form-select-option
            :value="null"
            disabled
          >Укажите категорию</b-form-select-option>
        </template>
      </b-form-select>
      <b-form-input
        class="mc-CostsDialog__input"
        required
        size="lg"
        v-model="itemData.sum"
        type="number"
        min="1"
        :number="true"
        placeholder="Укажите сумму"
        :formatter="sumFormatter"
      ></b-form-input>
      <b-form-input
        class="mc-CostsDialog__input"
        v-model="itemData.comment"
        size="lg"
        autocomplete="off"
        placeholder="Комментарий"
      ></b-form-input>
      <b-button
        class="mc-CostsDialog__submit"
        type="submit"
        variant="primary"
      >Добавить
      </b-button>
    </b-form>
  </b-modal>
</template>

<script>
import { CREATE_COST } from "../../store/actionsType/costs";

const MAX_SUM_FRACTION_COUNT = 2;

export default {
  name: "costs-dialog",
  props: {
    item: {
      type: Object,
      default: () => ({
        id: null,
        category: null,
        date: new Date(),
        comment: null,
        sum: null
      })
    }
  },
  data() {
    return {
      itemData: { ...this.item }
    };
  },
  methods: {
    /**
     * Функция для форматирования вводимого в поле суммы числа
     * ToDo: регулярка?
     */
    sumFormatter(value) {

      let result = value;

      // отсекаем минус и ведущий ноль
      while(result.match(/^[0-]/)) {
        result = result.substr(1);
      }

      // разделяем целую и дробную часть
      // если в дробной части становится больше 2 цифр,
      // оставляем только 2, остальное отбрасываем
      const [num, fraction] = value.split(".");

      if (fraction && fraction > MAX_SUM_FRACTION_COUNT) {
        result = `${num}.${fraction.substr(0, MAX_SUM_FRACTION_COUNT)}`;
      }

      return result.substr(0, 6);
    },
    submitHandler(event) {
      event.preventDefault();
      this.$store.dispatch(CREATE_COST, this.itemData).then(() => {
        this.resetItemData();
        this.$bvModal.hide(this.$attrs.id);
      });
    },
    resetItemData() {
      this.itemData = {
        id: null,
        category: null,
        date: new Date(),
        comment: null,
        sum: null
      };
    }
  }
};
</script>

<style lang="scss">
.mc-CostsDialog {
  &__input {
    text-align: center;
    text-align-last: center; // для select
    margin-top: 1rem;
  }

  &__submit {
    margin-top: 1rem;
  }
}
</style>