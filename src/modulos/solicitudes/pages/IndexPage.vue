<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Solicitudes</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Solicitudes"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 text-right">
        <q-btn
          class="q-mr-lg q-mt-lg"
          color="purple-ieen"
          icon-right="archive"
          label="Exportar Excel"
          no-caps
          @click="exportTable"
        />
      </div>
    </div>
    <q-card class="q-ma-lg">
      <q-tabs
        dense
        v-model="tab"
        align="justify"
        class="text-grey"
        active-color="purple-ieen"
        indicator-color="purple-ieen"
      >
        <q-tab icon="pending" name="pendientes" label="Pendientes de aprobar">
          <q-badge color="blue-grey" floating>{{
            list_Solicitudes.filter((x) => x.estatus_Ticket == "Pendiente")
              .length
          }}</q-badge>
        </q-tab>
        <q-tab icon="done_outline" name="aprobadas" label="Aprobadas">
          <q-badge color="blue-grey" floating>{{
            list_Solicitudes.filter(
              (x) => x.estatus_Ticket == "Aprobado por Jefe de Area"
            ).length
          }}</q-badge>
        </q-tab>
        <q-tab icon="engineering" name="en_Proceso" label="En Proceso">
          <q-badge color="blue-grey" floating>{{
            list_Solicitudes.filter((x) => x.estatus_Ticket == "En Proceso")
              .length
          }}</q-badge>
        </q-tab>
        <q-tab icon="task_alt" name="concluidas" label="Concluidas" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="pendientes">
          <TablaComp :tipo="'pendientes'" />
        </q-tab-panel>
        <q-tab-panel name="aprobadas">
          <TablaComp :tipo="'aprobadas'" />
        </q-tab-panel>
        <q-tab-panel name="en_Proceso">
          <TablaComp :tipo="'en_Proceso'" />
        </q-tab-panel>
        <q-tab-panel name="concluidas">
          <TablaComp :tipo="'concluidas'" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <ModalComp />
    <ModalArchivo />
    <ModalCategoriaComp />
    <ModalSubCategorias />
    <ModalCambiarSolicitud />
    <ModalDetalleSeguimiento />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, exportFile } from "quasar";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalArchivo from "src/helpers/ModalArchivo.vue";
import ModalCambiarSolicitud from "src/helpers/ModalCambiarSolicitud.vue";
import ModalCategoriaComp from "src/modulos/configuracion/components/ModalComp.vue";
import ModalSubCategorias from "src/modulos/configuracion/components/ModalSubCategorias.vue";
import ModalDetalleSeguimiento from "src/modulos/mis_Actividades_Solicitudes/components/ModalDetalleSeguimiento.vue";

//---------------------------------------------------------------

const $q = useQuasar();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const { list_Solicitudes } = storeToRefs(ticketsSolicitudesStore);
const tab = ref("pendientes");

//---------------------------------------------------------------

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

const exportTable = () => {
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      list_Solicitudes_Tickets.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const bom = "\uFEFF";
  const status = exportFile("Tickets", bom + content, "text/csv;charset=utf-8");
  if (status !== true) {
    $q.notify({
      message: "El navegador denegó la descarga...",
      color: "negative",
      icon: "warning",
    });
  }
};

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
];
</script>
