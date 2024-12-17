<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        :rows="list_Mis_Solicitudes"
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
        <!--TEMPLATE SCREEN DESKTOP-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="props.row.estatus_Ticket != 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitud(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus_Ticket == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editarSolicitud(col.value)"
                >
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
              </div>
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
              <div v-else-if="col.name === 'estatus_Ticket'">
                <q-badge
                  :color="
                    col.value == 'Pendiente' ||
                    col.value == 'Pendiente de Cancelación'
                      ? 'orange'
                      : col.value == 'Cancelado'
                      ? 'red'
                      : 'green'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    :name="
                      col.value == 'Pendiente' ||
                      col.value == 'Pendiente de Cancelación'
                        ? 'warning'
                        : col.value == 'Cancelado'
                        ? 'close'
                        : 'done'
                    "
                  />
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
import { storeToRefs } from "pinia";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { onBeforeMount, ref } from "vue";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const evidenciasStore = useEvidenciasStore();
const tiposSolicitudesStore = useTiposSolicitudesStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { list_Mis_Solicitudes } = storeToRefs(misSolicitudesStore);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  loading();
  await misSolicitudesStore.load_Mis_Solicitudes();
  await tiposSolicitudesStore.load_Tipos_Solicitudes();
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

const editarSolicitud = async (id) => {
  loading();
  misSolicitudesStore.updateIsEdit(true);
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  await misSolicitudesStore.load_Solicitud_By_Id(id);
  misSolicitudesStore.updateModalSolicitudes(true);
  $q.loading.hide();
};

const verSolicitud = async (id) => {
  loading();
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  await misSolicitudesStore.load_Solicitud_By_Id(id);
  misSolicitudesStore.updateModalSolicitudes(true);
  misSolicitudesStore.updateIsVisualize(true);
  $q.loading.hide();
};

const cancelarSolicitud = (id) => {
  Swal.fire({
    input: "text",
    icon: "warning",
    reverseButtons: true,
    showCloseButton: true,
    showCancelButton: true,
    allowOutsideClick: false,
    cancelButtonColor: "#f44336",
    confirmButtonColor: "#26A69A",
    cancelButtonText: `No, regresar`,
    confirmButtonText: `Si, cancelar`,
    title: "Cancelar ticket",
    inputLabel: "Especifique motivo de la cancelación",
    inputValidator: (value) => {
      return new Promise(async (resolve) => {
        if (value != "") {
          let solictudFormData = new FormData();
          solictudFormData.append("Solicitud_Ticket_Id", id);
          solictudFormData.append("Motivo", value);
          let resp = await cancelacionesStore.cancelarSolicitud(
            solictudFormData
          );
          if (resp.success) {
            await misSolicitudesStore.load_Mis_Solicitudes();
            alertNotify("top-right", "positive", resp.data);
          } else {
            alertNotify("top-right", "negative", resp.data);
          }
          resolve();
        } else {
          resolve("Campo vacio");
        }
      });
    },
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

//---------------------------------------------------------------

const columns = [
  {
    name: "folio",
    label: "Folio",
    field: "folio",
    sortable: true,
    align: "center",
  },
  {
    name: "estatus_Ticket",
    label: "Estatus",
    field: "estatus_Ticket",
    align: "center",
  },
  {
    name: "solicitante_Area",
    label: "Área",
    field: "solicitante_Area",
    align: "center",
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
  },
  {
    name: "fecha_Creacion",
    align: "center",
    label: "Fecha creación",
    field: "fecha_Creacion",
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
