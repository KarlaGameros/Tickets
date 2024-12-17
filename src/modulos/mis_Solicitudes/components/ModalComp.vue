<template>
  <q-dialog
    v-model="modal_Solicitudes"
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
          class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{
            is_Editar
              ? "EDITAR SOLICITUD"
              : is_Visualizar
              ? "VER SOLICITUD"
              : "CREAR SOLICITUD"
          }}
          <br />
          <p
            v-if="solicitud.id != null"
            class="text-subtitle1 text-bold text-purple-ieen"
          >
            {{ solicitud.folio }}
          </p>
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
            <div class="col-12" v-if="is_Editar || is_Visualizar">
              <q-badge
                :color="
                  solicitud.estatus_Ticket == 'Pendiente'
                    ? 'orange'
                    : solicitud.estatus_Ticket == 'Cancelado'
                    ? 'red'
                    : 'green'
                "
              >
                {{ solicitud.estatus_Ticket }}
                <q-icon
                  :name="
                    solicitud.estatus_Ticket == 'Pendiente'
                      ? 'warning'
                      : solicitud.estatus_Ticket == 'Cancelado'
                      ? 'close'
                      : 'done'
                  "
                />
              </q-badge>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                :readonly="is_Visualizar || perfil_Personal"
                v-model="area_Id"
                :options="list_Areas"
                label="Área del solicitante"
                hint="Seleccione un área"
                lazy-rules
                :rules="[(val) => !!val || 'El área es requerida']"
                color="purple-ieen"
              >
                <template v-slot:prepend>
                  <q-icon color="purple-ieen" name="apartment" />
                </template>
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                :readonly="!area_Informatica || is_Visualizar"
                color="purple-ieen"
                label="Fecha"
                hint="Fecha de la solicitud"
                v-model="currentDate"
              >
                <template v-slot:prepend>
                  <q-icon name="calendar_today" color="purple-ieen">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        :disable="!area_Informatica || is_Visualizar"
                        color="purple-ieen"
                        v-model="currentDate"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="purple-ieen"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append v-if="area_Informatica">
                  <q-icon
                    color="purple-ieen"
                    name="access_time"
                    class="cursor-pointer"
                  >
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        :disable="is_Visualizar"
                        color="purple-ieen"
                        v-model="currentDate"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="purple-ieen"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-select
                :readonly="is_Visualizar || perfil_Personal"
                color="purple-ieen"
                v-model="personal_Id"
                :options="list_Personal_By_Area"
                label="Solicitante"
                hint="Seleccione una opción"
                lazy-rules
                :rules="[(val) => !!val || 'El solicitante es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon color="purple-ieen" name="person" />
                </template>
              </q-select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <q-input
                color="purple-ieen"
                label="Puesto"
                hint="Puesto del solictante"
                readonly
                v-model="puesto"
              />
            </div>
            <div
              :class="
                !perfil_Personal
                  ? 'col-lg-6 col-md-6 col-sm-6 col-xs-12'
                  : 'col-12'
              "
            >
              <q-select
                :readonly="is_Visualizar"
                v-model="area_Solicitud_Id"
                :options="list_Areas"
                label="Área para atender la solicitud"
                hint="Seleccione un área"
                lazy-rules
                :rules="[(val) => !!val || 'El área es requerida']"
                color="purple-ieen"
              >
                <template v-slot:prepend>
                  <q-icon color="purple-ieen" name="apartment" />
                </template>
                <template v-slot:after>
                  <q-icon name="help" flat color="grey">
                    <q-tooltip>Área que atenderá la solicitud</q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>
            <div
              v-if="!perfil_Personal"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-select
                :readonly="is_Visualizar || perfil_Personal"
                color="purple-ieen"
                v-model="recepcion_Id"
                :options="list_Recepcion"
                label="Tipo de recepción"
                hint="Seleccione un tipo de recepción"
                lazy-rules
                :rules="[(val) => !!val || 'El tipo es requerido']"
              />
            </div>
            <div class="col-12 q-pt-md">
              <q-input
                :readonly="is_Visualizar"
                label="Motivo de la solicitud"
                v-model="solicitud.descripcion"
                color="purple-ieen"
                type="textarea"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon color="purple-ieen" name="edit_note" />
                </template>
              </q-input>
            </div>
            <div
              class="col-12 q-pt-sm text-center text-bold text-h6 text-purple-ieen"
            >
              EVIDENCIAS
            </div>
            <div
              v-if="!is_Visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-file
                bottom-slots
                label="Cargar anexos"
                v-model="evidencia"
                color="purple-ieen"
                max-file-size="10485760"
                @rejected="onRejected"
              >
                <template v-slot:prepend>
                  <q-icon
                    color="purple-ieen"
                    name="attach_file"
                    @click.stop.prevent
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop.prevent="evidencia = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file>
            </div>
            <div
              v-if="!is_Visualizar"
              class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
            >
              <q-input
                color="purple-ieen"
                label="Descripción"
                v-model="descripcion_Evidencia"
              />
            </div>
            <div
              v-if="!is_Visualizar && evidencia != null"
              class="col-12 text-right q-pb-xs"
            >
              <q-btn
                label="Agregar evidencias"
                size="sm"
                icon-right="add"
                color="secondary"
                @click="agregarEvidencia"
              />
            </div>
            <div class="col-12">
              <q-table
                :rows="list_Evidencias_Ticket"
                :columns="columns"
                row-key="name"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <div v-if="col.name == 'id'">
                        <q-btn
                          v-if="solicitud.id != null"
                          flat
                          round
                          color="purple-ieen"
                          icon="visibility"
                          @click="verEvidencia(props.row.evidencia_URL)"
                        >
                          <q-tooltip>Ver evidencia</q-tooltip>
                        </q-btn>
                        <q-btn
                          v-if="!is_Visualizar"
                          flat
                          round
                          color="red"
                          icon="delete"
                          @click="eliminarEvidencia(props.row)"
                        >
                          <q-tooltip>Eliminar evidencia</q-tooltip>
                        </q-btn>
                      </div>
                      <label v-else>{{ col.value }}</label>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
          <br />
          <div class="col-12 flotanteFooter">
            <div class="text-right">
              <q-btn
                label="Cerrar"
                type="reset"
                color="red"
                icon-right="close"
                @click="actualizarModal(false)"
              />
              <q-btn
                v-if="!is_Visualizar"
                icon-right="save"
                label="Guardar"
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
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { EncryptStorage } from "storage-encryption";
import { useHerlpersStore } from "src/stores/helpers-store";
import { useEvidenciasStore } from "src/stores/evidencias-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useTiposSolicitudesStore } from "src/stores/tipo_solicitudes-store";
import { useQuasar, QSpinnerFacebook, date } from "quasar";

