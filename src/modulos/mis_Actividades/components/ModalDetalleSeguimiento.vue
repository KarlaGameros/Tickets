<template>
  <q-dialog
    v-model="modal_Detalle_Seguimiento"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 700px; max-width: 70vw">
      <q-card-section class="row">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
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
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-sm">
            <div class="col-12">
              <q-badge
                :color="seguimiento.estatus == 'Asignado' ? 'orange' : 'green'"
              >
                {{ seguimiento.estatus }}
                <q-icon
                  :name="seguimiento.estatus == 'Asignado' ? 'warning' : 'done'"
                />
              </q-badge>
            </div>
            <div class="col-12">
              <q-input
                readonly
                color="purple-ieen"
                label="Personal seguimiento"
                v-model="seguimiento.empleado_Seguimiento"
              />
            </div>
            <div class="col-12">
              <q-input
                readonly
                color="purple-ieen"
                label="Actividad por realizar"
                v-model="seguimiento.titulo_Actividad_Realizada"
              />
            </div>
            <div class="col-12">
              <label for="" class="text-grey-8">Observaciones</label>
              <q-editor
                :readonly="is_Visualizar"
                v-model="seguimiento.observaciones"
                :toolbar="[['unordered', 'ordered', 'outdent', 'indent']]"
              />
            </div>
            <div class="col-12 q-pt-lg">
              <q-separator />
            </div>
            <div
              class="col-12 text-center text-purple-ieen text-bold text-subtitle1"
            >
              EVIDENCIAS
            </div>
            <div
              v-if="seguimiento.estatus != 'Concluido' && !is_Visualizar"
              class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
            >
              <q-file color="purple-ieen" v-model="evidencia.evidencia">
                <template v-slot:prepend>
                  <q-icon name="attach_file" color="purple-ieen" />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="evidencia.evidencia = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div
              v-if="seguimiento.estatus != 'Concluido' && !is_Visualizar"
              class="col-lg-8 col-md-8 col-sm-12 col-xs-12"
            >
              <q-input
                lazy-rules
                color="purple-ieen"
                label="Descripción"
                v-model="evidencia.descripcion"
              />
            </div>
            <div
              v-if="seguimiento.estatus != 'Concluido' && !is_Visualizar"
              class="col-12 text-right"
            >
              <q-btn
                @click="agregarEvidencia"
                size="sm"
                icon-right="add"
                label="Agregar"
                color="secondary"
                class="q-ml-sm"
              />
            </div>
            <div class="col-12">
              <TablaEvidencias />
            </div>
          </div>
          <div class="col-12 q-pt-md">
            <div class="text-right">
              <q-btn
                label="Cerrar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="seguimiento.estatus != 'Concluido' && !is_Visualizar"
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
import { storeToRefs } from "pinia";
import { useTicketsStore } from "src/stores/tickets-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaEvidencias from "./TablaEvidencias.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const ticketsStore = useTicketsStore();
const evidenciasStore = useEvidenciasStore();
const { seguimiento, modal_Detalle_Seguimiento, is_Visualizar } =
  storeToRefs(ticketsStore);
const { evidencia, list_Evidencias_Ticket_Detalle } =
  storeToRefs(evidenciasStore);

const actualizarModal = (valor) => {
  ticketsStore.initSeguimiento();
  ticketsStore.actualizarVisualizar(valor);
  ticketsStore.actualizarModalDetalleSeguimiento(valor);
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

const agregarEvidencia = async () => {
  if (
    evidencia.value.evidencia == null ||
    evidencia.value.descripcion == null
  ) {
    alertNotify("center", "warning", "Campos vacíos");
  } else {
    loading();
    let resp = null;
    let evidenciaFormData = new FormData();
    evidenciaFormData.append(
      "Solicitud_Ticket_Id",
      seguimiento.value.solicitud_Ticket_Id
    );
    evidenciaFormData.append("Tipo", "Seguimiento");
    evidenciaFormData.append("Descripcion", evidencia.value.descripcion);
    evidenciaFormData.append("Evidencia", evidencia.value.evidencia);
    evidenciaFormData.append(
      "Detalle_Solicitud_Ticket_Id",
      seguimiento.value.id
    );
    resp = await evidenciasStore.create_Evidencia_Ticket(evidenciaFormData);
    if (resp.success) {
      evidenciasStore.initEvidencia();
      await evidenciasStore.load_Evidencias_Seguimiento_By_Ticket(
        seguimiento.value.id
      );
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("center", "warning", resp.data);
    }
    $q.loading.hide();
  }
};

const onSubmit = async () => {
  loading();
  let resp = null;
  resp = await ticketsStore.update_Detalle_Seguimienti(seguimiento.value);
  if (resp.success) {
    await ticketsStore.load_Seguimiento_By_Ticket(
      seguimiento.value.solicitud_Ticket_Id
    );
    alertNotify("top-right", "positive", resp.data);
    actualizarModal(false);
  } else {
    alertNotify("top-right", "negative", resp.data);
  }
  $q.loading.hide();
};
</script>
