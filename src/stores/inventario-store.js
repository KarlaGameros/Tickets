import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInventarioStore = defineStore("useInventarioStore", {
  state: () => ({
    modal: false,
    inventario: {
      id: null,
      color: null,
      clave: null,
      marca: null,
      modelo: null,
      bodega: null,
      estatus: null,
      catalago: null,
      empleado: null,
      foto_1_URL: null,
      foto_2_URL: null,
      foto_3_URL: null,
      foto_4_URL: null,
      empleado_Id: null,
      descripcion: null,
      nombre_Corto: null,
      numero_Serie: null,
      observaciones: null,
      fecha_Registro: null,
    },
    inventario_Ticket: {
      id: null,
      no_Serie: null,
      descripcion: null,
      nombre_Corto: null,
      inventario_Id: null,
      fecha_Creacion: null,
      solicitud_Ticket_Id: null,
      folio_Solicitud_Ticket: null,
    },
    list_Inventario_Fallas: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    initInventario() {
      this.inventario.id = null;
      this.inventario.color = null;
      this.inventario.clave = null;
      this.inventario.marca = null;
      this.inventario.modelo = null;
      this.inventario.bodega = null;
      this.inventario.estatus = null;
      this.inventario.catalago = null;
      this.inventario.empleado = null;
      this.inventario.foto_1_URL = null;
      this.inventario.foto_2_URL = null;
      this.inventario.foto_3_URL = null;
      this.inventario.foto_4_URL = null;
      this.inventario.empleado_Id = null;
      this.inventario.descripcion = null;
      this.inventario.nombre_Corto = null;
      this.inventario.numero_Serie = null;
      this.inventario.observaciones = null;
      this.inventario.fecha_Registro = null;
    },

    initInventarioTicket() {
      this.inventario_Ticket.id = null;
      this.inventario_Ticket.no_Serie = null;
      this.inventario_Ticket.descripcion = null;
      this.inventario_Ticket.nombre_Corto = null;
      this.inventario_Ticket.inventario_Id = null;
      this.inventario_Ticket.fecha_Creacion = null;
      this.inventario_Ticket.solicitud_Ticket_Id = null;
      this.inventario_Ticket.folio_Solicitud_Ticket = null;
    },
    //---------------------------------------------------------------
    //GET INVENTARIOS CON FALLAS
    async load_Inventarios_Fallas() {
      try {
        const resp = await api.get("/T_Inventario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Inventario_Fallas = data.map((item) => {
                return {
                  id: item.id,
                  no_Serie: item.no_Serie,
                  descripcion: item.descripcion,
                  nombre_Corto: item.nombre_Corto,
                  inventario_Id: item.inventario_Id,
                  fecha_Creacion: item.fecha_Creacion,
                  solicitud_Ticket: item.solicitud_Ticket,
                  solicitud_Ticket_Id: item.solicitud_Ticket_Id,
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
    //GET INVENTARIO BY ID
    async load_Inventario_By_Id(id) {
      try {
        const resp = await api.get(`/Inventarios/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.inventario.id = data.id;
            this.inventario.color = data.color;
            this.inventario.clave = data.clave;
            this.inventario.marca = data.marca;
            this.inventario.modelo = data.modelo;
            this.inventario.bodega = data.bodega;
            this.inventario.estatus = data.estatus;
            this.inventario.catalago = data.catalago;
            this.inventario.empleado = data.empleado;
            this.inventario.foto_1_URL = data.foto_1_URL;
            this.inventario.foto_2_URL = data.foto_2_URL;
            this.inventario.foto_3_URL = data.foto_3_URL;
            this.inventario.foto_4_URL = data.foto_4_URL;
            this.inventario.empleado_Id = data.empleado_Id;
            this.inventario.descripcion = data.descripcion;
            this.inventario.nombre_Corto = data.nombre_Corto;
            this.inventario.numero_Serie = data.numero_Serie;
            this.inventario.observaciones =
              data.observaciones == null
                ? "Sin observaciones"
                : data.observaciones;
            this.inventario.fecha_Registro = data.fecha_Registro;
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
    //GET INVENTARIO BY TICKET
    async load_Inventario_By_Ticket(id) {
      try {
        const resp = await api.get(`/T_Inventario/ByTicket/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.inventario_Ticket.id = data.id;
            this.inventario_Ticket.solicitud_Ticket_Id =
              data.solicitud_Ticket_Id;
            this.inventario_Ticket.folio_Solicitud_Ticket =
              data.folio_Solicitud_Ticket;
            this.inventario_Ticket.no_Serie = data.no_Serie;
            this.inventario_Ticket.descripcion = data.descripcion;
            this.inventario_Ticket.nombre_Corto = data.nombre_Corto;
            this.inventario_Ticket.inventario_Id = data.inventario_Id;
            this.inventario_Ticket.fecha_Creacion = data.fecha_Creacion;
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
    //POST INVENTARIO DAÑADO
    async create_Inventario_Falla(inventario) {
      try {
        const resp = await api.post("/T_Inventario", inventario);
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
    //UPDATE INVENTARIO CON FALLA
    async update_Inventario_Falla(inventario) {
      try {
        const resp = await api.put(
          `/T_Inventario/${inventario.id}`,
          inventario
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
