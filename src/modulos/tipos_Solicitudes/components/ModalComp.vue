<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
        <div
          class="text-h5 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{
            is_Editar ? "EDITAR TIPO DE SOLICITUD" : "CREAR TIPO DE SOLICITUD"
          }}
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
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                color="purple-ieen"
                label="Nombre"
                hint="Nombre del tipo de solicitud"
                v-model="tipo.nombre"
                lazy-rules
                :rules="[(val) => !!val || 'El nombre es requerida']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pb-lg">
              <q-input
                color="purple-ieen"
                label="Descripción"
                hint="Descripción del tipo de solicitud"
                v-model="tipo.descripcion"
                lazy-rules
                :rules="[(val) => !!val || 'La descripcion es requerida']"
              />
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
                icon-right="save"
                :label="is_Editar ? 'Editar' : 'Guardar'"
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
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//---------------------------------------------------------------

const $q = useQuasar();
const tipoSolicitudesStore = useTiposSolicitudesStore();
const { tipo, modal, is_Editar } = storeToRefs(tipoSolicitudesStore);

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

const actualizarModal = (valor) => {
  tipoSolicitudesStore.initTipo();
  tipoSolicitudesStore.actualizarModal(valor);
  tipoSolicitudesStore.updateEditar(valor);
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
  let resp = null;
  if (is_Editar.value) {
    resp = await tipoSolicitudesStore.update_Tipo_Solicitud(tipo.value);
  } else {
    resp = await tipoSolicitudesStore.create_Tipo_Solicitud(tipo.value);
  }
  if (resp.success) {
    actualizarModal(false);
    await tipoSolicitudesStore.load_Tipos_Solicitudes();
    $q.loading.hide();
    alertNotify("top-right", "positive", resp.data);
  } else {
    $q.loading.hide();
    alertNotify("top-right", "negative", resp.data);
  }
};
</script>
