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

//---------------------------------------------------------------

const tableroStore = useTableroStore();
const { list_Solicitudes_Trimestral } = storeToRefs(tableroStore);
const colors = ["#539fa2", "#72b1a4", "#abccb1", "#c4dbb4", "#d4e2b6"];
const series = ref([
  {
    data: [],
  },
]);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const chartOptions = ref({
  chart: {
    height: 350,
    type: "bar",
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
    categories: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
    labels: {
      style: {
        colors: colors,
        fontSize: "12px",
      },
    },
  },
});

const cargarData = () => {
  series.value = [
    {
      data: list_Solicitudes_Trimestral.value.map((item) => item.solicitudes),
    },
  ];
};

watch(
  () => list_Solicitudes_Trimestral.value,
  (val) => {
    if (val.length) {
      cargarData();
    }
  },
  { immediate: true }
);
</script>
