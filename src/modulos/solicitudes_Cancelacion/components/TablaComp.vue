<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Solicitudes_Cancelacion"
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
                        icon="check_circle"
                        @click="aprobarSolicitud(col.value)"
                      >
                        <q-tooltip>Aprobar solicitud</q-tooltip>
                      </q-btn>
                    </div>
                    <div v-else-if="col.name === 'estatus'">
                      <q-badge
                        :color="col.value == 'Pendiente' ? 'orange' : 'green'"
                      >
                        {{ col.value }}
                        <q-icon
                          :name="col.value == 'Pendiente' ? 'warning' : 'done'"
                        />
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
                  @click="verSolicitud(props.row.solicitud_Ticket_Id)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus == 'Pendiente'"
                  flat
                  round
                  color="purple-ieen"
                  icon="check_circle"
                  @click="aprobarSolicitud(col.value)"
                >
                  <q-tooltip>Aprobar solicitud</q-tooltip>
                </q-btn>
              </div>
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
              <div v-else-if="col.name === 'estatus'">
                <q-badge
                  :color="
                    col.value == 'Pendiente'
                      ? 'orange'
                      : col.value == 'Rechazada'
                      ? 'red'
                      : 'green'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    :name="
                      col.value == 'Pendiente'
                        ? 'warning'
                        : col.value == 'Rechazada'
                        ? 'close'
                        : 'done'
                    "
                  />
                </q-badge>
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
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { onBeforeMount, ref } from "vue";
import { useCancelacionesStore } from "src/stores/cancelaciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const evidenciasStore = useEvidenciasStore();
const cancelacionesStore = useCancelacionesStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { list_Solicitudes_Cancelacion } = storeToRefs(cancelacionesStore);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  await cancelacionesStore.load_Solicitudes_Cancelacion();
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

const verSolicitud = async (id) => {
  loading();
  misSolicitudesStore.updateModal(true);
  await misSolicitudesStore.load_Solicitud_By_Id(id);
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  misSolicitudesStore.updateIsVisualize(true);
  $q.loading.hide();
};

const aprobarSolicitud = (id) => {
  Swal.fire({
    icon: "warning",
    reverseButtons: true,
    showCloseButton: true,
    showDenyButton: true,
    allowOutsideClick: false,
    denyButtonColor: "#f44336",
    confirmButtonColor: "#26A69A",
    denyButtonText: `Cancelar solicitud`,
    confirmButtonText: `Aprobar solicitud`,
    title: "¿Desea aprobar o cancelar la solicitud?",
    text: "Se afectará el estatus del ticket",
  }).then(async (result) => {
    if (result.isConfirmed) {
      loading();
      const resp = await cancelacionesStore.aprobarSolicitudCancelacion(id, 1);
      if (resp.success) {
        $q.loading.hide();
        await cancelacionesStore.load_Solicitudes_Cancelacion();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    }
    if (result.isDenied) {
      loading();
      const resp = await cancelacionesStore.aprobarSolicitudCancelacion(id, 2);
      if (resp.success) {
        $q.loading.hide();
        await cancelacionesStore.load_Solicitudes_Cancelacion();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    }
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
    name: "estatus",
    label: "Estatus",
    field: "estatus",
    align: "center",
  },
  {
    name: "solicitante",
    align: "center",
    label: "Solicitante",
    field: "solicitante",
  },
  {
    name: "motivo",
    align: "center",
    label: "Motivo de cancelación",
    field: "motivo",
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

<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
</style>
