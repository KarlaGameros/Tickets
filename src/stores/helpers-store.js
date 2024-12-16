import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useHerlpersStore = defineStore("useHerlpersStore", {
  state: () => ({
    list_Areas: [],
    list_Inventario: [],
    list_Personal_By_Area: [],
    list_Personal_By_Area_Copia: [],
  }),
  actions: {
    //---------------------------------------------------------------
    //AREAS
    async load_Areas() {
      try {
        const resp = await api.get("/Areas/GetLista");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Areas = data.map((area) => {
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
    //PERSONAL BY AREA
    async load_Personal_By_Area(id) {
      try {
        const resp = await api.get(`/Empleados/ByArea/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Personal_By_Area = data.map((personal) => {
                return {
                  id: personal.id,
                  area_Id: personal.area_Id,
                  puesto_Id: personal.puesto_Id,
                  puesto: personal.puesto,
                  tratamiento_Id: personal.tratamiento_Id,
                  tratamiento: personal.tratamiento,
                  estatus: personal.estatus,
                  nombre_Completo: personal.nombre_Completo,
                  activo: personal.activo,
                  value: personal.id,
                  label: `${personal.nombres} ${personal.apellido_Paterno} ${personal.apellido_Materno}`,
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
    //PERSONAL BY AREA COPIA
    async load_Personal_By_Area_Copia(id) {
      try {
        const resp = await api.get(`/Empleados/ByArea/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Personal_By_Area_Copia = data.map((personal) => {
                return {
                  id: personal.id,
                  puesto_Id: personal.puesto_Id,
                  puesto: personal.puesto,
                  tratamiento_Id: personal.tratamiento_Id,
                  tratamiento: personal.tratamiento,
                  estatus: personal.estatus,
                  nombre_Completo: personal.nombre_Completo,
                  activo: personal.activo,
                  value: personal.id,
                  label: `${personal.nombres} ${personal.apellido_Paterno} ${personal.apellido_Materno}`,
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
    //INVENTARIO BY PERSONAL
    async load_Inventario_By_Personal(id) {
      try {
        const resp = await api.get(`/Inventarios/GetByEmpleado/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              let list = data.map((item) => {
                return {
                  id: item.id,
                  estatus: item.estatus,
                  bodega: item.bodega,
                  empleado: item.empleado,
                  clave: item.clave,
                  descripcion: item.descripcion,
                  nombre_Corto: item.nombre_Corto,
                  numero_Serie: item.numero_Serie,
                  color: item.color,
                  value: item.id,
                  label: `${item.clave} - ${item.nombre_Corto}`,
                };
              });
              this.list_Inventario = list.filter(
                (x) => x.clave.includes("EY-02") || x.clave.includes("EY-06")
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
    //INVENTARIO BY AREA
    async load_Inventario_By_Area(id) {
      try {
        const resp = await api.get(`/Inventarios/ByArea/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              let list = data.map((item) => {
                return {
                  id: item.id,
                  estatus: item.estatus,
                  bodega: item.bodega,
                  empleado: item.empleado,
                  clave: item.clave,
                  descripcion: item.descripcion,
                  nombre_Corto: item.nombre_Corto,
                  numero_Serie: item.numero_Serie,
                  color: item.color,
                  value: item.id,
                  label: `${item.clave} - ${item.nombre_Corto}`,
                };
              });
              this.list_Inventario = list.filter(
                (x) => x.clave.includes("EY-02") || x.clave.includes("EY-06")
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
  },
});
