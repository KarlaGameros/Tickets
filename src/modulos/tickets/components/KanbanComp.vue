<template>
  <div class="row q-pa-lg">
    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 text-center q-pa-lg">
      <q-card flat>
        <div
          style="border-radius: 25px"
          class="flotante bg-amber text-white text-h6"
        >
          Pendiente de asignar
        </div>
        <q-scroll-area style="height: 600px">
          <q-card-section vertical align="center">
            <q-card class="my-card q-ma-sm" v-for="n in 3" :key="n" bordered>
              <q-badge class="absolute-left" color="amber" />
              <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">Soporte tecnico</q-item-label>
              </q-item-section>
              <q-item-section top>
                <q-item-label class="text-weight-medium q-pt-sm">
                  Área: Administración
                </q-item-label>
                <q-item-label caption>
                  Problema: Generic type parameter for props
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    @click="verSolicitud"
                    size="12px"
                    flat
                    dense
                    round
                    icon="visibility"
                  >
                    <q-tooltip>Ver solicitud</q-tooltip>
                  </q-btn>
                  <q-btn size="12px" flat dense round icon="add_circle" />
                </div>
              </q-item-section>
            </q-card>
          </q-card-section>
        </q-scroll-area>
        <br />
      </q-card>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 text-center q-pa-lg">
      <q-card flat>
        <div
          style="border-radius: 25px"
          class="flotante bg-orange text-white text-h6"
        >
          Asignado
        </div>
        <q-scroll-area style="height: 600px">
          <q-card-section vertical align="center">
            <q-card class="my-card q-ma-sm" v-for="n in 5" :key="n" bordered>
              <q-badge class="absolute-left" color="orange" />
              <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">Soporte tecnico</q-item-label>
              </q-item-section>
              <q-item-section top>
                <q-item-label class="text-weight-medium q-pt-sm">
                  Área: Administración
                </q-item-label>
                <q-item-label caption>
                  Problema: Generic type parameter for props
                </q-item-label>
                <q-item-label
                  class="q-mt-xs text-body2 text-weight-bold text-purple-ieen text-uppercase"
                >
                  <span class="cursor-pointer">Ver detalle </span>
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="add_circle" />
                  <q-btn size="12px" flat dense round icon="more_vert" />
                </div>
              </q-item-section>
            </q-card>
          </q-card-section>
        </q-scroll-area>
        <br />
      </q-card>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 text-center q-pa-lg">
      <q-card flat>
        <div
          style="border-radius: 25px"
          class="flotante bg-purple-ieen text-white text-h6"
        >
          Proceso
        </div>
        <q-scroll-area style="height: 600px">
          <q-card-section vertical align="center">
            <q-card class="my-card q-ma-sm" v-for="n in 6" :key="n" bordered>
              <q-badge class="absolute-left" color="purple-ieen" />
              <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm">Soporte tecnico</q-item-label>
              </q-item-section>
              <q-item-section top>
                <q-item-label class="text-weight-medium q-pt-sm">
                  Área: Administración
                </q-item-label>
                <q-item-label caption>
                  Problema: Generic type parameter for props
                </q-item-label>
                <q-item-label
                  class="q-mt-xs text-body2 text-weight-bold text-purple-ieen text-uppercase"
                >
                  <span class="cursor-pointer">Ver detalle </span>
                </q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="add_circle" />
                  <q-btn size="12px" flat dense round icon="more_vert" />
                </div>
              </q-item-section>
            </q-card>
          </q-card-section>
        </q-scroll-area>
        <br />
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useSolicitudesTicketStore } from "src/stores/mis-solicitudes-ticket";

const solicitudesTicketStore = useSolicitudesTicketStore();

const verSolicitud = () => {
  solicitudesTicketStore.actualizarModal(true);
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