//---------------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const helpersStore = useHerlpersStore();
const evidenciasStore = useEvidenciasStore();
const tiposSolicitudesStore = useTiposSolicitudesStore();
const misSolicitudesStore = useMisSolicitudesStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { usuario } = storeToRefs(authStore);
const { list_Tipos_Solicitudes } = storeToRefs(tiposSolicitudesStore);
const { modal_Solicitudes, solicitud, is_Visualizar, is_Editar } =
  storeToRefs(misSolicitudesStore);
const { list_Evidencias_Ticket } = storeToRefs(evidenciasStore);
const { list_Areas, list_Personal_By_Area } = storeToRefs(helpersStore);
const puesto = ref(null);
const area_Id = ref(null);
const evidencia = ref(null);
const list_Recepcion = ref([
  "Correo electrónico",
  "Teléfono",
  "Sistema",
  "Oficio",
]);
const personal_Id = ref(null);
const recepcion_Id = ref(null);
const area_Solicitud_Id = ref(null);
const descripcion_Evidencia = ref(null);
const inventario_Id = ref({ value: 0, label: "Ninguno" });
const perfil_Personal = ref(
  encryptStorage.decrypt("perfil") == "Personal" ? true : false
);
const timeStamp = Date.now();
const currentDate = ref(date.formatDate(timeStamp, "YYYY-MM-DD HH:mm:ss"));
const area_Informatica = ref(
  encryptStorage.decrypt("area") ==
    "Unidad Técnica de Informática y Estadística"
    ? true
    : false
);

