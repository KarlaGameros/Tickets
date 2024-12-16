<template>
  <q-dialog
    v-model="modal_Archivo"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 600px; max-width: 40vw">
      <q-card-section class="row flotante">
        <div
          v-if="solicitud.archivo_Firmado_URL != null"
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          Ticket concluido <br />
          <p class="text-purple-ieen">{{ solicitud.folio }}</p>
        </div>
        <div
          v-else
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          Subir vale firmado<br />
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
        <q-form @submit="onSubmit" class="row q-col-gutter-sm">
          <div
            v-if="solicitud.archivo_Firmado_URL != null"
            class="text-subtitle1"
          >
            <b>Nota de conclusión:</b>
            {{ solicitud.observaciones }}
          </div>
          <div v-if="solicitud.archivo_Firmado_URL == null" class="col-12">
            <q-file
              color="purple-ieen"
              accept=".jpg, image/*, .pdf"
              hint="Subir archivo firmado"
              lazy-rules
              :rules="[(val) => !!val || 'El archivo es requerido']"
              v-model="archivo"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div v-if="solicitud.archivo_Firmado_URL != null" class="col-12">
            <iframe
              :src="solicitud.archivo_Firmado_URL"
              width="100%"
              height="550"
            ></iframe>
          </div>
          <div class="col-12 flotanteFooter">
            <div class="text-right">
              <q-btn
                label="Cerrar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="solicitud.archivo_Firmado_URL == null"
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
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { modal_Archivo } = storeToRefs(ticketsSolicitudesStore);
const { solicitud } = storeToRefs(misSolicitudesStore);
const archivo = ref(null);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  misSolicitudesStore.initSolicitud();
  ticketsSolicitudesStore.actualizarModalArchivo(valor);
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
  let archivoFormData = new FormData();
  archivoFormData.append("Archivo", archivo.value);
  let resp = await ticketsSolicitudesStore.subir_Archivo_Firmado(
    solicitud.value.id,
    archivoFormData
  );
  if (resp.success) {
    await ticketsSolicitudesStore.load_Solicitudes_Tickets();
    await ticketsSolicitudesStore.load_Solicitudes();
    actualizarModal(false);
    alertNotify("top-right", "positive", resp.data);
  } else {
    alertNotify("center", "warning", resp.data);
  }
  $q.loading.hide();
};
</script>
