import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useTicketsSolicitudesStore = defineStore(
  "useTicketsSolicitudesStore",
  {
    state: () => ({
      modal: false,
      modal_Archivo: false,
      modal_Solicitud: false,
      modal_Seguimiento: false,
      modal_Cambiar_Solicitud: false,
      modal_Seguimiento_Solicitudes: false,
      modal_Detalle_Seguimiento: false,
      modal_Detalle_Seguimiento_Solicitudes: false,
      is_Visualizar: false,
      responsable: {
        prioridad: null,
        subcategoria_Id: null,
        tipo_Solicitud_Id: null,
        responsable_Ticket_Id: null,
      },
      sustituir_Responsable: {
        empleado_Nuevo_Id: null,
        solicitud_Ticket_Id: null,
        empleado_Anterior_Id: null,
      },
      seguimiento: {
        id: null,
        tipo: null,
        estatus: null,
        observaciones: "",
        solicitud_Ticket_Id: null,
        empleado_Seguimiento: null,
        fecha_Fin_Seguimiento: null,
        folio_Solicitud_Ticket: null,
        empleado_Seguimiento_Id: null,
        fecha_Inicio_Seguimiento: null,
        evidencia_Seguimiento_URL: null,
        titulo_Actividad_Realizada: null,
      },
      seguimiento_Sustituir: {
        id: null,
        tipo: null,
        observaciones: null,
        solicitud_Ticket_Id: null,
        empleado_Seguimiento_Id: null,
        titulo_Actividad_Realizada: null,
      },
      concluirSeguimiento: {
        id: null,
        observaciones: null,
      },
      list_Solicitudes: [],
      list_Tickets_Filtro: [],
      list_Seguimiento_Ticket: [],
      list_Solicitudes_Tickets: [],
      list_Seguimiento_Solicitud: [],
      list_Seguimiento_By_Ticket: [],
    }),
    actions: {
      actualizarModal(valor) {
        this.modal = valor;
      },

      actualizarModalSolicitud(valor) {
        this.modal_Solicitud = valor;
      },

      actualizarModalArchivo(valor) {
        this.modal_Archivo = valor;
      },

      actualizarModalSeguimiento(valor) {
        this.modal_Seguimiento = valor;
      },

      actualizarModalCambiarSolicitud(valor) {
        this.modal_Cambiar_Solicitud = valor;
      },

      actualizarModalSeguimientoSolicitudes(valor) {
        this.modal_Seguimiento_Solicitudes = valor;
      },

      actualizarModalDetalleSeguimiento(valor) {
        this.modal_Detalle_Seguimiento = valor;
      },

      actualizarModalDetalleSeguimientoSolicitudes(valor) {
        this.modal_Detalle_Seguimiento_Solicitudes = valor;
      },

      actualizarVisualizar(valor) {
        this.is_Visualizar = valor;
      },

      initResponsable() {
        this.responsable.tipo = null;
        this.responsable.prioridad = null;
        this.responsable.subcategoria_Id = null;
        this.responsable.responsable_Ticket_Id = null;
      },

      initSeguimiento() {
        this.seguimiento.id = null;
        this.seguimiento.tipo = null;
        this.seguimiento.estatus = null;
        this.seguimiento.observaciones = "";
        this.seguimiento.solicitud_Ticket_Id = null;
        this.seguimiento.empleado_Seguimiento = null;
        this.seguimiento.fecha_Fin_Seguimiento = null;
        this.seguimiento.folio_Solicitud_Ticket = null;
        this.seguimiento.empleado_Seguimiento_Id = null;
        this.seguimiento.fecha_Inicio_Seguimiento = null;
        this.seguimiento.evidencia_Seguimiento_URL = null;
        this.seguimiento.titulo_Actividad_Realizada = null;
      },

      //---------------------------------------------------------------
      //GET SOLICITUDES TICKETS
      async load_Solicitudes_Tickets() {
        try {
          const resp = await api.get("/T_Solicitudes");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              if (data) {
                let list = data.map((item) => {
                  return {
                    id: item.id,
                    folio: item.folio,
                    opiniones: item.opiniones,
                    fecha_Fin: item.fecha_Fin,
                    prioridad: item.prioridad,
                    capturista: item.capturista,
                    solicitante: item.solicitante,
                    descripcion: item.descripcion,
                    fecha_Inicio: item.fecha_Inicio,
                    seguimientos: item.seguimientos,
                    subcategoria: item.subcategoria,
                    observaciones: item.observaciones,
                    capturista_Id: item.capturista_Id,
                    fecha_Creacion: item.fecha_Creacion,
                    responsable_Ticket_Puesto_Id:
                      item.responsable_Ticket_Puesto_Id,
                    tipo_Solicitud: item.tipo_Solicitud,
                    estatus_Ticket: item.estatus_Ticket,
                    tipo_Recepcion: item.tipo_Recepcion,
                    subcategoria_Id: item.solicitante_Id,
                    estatus_Interno: item.estatus_Interno,
                    capturista_Area: item.capturista_Area,
                    solicitante_Area: item.solicitante_Area,
                    solicitante_Id: item.solicitante_Area_Id,
                    capturista_Puesto: item.capturista_Puesto,
                    tipo_Solicitud_Id: item.tipo_Solicitud_Id,
                    capturista_Area_Id: item.capturista_Area_Id,
                    responsable_Ticket: item.responsable_Ticket,
                    solicitante_Puesto: item.solicitante_Puesto,
                    solicitante_Area_Id: item.solicitante_Area_Id,
                    archivo_Firmado_URL: item.archivo_Firmado_URL,
                    capturista_Puesto_Id: item.capturista_Puesto_Id,
                    responsable_Ticket_Id: item.responsable_Ticket_Id,
                    solicitante_Puesto_Id: item.solicitante_Puesto_Id,
                    seguimientos_Pendientes: item.seguimientos_Pendientes,
                    responsable_Ticket_Area: item.responsable_Ticket_Area,
                    responsable_Ticket_Puesto: item.responsable_Ticket_Puesto,
                    responsable_Ticket_Area_Id: item.responsable_Ticket_Area_Id,
                  };
                });
                this.list_Solicitudes_Tickets = list
                  .filter((x) => x.tipo_Solicitud != "Solicitudes")
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
      //GET SOLICITUDES TICKETS
      async load_Solicitudes() {
        try {
          const resp = await api.get(
            `/T_Solicitudes/SolicitudesByArea?Area_Id=${encryptStorage.decrypt(
              "area_Id"
            )}`
          );
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              if (data) {
                let list = data.map((item) => {
                  return {
                    id: item.id,
                    folio: item.folio,
                    opiniones: item.opiniones,
                    fecha_Fin: item.fecha_Fin,
                    prioridad: item.prioridad,
                    capturista: item.capturista,
                    solicitante: item.solicitante,
                    descripcion: item.descripcion,
                    fecha_Inicio: item.fecha_Inicio,
                    seguimientos: item.seguimientos,
                    subcategoria: item.subcategoria,
                    observaciones: item.observaciones,
                    capturista_Id: item.capturista_Id,
                    fecha_Creacion: item.fecha_Creacion,
                    responsable_Ticket_Puesto_Id:
                      item.responsable_Ticket_Puesto_Id,
                    tipo_Solicitud: item.tipo_Solicitud,
                    estatus_Ticket: item.estatus_Ticket,
                    tipo_Recepcion: item.tipo_Recepcion,
                    subcategoria_Id: item.solicitante_Id,
                    estatus_Interno: item.estatus_Interno,
                    capturista_Area: item.capturista_Area,
                    solicitante_Area: item.solicitante_Area,
                    solicitante_Id: item.solicitante_Area_Id,
                    capturista_Puesto: item.capturista_Puesto,
                    tipo_Solicitud_Id: item.tipo_Solicitud_Id,
                    capturista_Area_Id: item.capturista_Area_Id,
                    responsable_Ticket: item.responsable_Ticket,
                    solicitante_Puesto: item.solicitante_Puesto,
                    solicitante_Area_Id: item.solicitante_Area_Id,
                    archivo_Firmado_URL: item.archivo_Firmado_URL,
                    capturista_Puesto_Id: item.capturista_Puesto_Id,
                    responsable_Ticket_Id: item.responsable_Ticket_Id,
                    solicitante_Puesto_Id: item.solicitante_Puesto_Id,
                    seguimientos_Pendientes: item.seguimientos_Pendientes,
                    responsable_Ticket_Area: item.responsable_Ticket_Area,
                    responsable_Ticket_Puesto: item.responsable_Ticket_Puesto,
                    responsable_Ticket_Area_Id: item.responsable_Ticket_Area_Id,
                  };
                });
                this.list_Solicitudes = list
                  .filter((x) => x.tipo_Solicitud == "Solicitudes")
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
      //POST RESPONABLE TICKET
      async asignar_Responsable_Ticket(id, responsable) {
        try {
          const resp = await api.post(
            `/T_Solicitudes/Asignar_Responsable/${id}`,
            responsable
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //---------------------------------------------------------------
      //SUSTITUIR RESPONSABLE TICKET
      async sustituir_Responsable_Ticket(sustituir_Responsable) {
        try {
          const resp = await api.post(
            "/T_Sustitucion_Responsable",
            sustituir_Responsable
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

      //---------------------------------------------------------------
      //GET SEGUIMIENTO TICKET
      async load_Seguimiento_Ticket() {
        try {
          this.list_Seguimiento_Ticket = [];
          this.list_Seguimiento_Solicitud = [];
          let resp = await api.get("/T_Detalles_Solicitudes");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              if (data) {
                let list = data.map((item) => {
                  return {
                    id: item.id,
                    lectura: false,
                    tipo: item.tipo,
                    estatus: item.estatus,
                    observaciones: item.observaciones,
                    tipo_Encabezado: item.tipo_Encabezado,
                    solicitud_Ticket_Id: item.solicitud_Ticket_Id,
                    empleado_Seguimiento: item.empleado_Seguimiento,
                    fecha_Fin_Seguimiento: item.fecha_Fin_Seguimiento,
                    folio_Solicitud_Ticket: item.folio_Solicitud_Ticket,
                    empleado_Seguimiento_Id: item.empleado_Seguimiento_Id,
                    fecha_Inicio_Seguimiento: item.fecha_Inicio_Seguimiento,
                    evidencia_Seguimiento_URL: item.evidencia_Seguimiento_URL,
                    titulo_Actividad_Realizada: item.titulo_Actividad_Realizada,
                  };
                });

                this.list_Seguimiento_Ticket = list
                  .filter((x) => x.tipo_Encabezado != "Solicitudes")
                  .sort((a, b) => b.id - a.id);
                this.list_Seguimiento_Solicitud = list
                  .filter((x) => x.tipo_Encabezado == "Solicitudes")
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
      //GET SEGUIMIENTO BY TICKET
      async load_Seguimiento_By_Ticket(id) {
        try {
          const resp = await api.get(`/T_Detalles_Solicitudes/ByTicket/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              if (data) {
                this.list_Seguimiento_By_Ticket = data.map((item) => {
                  return {
                    id: item.id,
                    tipo: item.tipo,
                    estatus: item.estatus,
                    observaciones: item.observaciones,
                    solicitud_Ticket_Id: item.solicitud_Ticket_Id,
                    empleado_Seguimiento: item.empleado_Seguimiento,
                    fecha_Fin_Seguimiento: item.fecha_Fin_Seguimiento,
                    folio_Solicitud_Ticket: item.folio_Solicitud_Ticket,
                    empleado_Seguimiento_Id: item.empleado_Seguimiento_Id,
                    fecha_Inicio_Seguimiento: item.fecha_Inicio_Seguimiento,
                    evidencia_Seguimiento_URL: item.evidencia_Seguimiento_URL,
                    titulo_Actividad_Realizada: item.titulo_Actividad_Realizada,
                  };
                });
                this.list_Seguimiento_By_Ticket.sort((a, b) => b.id - a.id);
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
      //POST RESPONSABLE TICKET
      async asignar_Seguimiento_Ticket(seguimiento) {
        try {
          const resp = await api.post("T_Detalles_Solicitudes", seguimiento);
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //---------------------------------------------------------------
      //POST CONCLUIR SEGUIMIENTO
      async concluir_Seguimiento(id) {
        try {
          const resp = await api.get(
            `/T_Detalles_Solicitudes/Concluir_Seguimiento/${id}`
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

      //---------------------------------------------------------------
      //POST AGREGAR SEGUIMIENTO
      async create_Seguimiento(seguimiento) {
        try {
          const resp = await api.post("/T_Detalles_Solicitudes", seguimiento);
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
              data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, intentelo de nuevo. Si el error perisiste, contacte a soporte",
          };
        }
      },

      //---------------------------------------------------------------
      //GET SEGUIMIENTO BY DETALLE ID
      async get_Seguimiento_By_Id(id) {
        try {
          const resp = await api.get(
            `/T_Detalles_Solicitudes/BySeguimiento(Detalle)/${id}`
          );
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              this.seguimiento.id = data.id;
              this.seguimiento.tipo = data.tipo;
              this.seguimiento.estatus = data.estatus;
              this.seguimiento.folio_Solicitud_Ticket =
                data.folio_Solicitud_Ticket;
              this.seguimiento.empleado_Seguimiento_Id =
                data.empleado_Seguimiento_Id;
              this.seguimiento.fecha_Inicio_Seguimiento =
                data.fecha_Inicio_Seguimiento;
              this.seguimiento.evidencia_Seguimiento_URL =
                data.evidencia_Seguimiento_URL;
              this.seguimiento.titulo_Actividad_Realizada =
                data.titulo_Actividad_Realizada;
              this.seguimiento.observaciones =
                data.observaciones == null ? "" : data.observaciones;
              this.seguimiento.solicitud_Ticket_Id = data.solicitud_Ticket_Id;
              this.seguimiento.empleado_Seguimiento = data.empleado_Seguimiento;
              this.seguimiento.fecha_Fin_Seguimiento =
                data.fecha_Fin_Seguimiento;
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
      //POST CONCLUIR TICKET
      async concluir_Ticket(id, concluir) {
        try {
          const resp = await api.post(
            `/T_Solicitudes/Concluir_Solicitud/${id}`,
            concluir,
            {
              headers: {
                "Conten-Type": "multipart/form-data",
              },
            }
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
        } catch (e) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //---------------------------------------------------------------
      //UPDATE SOLICITUD
      async update_Detalle_Seguimienti(seguimiento) {
        try {
          const resp = await api.put(
            `/T_Detalles_Solicitudes/${seguimiento.id}`,
            seguimiento
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

      //---------------------------------------------------------------
      //SUBIR ARCHIVO FIRMADO
      async subir_Archivo_Firmado(id, archivo) {
        try {
          const resp = await api.post(
            `/T_Solicitudes/Subir_Conclusion/${id}`,
            archivo,
            {
              headers: {
                "Conten-Type": "multipart/form-data",
              },
            }
          );
          if (resp.status == 200) {
            const { success, data, id } = resp.data;
            if (success === true) {
              return { success, data, id };
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
      //DELETE SEGUIMIENTO
      async delete_Seguimiento(id) {
        try {
          const resp = await api.delete(`/T_Detalles_Solicitudes/${id}`);
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
      //APROBAR SOLICITUD
      async aprobar_Solicitud(id) {
        try {
          const resp = await api.get(`/T_Solicitudes/Aprobar/${id}`);
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
    },
  }
);
