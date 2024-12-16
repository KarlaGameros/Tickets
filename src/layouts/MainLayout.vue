<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Sistema de Tickets y Solicitudes </q-toolbar-title>
        <q-badge rounded :color="onLine == true ? 'green' : 'red'" />
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="no_notificaciones > 0" color="red" floating>{{
            no_notificaciones > 5 ? "5+" : no_notificaciones
          }}</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <div
                class="q-pl-md q-pt-sm q-pb-sm q-pr-md text-bold text-h6 text-grey-9"
              >
                Notificaciones
              </div>
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3"
                      >{{ notificacion.mensaje }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    {{ notificacion.fecha_Registro }}
                    <q-badge
                      v-if="notificacion.leido == false"
                      color="blue"
                      rounded
                      class="q-mr-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <q-card
                class="text-center no-shadow no-border q-pa-sm"
                v-if="notificaciones.length == 0"
              >
                <div class="text-indigo-8 text-purple-ieen">
                  Sin notificaciones
                </div>
              </q-card>
              <q-separator />
              <q-card class="text-center no-shadow no-border q-pa-sm">
                <q-btn
                  label="Marcar todo como leido"
                  color="purple-ieen"
                  flat
                  class="text-indigo-8"
                  @click="marcarLeido"
                ></q-btn>
                <q-btn
                  flat
                  label="Ver todos"
                  color="purple-ieen"
                  class="text-indigo-8"
                  @click="toNotificaciones"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer
      :width="300"
      :breakpoint="1024"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-img
        class="absolute-top"
        src="~assets/FondoIEEN.png"
        style="height: 150px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a) <br />
            {{ usuario }}
          </div>
        </div>
      </q-img>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item
            :to="{ name: 'inicio' }"
            :content-inset-level="2"
            :header-inset-level="2"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>
          <q-expansion-item
            v-if="menuTicketList.some((element) => element == 'ST-REG-CAT')"
            expand-separator
            icon="construction"
            label="Configuración"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
            :header-inset-level="0"
            :content-inset-level="1"
          >
            <q-item
              :to="{ name: 'configuracion' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="chevron_right" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Categorías y Subcategorías</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              :to="{ name: 'tipo_Solicitudes' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="chevron_right" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tipos de tickets</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            v-if="menuTicketList.some((element) => element == 'ST-MIS-SOL')"
            expand-separator
            icon="confirmation_number"
            label="Tickets soporte"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
            :header-inset-level="0"
            :content-inset-level="1"
          >
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-MIS-SOL')"
              :to="{ name: 'mis_Tickets' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="checklist" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis solicitudes</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-TIC-KET')"
              :to="{ name: 'tickets' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="confirmation_number" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tickets</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey">
                  {{
                    list_Solicitudes_Tickets.filter(
                      (x) => x.estatus_Ticket == "Pendiente"
                    ).length
                  }}</q-badge
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-SEG-ACT')"
              :to="{ name: 'mis_Actividades' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="menu_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis actividades</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey">
                  {{
                    list_Seguimiento_Ticket.filter(
                      (x) => x.estatus != "Concluido"
                    ).length
                  }}</q-badge
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-SOL-CAN')"
              :to="{ name: 'cancelaciones' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solicitudes de cancelación</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey">
                  {{ list_Solicitudes_Cancelacion.length }}
                </q-badge>
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-HIS-INV')"
              :to="{ name: 'inventario' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="inventory" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Inventario</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-if="menuTicketList.some((element) => element == 'ST-TABLERO')"
              :to="{ name: 'tablero' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="bar_chart" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dashboard tickets</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            expand-separator
            icon="list"
            label="Solicitudes"
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
            :header-inset-level="0"
            :content-inset-level="1"
          >
            <q-item
              :to="{ name: 'mis_Solicitudes' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="checklist" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis solicitudes</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              :to="{ name: 'solicitudes' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="confirmation_number" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solicitudes</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey">
                  {{
                    list_Solicitudes.filter(
                      (x) => x.estatus_Ticket == "Pendiente"
                    ).length
                  }}
                </q-badge>
              </q-item-section>
            </q-item>

            <q-item
              :to="{ name: 'mis_Actividades_Solicitudes' }"
              :content-inset-level="2"
              :header-inset-level="2"
              class="text-grey-8 text-bold"
              active-class="text-purple-ieen"
            >
              <q-item-section avatar>
                <q-icon name="menu_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mis actividades</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="blue-grey">
                  {{
                    list_Seguimiento_Solicitud.filter(
                      (x) => x.estatus != "Concluido"
                    ).length
                  }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title>
          <div>&#169; Unidad Técnica de Informática y Estadística</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { urlSistemas } from "src/boot/axios";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { EncryptStorage } from "storage-encryption";
import { useTicketsSolicitudesStore } from "src/stores/tickets-solicitudes-store";
import { useNotifications } from "../helpers/signalRService";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotificacionStore } from "../stores/notificaciones-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useCancelacionesStore } from "src/stores/cancelaciones-store";

//---------------------------------------------------------------

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const ticketsSolicitudesStore = useTicketsSolicitudesStore();
const notificacionStore = useNotificacionStore();
const cancelacionesStore = useCancelacionesStore();
const {
  list_Solicitudes_Tickets,
  list_Seguimiento_Ticket,
  list_Solicitudes,
  list_Seguimiento_Solicitud,
} = storeToRefs(ticketsSolicitudesStore);
const { modulos, apps, sistemas } = storeToRefs(authStore);
const { list_Solicitudes_Cancelacion } = storeToRefs(cancelacionesStore);
const { notificaciones, no_notificaciones } = storeToRefs(notificacionStore);
const { startConnection, onReceiveNotification, onLine } = useNotifications();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const usuario = ref("");
const menuTicketList = ref([]);
const leftDrawerOpen = ref(false);

//---------------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//---------------------------------------------------------------

const cargarData = async () => {
  loading();
  if (route.query.key) {
    loading();
    encryptStorage.encrypt("key", route.query.key);
    const resp = await authStore.validar_Token(
      route.query.key,
      route.query.sistema
    );
    $q.loading.hide();
    if (resp.success == false) {
      encryptStorage.remove("key");
      window.location = "http://sistema.ieenayarit.org:9271?return=false";
    }
  }
  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }
  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
    usuario.value = encryptStorage.decrypt("usuario");
  } else {
    if (encryptStorage.decrypt("usuario") != null) {
      usuario.value = encryptStorage.decrypt("usuario");
    }
  }
  usuario.value = encryptStorage.decrypt("empleado");
  await loadMenu();
  await notificacionStore.loadNotificaciones();
  await notificacionStore.loadNotificacionesAll();
  conectar_signalr();
  $q.loading.hide();
};

const conectar_signalr = async () => {
  await startConnection();
  onReceiveNotification();
};

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

const loadMenu = async () => {
  loading();
  await authStore.load_Modulos();
  await authStore.load_Sistemas();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "ST-REG-CAT":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-MIS-SOL":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-SEG-ACT":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-TIC-KET":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-SOL-CAN":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-HIS-INV":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      case "ST-TABLERO":
        menuTicketList.value.push(element.siglas_Modulo);
        break;
      default:
        break;
    }
  });
  if (menuTicketList.value.some((element) => element == "ST-TIC-KET")) {
    await ticketsSolicitudesStore.load_Solicitudes_Tickets();
    await ticketsSolicitudesStore.load_Seguimiento_Ticket();
  }
  $q.loading.hide();
};

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      window.location = `${urlSistemas}:9271?return=false`;
    } else if (action.label == "Ir a universo") {
      window.location = `${urlSistemas}:9271?return=true`;
    } else {
      window.location = `${urlSistemas}:${
        action.url.split(":")[2]
      }/#/?key=${encryptStorage.decrypt("key")}&sistema=${
        action.id
      }&usr=${encryptStorage.decrypt("usuario")}`;
    }
  });
};

const detalle = async (row) => {
  loading();
  let resp = await notificacionStore.leerNotificacion(row.id);
  if (resp.success == true) {
    await notificacionStore.loadNotificaciones();
  }
  let url = sistemas.value.find((x) => x.value == row.sistema_Id);
  if (row.sistema_Id == encryptStorage.decrypt("sistema")) {
    router.push({
      name: "mis_Solicitudes",
    });
  } else {
    window.location =
      url.url +
      `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
        row.sistema_Id
      }&usr=${encryptStorage.decrypt("usuario")}`;
  }
  $q.loading.hide();
};

const marcarLeido = async () => {
  let resp = await notificacionStore.leerTodas();
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
    await notificacionStore.loadNotificaciones();
    await notificacionStore.loadNotificacionesAll();
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  }
};

const toNotificaciones = () => {
  router.push({
    name: "notificaciones",
  });
};

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>
