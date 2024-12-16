import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCancelacionesStore = defineStore("useCancelacionesStore", {
  state: () => ({
    list_Solicitudes_Cancelacion: [],
  }),
  actions: {
    //---------------------------------------------------------------
    //CANCELAR SOLICITUD
    async cancelarSolicitud(solicitud) {
      try {
        const resp = await api.post("/T_Solicitudes_Cancelacion", solicitud, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
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
    //SOLICITUDES DE CANCELACIÓN
    async load_Solicitudes_Cancelacion() {
      try {
        const resp = await api.get("/T_Solicitudes_Cancelacion");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Solicitudes_Cancelacion = data.map((item) => {
                return {
                  id: item.id,
                  motivo: item.motivo,
                  estatus: item.estatus,
                  solicitante: item.solicitante,
                  solicitante_Id: item.solicitante_Id,
                  fecha_Creacion: item.fecha_Creacion,
                  fecha_Aprobacion: item.fecha_Aprobacion,
                  empleado_Aprueba: item.empleado_Aprueba,
                  solicitud_Ticket_Id: item.solicitud_Ticket_Id,
                  empleado_Aprueba_Id: item.empleado_Aprueba_Id,
                  folio_Solicitud_Ticket: item.folio_Solicitud_Ticket,
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
    //APROBAR SOLICITUD DE CANCELACIÓN
    async aprobarSolicitudCancelacion(id, aprobado) {
      try {
        const resp = await api.get(
          `/T_Solicitudes_Cancelacion/Aprobar/${id}?Aprobado=${aprobado}`
        );
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
  },
});
