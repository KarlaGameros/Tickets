<template>
  <div class="row">
    <div class="col-12">
      <q-table
        :rows="list_Evidencias_Ticket_Detalle"
        :columns="columns"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verEvidencia(props.row.evidencia_URL)"
                >
                  <q-tooltip>Ver evidencia</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!is_Visualizar"
                  flat
                  round
                  color="red"
                  icon="delete"
                  @click="eliminarEvidencia(props.row)"
                >
                  <q-tooltip>Eliminar evidencia</q-tooltip>
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
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//---------------------------------------------------------------

const $q = useQuasar();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const evidenciasStore = useEvidenciasStore();
const { seguimiento, is_Visualizar } = storeToRefs(ticketsSolicitudesStore);
const { list_Evidencias_Ticket_Detalle } = storeToRefs(evidenciasStore);

//---------------------------------------------------------------

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

const verEvidencia = (evidencia) => {
  $q.dialog({
    title: "Ver evidencia",
    style: "width: 800px; max-width: 80vw",
    message: `<iframe
            src="${evidencia}"
            width="100%"
            height="550"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const eliminarEvidencia = async (row) => {
  $q.dialog({
    title: "Eliminar evidencia",
    message: "¿Está seguro de eliminar evidencia?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Eliminar",
    },
    cancel: {
      color: "red",
      label: "No, Regresar",
    },
  }).onOk(async () => {
    loading();
    let resp = await evidenciasStore.eliminar_Evidencia(row.id, true);
    if (resp.success) {
      await evidenciasStore.load_Evidencias_Seguimiento_By_Ticket(
        seguimiento.value.id
      );
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("top-right", "negative", resp.data);
    }
    $q.loading.hide();
  });
};

//---------------------------------------------------------------

const columns = [
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
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
</script>

<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
</style>
