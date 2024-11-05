<template>
  <q-dialog
    v-model="modal_Sub"
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
          SUBCATEGORÍAS
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
                readonly
                color="purple-ieen"
                label="Título"
                v-model="categoria.titulo"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pb-lg">
              <q-input
                readonly
                color="purple-ieen"
                label="Descripción"
                v-model="categoria.descripcion"
              />
            </div>
            <div
              v-if="categoria.id != null"
              class="col-12 text-center text-bold text-subtitle1 text-gray-ieen-1"
            >
              AGREGAR SUBCATEGORÍA
            </div>
            <div
              v-if="categoria.id != null"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-input
                color="purple-ieen"
                label="Título subcategoría"
                hint="Título de la subcategoría"
                v-model="subcategoria.titulo"
              />
            </div>
            <div
              v-if="categoria.id != null"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12 q-pb-lg"
            >
              <q-input
                color="purple-ieen"
                label="Descripción subcategoría"
                hint="Descripción de la subcategoría"
                v-model="subcategoria.descripcion"
              />
            </div>
            <div v-if="categoria.id != null" class="col-12 q-pt-md q-pr-sm">
              <div class="text-right">
                <q-btn
                  type="submit"
                  :icon-right="subcategoria.id != null ? 'edit' : 'add'"
                  :label="subcategoria.id != null ? 'Editar' : 'Agregar'"
                  color="secondary"
                />
              </div>
            </div>
            <div class="col-12" v-if="categoria.id != null">
              <TablaSubCategorias />
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
import TablaSubCategorias from "./TablaSubCategorias.vue";

//---------------------------------------------------------------

const $q = useQuasar();
const categoriasStore = useCategoriasStore();
const { categoria, subcategoria, modal_Sub } = storeToRefs(categoriasStore);

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
  categoriasStore.actualizarModalSub(valor);
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
  subcategoria.value.categoria_Id = categoria.value.id;
  if (subcategoria.value.id != null) {
    resp = await categoriasStore.update_Subcategoria(subcategoria.value);
  } else {
    resp = await categoriasStore.createSubcategoria(subcategoria.value);
  }
  if (resp.success) {
    categoriasStore.initSubcategoria();
    await categoriasStore.load_Subcategorias(categoria.value.id);
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
