<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTableroStore } from "src/stores/tablero-store";
import { onBeforeMount, ref, watch } from "vue";

const tableroStore = useTableroStore();
const { list_Tickets_By_Area } = storeToRefs(tableroStore);
const colors = ["#539fa2", "#72b1a4", "#abccb1", "#c4dbb4", "#d4e2b6"];
const categories = ref([]);

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  // for (let index = 0; index < list_Tickets_By_Area.value.length; index++) {
  //   const element = list_Tickets_By_Area.value[index];
  //   if (!categories.value.includes(element.area)) {
  //     categories.value.push(element.area);
  //   }
  // }
};

const series = [
  {
    data: [21, 22, 10, 28],
  },
];
const chartOptions = {
  chart: {
    height: 350,
    type: "bar",
    events: {
      click: function (chart, w, e) {
        // console.log(chart, w, e)
      },
    },
  },
  colors: colors,
  plotOptions: {
    bar: {
      columnWidth: "45%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  xaxis: {
    categories: ["John", "Joe", "Jake", "Amber"],
    labels: {
      style: {
        colors: colors,
        fontSize: "12px",
      },
    },
  },
};
</script>
