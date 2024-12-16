<template>
  <div id="chart">
    <apexchart
      type="pie"
      width="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { onBeforeMount, ref } from "vue";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";

//---------------------------------------------------------------

const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const tiposSolictudesStore = useTiposSolicitudesStore();
const { list_Solicitudes_Tickets } = storeToRefs(ticketsSolicitudesStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolictudesStore);
const series = ref([]);
const labels = ref([]);
const colors = ["#539fa2", "#abccb1", "#c4dbb4", "#d4e2b6"];

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const cargarData = async () => {
  await ticketsSolicitudesStore.load_Solicitudes_Tickets();
  await tiposSolictudesStore.load_Tipos_Solicitudes();
  list_Tipos_Solicitudes.value.forEach((element) => {
    if (element.nombre != "Solicitudes") {
      series.value.push(
        list_Solicitudes_Tickets.value.filter(
          (x) => x.tipo_Solicitud == element.label
        ).length
      );
      labels.value.push(element.nombre);
    }
  });
};

const chartOptions = {
  chart: {
    width: 380,
    type: "pie",
  },
  colors: colors,
  labels: labels.value,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};
</script>

<style></style>
