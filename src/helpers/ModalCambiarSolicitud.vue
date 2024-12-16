<template>
  <q-dialog
    v-model="modal_Cambiar_Solicitud"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 400px; max-width: 40vw">
      <q-card-section class="row">
        <div
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          Cambiar de tipo
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
        <q-form @submit="onSubmit" class="row q-col-gutter-sm">
          <div class="col-12">
            <q-select
              stack-label
              color="purple-ieen"
              v-model="tipo_Id"
              :options="list_Tipos_Solicitudes"
              label="Tipo de solicitud"
              hint="Seleccione el tipo al que desea cambiar"
              lazy-rules
              :rules="[(val) => !!val || 'El tipo es requerido']"
            />
          </div>
          <div class="col-12 q-pt-lg">
            <div class="text-right">
              <q-btn
                label="Cerrar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                icon-right="save"
                label="Guardar"
                type="submit"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useInventarioStore } from "src/stores/inventario-store";

//-----------------------------------------------------------

const $q = useQuasar();
const helpersStore = useHerlpersStore();
const inventarioStore = useInventarioStore();
const misSolicitudesStore = useMisSolicitudesStore();
const tiposSolicitudesStore = useTiposSolicitudesStore();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const { list_Areas } = storeToRefs(helpersStore);
const { inventario_Ticket } = storeToRefs(inventarioStore);
const { solicitud } = storeToRefs(misSolicitudesStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolicitudesStore);
const { modal_Cambiar_Solicitud } = storeToRefs(ticketsSolicitudesStore);
const tipo_Id = ref(null);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  inventarioStore.initInventario();
  ticketsSolicitudesStore.actualizarModalCambiarSolicitud(valor);
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
  $q.dialog({
    title: "¿Está seguro de cambiar el tipo de la solicitud?",
    message: `Se cambiará a '${tipo_Id.value.label}'`,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! cambiar",
    },
    cancel: {
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loading();
    let area_Id = list_Areas.value.find(
      (x) => x.label == "Unidad Técnica de Informática y Estadística"
    );
    let solictudFormData = new FormData();
    solictudFormData.append("Tipo_Solicitud_Id", tipo_Id.value.value);
    solictudFormData.append("Descripcion", solicitud.value.descripcion);
    solictudFormData.append("Area_Solicitud_Id", parseInt(area_Id.value));
    solictudFormData.append("Fecha_Creacion", solicitud.value.fecha_Creacion);
    solictudFormData.append("Tipo_Recepcion", solicitud.value.tipo_Recepcion);
    solictudFormData.append("Solicitante_Id", solicitud.value.solicitante_Id);
    if (inventario_Ticket.value.id != null) {
      if (tipo_Id.value.label != "Solicitudes") {
        solictudFormData.append(
          "Inventario_Id",
          inventario_Ticket.value.inventario_Id
        );
      } else {
        await inventarioStore.delete_Inventario_By_Ticket(
          inventario_Ticket.value.id
        );
      }
    }
    let resp = await misSolicitudesStore.update_Solicitud_Ticket(
      solicitud.value.id,
      solictudFormData
    );
    if (resp.success) {
      actualizarModal(false);
      ticketsSolicitudesStore.actualizarModal(false);
      ticketsSolicitudesStore.actualizarModalSolicitud(false);
      await ticketsSolicitudesStore.load_Solicitudes_Tickets();
      await ticketsSolicitudesStore.load_Solicitudes();
      alertNotify("top-right", "positive", "Se hizo el cambio correctamente");
    } else {
      alertNotify("top-right", "negative", resp.data);
    }
    $q.loading.hide();
  });
};
</script>
