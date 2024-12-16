import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useConCopiaStore = defineStore("useConCopiaStore", {
  state: () => ({
    copia: {
      solicitud_Id: null,
      empleado_Id: null,
    },
    list_Con_Copia: [],
    list_Con_Copia_By_Empleado: [],
  }),
  actions: {
    initCopia() {
      this.copia.empleado_Id = null;
      this.copia.solicitud_Id = null;
    },

    //---------------------------------------------------------------
    //GET CON COPIA
    async load_Con_Copia_By_Empleado() {
      try {
        this.list_Con_Copia_By_Empleado = [];
        let resp = await api.get("/T_Solicitudes/Mis_Solicitudes");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              let list = data[1].solicitudes.map((item) => {
                return {
                  solicitud_Ticket_Id: item.id,
                  lectura: true,
                  categoria: item.categoria,
                  opiniones: item.opiniones,
                  prioridad: item.prioridad,
                  capturista: item.capturista,
                  estatus: item.estatus_Ticket,
                  titulo_Actividad_Realizada: item.descripcion,
                  solicitante: item.solicitante,
                  categoria_Id: item.categoria_Id,
                  subcategoria: item.subcategoria,
                  seguimientos: item.seguimientos,
                  observaciones: item.observaciones,
                  capturista_Id: item.capturista_Id,
                  folio_Solicitud_Ticket: item.folio,
                  area_Solicitud: item.area_Solicitud,
                  tipo_Recepcion: item.tipo_Recepcion,
                  tipo_Solicitud: item.tipo_Solicitud,
                  fecha_Creacion: item.fecha_Creacion,
                  empleado_Asigna_Ticket_Puesto:
                    item.empleado_Asigna_Ticket_Puesto,
                  responsable_Ticket_Puesto_Id:
                    item.responsable_Ticket_Puesto_Id,
                  fecha_Fin_Seguimiento: item.fecha_Fin,
                  estatus_Interno: item.estatus_Interno,
                  subcategoria_Id: item.subcategoria_Id,
                  capturista_Area: item.capturista_Area,
                  fecha_Inicio_Seguimiento: item.fecha_Inicio,
                  solicitante_Id: item.solicitante_Id,
                  empleado_Asigna_Ticket_Area: item.empleado_Asigna_Ticket_Area,
                  solicitante_Area: item.solicitante_Area,
                  capturista_Puesto: item.capturista_Puesto,
                  area_Solicitud_Id: item.area_Solicitud_Id,
                  tipo_Solicitud_Id: item.tipo_Solicitud_Id,
                  capturista_Area_Id: item.capturista_Area_Id,
                  solicitante_Puesto: item.solicitante_Puesto,
                  empleado_Seguimiento: item.responsable_Ticket,
                  archivo_Firmado_URL: item.archivo_Firmado_URL,
                  solicitante_Area_Id: item.solicitante_Area_Id,
                  capturista_Puesto_Id: item.capturista_Puesto_Id,
                  responsable_Ticket_Id: item.responsable_Ticket_Id,
                  solicitante_Puesto_Id: item.solicitante_Puesto_Id,
                  empleado_Asigna_Ticket: item.empleado_Asigna_Ticket,
                  seguimientos_Pendientes: item.seguimientos_Pendientes,
                  empleado_Asigna_Area_Id: item.empleado_Asigna_Area_Id,
                  responsable_Ticket_Area: item.responsable_Ticket_Area,
                  responsable_Ticket_Puesto: item.responsable_Ticket_Puesto,
                  empleado_Asigna_Puesto_Id: item.empleado_Asigna_Puesto_Id,
                  empleado_Asigna_Ticket_Id: item.empleado_Asigna_Ticket_Id,
                  responsable_Ticket_Area_Id: item.responsable_Ticket_Area_Id,
                };
              });
              this.list_Con_Copia_By_Empleado = list
                .filter(
                  (x) =>
                    x.tipo_Solicitud == "Solicitudes" &&
                    x.empleado_Seguimiento != null
                )
                .sort((a, b) => b.id - a.id);
            }
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //LOAD CON COPIA
    async load_Con_Copia() {
      try {
        const resp = await api.get("/T_Con_Copia");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Con_Copia = data.map((area) => {
                return {
                  label: area.label,
                  value: area.value,
                  puesto: area.puesto,
                };
              });
            }
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //CREATE CON COPIA
    async create_Con_Copia(copia) {
      try {
        const resp = await api.post("/T_Con_Copia", copia);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (e) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //DELETE COPIA
    async eliminar_Con_Copia(id) {
      try {
        const resp = await api.delete(`/T_Con_Copia/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //LOAD CON COPIA BY SOLICITUD
    async load_Con_Copia_By_Solicitud(id) {
      try {
        const resp = await api.get(`/T_Con_Copia/BySolicitud/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Con_Copia = data.map((item) => {
                return {
                  id: item.id,
                  fecha: item.fecha,
                  empleado: item.empleado,
                  empleado_Id: item.empleado_Id,
                  solicitud_Id: item.solicitud_Id,
                  folio_Solicitud: item.folio_Solicitud,
                };
              });
            }
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
