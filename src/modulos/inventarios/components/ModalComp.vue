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
          INFORMACIÓN DE INVENTARIO
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
        <div class="row q-col-gutter-sm">
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Clave" v-model="inventario.clave" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              readonly
              label="Número de serie"
              v-model="inventario.numero_Serie"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              readonly
              label="Nombre corto"
              v-model="inventario.nombre_Corto"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              readonly
              label="Descripción"
              v-model="inventario.descripcion"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Marca" v-model="inventario.marca" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Modelo" v-model="inventario.modelo" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Color" v-model="inventario.color" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Estatus" v-model="inventario.estatus" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input readonly label="Catálogo" v-model="inventario.catalago" />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <q-input
              readonly
              label="Observaciones"
              v-model="inventario.observaciones"
            />
          </div>
          <div
            v-if="
              inventario.foto_1_URL != null ||
              inventario.foto_2_URL != null ||
              inventario.foto_3_URL != null ||
              inventario.foto_4_URL != null
            "
            class="col-12"
          >
            <q-carousel
              animated
              infinite
              swipeable
              thumbnails
              v-model="slide"
              v-model:fullscreen="fullscreen"
            >
              <q-carousel-slide
                v-if="inventario.foto_1_URL != null"
                :name="1"
                :img-src="inventario.foto_1_URL"
              />
              <q-carousel-slide
                v-if="inventario.foto_2_URL != null"
                :name="2"
                :img-src="inventario.foto_2_URL"
              />
              <q-carousel-slide
                v-if="inventario.foto_3_URL != null"
                :name="3"
                :img-src="inventario.foto_3_URL"
              />
              <q-carousel-slide
                v-if="inventario.foto_4_URL"
                :name="4"
                :img-src="inventario.foto_4_URL"
              />
              <template v-slot:control>
                <q-carousel-control position="bottom-right" :offset="[18, 18]">
                  <q-btn
                    push
                    round
                    dense
                    color="white"
                    text-color="primary"
                    :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="fullscreen = !fullscreen"
                  />
                </q-carousel-control>
              </template>
            </q-carousel>
          </div>
          <div
            class="col-12 text-center text-h6 text-bold q-pa-md text-purple-ieen"
          >
            <q-icon name="image" />
            Sin fotos
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
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useInventarioStore } from "src/stores/inventario-store";
//---------------------------------------------------------------

const $q = useQuasar();
const inventariosStore = useInventarioStore();
const { inventario, modal } = storeToRefs(inventariosStore);
const slide = ref(1);
const fullscreen = ref(false);

//---------------------------------------------------------------

const actualizarModal = (valor) => {
  inventariosStore.initInventario();
  inventariosStore.actualizarModal(valor);
};
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
</style>
