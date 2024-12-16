<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-grey-7 text-h6">Dashboard</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              icon="library_books"
              class="text-grey-7"
              label="Tablero"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-sm">
        <q-card flat bordered style="border-radius: 10px" class="my-card">
          <q-card-section>
            <div class="text-h6 text-bold text-grey-8">Tablero</div>
            La siguiente información corresponde a tickets y solicitudes
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 q-pa-sm">
        <q-card style="border-radius: 10px" flat bordered class="my-card">
          <q-card-section class="row">
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar
                    color="blue-grey"
                    text-color="white"
                    icon="leaderboard"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-blue-grey text-bold"
                    >Pendientes</q-item-label
                  >
                  <q-item-label class="text-bold text-grey-8">{{
                    list_Solicitudes_Tickets.filter(
                      (x) => x.estatus_Ticket == "Pendiente"
                    ).length
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar
                    color="blue-grey"
                    text-color="white"
                    icon="leaderboard"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-blue-grey text-bold"
                    >En proceso</q-item-label
                  >
                  <q-item-label class="text-bold text-grey-8">{{
                    list_Solicitudes_Tickets.filter(
                      (x) => x.estatus_Ticket == "En Proceso"
                    ).length
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar
                    color="blue-grey"
                    text-color="white"
                    icon="leaderboard"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-blue-grey text-bold"
                    >Concluido</q-item-label
                  >
                  <q-item-label class="text-bold text-grey-8">{{
                    list_Solicitudes_Tickets.filter(
                      (x) => x.estatus_Ticket == "Concluido"
                    ).length
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pl-md q-pr-md">
      <div class="text-center col-lg-4 col-md-4 col-sm-4 col-xs-6 q-pa-sm">
        <q-card flat bordered style="border-radius: 10px" class="my-card">
          <q-card-section>
            <div class="text-h6 text-grey-8 text-bold">
              Tipos de solicitudes
            </div>
          </q-card-section>
          <q-card-section>
            <ChartPie />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 q-pa-sm">
        <q-card flat bordered style="border-radius: 10px" class="my-card">
          <q-card-section v-if="list_Solicitudes_Trimestral.length > 0">
            <ChartGeneral />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-sm">
        <q-list bordered class="rounded-borders">
          <q-item-label header class="text-subtitle1 text-bold"
            >Personal UTIE</q-item-label
          >
          <q-item
            v-for="personal in list_Seguimiento_By_Personal"
            :key="personal"
          >
            <q-item-section avatar>
              <q-avatar icon="person" color="blue-grey" text-color="white">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1"> {{ personal.empleado }}</q-item-label>
              <q-item-label caption lines="2">
                {{ personal.puesto }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <p class="text-bold text-subtitle1">{{ personal.solicitudes }}</p>
            </q-item-section>
          </q-item>
          <q-separator inset="item" />
        </q-list>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 q-pa-sm">
        <TablaComp />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useTableroStore } from "src/stores/tablero-store";
import { useHerlpersStore } from "src/stores/helpers-store";
import { onBeforeMount, ref } from "vue";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import ChartPie from "../components/ChartPie.vue";
import TablaComp from "../components/TablaComp.vue";
import ChartGeneral from "src/modulos/tablero/components/ChartGeneral.vue";

//---------------------------------------------------------------

const tableroStore = useTableroStore();
const helpersStore = useHerlpersStore();
const tiposSolictudesStore = useTiposSolicitudesStore();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const { list_Personal_By_Area } = storeToRefs(helpersStore);
const { list_Solicitudes_Trimestral, list_Seguimiento_By_Personal } =
  storeToRefs(tableroStore);
const { list_Solicitudes_Tickets } = storeToRefs(ticketsSolicitudesStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolictudesStore);
const solicitudes_Tipos = ref([]);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const cargarData = async () => {
  await tableroStore.load_Solicitudes_Area();
  await helpersStore.load_Personal_By_Area(9);
  await ticketsSolicitudesStore.load_Solicitudes_Tickets();
  await tableroStore.load_Seguimiento_Personal();
  await tableroStore.load_Solicitudes_Trimestral();
  await tiposSolictudesStore.load_Tipos_Solicitudes();
  list_Tipos_Solicitudes.value.forEach((element) => {
    solicitudes_Tipos.value.push({
      nombre: element.label,
      numero: list_Solicitudes_Tickets.value.filter(
        (x) => x.tipo_Solicitud == element.label
      ).length,
    });
  });
};
</script>
