<template>
  <div class="row">
    <div class="col-12">
      <q-table
        flat
        row-key="id"
        :filter="filter"
        :columns="columns"
        :grid="$q.screen.xs"
        :pagination="pagination"
        no-data-label="No hay registros"
        :visible-columns="visible_colums"
        class="my-sticky-last-column-table"
        rows-per-page-label="Filas por pagina"
        :rows="
          props.tipo == 'pendientes'
            ? list_Tickets_Filtro.filter((x) => x.estatus_Ticket == 'Pendiente')
            : props.tipo == 'en_Proceso'
            ? list_Tickets_Filtro.filter(
                (x) => x.estatus_Ticket == 'En Proceso'
              )
            : list_Tickets_Filtro.filter((x) => x.estatus_Ticket == 'Concluido')
        "
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      >
        <template v-slot:top-left>
          <q-select
            style="width: 250px"
            dense
            color="purple-ieen"
            v-model="tipo_Solicitud"
            :options="list_Tipos_Solicitudes"
            label="Tipo de solicitud"
            class="q-pr-sm"
          />
          <q-select
            style="width: 250px"
            dense
            color="purple-ieen"
            v-model="area_Id"
            :options="list_Areas"
            label="Área"
          />
        </template>
        <template v-slot:top-right>
          <q-input dense debounce="300" v-model="filter" placeholder="Buscar..">
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
                      <q-btn
                        v-if="tipo == 'en_Proceso'"
                        flat
                        round
                        color="purple-ieen"
                        icon="task_alt"
                        @click="concluirTicket(col.value)"
                      >
                        <q-tooltip>Concluir ticket</q-tooltip>
                      </q-btn>
                    </div>
                    <label v-else-if="col.name == 'folio'" class="text-bold">{{
                      col.value
                    }}</label>
                    <div v-else-if="col.name === 'estatus_Ticket'">
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
                  @click="verSolicitud(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="tipo == 'en_Proceso'"
                  flat
                  round
                  color="purple-ieen"
                  icon="task_alt"
                  @click="concluirTicket(col.value)"
                >
                  <q-tooltip>Concluir ticket</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.opiniones != null"
                  flat
                  round
                  color="purple-ieen"
                  icon="reviews"
                  @click="verOpinion(props.row)"
                >
                  <q-tooltip>Ver opinion</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus_Ticket == 'Concluido'"
                  flat
                  round
                  color="purple-ieen"
                  icon="attach_file"
                  @click="subirArchivoFirmado(props.row)"
                >
                  <q-tooltip>Subir archivo firmado</q-tooltip>
                </q-btn>
              </div>
              <label v-else-if="col.name == 'folio'" class="text-bold">{{
                col.value
              }}</label>
              <div v-else-if="col.name === 'estatus_Ticket'">
                <q-badge :color="col.value == 'Pendiente' ? 'orange' : 'green'">
                  {{ col.value }}
                  <q-icon
                    :name="col.value == 'Pendiente' ? 'warning' : 'done'"
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
import { useTicketsStore } from "src/stores/tickets-store";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useInventarioStore } from "src/stores/inventario-store";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useSolicitudesTicketStore } from "src/stores/mis-solicitudes-ticket";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watchEffect } from "vue";
import Swal from "sweetalert2";

const $q = useQuasar();
const ticketsStore = useTicketsStore();
const helpersStore = useHerlpersStore();
const inventarioStore = useInventarioStore();
const evidenciasStore = useEvidenciasStore();
const tiposSolicitudesStore = useTiposSolicitudesStore();
const solicitudesTicketStore = useSolicitudesTicketStore();
const { list_Areas } = storeToRefs(helpersStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolicitudesStore);
const {
  list_Solicitudes_Tickets,
  list_Seguimiento_By_Ticket,
  list_Tickets_Filtro,
} = storeToRefs(ticketsStore);
const props = defineProps({
  tipo: {
    type: String,
  },
});
const visible_colums = ref([]);
const area_Id = ref({ value: 0, label: "Todos" });
const tipo_Solicitud = ref({ value: 0, label: "Todos" });

onBeforeMount(() => {
  cargarData();
});

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

