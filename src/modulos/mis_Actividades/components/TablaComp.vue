<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        :grid="$q.screen.xs"
        :rows="list_Seguimiento_Ticket"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
      >
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
                    <div v-if="col.name == 'id'">
                      <q-btn
                        flat
                        round
                        color="purple-ieen"
                        icon="visibility"
                        @click="verSolicitud(props.row)"
                      >
                        <q-tooltip>Ver solicitud</q-tooltip>
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
            <q-td auto-width class="text-center">
              <q-btn
                size="sm"
                color="purple-ieen"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitud(props.row)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.fecha_Fin_Seguimiento == null"
                  flat
                  round
                  color="purple-ieen"
                  icon="check_circle"
                  @click="concluir(props.row)"
                >
                  <q-tooltip>Concluir seguimiento</q-tooltip>
                </q-btn>
              </div>
              <label
                v-else-if="col.name == 'folio_Solicitud_Ticket'"
                class="text-bold"
                >{{ col.value }}</label
              >
              <div v-else-if="col.name === 'estatus'">
                <q-badge :color="col.value == 'Asignado' ? 'orange' : 'green'">
                  {{ col.value }}
                  <q-icon
                    :name="col.value == 'Asignado' ? 'warning' : 'done'"
                  />
                </q-badge>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div
                class="text-left"
                v-html="props.row.titulo_Actividad_Realizada"
              ></div>
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
import { onBeforeMount, ref } from "vue";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useSolicitudesTicketStore } from "src/stores/mis-solicitudes-ticket";
import { useQuasar, QSpinnerFacebook } from "quasar";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const ticketsStore = useTicketsStore();
const evidenciasStore = useEvidenciasStore();
const solicitudesTicketStore = useSolicitudesTicketStore();
const { list_Seguimiento_Ticket, concluirSeguimiento } =
  storeToRefs(ticketsStore);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const cargarData = async () => {
  await ticketsStore.load_Seguimiento_Ticket();
};

const verSolicitud = async (row) => {
  loading();
  ticketsStore.actualizarVisualizar(false);
  ticketsStore.actualizarModalSeguimiento(true);
  await ticketsStore.get_Seguimiento_By_Id(row.id);
  await ticketsStore.load_Seguimiento_By_Ticket(row.solicitud_Ticket_Id);
  await evidenciasStore.load_Evidencias_By_Ticket(row.solicitud_Ticket_Id);
  await solicitudesTicketStore.load_Solicitud_By_Ticket(
    row.solicitud_Ticket_Id
  );
  $q.loading.hide();
};

const concluir = async (row) => {
  if (row.observaciones == null || row.observaciones == "") {
    alertNotify(
      "center",
      "warning",
      "No tiene actividades registradas, no podrá concluir"
    );
  } else {
    Swal.fire({
      icon: "warning",
      reverseButtons: true,
      showCloseButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#26A69A",
      cancelButtonText: `No, regresar`,
      confirmButtonText: `Si, concluir`,
      title: "Concluir seguimiento",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let resp = await ticketsStore.concluir_Seguimiento(row.id);
        if (resp.success) {
          ticketsStore.load_Seguimiento_Ticket();
          alertNotify("top-right", "positive", resp.data);
        } else {
          alertNotify("top-right", "negative", resp.data);
        }
      }
    });
  }
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

const columns = [
  {
    label: "Actividad",
    sortable: true,
    align: "center",
  },
  {
    name: "folio_Solicitud_Ticket",
    label: "Folio",
    field: "folio_Solicitud_Ticket",
    sortable: true,
    align: "center",
  },
  {
    name: "estatus",
    label: "Estatus",
    field: "estatus",
    align: "center",
  },
  {
    name: "empleado_Seguimiento",
    label: "Personal",
    field: "empleado_Seguimiento",
    align: "center",
  },
  {
    name: "fecha_Inicio_Seguimiento",
    align: "center",
    label: "Fecha asignación",
    field: "fecha_Inicio_Seguimiento",
  },
  {
    name: "fecha_Fin_Seguimiento",
    align: "center",
    label: "Fecha conclusión",
    field: "fecha_Fin_Seguimiento",
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
