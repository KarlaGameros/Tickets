<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Mis actividades</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Mis actividades"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <!-- <div class="row" v-if="list_Seguimiento_Ticket.length > 0">
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
    </div> -->
    <TablaComp />
    <ModalComp />
    <ModalDetalleSeguimiento />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useQuasar, exportFile } from "quasar";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalDetalleSeguimiento from "../components/ModalDetalleSeguimiento.vue";

//---------------------------------------------------------------

const $q = useQuasar();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const { list_Seguimiento_Ticket } = storeToRefs(ticketsSolicitudesStore);

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
      list_Seguimiento_Ticket.value.map((row) =>
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
  const status = exportFile(
    `Mis_Seguimientos_${list_Seguimiento_Ticket.value[0].empleado_Seguimiento}`,
    bom + content,
    "text/csv;charset=utf-8"
  );
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
    name: "titulo_Actividad_Realizada",
    label: "Actividad a realizar",
    sortable: true,
    field: "titulo_Actividad_Realizada",
  },
  {
    name: "observaciones",
    label: "Observaciones",
    sortable: true,
    field: "observaciones",
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
];
</script>