const cargarData = async () => {
  loading();
  cargarColumnas();
  await helpersStore.load_Areas();
  await ticketsStore.load_Solicitudes_Tickets();
  await tiposSolicitudesStore.load_Tipos_Solicitudes();
  $q.loading.hide();
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

const verSolicitud = async (id) => {
  loading();
  await solicitudesTicketStore.load_Solicitud_By_Ticket(id);
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  await inventarioStore.load_Inventario_By_Ticket(id);
  await ticketsStore.load_Seguimiento_By_Ticket(id);
  ticketsStore.actualizarModal(true);
  if (props.tipo == "concluidas") {
    ticketsStore.actualizarVisualizar(true);
  } else {
    ticketsStore.actualizarVisualizar(false);
  }
  $q.loading.hide();
};

const subirArchivoFirmado = async (row) => {
  await solicitudesTicketStore.load_Solicitud_By_Ticket(row.id);
  ticketsStore.actualizarModalArchivo(true);
};

const cargarColumnas = () => {
  switch (props.tipo) {
    case "pendientes":
      visible_colums.value = [
        "id",
        "folio",
        "solicitante",
        "fecha_Creacion",
        "estatus_Ticket",
        "solicitante_Area",
      ];
      break;
    case "en_Proceso":
      visible_colums.value = [
        "id",
        "folio",
        "tipo_Solicitud",
        "solicitante",
        "responsable_Ticket",
        "fecha_Inicio",
        "fecha_Creacion",
        "estatus_Ticket",
        "solicitante_Area",
      ];
      break;
    case "concluidas":
      visible_colums.value = [
        "id",
        "folio",
        "tipo_Solicitud",
        "solicitante",
        "fecha_Inicio",
        "fecha_Fin",
        "fecha_Creacion",
        "estatus_Ticket",
        "solicitante_Area",
      ];
      break;
    default:
      break;
  }
};

const verOpinion = async (row) => {
  Swal.fire({
    title: "Opinión registrada",
    text: `- ${row.opiniones}`,
    showCloseButton: true,
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: true,
  });
};

const concluirTicket = async (id) => {
  await ticketsStore.load_Seguimiento_By_Ticket(id);
  if (list_Seguimiento_By_Ticket.value.length > 0) {
    let encontrar = list_Seguimiento_By_Ticket.value.filter(
      (x) => x.estatus != "Concluido"
    );
    if (encontrar.length == 0) {
      Swal.fire({
        title: "Concluir ticket",
        text: "¿Está seguro de concluir el ticket?",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        icon: "warning",
        reverseButtons: true,
        showCloseButton: true,
        showCancelButton: true,
        allowOutsideClick: false,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#26A69A",
        cancelButtonText: `No, regresar`,
        confirmButtonText: `Si, concluir`,
        inputValidator: (value) => {
          if (!value) {
            return "Se requiere observación";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          loading();
          let resp = null;
          let concluirFormData = new FormData();
          concluirFormData.append("Observaciones", result.value);
          resp = await ticketsStore.concluir_Ticket(id, concluirFormData);
          if (resp.success) {
            await ticketsStore.load_Solicitudes_Tickets();
            alertNotify("top-right", "positive", resp.data);
          } else {
            alertNotify("top-right", "negative", resp.data);
          }
          $q.loading.hide();
        }
      });
    } else {
      alertNotify(
        "center",
        "warning",
        "Tiene seguimientos acitvos, no podrá concluir"
      );
    }
  } else {
    alertNotify("center", "warning", "No tiene seguimientos asignados");
  }
};

const filtrar = (list, filtro) => {
  list_Tickets_Filtro.value = list.filter((item) => {
    let cumple = true;
    if (filtro.tipo !== undefined) {
      if (filtro.tipo == 0) {
        cumple = cumple && item.tipo_Solicitud_Id === item.tipo_Solicitud_Id;
      } else {
        cumple = cumple && item.tipo_Solicitud_Id === filtro.tipo;
      }
    }
    if (filtro.area !== undefined) {
      if (filtro.area == 0) {
        cumple =
          cumple && item.solicitante_Area_Id === item.solicitante_Area_Id;
      } else {
        cumple = cumple && item.solicitante_Area_Id === parseInt(filtro.area);
      }
    }
    return cumple;
  });
};

watchEffect(() => {
  const filtro = {};
  if (tipo_Solicitud.value != null) filtro.tipo = tipo_Solicitud.value.value;
  if (area_Id.value != null) filtro.area = area_Id.value.value;
  filtrar(list_Solicitudes_Tickets.value, filtro);
});

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
    name: "tipo_Solicitud",
    label: "Tipo",
    field: "tipo_Solicitud",
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
    name: "responsable_Ticket",
    align: "center",
    label: "Responsable",
    field: "responsable_Ticket",
  },
  {
    name: "fecha_Creacion",
    align: "center",
    label: "Fecha solicitud",
    field: "fecha_Creacion",
  },
  {
    name: "fecha_Inicio",
    align: "center",
    label: "Fecha asignación",
    field: "fecha_Inicio",
  },
  {
    name: "fecha_Fin",
    align: "center",
    label: "Fecha conclusión",
    field: "fecha_Fin",
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
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
