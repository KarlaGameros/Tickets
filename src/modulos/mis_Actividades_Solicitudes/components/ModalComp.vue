<template>
  <q-dialog
    v-model="modal_Seguimiento_Solicitudes"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row flotante">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          SOLICITUD <br />
          <p class="text-purple-ieen">{{ solicitud.folio }}</p>
        </div>

        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-stepper
          color="purple-ieen"
          v-model="step"
          header-nav
          ref="stepper"
          animated
          active-color="purple-ieen"
        >
          <q-step
            :name="1"
            icon="description"
            title="Información de la solicitud"
          >
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-badge
                  :color="
                    solicitud.estatus_Ticket == 'Pendiente' ? 'orange' : 'green'
                  "
                >
                  {{ solicitud.estatus_Ticket }}
                  <q-icon
                    :name="
                      solicitud.estatus_Ticket == 'Pendiente'
                        ? 'warning'
                        : 'done'
                    "
                  />
                </q-badge>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  color="purple-ieen"
                  label="Área del solicitante"
                  readonly
                  v-model="solicitud.solicitante_Area"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="apartment" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  color="purple-ieen"
                  label="Fecha"
                  readonly
                  v-model="solicitud.fecha_Creacion"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" color="purple-ieen" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  color="purple-ieen"
                  label="Solicitante"
                  readonly
                  v-model="solicitud.solicitante"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  color="purple-ieen"
                  label="Puesto"
                  readonly
                  v-model="solicitud.solicitante_Puesto"
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  color="purple-ieen"
                  label="Tipo de recepción"
                  v-model="solicitud.tipo_Recepcion"
                />
              </div>
              <div class="col-12">
                <q-input
                  readonly
                  label="Motivo de la solicitud"
                  v-model="solicitud.descripcion"
                  outlined
                  type="textarea"
                  color="purple-ieen"
                />
              </div>
              <div class="col-12" v-if="list_Evidencias_Ticket.length > 0">
                <div
                  class="text-bold text-purple-ieen text-center text-h6 q-pt-lg"
                >
                  EVIDENCIAS
                </div>
                <q-list bordered class="rounded-borders">
                  <q-item
                    v-for="evidencia in list_Evidencias_Ticket"
                    :key="evidencia"
                  >
                    <q-item-section>
                      Evidencia:
                      {{ evidencia.descripcion }}</q-item-section
                    >
                    <q-item-section top side>
                      <q-btn
                        color="purple-ieen"
                        flat
                        dense
                        round
                        icon="visibility"
                        @click="verEvidencia(evidencia.evidencia_URL)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-step>
          <q-step :name="2" title="Responsable" icon="supervisor_account">
            <div class="row q-col-gutter-sm">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  stack-label
                  v-model="solicitud.responsable_Ticket"
                  label="Personal responsable"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  label="Puesto"
                  hint="Puesto del solictante"
                  readonly
                  v-model="solicitud.responsable_Ticket_Puesto"
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  v-model="solicitud.prioridad"
                  :options="list_Prioridad"
                  label="Prioridad"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="timer" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  v-model="solicitud.tipo_Solicitud"
                  label="Tipo de solicitud"
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  label="Categoria"
                  v-model="solicitud.categoria"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="category" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
                  label="Subcategoria"
                  v-model="solicitud.subcategoria"
                >
                </q-input>
              </div>
            </div>
          </q-step>
          <q-step :name="3" title="Seguimiento" icon="add">
            <div class="col-12">
              <q-table
                :rows="list_Seguimiento_By_Ticket"
                :columns="columns"
                row-key="id"
                :pagination="pagination"
                class="my-sticky-last-column-table"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td auto-width class="text-center">
                      <q-btn
                        size="sm"
                        color="purple-ieen"
                        round
                        dense
                        @click="props.expand = !props.expand"
                        :icon="
                          props.expand ? 'arrow_drop_up' : 'arrow_drop_down'
                        "
                      />
                    </q-td>
                    <q-td
                      v-for="col in props.cols.filter(
                        (x) => x.name != 'observaciones'
                      )"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name == 'id'">
                        <q-btn
                          flat
                          round
                          color="purple-ieen"
                          icon="add_circle"
                          @click="verDetalle(props.row)"
                        >
                          <q-tooltip>Agregar actividades</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="props.row.observaciones == null"
                          flat
                          round
                          color="purple-ieen"
                          icon="delete"
                          @click="eliminarDetalle(props.row)"
                        >
                          <q-tooltip>Eliminar seguimiento</q-tooltip>
                        </q-btn>
                      </div>
                      <div v-else-if="col.name === 'estatus'">
                        <q-badge
                          :color="col.value == 'Asignado' ? 'orange' : 'green'"
                        >
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
                        v-html="
                          props.row.observaciones == null ||
                          props.row.observaciones == ''
                            ? '- Sin actividades'
                            : props.row.observaciones
                        "
                      ></div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-step>
          <q-step
            v-if="
              solicitud.responsable_Ticket_Id == usuario.solicitante_Id &&
              solicitud.estatus_Ticket != 'Concluido' &&
              !is_Visualizar
            "
            :name="4"
            title="Reasignar"
            icon="add"
          >
            <q-form @submit="guardarSeguimiento">
              <div class="col-12">
                <q-select
                  lazy-rules
                  stack-label
                  label="Personal"
                  color="purple-ieen"
                  hint="Seleccione personal"
                  :options="list_Personal_By_Area"
                  v-model="personal_Seguimiento_Id"
                  :rules="[(val) => !!val || 'El personal es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="person" />
                  </template>
                </q-select>
              </div>
              <br />
              <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                <q-input
                  lazy-rules
                  color="purple-ieen"
                  hint="Describir actividad"
                  v-model="actividades_Seguimiento"
                  label="Describir actividad por realizar"
                  :rules="[(val) => !!val || 'La actividad es requerida']"
                />
              </div>
              <div class="col-12 text-right q-pb-lg q-pt-lg">
                <q-btn
                  type="submit"
                  label="Asignar nuevo seguimiento"
                  icon-right="save"
                  color="purple-ieen"
                ></q-btn>
              </div>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useCategoriasStore } from "src/stores/categorias-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const helpersStore = useHerlpersStore();