//---------------------------------------------------------------

watch(modal_Solicitudes, (val) => {
  if (val == true) {
    cargarData();
  }
});

watch(solicitud.value, (val) => {
  if (val.id != null) {
    cargarArea(val);
    recepcion_Id.value = val.tipo_Recepcion;
    if (val.fecha_Creacion != null) {
      currentDate.value = val.fecha_Creacion;
    }
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    personal_Id.value = null;
    puesto.value = null;
    cargarPersonal(val.value);
  }
});

watch(personal_Id, (val) => {
  if (val != null) {
    puesto.value = val.puesto;
  }
});

//---------------------------------------------------------------

const cargarData = async () => {
  loading();
  await helpersStore.load_Areas();
  await authStore.get_Empleado_By_Usuario();
  await tiposSolicitudesStore.load_Tipos_Solicitudes();
  if (perfil_Personal.value) {
    cargarArea(usuario.value);
  }
  $q.loading.hide();
};

const cargarPersonal = async (id) => {
  loading();
  await helpersStore.load_Personal_By_Area(id);
  $q.loading.hide();
};

const cargarArea = async (val) => {
  await helpersStore.load_Areas();
  if (area_Id.value == null) {
    let areaFiltrado = list_Areas.value.find(
      (x) => x.value == val.solicitante_Area_Id
    );
    area_Id.value = areaFiltrado;
    cargarSolicitante(val);
  }
  if (area_Solicitud_Id.value == null) {
    let areaFiltrado = list_Areas.value.find(
      (x) => x.value == val.area_Solicitud_Id
    );
    area_Solicitud_Id.value = areaFiltrado;
  }
};

const cargarSolicitante = async (val) => {
  await helpersStore.load_Personal_By_Area(val.solicitante_Area_Id);
  if (personal_Id.value == null) {
    let personalFiltrado = list_Personal_By_Area.value.find(
      (x) => x.value == val.solicitante_Id
    );
    personal_Id.value = personalFiltrado;
  }
};

