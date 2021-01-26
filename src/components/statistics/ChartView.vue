<template>
  <highcharts ref="highcharts" class="mc-ChartView" :options="chartOptions" />
</template>

<script>
export default {
  name: "chart-view",
  computed: {
    chartOptions() {
      const { data, colors } = this.$store.state.costs.statistics;

      return {
        title: this.getDefaultTitle(),
        chart: {
          backgroundColor: "#343a40",
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
            name: "Расход",
            colorByPoint: true,
            innerSize: "75%",
            data,
            point: {
              events: {
                mouseOut: (event) => {
                  this.$emit('pointMouseOut', event.target.id);
                },
                mouseOver: (event) => {
                  this.$emit('pointMouseOver', event.target.id);
                },
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    togglePointSelect(id) {
      const [serie] = this.$refs.highcharts.chart.series;

      if (serie) {
        const point = serie.points.find((point) => point.id === id);

        if (point) {
          point.select();
          const titleData = this.getDefaultTitle();

          if (point.selected) {
            titleData.text = point.y.toLocaleString();
          }

          this.$refs.highcharts.chart.setTitle(titleData);
        }
      }
    },
    getDefaultTitle() {
      return {
        text: this.$store.state.costs.total.toLocaleString(),
        align: "center",
        verticalAlign: "middle",
        y: 30,
        style: { fontSize: "2rem", fontWeight: "bold", color: "white" },
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mc-ChartView {
  height: 100%;
  width: 100%;
}
</style>