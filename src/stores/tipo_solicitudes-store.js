import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useTiposSolicitudesStore = defineStore(
  "useTiposSolicitudesStore",
  {
    state: () => ({
      modal: false,
      is_Editar: false,
      tipo: {
        nombre: null,
        descripcion: null,
      },
      list_Tipos_Solicitudes: [],
    }),
    actions: {
      actualizarModal(valor) {
        this.modal = valor;
      },

      updateEditar(valor) {
        this.is_Editar = valor;
      },

      initTipo() {
        this.tipo.nombre = null;
        this.tipo.descripcion = null;
      },

      //---------------------------------------------------------------
      //TIPO DE SOLICITUDES
      async load_Tipos_Solicitudes() {
        try {
          const resp = await api.get("/T_Tipos_Solicitud");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success == true) {
              if (data) {
                this.list_Tipos_Solicitudes = data.map((tipo) => {
                  return {
                    id: tipo.id,
                    value: tipo.id,
                    label: tipo.nombre,
                    nombre: tipo.nombre,
                    descripcion: tipo.descripcion,
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
      //GET TIPO BY ID
      async load_Tipo_Solicitud_By_Id(id) {
        try {
          const resp = await api.get(`/T_Tipos_Solicitud/ById/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              this.tipo.id = data.id;
              this.tipo.nombre = data.nombre;
              this.tipo.descripcion = data.descripcion;
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
      //POST TIPO DE SOLICITUD
      async create_Tipo_Solicitud(tipo) {
        try {
          const resp = await api.post("/T_Tipos_Solicitud", tipo);
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
      //UPDATE TIPO SOLICITUD
      async update_Tipo_Solicitud(tipo) {
        try {
          const resp = await api.put(`/T_Tipos_Solicitud/${tipo.id}`, tipo);
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
      //DELETE TIPO DE SOLICITUD
      async delete_Tipo(id) {
        try {
          const resp = await api.delete(`/T_Tipos_Solicitud/${id}`);
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
  }
);
