<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Categorias_Filtrado"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-left>
          <q-select
            v-model="area_Id"
            color="purple-ieen"
            style="width: 250px"
            :options="list_Areas_Filtro"
            label="Buscar por área"
          />
        </template>
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
                        color="purple-ieen"
                        icon="edit"
                        @click="editarCategoria(col.value)"
                      />
                      <q-btn
                        flat
                        round
                        color="red"
                        icon="delete"
                        @click="eliminarCategoria(col.value)"
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
                  @click="editarCategoria(col.value)"
                >
                  <q-tooltip>Editar categoria</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="add_circle"
                  @click="agregarSubcategoria(col.value)"
                >
                  <q-tooltip>Agregar subcategoria</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="red"
                  icon="delete"
                  @click="eliminarCategoria(col.value)"
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
import { storeToRefs } from "pinia";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useCategoriasStore } from "src/stores/categorias-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watchEffect } from "vue";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const helpersStore = useHerlpersStore();
const categoriasStore = useCategoriasStore();
const { list_Areas } = storeToRefs(helpersStore);
const { list_Categorias } = storeToRefs(categoriasStore);
const list_Areas_Filtro = ref([]);
const list_Categorias_Filtrado = ref([]);
const area_Id = ref({ value: 0, label: "Todos" });

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const cargarData = async () => {
  loading();
  await helpersStore.load_Areas();
  await categoriasStore.load_Categorias();
  list_Areas_Filtro.value = list_Areas.value;
  list_Areas_Filtro.value.splice(0, 0, {
    value: 0,
    label: "Todos",
  });
  $q.loading.hide();
};

const editarCategoria = async (id) => {
  loading();
  categoriasStore.actualizarIsEditar(true);
  await categoriasStore.load_Categoria_By_Id(id);
  await categoriasStore.load_Subcategorias(id);
  categoriasStore.actualizarModal(true);
  $q.loading.hide();
};

const agregarSubcategoria = async (id) => {
  loading();
  await categoriasStore.load_Categoria_By_Id(id);
  await categoriasStore.load_Subcategorias(id);
  categoriasStore.actualizarModalSub(true);
  categoriasStore.actualizarIsEditar(true);
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

const eliminarCategoria = async (id) => {
  Swal.fire({
    title: "Eliminar categoria",
    text: "¿Está seguro de eliminar la categoria?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "No, regresar",
    reverseButtons: true,
    confirmButtonColor: "#26a69a",
    cancelButtonColor: "#f44336",
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading();
      const resp = await categoriasStore.delete_Categoria(id);
      if (resp.success) {
        $q.loading.hide();
        await categoriasStore.load_Categorias();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    }
  });
};

const filtrar = (list, filtro) => {
  list_Categorias_Filtrado.value = list.filter((item) => {
    let cumple = true;
    if (filtro.area !== undefined) {
      if (filtro.area == 0) {
        cumple = cumple && item.area_Id === item.area_Id;
      } else {
        cumple = cumple && item.area_Id === parseInt(filtro.area);
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (area_Id.value != null) filtro.area = area_Id.value.value;
  filtrar(list_Categorias.value, filtro);
});

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
    name: "area",
    label: "Área",
    field: "area",
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
