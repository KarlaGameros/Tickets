<template>
  <div class="row q-pa-lg">
    <div class="col">
      <q-table
        :grid="$q.screen.xs"
        :rows="rows"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!--TEMPLATE SCREEN XS-->
        <template v-if="$q.screen.xs" v-slot:item="props">
          <div
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          >
            <q-card bordered class="no-shadow">
              <q-list dense>
                <q-item v-for="col in props.cols" :key="col.name">
                  <q-item-section>
                    <q-item-label class="text-bold"
                      >{{ col.label }}:</q-item-label
                    >
                  </q-item-section>
                  <q-item-section>
                    <div v-if="col.name == 'id'">
                      <q-btn
                        flat
                        round
                        color="purple-ieen"
                        icon="visibility"
                        @click="verSolicitud(col.value)"
                      >
                        <q-tooltip>Ver solicitud</q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else-if="col.name === 'estatus'">
                      <q-badge color="green ">
                        {{ col.value }} <q-icon name="done " />
                      </q-badge>
                    </div>
                    <q-item-label v-else>{{ col.value }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </template>
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-slot:body="props" v-else>
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitud(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
              </div>
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
              <div v-else-if="col.name === 'estatus'">
                <q-badge
                  color="green
                  "
                >
                  {{ col.value }}
                  <q-icon name="done " />
                </q-badge>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

const columns = [
  {
    name: "folio",
    label: "Folio",
    field: "folio",
    sortable: true,
    align: "center",
  },
  { name: "estatus", label: "Estatus", field: "estatus", align: "center" },
  {
    name: "area",
    label: "Área",
    field: "area",
    align: "center",
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
  },
  { name: "atendio", label: "Atendió", field: "atendio", align: "center" },
  { name: "motivo", label: "Motivo", field: "motivo", align: "center" },
  {
    name: "id",
    label: "Acciones",
    field: "id",
    align: "center",
  },
];

const rows = [
  {
    id: 1,
    folio: "ABC-001-2024",
    estatus: "Concluido",
    area: "Administración",
    solicitante: "Maria López",
    atendio: "Karla Gameros",
    motivo: "No tengo internet",
  },
  {
    id: 2,
    folio: "ABC-002-2024",
    estatus: "Concluido",
    area: "Administración",
    solicitante: "Maria López",
    atendio: "Karla Gameros",
    motivo: "No tengo internet",
  },
  {
    id: 3,
    folio: "ABC-003-2024",
    estatus: "Concluido",
    area: "Administración",
    solicitante: "Maria López",
    atendio: "Karla Gameros",
    motivo: "No tengo internet",
  },
  {
    id: 4,
    folio: "ABC-004-2024",
    estatus: "Concluido",
    area: "Administración",
    solicitante: "Maria López",
    atendio: "Karla Gameros",
    motivo: "No tengo internet",
  },
  {
    id: 5,
    folio: "ABC-005-2024",
    estatus: "Concluido",
    area: "Administración",
    solicitante: "Maria López",
    atendio: "Karla Gameros",
    motivo: "No tengo internet",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
