import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCategoriasStore = defineStore("useCategoriasStore", {
  state: () => ({
    modal: false,
    modal_Sub: false,
    is_Editar: false,
    is_Editar_Sub: false,
    list_Categorias: [],
    list_Subcategorias: [],
    categoria: {
      id: null,
      titulo: null,
      descripcion: null,
    },
    subcategoria: {
      id: null,
      titulo: null,
      categoria: null,
      descripcion: null,
      categoria_Id: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalSub(valor) {
      this.modal_Sub = valor;
    },

    actualizarIsEditar(valor) {
      this.is_Editar = valor;
    },

    actualizarIsEditarSub(valor) {
      this.is_Editar_Sub = valor;
    },

    initCategoria() {
      this.categoria.id = null;
      this.categoria.titulo = null;
      this.categoria.descripcion = null;
    },

    initSubcategoria() {
      this.subcategoria.id = null;
      this.subcategoria.titulo = null;
      this.subcategoria.descripcion = null;
    },

    //---------------------------------------------------------------
    //GET LIST CATEGORIAS
    async load_Categorias() {
      try {
        const resp = await api.get("/T_Categorias");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Categorias = data.map((categoria) => {
                return {
                  id: categoria.id,
                  value: categoria.id,
                  label: categoria.titulo,
                  titulo: categoria.titulo,
                  descripcion: categoria.descripcion,
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
    //POST CATEGORIA
    async createCategoria(categoria) {
      try {
        const resp = await api.post("/T_Categorias", categoria);
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
    //GET CATEGORIA
    async load_Categoria_By_Id(id) {
      try {
        const resp = await api.get(`/T_Categorias/ByCategoria/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.categoria.id = data.id;
            this.categoria.titulo = data.titulo;
            this.categoria.descripcion = data.descripcion;
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
    //UPDATE CATEGORIA
    async update_Categoria(categoria) {
      try {
        const resp = await api.put(`/T_Categorias/${categoria.id}`, categoria);
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
    //DELETE CATEGORIA
    async delete_Categoria(id) {
      try {
        const resp = await api.delete(`/T_Categorias/${id}`);
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
    //GET LIST SUBCATEGORIAS
    async load_Subcategorias(id) {
      try {
        const resp = await api.get(`/T_Subcategorias/ByCategoria/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Subcategorias = data.map((sub) => {
                return {
                  id: sub.id,
                  value: sub.id,
                  label: sub.titulo,
                  titulo: sub.titulo,
                  categoria: sub.categoria,
                  descripcion: sub.descripcion,
                  categoria_Id: sub.categoria_Id,
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
    //POST SUBCATEGORIA
    async createSubcategoria(subcategoria) {
      try {
        const resp = await api.post("/T_Subcategorias", subcategoria);
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
    //GET SUBCATEGORIA
    async load_Subcategoria_By_Id(id) {
      try {
        const resp = await api.get(`/T_Subcategorias/BySubcategoria/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.subcategoria.id = data.id;
            this.subcategoria.titulo = data.titulo;
            this.subcategoria.categoria = data.categoria;
            this.subcategoria.descripcion = data.descripcion;
            this.subcategoria.categoria_Id = data.categoria_Id;
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
    //UPDATE SUBCATEGORIA
    async update_Subcategoria(subcategoria) {
      try {
        const resp = await api.put(
          `/T_Subcategorias/${subcategoria.id}`,
          subcategoria
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
    //DELETE SUBCATEGORIA
    async delete_SubCategoria(id) {
      try {
        const resp = await api.delete(`/T_Subcategorias/${id}`);
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
