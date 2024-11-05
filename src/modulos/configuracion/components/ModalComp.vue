<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row flotante">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
        <div
          class="text-h5 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{ is_Editar ? "EDITAR CATEGORÍA" : "CREAR CATEGORÍA" }}
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
                label="Título"
                hint="Título de la categorÍa"
                v-model="categoria.titulo"
                lazy-rules
                :rules="[(val) => !!val || 'E l título es requerido']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pb-lg">
              <q-input
                color="purple-ieen"
                label="Descripción"
                hint="Descripción de la categoría"
                v-model="categoria.descripcion"
                lazy-rules
                :rules="[(val) => !!val || 'La descripción es requerida']"
              />
            </div>
          </div>
          <div class="col-12 q-pt-md flotanteFooter">
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
import { useCategoriasStore } from "src/stores/categorias-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//---------------------------------------------------------------

const $q = useQuasar();
const categoriasStore = useCategoriasStore();
const { categoria, subcategoria, modal, is_Editar } =
  storeToRefs(categoriasStore);

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
  categoriasStore.initCategoria();
  categoriasStore.initSubcategoria();
  categoriasStore.actualizarModal(valor);
  categoriasStore.actualizarIsEditar(false);
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
    resp = await categoriasStore.update_Categoria(categoria.value);
  } else {
    resp = await categoriasStore.createCategoria(categoria.value);
  }
  if (resp.success) {
    actualizarModal(false);
    await categoriasStore.load_Categorias();
    $q.loading.hide();
    alertNotify("top-right", "positive", resp.data);
  } else {
    $q.loading.hide();
    alertNotify("top-right", "negative", resp.data);
  }
};
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
</style>
