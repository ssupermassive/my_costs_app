<template>
  <highcharts class="mc-ChartView" :options="chartOptions" />
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  name: "chart-view",
  components: [Chart],
  computed: {
    chartOptions() {
      const { data, colors } = this.$store.state.costs.statistics;


      return {
        title: {
          text: this.$store.state.costs.total.toLocaleString(),
          align: 'center',
          verticalAlign: 'middle',
          y: 30,
          style: {fontSize: '2rem', fontWeight: 'bold'}
        },
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
        },
        colors,
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: "Всего",
            colorByPoint: true,
            innerSize: "80%",
            data,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.mc-ChartView {
  height: 100%;
  width: 100%;
}
</style>