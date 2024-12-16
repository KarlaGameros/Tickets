<template>
  <q-dialog
    v-model="modal_Nota"
    persistent
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card style="width: 500px; max-width: 50vw">
      <q-card-section class="row">
        <q-img
          src="../../../assets/IEEN300.png"
          :width="$q.screen.xs ? '60px' : '90px'"
        />
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div
          class="col-12 text-subtitle1 q-pb-md text-red text-bold text-center"
        >
          El tamaño del archivo excede el tamaño maximo permitido
        </div>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="purple-ieen" name="looks_one" />
            </q-item-section>

            <q-item-section
              >El tamaño maximo permitido son 10 megas</q-item-section
            >
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="purple-ieen" name="looks_two" />
            </q-item-section>

            <q-item-section
              >Puede subir el archivo a Drive y compartir el
              link</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";

const misSolicitudesStore = useMisSolicitudesStore();
const { modal_Nota } = storeToRefs(misSolicitudesStore);
</script>

<style></style>