const evidenciasStore = useEvidenciasStore();
const categoriasStore = useCategoriasStore();
const misSolicitudesStore = useMisSolicitudesStore();
const {
  seguimiento,
  is_Visualizar,
  list_Seguimiento_By_Ticket,
  modal_Seguimiento_Solicitudes,
} = storeToRefs(ticketsSolicitudesStore);
const { usuario } = storeToRefs(authStore);
const { solicitud } = storeToRefs(misSolicitudesStore);
const { list_Evidencias_Ticket } = storeToRefs(evidenciasStore);
const { list_Areas, list_Personal_By_Area } = storeToRefs(helpersStore);
const { list_Categorias, list_Subcategorias } = storeToRefs(categoriasStore);
const step = ref(1);
const tipo_Id = ref(null);
const evidencia = ref(null);
const prioridad_Id = ref(null);
const categoria_Id = ref(null);
const subcategoria_Id = ref(null);
const puesto_Responsable = ref(null);
const actividades_Seguimiento = ref("");
const personal_Responsable_Id = ref(null);
const personal_Seguimiento_Id = ref(null);
const list_Prioridad = ref(["Baja", "Media", "Alta"]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(solicitud.value, (val) => {
  if (val.is_Asignado) {
    cargarResponsable(val);
    //cargarPersonalSeguimiento(val);
    cargarCategoria(val);
    prioridad_Id.value = val.prioridad;
    tipo_Id.value = val.tipo;
  }
});

watch(categoria_Id, (val) => {
  if (val != null) {
    subcategoria_Id.value = null;
    cargarSubCategoria(val);
  }
});

watch(personal_Responsable_Id, (val) => {
  if (val != null) {
    puesto_Responsable.value = val.puesto;
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  loading();
  await helpersStore.load_Areas();
  await categoriasStore.load_Categorias();
  await authStore.get_Empleado_By_Usuario();
  let areaInformatica = list_Areas.value.find(
    (x) => x.label == "Unidad Técnica de Informática y Estadística"
  );
  if (areaInformatica != null) {
    await helpersStore.load_Personal_By_Area(areaInformatica.value);
  }
  $q.loading.hide();
};

const cargarResponsable = async (val) => {
  if (personal_Responsable_Id.value == null) {
    let responsableFiltrado = list_Personal_By_Area.value.find(
      (x) => x.value == val.responsable_Ticket_Id
    );
    personal_Responsable_Id.value = responsableFiltrado;
  }
};

const cargarCategoria = async (val) => {
  if (categoria_Id.value == null) {
    let categoriaFiltrado = list_Categorias.value.find(
      (x) => x.value == val.categoria_Id
    );
    categoria_Id.value = categoriaFiltrado;
    await cargarSubCategoria(categoria_Id.value);
    let subcategoriaFiltrado = list_Subcategorias.value.find(
      (x) => x.value == val.subcategoria_Id
    );
    subcategoria_Id.value = subcategoriaFiltrado;
  }
};

const verEvidencia = (url) => {
  $q.dialog({
    title: "Ver",
    style: "width: 800px; max-width: 65vw;",
    message: `<iframe
            src="${url}"
            width="100%"
            height="550"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const cargarSubCategoria = async (val) => {
  loading();
  await categoriasStore.load_Subcategorias(val.value);
  $q.loading.hide();
};

// const cargarPersonalSeguimiento = async (val) => {
//   if (personal_Seguimiento_Id.value == null) {
//     let seguimientoFiltrado = list_Personal_By_Area.value.find(
//       (x) => x.value == val.responsable_Ticket_Id
//     );
//     personal_Seguimiento_Id.value = seguimientoFiltrado;
//   }
// };

const verDetalle = async (row) => {
  if (
    row.estatus == "Concluido" ||
    row.empleado_Seguimiento_Id != usuario.value.id
  ) {
    ticketsSolicitudesStore.actualizarVisualizar(true);
  } else {
    ticketsSolicitudesStore.actualizarModalSolicitud(false);
  }
  await evidenciasStore.load_Evidencias_Seguimiento_By_Ticket(row.id);
  await ticketsSolicitudesStore.get_Seguimiento_By_Id(row.id);
  ticketsSolicitudesStore.actualizarModalDetalleSeguimientoSolicitudes(true);
};

const eliminarDetalle = async (row) => {
  $q.dialog({
    title: "¿Está seguro de eliminar el seguimiento?",
    message: "Se eliminará el seguimiento del ticket",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "delete",
      color: "secondary",
      label: "Sí! eliminar",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loading();
    const resp = await ticketsSolicitudesStore.delete_Seguimiento(row.id);
    if (resp.success) {
      await ticketsSolicitudesStore.load_Seguimiento_By_Ticket(
        row.solicitud_Ticket_Id
      );
      alertNotify("top-right", "positive", resp.data);
      $q.loading.hide();
    } else {
      $q.loading.hide();
      alertNotify("top-right", "negative", resp.data);
    }
  });
};

const actualizarModal = (valor) => {
  limpiar();
  ticketsSolicitudesStore.actualizarModalSeguimientoSolicitudes(valor);
};

const limpiar = () => {
  step.value = 1;
  tipo_Id.value = null;
  evidencia.value = null;
  prioridad_Id.value = null;
  categoria_Id.value = null;
  subcategoria_Id.value = null;
  puesto_Responsable.value = null;
  actividades_Seguimiento.value = null;
  personal_Responsable_Id.value = null;
  personal_Seguimiento_Id.value = null;
  list_Evidencias_Ticket.value = [];
  misSolicitudesStore.initSolicitud();
  ticketsSolicitudesStore.initSeguimiento();
  ticketsSolicitudesStore.actualizarVisualizar(false);
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

const guardarSeguimiento = async () => {
  if (
    personal_Responsable_Id.value.value == personal_Seguimiento_Id.value.value
  ) {
    alertNotify(
      "center",
      "warning",
      "No se puede asignar otro seguimiento al responsable del ticket"
    );
  } else {
    loading();
    let resp = null;
    seguimiento.value.observaciones = null;
    seguimiento.value.titulo_Actividad_Realizada =
      actividades_Seguimiento.value;
    seguimiento.value.tipo = "Seguimiento secundario";
    seguimiento.value.empleado_Seguimiento_Id =
      personal_Seguimiento_Id.value.value;
    seguimiento.value.solicitud_Ticket_Id = solicitud.value.id;
    resp = await ticketsSolicitudesStore.create_Seguimiento(seguimiento.value);
    if (resp.success) {
      await ticketsSolicitudesStore.load_Seguimiento_By_Ticket(
        solicitud.value.id
      );
      actualizarModal(false);
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("top-right", "negative", resp.data);
    }
    $q.loading.hide();
  }
};

const columns = [
  {
    name: "observaciones",
    align: "center",
    label: "Seguimientos",
    field: "observaciones",
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
  },
  {
    name: "fecha_Inicio_Seguimiento",
    label: "Fecha",
    field: "fecha_Inicio_Seguimiento",
    align: "center",
  },
  {
    name: "empleado_Seguimiento",
    label: "Personal",
    field: "empleado_Seguimiento",
    align: "center",
  },
  {
    name: "titulo_Actividad_Realizada",
    align: "center",
    label: "Actividad",
    field: "titulo_Actividad_Realizada",
  },
  {
    name: "id",
    align: "center",
    label: "Evidencia",
    field: "id",
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});
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
