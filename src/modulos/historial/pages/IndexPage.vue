<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Historial de tickets</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Concluidas"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp />
  </q-page>
</template>

<script setup>
import TablaComp from "../components/TablaComp.vue";
</script>
