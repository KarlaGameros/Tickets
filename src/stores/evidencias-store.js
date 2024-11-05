import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEvidenciasStore = defineStore("useEvidenciasStore", {
  state: () => ({
    evidencia: {
      tipo: null,
      evidencia: null,
      descripcion: null,
      solicitud_Ticket_Id: null,
      detalle_Solicitud_Ticket_Id: null,
    },
    list_Evidencias_Ticket: [],
    list_Evidencias_Ticket_Detalle: [],
  }),
  actions: {
    initEvidencia() {
      this.evidencia.id = null;
      this.evidencia.tipo = null;
      this.evidencia.evidencia = null;
      this.evidencia.descripcion = null;
      this.evidencia.solicitud_Ticket_Id = null;
      this.evidencia.detalle_Solicitud_Ticket_Id = null;
    },
    //---------------------------------------------------------------
    //GET EVIDENCIAS BY SOLICITUD
    async load_Evidencias_By_Ticket(id) {
      try {
        const resp = await api.get(`/T_Evidencias/ByTicket/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              let list = data.map((item) => {
                return {
                  id: item.id,
                  tipo: item.tipo,
                  descripcion: item.descripcion,
                  evidencia_URL: item.evidencia_URL,
                  solicitud_Ticket_Id: item.solicitud_Ticket_Id,
                  detalle_Solicitud_Ticket_Id: item.detalle_Solicitud_Ticket_Id,
                };
              });
              this.list_Evidencias_Ticket = list.filter(
                (x) => x.tipo == "Ticket"
              );
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
    //GET EVIDENCIAS BY DETALLE
    async load_Evidencias_Seguimiento_By_Ticket(id) {
      try {
        this.list_Evidencias_Ticket_Detalle = [];
        const resp = await api.get(
          `/T_Evidencias/BySeguimiento(Detalle)/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Evidencias_Ticket_Detalle = data.map((item) => {
                return {
                  id: item.id,
                  tipo: item.tipo,
                  descripcion: item.descripcion,
                  evidencia_URL: item.evidencia_URL,
                  solicitud_Ticket_Id: item.solicitud_Ticket_Id,
                  detalle_Solicitud_Ticket_Id: item.detalle_Solicitud_Ticket_Id,
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
    //POST EVIDENCIS
    async create_Evidencia_Ticket(evidencia) {
      try {
        const resp = await api.post("/T_Evidencias", evidencia, {
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
    //ADD EVIDENCIAS
    async add_Evidencias_Ticket(
      id_Ticket,
      id_Seguimiento,
      file,
      descripcion,
      tipo
    ) {
      try {
        if (this.list_Evidencias_Ticket.length == 4) {
          return {
            success: false,
            data: "Solo es posible subir maximo 4 evidencias",
          };
        } else {
          let id = 0;
          if (this.list_Evidencias_Ticket.length > 0) {
            let newList = [...this.list_Evidencias_Ticket];
            let ultimo = newList.pop();
            id = ultimo.id;
          }
          this.list_Evidencias_Ticket.push({
            id: id + 1,
            solicitud_Ticket_Id: id_Ticket,
            detalle_Solicitud_Ticket_Id: id_Seguimiento,
            tipo: tipo,
            descripcion: descripcion,
            evidencia: file,
            evidencia_Name: file.name,
          });
          return { success: true, data: "Se guardó con exito" };
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //DELETE EVIDENCIAS
    async eliminar_Evidencia(id, editar) {
      try {
        if (!editar) {
          let nIndex = this.list_Evidencias_Ticket.findIndex((x) => x.id == id);
          this.list_Evidencias_Ticket.splice(nIndex, 1);
          return { success: true, data: "Se elimino de la lista" };
        } else {
          const resp = await api.delete(`/T_Evidencias/${id}`);
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
