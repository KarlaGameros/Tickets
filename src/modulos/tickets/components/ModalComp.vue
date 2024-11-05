<template>
  <q-dialog
    v-model="modal"
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
          TICKET <br />
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
          <q-step :name="1" icon="description" title="Información del ticket">
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
                  label="Puesto"
                  readonly
                  v-model="solicitud.solicitante_Puesto"
                />
              </div>
              <div
                v-if="inventario_Ticket.id != null"
                class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
              >
                <q-input
                  readonly
                  v-model="inventario_Ticket.nombre_Corto"
                  label="Inventario con falla"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="inventory_2" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  readonly
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
            <q-form @submit="onSubmit" class="row q-col-gutter-sm">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-select
                  :readonly="is_Visualizar"
                  stack-label
                  color="purple-ieen"
                  v-model="personal_Responsable_Id"
                  :options="list_Personal_By_Area"
                  label="Personal responsable"
                  hint="Seleccione personal"
                  lazy-rules
                  :rules="[(val) => !!val || 'El responsable es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="person" />
                  </template>
                </q-select>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  color="purple-ieen"
                  label="Puesto"
                  hint="Puesto del solictante"
                  readonly
                  v-model="puesto_Responsable"
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-select
                  :readonly="is_Visualizar"
                  v-model="prioridad_Id"
                  :options="list_Prioridad"
                  label="Prioridad"
                  hint="Seleccione prioridad"
                  lazy-rules
                  :rules="[(val) => !!val || 'La prioridad es requerido']"
                  color="purple-ieen"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="timer" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label
                          :class="
                            scope.opt == 'Baja'
                              ? 'text-green text-bold'
                              : scope.opt == 'Media'
                              ? 'text-orange text-bold'
                              : 'text-red text-bold'
                          "
                          >{{ scope.opt }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-select
                  :readonly="is_Visualizar"
                  stack-label
                  color="purple-ieen"
                  v-model="tipo_Id"
                  :options="list_Tipos_Solicitudes"
                  label="Tipo de solicitud"
                  hint="Seleccione tipo"
                  lazy-rules
                  :rules="[(val) => !!val || 'El tipo es requerido']"
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-select
                  :readonly="is_Visualizar"
                  stack-label
                  color="purple-ieen"
                  v-model="categoria_Id"
                  :options="list_Categorias"
                  label="Categoria"
                  hint="Seleccione categoria"
                  lazy-rules
                  :rules="[(val) => !!val || 'La categoria es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon color="purple-ieen" name="category" />
                  </template>

                  <template v-if="!is_Visualizar" v-slot:append>
                    <q-btn
                      flat
                      color="purple-ieen"
                      round
                      dense
                      icon="add"
                      @click="agregarCategoria"
                    >
                      <q-tooltip>Agregar nueva categoria</q-tooltip>
                    </q-btn>
                  </template>
                </q-select>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-select
                  :readonly="is_Visualizar"
                  stack-label
                  color="purple-ieen"
                  v-model="subcategoria_Id"
                  :options="list_Subcategorias"
                  label="Subcategoria"
                  hint="Seleccione subcategoria"
                  lazy-rules
                  :rules="[(val) => !!val || 'La subcategoria es requerido']"
                >
                  <template
                    v-slot:append
                    v-if="categoria_Id != null && !is_Visualizar"
                  >
                    <q-btn
                      flat
                      color="purple-ieen"
                      round
                      dense
                      icon="add"
                      @click="agregarSubcategoria"
                    >
                      <q-tooltip>Agregar nueva subcategoria</q-tooltip>
                    </q-btn>
                  </template>
                </q-select>
              </div>
              <div class="col-12 text-right q-pt-lg">
                <q-btn
                  v-if="!solicitud.is_Asignado && !is_Visualizar"
                  type="submit"
                  label="Asignar"
                  icon-right="save"
                  color="purple-ieen"
                ></q-btn>
                <q-btn
                  v-if="solicitud.is_Asignado && !is_Visualizar"
                  label="Sustituir responsable"
                  icon-right="save"
                  @click="sustituirResponsable"
                  color="purple-ieen"
                ></q-btn>
              </div>
            </q-form>
          </q-step>
          <q-step
            v-if="solicitud.responsable_Ticket_Id != null"
            :name="3"
            title="Seguimiento"
            icon="add"
          >
            <div class="col-12">
              <q-table
                :rows="list_Seguimiento_By_Ticket"
                :columns="columns"
                row-key="name"
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
                        :icon="props.expand ? 'remove' : 'add'"
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
                          icon="visibility"
                          @click="verEvidenciasSeguimiento(props.row)"
                        >
                          <q-tooltip>Ver detalle</q-tooltip>
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
                      <div class="text-left">
                        -
                        {{
                          props.row.observaciones == null ||
                          props.row.observaciones == ""
                            ? "Sin actividades"
                            : props.row.observaciones
                        }}
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTicketsStore } from "src/stores/tickets-store";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useCategoriasStore } from "src/stores/categorias-store";
import { useInventarioStore } from "src/stores/inventario-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { onBeforeMount, ref, watch } from "vue";
import { useSolicitudesTicketStore } from "src/stores/mis-solicitudes-ticket";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const ticketsStore = useTicketsStore();
const helpersStore = useHerlpersStore();
const evidenciasStore = useEvidenciasStore();
const categoriasStore = useCategoriasStore();
const inventarioStore = useInventarioStore();
const tiposSolicitudesStore = useTiposSolicitudesStore();
const solicitudesTicketStore = useSolicitudesTicketStore();
const {
  modal,
  responsable,
  seguimiento,
  is_Visualizar,
  sustituir_Responsable,
  seguimiento_Sustituir,
  list_Seguimiento_By_Ticket,
} = storeToRefs(ticketsStore);
const { solicitud } = storeToRefs(solicitudesTicketStore);
const { inventario_Ticket } = storeToRefs(inventarioStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolicitudesStore);
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
    cargarCategoria(val);
    cargarResponsable(val);
    cargarTipoSolicitud(val);
    cargarPersonalSeguimiento(val);
    prioridad_Id.value = val.prioridad;
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
  await tiposSolicitudesStore.load_Tipos_Solicitudes();
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