const verEvidencia = (url) => {
  $q.dialog({
    title: "Ver",
    style: "width: 800px; max-width: 80vw",
    message: `<iframe
            src="${url}"
            width="100%"
            height="650"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const agregarEvidencia = async () => {
  if (evidencia.value == null) {
    alertNotify("center", "warning", "No subió evidencia");
  } else if (list_Evidencias_Ticket.value.length == 4) {
    alertNotify("center", "warning", "Solo puede subir 4 evidencias");
  } else {
    let resp = null;
    if (solicitud.value.id != null) {
      let evidenciaFormData = new FormData();
      evidenciaFormData.append("Solicitud_Ticket_Id", solicitud.value.id);
      evidenciaFormData.append("Tipo", "Ticket");
      evidenciaFormData.append(
        "Descripcion",
        descripcion_Evidencia.value == null
          ? "Sin descripción"
          : descripcion_Evidencia.value
      );
      evidenciaFormData.append("Evidencia", evidencia.value);
      resp = await evidenciasStore.create_Evidencia_Ticket(evidenciaFormData);
    } else {
      resp = await evidenciasStore.add_Evidencias_Ticket(
        "",
        "",
        evidencia.value,
        descripcion_Evidencia.value,
        "Ticket"
      );
    }
    if (resp.success) {
      evidencia.value = null;
      descripcion_Evidencia.value = null;
      if (solicitud.value.id != null) {
        await evidenciasStore.load_Evidencias_By_Ticket(solicitud.value.id);
      }
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("center", "warning", resp.data);
    }
  }
};

const eliminarEvidencia = async (row) => {
  $q.dialog({
    title: "Eliminar evidencia",
    message: "¿Está seguro de eliminar evidencia?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Eliminar",
    },
    cancel: {
      color: "red",
      label: "No, Regresar",
    },
  }).onOk(async () => {
    loading();
    let resp = await evidenciasStore.eliminar_Evidencia(
      row.id,
      is_Editar.value
    );
    if (resp.success) {
      if (is_Editar.value) {
        await evidenciasStore.load_Evidencias_By_Ticket(
          row.solicitud_Ticket_Id
        );
      }
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("top-right", "negative", resp.data);
    }
    $q.loading.hide();
  });
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

const limpiar = () => {
  puesto.value = null;
  area_Id.value = null;
  evidencia.value = null;
  personal_Id.value = null;
  recepcion_Id.value = null;
  area_Solicitud_Id.value = null;
  list_Evidencias_Ticket.value = [];
  misSolicitudesStore.initSolicitud();
  currentDate.value = date.formatDate(timeStamp, "YYYY/MM/DD HH:mm:ss");
};

const actualizarModal = (valor) => {
  misSolicitudesStore.updateIsEdit(valor);
  misSolicitudesStore.updateIsVisualize(valor);
  misSolicitudesStore.updateModalSolicitudes(valor);
  limpiar();
};

const onRejected = (rejectedEntries) => {
  // $q.notify({
  //   type: "negative",
  //   message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  // });
  misSolicitudesStore.actualizarModalNota(true);
};

const onSubmit = async () => {
  loading();
  let resp = null;

  let solictudFormData = new FormData();
  solictudFormData.append(
    "Tipo_Recepcion",
    perfil_Personal.value ? "Sistema" : recepcion_Id.value
  );
  solictudFormData.append("Solicitante_Id", personal_Id.value.value);
  solictudFormData.append("Descripcion", solicitud.value.descripcion);
  solictudFormData.append("Area_Solicitud_Id", area_Solicitud_Id.value.value);
  solictudFormData.append(
    "Tipo_Solicitud_Id",
    list_Tipos_Solicitudes.value.find((x) => x.label == "Solicitudes").value
  );
  solictudFormData.append(
    "Fecha_Creacion",
    date.formatDate(currentDate.value, "YYYY-MM-DD HH:mm:ss")
  );
  if (inventario_Id.value.value != 0)
    solictudFormData.append("Inventario_Id", inventario_Id.value.value);
  if (is_Editar.value) {
    resp = await misSolicitudesStore.update_Solicitud_Ticket(
      solicitud.value.id,
      solictudFormData
    );
  } else {
    resp = await misSolicitudesStore.create_Solicitud_Ticket(solictudFormData);
  }
  if (resp.success) {
    if (resp.id != null && list_Evidencias_Ticket.value.length > 0) {
      list_Evidencias_Ticket.value.forEach(async (element) => {
        let evidenciaFormData = new FormData();
        evidenciaFormData.append("Solicitud_Ticket_Id", resp.id);
        evidenciaFormData.append("Tipo", "Ticket");
        evidenciaFormData.append(
          "Descripcion",
          element.descripcion == null ? "Sin descripción" : element.descripcion
        );
        evidenciaFormData.append("Evidencia", element.evidencia);
        let respEvidencia = await evidenciasStore.create_Evidencia_Ticket(
          evidenciaFormData
        );
      });
    }

    if (resp.success) {
      alertNotify("top-right", "positive", resp.data);
    } else {
      alertNotify("center", "warning", resp.data);
    }
    await misSolicitudesStore.load_Mis_Solicitudes();
    actualizarModal(false);
    $q.loading.hide();
  } else {
    $q.loading.hide();
    alertNotify("top-right", "negative", resp.data);
  }
};

const columns = [
  {
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: "descripcion",
  },
  { name: "id", align: "center", label: "Acciones", field: "id" },
];
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
