<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Subcategorias"
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
                  <q-item-section class="text-center">
                    <div v-if="col.name == 'id'">
                      <q-btn
                        flat
                        round
                        color="blue-grey"
                        icon="edit"
                        @click="editarSubcategoria(col.value)"
                      />
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="delete"
                        @click="eliminarSubCategoria(props.row)"
                      />
                    </div>
                    <q-item-label v-else>
                      <b>{{ col.label }}: </b>{{ col.value }}
                    </q-item-label>
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
                  icon="edit"
                  @click="editarSubcategoria(col.value)"
                >
                  <q-tooltip>Editar categoria</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="red"
                  icon="delete"
                  @click="eliminarSubCategoria(props.row)"
                >
                  <q-tooltip>Eliminar categoria</q-tooltip>
                </q-btn>
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useCategoriasStore } from "src/stores/categorias-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const categoriasStore = useCategoriasStore();
const { list_Subcategorias } = storeToRefs(categoriasStore);

//---------------------------------------------------------------

const editarSubcategoria = async (id) => {
  loading();
  await categoriasStore.load_Subcategoria_By_Id(id);
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

const alertNotify = (position, type, resp) => {
  $q.notify({
    position: position,
    type: type,
    message: resp,
    actions: [
      {
        icon: "close",
        color: "black",
        round: true,
        handler: () => {},
      },
    ],
  });
};

const eliminarSubCategoria = async (row) => {
  $q.dialog({
    title: "Eliminar subcategoria",
    message: "¿Está seguro de eliminar la subcategoria?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Eliminar",
    },
    cancel: {
      color: "red",
      label: "No, Regresar",
    },
  }).onOk(async () => {
    loading();
    const resp = await categoriasStore.delete_SubCategoria(row.id);
    if (resp.success) {
      $q.loading.hide();
      await categoriasStore.load_Subcategorias(row.categoria_Id);
      alertNotify("top-right", "positive", resp.data);
    } else {
      $q.loading.hide();
      alertNotify("top-right", "negative", resp.data);
    }
    $q.loading.hide();
  });
};

//---------------------------------------------------------------

const columns = [
  {
    name: "titulo",
    label: "Título",
    field: "titulo",
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
    name: "id",
    label: "Acciones",
    field: "id",
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