const cargarTipoSolicitud = async (val) => {
  if (tipo_Id.value == null) {
    let tipoFiltrado = list_Tipos_Solicitudes.value.find(
      (x) => x.value == val.tipo_Solicitud_Id
    );
    tipo_Id.value = tipoFiltrado;
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

const cargarSubCategoria = async (val) => {
  loading();
  await categoriasStore.load_Subcategorias(val.value);
  $q.loading.hide();
};

const cargarPersonalSeguimiento = async (val) => {
  if (personal_Seguimiento_Id.value == null) {
    let seguimientoFiltrado = list_Personal_By_Area.value.find(
      (x) => x.value == val.responsable_Ticket_Id
    );
    personal_Seguimiento_Id.value = seguimientoFiltrado;
  }
};

const verEvidencia = (url) => {
  $q.dialog({
    title: "Ver",
    style: "width: 800px; max-width: 65vw",
    message: `<iframe
            src="${url}"
            width="100%"
            height="550"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const verEvidenciasSeguimiento = async (row) => {
  await ticketsStore.get_Seguimiento_By_Id(row.id);
  await evidenciasStore.load_Evidencias_Seguimiento_By_Ticket(row.id);
  ticketsStore.actualizarModalDetalleSeguimiento(true);
  ticketsStore.actualizarVisualizar(true);
};

const agregarCategoria = () => {
  categoriasStore.actualizarModal(true);
};

const agregarSubcategoria = async () => {
  await categoriasStore.load_Categoria_By_Id(categoria_Id.value.value);
  await categoriasStore.load_Subcategorias(categoria_Id.value.value);
  categoriasStore.actualizarModalSub(true);
  categoriasStore.actualizarIsEditar(true);
};

const sustituirResponsable = async () => {
  $q.dialog({
    title: "¿Está seguro de sustituir el responsable del ticket?",
    message: "La actividad se asignará al personal seleccionado",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Sustituir",
    },
    cancel: {
      color: "red",
      label: "No, Regresar",
    },
  }).onOk(async () => {
    if (
      solicitud.value.responsable_Ticket_Id ==
      personal_Responsable_Id.value.value
    ) {
      alertNotify(
        "center",
        "warning",
        "No se puede sustituir por mismo personal que está de responsable"
      );
    } else {
      sustituir_Responsable.value.empleado_Nuevo_Id =
        personal_Responsable_Id.value.value;
      sustituir_Responsable.value.solicitud_Ticket_Id = solicitud.value.id;
      sustituir_Responsable.value.empleado_Anterior_Id =
        solicitud.value.responsable_Ticket_Id;

      let encontro = list_Seguimiento_By_Ticket.value.find(
        (x) => x.tipo == "Seguimiento principal"
      );

      let resp = await ticketsStore.sustituir_Responsable_Ticket(
        sustituir_Responsable.value
      );

      seguimiento_Sustituir.value.solicitud_Ticket_Id = encontro.id;
      seguimiento_Sustituir.value.empleado_Seguimiento_Id =
        personal_Responsable_Id.value.value;
      seguimiento_Sustituir.value.titulo_Actividad_Realizada =
        encontro.titulo_Actividad_Realizada;
      seguimiento_Sustituir.value.observaciones = encontro.observaciones;
      seguimiento_Sustituir.value.tipo = encontro.tipo;

      if (resp.success) {
        if (encontro != undefined) {
          seguimiento_Sustituir.value.id = encontro.id;
          seguimiento_Sustituir.value.solicitud_Ticket_Id = encontro.id;
          seguimiento_Sustituir.value.empleado_Seguimiento_Id =
            personal_Responsable_Id.value.value;
          seguimiento_Sustituir.value.titulo_Actividad_Realizada =
            encontro.titulo_Actividad_Realizada;
          seguimiento_Sustituir.value.observaciones = "";
          seguimiento_Sustituir.value.tipoFiltrado = encontro.tipo;
          await ticketsStore.update_Detalle_Seguimienti(
            seguimiento_Sustituir.value
          );
        }
        await ticketsStore.load_Solicitudes_Tickets();
        actualizarModal(false);
        alertNotify("top-right", "positive", resp.data);
      } else {
        alertNotify("top-right", "negative", resp.data);
      }
    }
  });
};

const actualizarModal = (valor) => {
  limpiar();
  ticketsStore.actualizarModal(valor);
  ticketsStore.actualizarVisualizar(false);
};

const limpiar = () => {
  step.value = 1;
  tipo_Id.value = null;
  evidencia.value = null;
  prioridad_Id.value = null;
  categoria_Id.value = null;
  subcategoria_Id.value = null;
  ticketsStore.initResponsable();
  puesto_Responsable.value = null;
  personal_Responsable_Id.value = null;
  personal_Seguimiento_Id.value = null;
  solicitudesTicketStore.initSolicitudTicket();
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

const onSubmit = async () => {
  loading();
  responsable.value.responsable_Ticket_Id = personal_Responsable_Id.value.value;
  responsable.value.prioridad = prioridad_Id.value;
  responsable.value.tipo_Solicitud_Id = tipo_Id.value.value;
  responsable.value.subcategoria_Id = subcategoria_Id.value.value;
  let resp = await ticketsStore.asignar_Responsable_Ticket(
    solicitud.value.id,
    responsable.value
  );
  if (resp.success) {
    seguimiento.value.empleado_Seguimiento_Id =
      personal_Responsable_Id.value.value;
    seguimiento.value.tipo = "Seguimiento principal";
    seguimiento.value.solicitud_Ticket_Id = solicitud.value.id;
    seguimiento.value.titulo_Actividad_Realizada = solicitud.value.descripcion;
    let respSeguimiento = await ticketsStore.create_Seguimiento(
      seguimiento.value
    );
    if (respSeguimiento.success) {
      await ticketsStore.load_Solicitudes_Tickets();
      await ticketsStore.load_Seguimiento_Ticket();
      actualizarModal(false);
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("top-right", "negative", resp.data);
    }
  } else {
    alertNotify("top-right", "negative", resp.data);
  }
  $q.loading.hide();
};

const columns = [
  {
    name: "observaciones",
    align: "center",
    label: "Actividades",
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
<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
.flotanteFooter {
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: white;
}
.my-sticky-last-column-table thead tr:last-child th:last-child {
  background-color: white;
}

td:last-child {
  background-color: white;
}

th:last-child,
td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
