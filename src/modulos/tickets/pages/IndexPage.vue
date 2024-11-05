<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Tickets</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Tickets"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <q-card class="q-ma-lg">
      <q-tabs
        dense
        v-model="tab"
        align="justify"
        class="text-grey"
        active-color="purple-ieen"
        indicator-color="purple-ieen"
      >
        <q-tab icon="pending" name="pendientes" label="Pendientes">
          <q-badge color="blue-grey" floating>{{
            list_Tickets_Filtro.filter((x) => x.estatus_Ticket == "Pendiente")
              .length
          }}</q-badge>
        </q-tab>
        <q-tab icon="engineering" name="en_Proceso" label="En Proceso">
          <q-badge color="blue-grey" floating>{{
            list_Tickets_Filtro.filter((x) => x.estatus_Ticket == "En Proceso")
              .length
          }}</q-badge>
        </q-tab>
        <q-tab icon="task_alt" name="concluidas" label="Concluidas" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="pendientes">
          <TablaComp :tipo="'pendientes'" />
        </q-tab-panel>
        <q-tab-panel name="en_Proceso">
          <TablaComp :tipo="'en_Proceso'" />
        </q-tab-panel>
        <q-tab-panel name="concluidas">
          <TablaComp :tipo="'concluidas'" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <ModalComp />
    <ModalArchivo />
    <ModalCategoriaComp />
    <ModalSubCategorias />
    <ModalDetalleSeguimiento />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTicketsStore } from "src/stores/tickets-store";
import ModalComp from "../components/ModalComp.vue";
import TablaComp from "../components/TablaComp.vue";
import ModalArchivo from "../components/ModalArchivo.vue";
import ModalCategoriaComp from "src/modulos/configuracion/components/ModalComp.vue";
import ModalSubCategorias from "src/modulos/configuracion/components/ModalSubCategorias.vue";
import ModalDetalleSeguimiento from "src/modulos/mis_Actividades/components/ModalDetalleSeguimiento.vue";

const ticketsStore = useTicketsStore();
const { list_Tickets_Filtro } = storeToRefs(ticketsStore);
const tab = ref("pendientes");
</script>
