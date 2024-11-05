<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Mis actividades</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Mis solicitudes"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp />
    <ModalComp />
    <ModalDetalleSeguimiento />
  </q-page>
</template>

<script setup>
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalDetalleSeguimiento from "../components/ModalDetalleSeguimiento.vue";
</script>
