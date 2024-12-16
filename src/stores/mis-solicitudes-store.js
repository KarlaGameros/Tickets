import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useMisSolicitudesStore = defineStore("useMisSolicitudesStore", {
  state: () => ({
    modal: false,
    modal_Nota: false,
    modal_Solicitudes: false,
    is_Editar: false,
    is_Visualizar: false,
    list_Mis_Tickets: [],
    list_Mis_Solicitudes: [],
    solicitud: {
      id: null,
      tipo: null,
      folio: null,
      opiniones: null,
      fecha_Fin: null,
      prioridad: null,
      categoria: null,
      capturista: null,
      solicitante: null,
      descripcion: null,
      is_Asignado: false,
      fecha_Inicio: null,
      subcategoria: null,
      categoria_Id: null,
      observaciones: null,
      capturista_Id: null,
      solicitante_Id: null,
      fecha_Creacion: null,
      estatus_Ticket: null,
      tipo_Recepcion: null,
      tipo_Solicitud: null,
      area_Solicitud: null,
      subcategoria_Id: null,
      estatus_Interno: null,
      capturista_Area: null,
      solicitante_Area: null,
      area_Solicitud_Id: null,
      tipo_Solicitud_Id: null,
      capturista_Puesto: null,
      capturista_Area_Id: null,
      responsable_Ticket: null,
      solicitante_Puesto: null,
      solicitante_Area_Id: null,
      archivo_Firmado_URL: null,
      capturista_Puesto_Id: null,
      responsable_Ticket_Id: null,
      solicitante_Puesto_Id: null,
      empleado_Asigna_Ticket: null,
      responsable_Ticket_Area: null,
      empleado_Asigna_Area_Id: null,
      empleado_Asigna_Ticket_Id: null,
      responsable_Ticket_Puesto: null,
      empleado_Asigna_Puesto_Id: null,
      responsable_Ticket_Area_Id: null,
      empleado_Asigna_Ticket_Area: null,
      responsable_Ticket_Puesto_Id: null,
      empleado_Asigna_Ticket_Puesto: null,
    },
    inventario: {
      descripcion: null,
      inventario_Id: null,
      solicitud_Ticket_Id: null,
    },
    opinion: {
      id: null,
      opiniones: null,
    },
  }),
  actions: {
    //-----------------------------TICKETS--------------------------
    updateModal(valor) {
      this.modal = valor;
    },

    actualizarModalNota(valor) {
      this.modal_Nota = valor;
    },

    updateModalSolicitudes(valor) {
      this.modal_Solicitudes = valor;
    },

    updateIsEdit(valor) {
      this.is_Editar = valor;
    },

    updateIsVisualize(valor) {
      this.is_Visualizar = valor;
    },

    initSolicitud() {
      this.solicitud.id = null;
      this.solicitud.tipo = null;
      this.solicitud.folio = null;
      this.solicitud.opiniones = null;
      this.solicitud.fecha_Fin = null;
      this.solicitud.prioridad = null;
      this.solicitud.categoria = null;
      this.solicitud.capturista = null;
      this.solicitud.is_Asignado = false;
      this.solicitud.solicitante = null;
      this.solicitud.descripcion = null;
      this.solicitud.fecha_Inicio = null;
      this.solicitud.subcategoria = null;
      this.solicitud.categoria_Id = null;
      this.solicitud.observaciones = null;
      this.solicitud.capturista_Id = null;
      this.solicitud.area_Solicitud_Id = null;
      this.solicitud.empleado_Asigna_Ticket_Area = null;
      this.solicitud.fecha_Creacion = null;
      this.solicitud.responsable_Ticket_Puesto_Id = null;
      this.solicitud.estatus_Ticket = null;
      this.solicitud.tipo_Recepcion = null;
      this.solicitud.empleado_Asigna_Ticket_Puesto = null;
      this.solicitud.subcategoria_Id = null;
      this.solicitud.estatus_Interno = null;
      this.solicitud.capturista_Area = null;
      this.solicitud.solicitante_Area = null;
      this.solicitud.solicitante_Id = null;
      this.solicitud.capturista_Puesto = null;
      this.solicitud.capturista_Area_Id = null;
      this.solicitud.responsable_Ticket = null;
      this.solicitud.solicitante_Puesto = null;
      this.solicitud.solicitante_Area_Id = null;
      this.solicitud.archivo_Firmado_URL = null;
      this.solicitud.capturista_Puesto_Id = null;
      this.solicitud.responsable_Ticket_Id = null;
      this.solicitud.solicitante_Puesto_Id = null;
      this.solicitud.responsable_Ticket_Area = null;
      this.solicitud.empleado_Asigna_Area_Id = null;
      this.solicitud.empleado_Asigna_Ticket = null;
      this.solicitud.responsable_Ticket_Puesto = null;
      this.solicitud.empleado_Asigna_Puesto_Id = null;
      this.solicitud.empleado_Asigna_Ticket_Id = null;
      this.solicitud.responsable_Ticket_Area_Id = null;
    },

    //---------------------------------------------------------------
    //GET SOLICITUDES TICKETS
    async load_Mis_Solicitudes() {
      try {
        let resp = null;
        if (
          encryptStorage.decrypt("perfil") == "Super Administrador" ||
          encryptStorage.decrypt("perfil") == "Administrador"
        ) {
          resp = await api.get("/T_Solicitudes");
        } else {
          resp = await api.get("/T_Solicitudes/Mis_Solicitudes");
        }
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              let list =
                encryptStorage.decrypt("perfil") == "Super Administrador" ||
                encryptStorage.decrypt("perfil") == "Administrador"
                  ? data
                  : data[0].solicitudes;
              list.map((item) => {
                return {
                  id: item.id,
                  folio: item.folio,
                  categoria: item.categoria,
                  opiniones: item.opiniones,
                  prioridad: item.prioridad,
                  fecha_Fin: item.fecha_Fin,
                  capturista: item.capturista,
                  descripcion: item.descripcion,
                  solicitante: item.solicitante,
                  categoria_Id: item.categoria_Id,
                  subcategoria: item.subcategoria,
                  seguimientos: item.seguimientos,
                  fecha_Inicio: item.fecha_Inicio,
                  responsable_Ticket_Puesto: item.responsable_Ticket_Puesto,
                  empleado_Asigna_Puesto_Id: item.empleado_Asigna_Puesto_Id,
                  empleado_Asigna_Ticket_Id: item.empleado_Asigna_Ticket_Id,
                  responsable_Ticket_Area_Id: item.responsable_Ticket_Area_Id,
                  observaciones: item.observaciones,
                  capturista_Id: item.capturista_Id,
                  empleado_Asigna_Ticket_Area: item.empleado_Asigna_Ticket_Area,
                  area_Solicitud: item.area_Solicitud,
                  tipo_Recepcion: item.tipo_Recepcion,
                  tipo_Solicitud: item.tipo_Solicitud,
                  estatus_Ticket: item.estatus_Ticket,
                  solicitante_Id: item.solicitante_Id,
                  responsable_Ticket_Puesto_Id:
                    item.responsable_Ticket_Puesto_Id,
                  empleado_Asigna_Ticket_Puesto:
                    item.empleado_Asigna_Ticket_Puesto,
                  estatus_Interno: item.estatus_Interno,
                  fecha_Creacion: item.fecha_Creacion,
                  subcategoria_Id: item.subcategoria_Id,
                  capturista_Area: item.capturista_Area,
                  solicitante_Area: item.solicitante_Area,
                  capturista_Puesto: item.capturista_Puesto,
                  area_Solicitud_Id: item.area_Solicitud_Id,
                  tipo_Solicitud_Id: item.tipo_Solicitud_Id,
                  capturista_Area_Id: item.capturista_Area_Id,
                  solicitante_Puesto: item.solicitante_Puesto,
                  responsable_Ticket: item.responsable_Ticket,
                  archivo_Firmado_URL: item.archivo_Firmado_URL,
                  solicitante_Area_Id: item.solicitante_Area_Id,
                  capturista_Puesto_Id: item.capturista_Puesto_Id,
                  responsable_Ticket_Id: item.responsable_Ticket_Id,
                  solicitante_Puesto_Id: item.solicitante_Puesto_Id,
                  empleado_Asigna_Ticket: item.empleado_Asigna_Ticket,
                  seguimientos_Pendientes: item.seguimientos_Pendientes,
                  empleado_Asigna_Area_Id: item.empleado_Asigna_Area_Id,
                  responsable_Ticket_Area: item.responsable_Ticket_Area,
                };
              });

              this.list_Mis_Tickets = list
                .filter((x) => x.tipo_Solicitud != "Solicitudes")
                .sort((a, b) => b.id - a.id);

              this.list_Mis_Solicitudes = list
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
    //POST SOLICITUD
    async create_Solicitud_Ticket(solicitud) {
      try {
        const resp = await api.post("/T_Solicitudes", solicitud, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
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
    //GET SOLICITUD BY ID
    async load_Solicitud_By_Id(id) {
      try {
        const resp = await api.get(`/T_Solicitudes/ByTicket/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.solicitud.id = data.id;
            this.solicitud.tipo = data.tipo;
            this.solicitud.folio = data.folio;
            this.solicitud.prioridad = data.prioridad;
            this.solicitud.opiniones = data.opiniones;
            this.solicitud.fecha_Fin = data.fecha_Fin;
            this.solicitud.responsable_Ticket_Area =
              data.responsable_Ticket_Area;
            this.solicitud.responsable_Ticket_Puesto =
              data.responsable_Ticket_Puesto;
            this.solicitud.responsable_Ticket_Area_Id =
              data.responsable_Ticket_Area_Id;
            this.solicitud.capturista = data.capturista;
            this.solicitud.responsable_Ticket_Puesto_Id =
              data.responsable_Ticket_Puesto_Id;
            this.solicitud.categoria = data.categoria;
            this.solicitud.solicitante = data.solicitante;
            this.solicitud.descripcion = data.descripcion;
            this.solicitud.subcategoria = data.subcategoria;
            this.solicitud.fecha_Inicio = data.fecha_Inicio;
            this.solicitud.categoria_Id = data.categoria_Id;
            this.solicitud.observaciones = data.observaciones;
            this.solicitud.capturista_Id = data.capturista_Id;
            this.solicitud.area_Solicitud = data.area_Solicitud;
            this.solicitud.fecha_Creacion =
              data.fecha_Creacion != null
                ? data.fecha_Creacion.replace("T", " ")
                : data.fecha_Creacion;
            this.solicitud.solicitante_Id = data.solicitante_Id;
            this.solicitud.estatus_Ticket = data.estatus_Ticket;
            this.solicitud.tipo_Recepcion = data.tipo_Recepcion;
            this.solicitud.tipo_Solicitud = data.tipo_Solicitud;
            this.solicitud.is_Asignado =
              data.responsable_Ticket_Id != null ? true : false;
            this.solicitud.estatus_Interno = data.estatus_Interno;
            this.solicitud.subcategoria_Id = data.subcategoria_Id;
            this.solicitud.subcategoria_Id = data.subcategoria_Id;
            this.solicitud.capturista_Area = data.capturista_Area;
            this.solicitud.solicitante_Area = data.solicitante_Area;
            this.solicitud.area_Solicitud_Id = data.area_Solicitud_Id;
            this.solicitud.capturista_Puesto = data.capturista_Puesto;
            this.solicitud.tipo_Solicitud_Id = data.tipo_Solicitud_Id;
            this.solicitud.responsable_Ticket = data.responsable_Ticket;
            this.solicitud.solicitante_Puesto = data.solicitante_Puesto;
            this.solicitud.capturista_Area_Id = data.capturista_Area_Id;
            this.solicitud.archivo_Firmado_URL = data.archivo_Firmado_URL;
            this.solicitud.solicitante_Area_Id = data.solicitante_Area_Id;
            this.solicitud.capturista_Puesto_Id = data.capturista_Puesto_Id;
            this.solicitud.responsable_Ticket_Id = data.responsable_Ticket_Id;
            this.solicitud.solicitante_Puesto_Id = data.solicitante_Puesto_Id;
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
    //UPDATE SOLICITUD
    async update_Solicitud_Ticket(id, solicitud) {
      try {
        const resp = await api.put(`/T_Solicitudes/${id}`, solicitud, {
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //---------------------------------------------------------------
    //CREATE OPINION
    async create_Opinion(opinion) {
      try {
        const resp = await api.post(
          `/T_Solicitudes/Opiniones_Solicitud/${opinion.id}`,
          opinion
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

    //-----------------------------SOLICITUDES--------------------------
  },
});
