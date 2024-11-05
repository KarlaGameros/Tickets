import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useTableroStore = defineStore("useTableroStore", {
  state: () => ({
    list_Tickets_By_Area: [],
    list_Seguimiento_By_Personal: [],
  }),
  actions: {
    //---------------------------------------------------------------
    //AREAS
    async load_Solicitudes_Area() {
      try {
        const resp = await api.get("/T_Solicitudes/SolicitudesByArea");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Tickets_By_Area = data.map((item) => {
                return {
                  area_Id: item.area_Id,
                  area: item.area,
                  data: item.solicitudes,
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
    //SEGUIMIENTO BY PERSONAL
    async load_Seguimiento_Personal() {
      try {
        const resp = await api.get("/T_Solicitudes/SolicitudesAtendidasByUTIE");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              this.list_Seguimiento_By_Personal = data.map((item) => {
                return {
                  empleado: item.empleado,
                  solicitudes: item.solicitudes,
                  empleado_Id: item.empleado_Id,
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
