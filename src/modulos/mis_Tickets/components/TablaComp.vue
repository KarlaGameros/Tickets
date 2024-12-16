<template>
  <div class="row q-pa-lg">
    <div class="col-12">
      <q-table
        row-key="id"
        :filter="filter"
        :columns="columns"
        :grid="$q.screen.xs"
        :rows="list_Mis_Tickets"
        :pagination="pagination"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
        rows-per-page-label="Filas por pagina"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
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
                        v-if="props.row.estatus_Ticket != 'Pendiente'"
                        flat
                        round
                        color="purple-ieen"
                        icon="visibility"
                        @click="verSolicitud(col.value)"
                      >
                        <q-tooltip>Ver solicitud</q-tooltip>
                      </q-btn>
                    </div>
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
            <q-td auto-width>
              <q-btn
                size="sm"
                :color="props.expand ? 'grey' : 'purple-ieen'"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
                class="absolute-center"
              />
            </q-td>
            <q-td
              v-for="col in props.cols.filter((x) => x.name !== 'vermas')"
              :key="col.name"
              :props="props"
            >
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="props.row.estatus_Ticket == 'Concluido'"
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="generarVale(col.value)"
                >
                  <q-tooltip>Generar vale</q-tooltip>
                </q-btn>
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
                  v-if="
                    props.row.estatus_Ticket == 'Pendiente' ||
                    ((perfil == 'Super Administrador' ||
                      perfil == 'Administrador') &&
                      props.row.estatus_Ticket != 'Concluido' &&
                      props.row.estatus_Ticket != 'Cancelado')
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editarSolicitud(col.value)"
                >
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus_Ticket == 'Pendiente'"
                  flat
                  round
                  color="red"
                  icon="cancel"
                  @click="cancelarSolicitud(col.value)"
                >
                  <q-tooltip>Cancelar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="props.row.estatus_Ticket == 'Concluido'"
                  flat
                  round
                  color="purple-ieen"
                  icon="reviews"
                  @click="agregarOpinion(props.row)"
                >
                  <q-tooltip>{{
                    props.row.opiniones == null
                      ? "Agregar opiniones"
                      : "Ver opinión"
                  }}</q-tooltip>
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
                      : col.value == 'En Proceso'
                      ? 'secondary'
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
                        : col.value == 'En Proceso'
                        ? 'pending'
                        : col.value == 'Cancelado'
                        ? 'close'
                        : 'done'
                    "
                  />
                </q-badge>
              </div>
              <div v-else-if="col.name == 'fecha_Creacion'">
                {{ col.value.replace("T", " ") }}
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left q-pa-xs">
                <b>Motivo:</b>
                {{ props.row.descripcion }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { EncryptStorage } from "storage-encryption";
import { onBeforeMount, ref } from "vue";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useInventarioStore } from "src/stores/inventario-store";
import { useCancelacionesStore } from "src/stores/cancelaciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import ValeTicket from "../../../helpers/ValeTicket";
import Swal from "sweetalert2";

//---------------------------------------------------------------

const $q = useQuasar();
const inventarioStore = useInventarioStore();
const evidenciasStore = useEvidenciasStore();
const cancelacionesStore = useCancelacionesStore();
const misSolicitudesStore = useMisSolicitudesStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { list_Mis_Tickets, opinion } = storeToRefs(misSolicitudesStore);
const perfil = encryptStorage.decrypt("perfil");

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

const cargarData = async () => {
  loading();
  await misSolicitudesStore.load_Mis_Solicitudes();
  $q.loading.hide();
};

const verSolicitud = async (id) => {
  loading();
  await inventarioStore.load_Inventario_By_Ticket(id);
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  misSolicitudesStore.updateModal(true);
  await misSolicitudesStore.load_Solicitud_By_Id(id);
  misSolicitudesStore.updateIsVisualize(true);
  $q.loading.hide();
};

const editarSolicitud = async (id) => {
  loading();
  misSolicitudesStore.updateIsEdit(true);
  misSolicitudesStore.updateModal(true);
  await inventarioStore.load_Inventario_By_Ticket(id);
  await evidenciasStore.load_Evidencias_By_Ticket(id);
  await misSolicitudesStore.load_Solicitud_By_Id(id);

  $q.loading.hide();
};

const generarVale = async (id) => {
  loading();
  await misSolicitudesStore.load_Solicitud_By_Id(id);
  let resp = await ValeTicket();
  if (resp.success) {
    alertNotify("top-right", "positive", resp.data);
  }
  misSolicitudesStore.initSolicitud();
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

const agregarOpinion = async (row) => {
  if (row.opiniones == null) {
    Swal.fire({
      icon: "info",
      title: "Opiniones",
      text: "En este apartado podras escribir una opinión sobre el ticket",
      inputAttributes: {
        autocapitalize: "off",
      },
      reverseButtons: true,
      showCloseButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#26A69A",
      cancelButtonText: `Salir`,
      confirmButtonText: `Enviar`,
      input: "textarea",
    }).then(async (result) => {
      if (result.isConfirmed) {
        loading();
        let resp = null;
        opinion.value.id = row.id;
        opinion.value.opiniones = result.value;
        resp = await misSolicitudesStore.create_Opinion(opinion.value);
        if (resp.success) {
          await misSolicitudesStore.load_Mis_Solicitudes();
          alertNotify("top-right", "positive", resp.data);
        } else {
          alertNotify("top-right", "negative", resp.data);
        }
        $q.loading.hide();
      }
    });
  } else {
    Swal.fire({
      icon: "info",
      title: "Opinión registrada",
      text: `- ${row.opiniones}`,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: true,
    });
  }
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

//---------------------------------------------------------------

const columns = [
  {
    name: "vermas",
    label: "Ver motivo",
    field: "folio",
    align: "vermas",
  },
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
