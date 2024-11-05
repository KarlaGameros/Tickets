<template>
  <div class="row q-pa-lg">
    <q-banner dense class="bg-grey-2 col-12 q-mb-md">
      <template v-slot:avatar>
        <q-icon size="lg" name="notification_important" color="purple-ieen" />
      </template>
      El siguiente listado muestra inventarios que han resultado tener alguna
      falla o incoveniente
    </q-banner>
    <div class="col-12">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Inventario_Fallas"
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
            color="purple-ieen"
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
                    <div v-if="col.name == 'inventario_Id'">
                      <q-btn
                        flat
                        round
                        color="purple-ieen"
                        icon="visibility"
                        @click="verInventario(col.value)"
                      >
                        <q-tooltip>Ver inventario</q-tooltip>
                      </q-btn>
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
              <div v-if="col.name === 'inventario_Id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verInventario(col.value)"
                >
                  <q-tooltip>Ver inventario</q-tooltip>
                </q-btn>
              </div>
              <label
                v-else-if="col.name == 'folio_Solicitud_Ticket'"
                class="text-bold"
                >{{ col.value }}</label
              >
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useInventarioStore } from "src/stores/inventario-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//---------------------------------------------------------------

const $q = useQuasar();
const inventariosStore = useInventarioStore();
const { list_Inventario_Fallas } = storeToRefs(inventariosStore);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  loading();
  await inventariosStore.load_Inventarios_Fallas();
  $q.loading.hide();
};

const loading = () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
};

const verInventario = async (id) => {
  loading();
  await inventariosStore.load_Inventario_By_Id(id);
  inventariosStore.actualizarModal(true);
  $q.loading.hide();
};

//---------------------------------------------------------------

const columns = [
  {
    name: "folio_Solicitud_Ticket",
    label: "Ticket",
    field: "folio_Solicitud_Ticket",
    sortable: true,
    align: "center",
  },
  {
    name: "no_Serie",
    label: "No. Serie",
    field: "no_Serie",
    sortable: true,
    align: "center",
  },
  {
    name: "nombre_Corto",
    label: "Nombre corto",
    field: "nombre_Corto",
    sortable: true,
    align: "center",
  },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_Creacion",
    label: "Fecha ticket",
    field: "fecha_Creacion",
    sortable: true,
    align: "center",
  },
  {
    name: "inventario_Id",
    label: "Acciones",
    field: "inventario_Id",
    align: "center",
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

<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
</style>
