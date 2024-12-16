<template>
  <q-table
    flat
    bordered
    title="Solicitudes por área"
    :filter="filter"
    :pagination="pagination"
    :rows="list_Tickets_By_Area"
    :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
    :columns="columns"
    row-key="name"
  >
    <template v-slot:body="props">
      <q-tr :props="props" @click="onRowClick(props.row)">
        <q-td key="area" :props="props" class="text-bold">
          {{ props.row.area }}
        </q-td>
        <q-td key="data" :props="props">
          <q-badge color="blue-grey">
            {{ props.row.data }}
          </q-badge>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTableroStore } from "src/stores/tablero-store";

//---------------------------------------------------------------

const tableroStore = useTableroStore();
const { list_Tickets_By_Area } = storeToRefs(tableroStore);

//---------------------------------------------------------------

const columns = [
  {
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
    sortable: true,
  },
  { name: "data", label: "Tickets", field: "data", sortable: true },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
