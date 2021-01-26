<template>
  <div class="mc-ChartLayout flexbox flex-column flex-grow-1 flex-shrink-1">
    <div
      class="mc-ChartLayout__top flexbox justify-content-around flex-grow-0 flex-shrink-0"
    >
      <template v-if="topData">
        <div
          v-for="item in topData"
          :key="item.id"
          class="mc-ChartLayout__category flexbox justify-content-center align-items-center"
          :class="{'mc-ChartLayout__category-selected': item.id === selectedCategory}"
          @mouseover="_categoryCostMouseOver(item.id)"
          @mouseout="_categoryCostMouseOut(item.id)"
        >
          <category-costs :item="item" />
        </div>
      </template>
    </div>
    <div class="mc-ChartLayout__center flexbox flex-grow-1 flex-shrink-1">
      <div
        class="mc-ChartLayout__center-left flexbox justify-content-around align-items-center flex-column flex-grow-0 flex-shrink-0"
      >
        <template v-if="leftData">
          <div
            v-for="item in leftData"
            :key="item.id"
            class="mc-ChartLayout__category flexbox justify-content-center align-items-center"
            :class="{'mc-ChartLayout__category-selected': item.id === selectedCategory}"
            @mouseover="_categoryCostMouseOver(item.id)"
            @mouseout="_categoryCostMouseOut(item.id)"
          >
            <category-costs :item="item" />
          </div>
        </template>
      </div>
      <div
        class="mc-ChartLayout__center-middle flex-grow-1 flex-shrink-1">
          <chart-view 
            ref="chartView"
            @pointMouseOut="pointMouseOutHandler" 
            @pointMouseOver="pointMouseOverHandler"/>
        </div>
      <div
        class="mc-ChartLayout__center-right justify-content-around align-items-center flexbox flex-column flex-grow-0 flex-shrink-0"
      >
        <template v-if="rightData">
          <div 
            v-for="item in rightData"
            :key="item.id"
            class="mc-ChartLayout__category flexbox justify-content-center align-items-center"
            :class="{'mc-ChartLayout__category-selected': item.id === selectedCategory}"
            @mouseover="_categoryCostMouseOver(item.id)"
            @mouseout="_categoryCostMouseOut(item.id)"
          >
            <category-costs :item="item" />
          </div>
        </template>
      </div>
    </div>
    <div
      class="mc-ChartLayout__bottom flexbox justify-content-around flex-grow-0 flex-shrink-0"
    >
      <template v-if="bottomData">
        <div
          v-for="item in bottomData"
          :key="item.id"
          class="mc-ChartLayout__category flexbox justify-content-center align-items-center"
          :class="{'mc-ChartLayout__category-selected': item.id === selectedCategory}"
          @mouseover="_categoryCostMouseOver(item.id)"
          @mouseout="_categoryCostMouseOut(item.id)"
        >
          <category-costs :item="item"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import CategoryCosts from './CategoryCosts';
import ChartView from './ChartView';

const TOP_DATA_INTERVAL = [0, 4];
const LEFT_DATA_INTERVAL = [4, 6];
const RIGHT_DATA_INTERVAL = [6, 8];
const BOTTOM_DATA_INTERVAL = [8, 12];

export default {
  name: "chart-layout",
  components: {
    CategoryCosts,
    ChartView
  },
  data() {
    return {
      selectedCategory: null
    }
  },
  computed: {
    topData() {
      return this.getData(TOP_DATA_INTERVAL);
    },
    rightData() {
      return this.getData(RIGHT_DATA_INTERVAL);
    },
    leftData() {
      return this.getData(LEFT_DATA_INTERVAL);
    },
    bottomData() {
      return this.getData(BOTTOM_DATA_INTERVAL);
    },
    hasItems() {
      return !!this.$store.state.categories.items.length;
    },
  },
  methods: {
    getData(interval) {
      if (this.hasItems) {
        const [start, end] = interval;

        const data = this.$store.state.costs.itemsByCategory.slice(start, end);

        if (data.length) {
          return data;
        }
      }
      return null;
    },
    pointMouseOverHandler(id) {
      this.selectedCategory = id;
    },
    pointMouseOutHandler() {
      this.selectedCategory = null;
    },
    _categoryCostMouseOver(id) {
      this.selectedCategory = id;
      this.$refs.chartView.togglePointSelect(id);
    },
    _categoryCostMouseOut(id) {
      this.selectedCategory = null;
      this.$refs.chartView.togglePointSelect(id);
    }
  },
};
</script>

<style lang="scss" scoped>
.mc-ChartLayout {
  &__center {
    height: 100%;

    &-left,
    &-right {
      width: 25%;
      padding: 0 2rem;
    }

    &-middle {
      width: 50%;
    }
  }

  &__top,
  &__bottom {
    padding: 2rem 0;
  }

  &__category {
    width: 8rem;
    height: 8rem;

    &-selected {
      background-color: rgba($color: #CCC, $alpha: 0.5);
      border-radius: 50%;
    }
  }
}
</style>