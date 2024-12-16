import { api } from "src/boot/axios";
import { defineStore } from "pinia";
import { EncryptStorage } from "storage-encryption";

const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
export const useAuthStore = defineStore("auth", {
  state: () => ({
    apps: [],
    modulos: [],
    sistemas: [],
    usuario: {
      id: null,
      area: null,
      puesto: null,
      nombres: null,
      area_Id: null,
      puesto_Id: null,
      solicitante_Id: null,
      nombre_Completo: null,
      apellido_Materno: null,
      tipo_Empleado_Id: null,
      apellido_Paterno: null,
      solicitante_Area_Id: null,
    },
    responsable: {
      id: null,
      area: null,
      puesto: null,
      activo: false,
      area_Id: null,
      empleado: null,
      puesto_Id: null,
      created_at: null,
      empleado_Id: null,
      fecha_Asignacion: null,
      fecha_destitucion: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    //VALIDAR TOKEN
    async validar_Token(token, sistemaId) {
      try {
        const resp = await api.get(
          `/Accesos/ValidaToken/?token=${token}&SistemaId=${sistemaId}`
        );
        if (resp.status == 200) {
          const {
            success,
            empleado,
            perfil,
            perfil_Id,
            area,
            area_Id,
            puesto,
            puesto_Id,
          } = resp.data;
          if (success === true) {
            encryptStorage.encrypt("empleado", empleado);
            encryptStorage.encrypt("perfil", perfil);
            encryptStorage.encrypt("perfil_Id", perfil_Id);
            encryptStorage.encrypt("area", area);
            encryptStorage.encrypt("areaLetra", area);
            encryptStorage.encrypt("area_Id", area_Id);
            encryptStorage.encrypt("puesto", puesto);
            encryptStorage.encrypt("puesto_Id", puesto_Id);
            return success;
          } else {
            return { success };
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

    //-----------------------------------------------------------
    //LOAD SISTEMAS
    async load_Sistemas() {
      try {
        const resp = await api.get(`/SistemasUsuarios/ByUSuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.sistemas = data.map((sistema) => {
                return {
                  sistema_Id: sistema.sistema_Id,
                  sistema: sistema.sistema,
                  url: sistema.url,
                  label: sistema.sistema,
                  value: sistema.sistema_Id,
                };
              });

              const appsArray = data.map((app) => {
                return {
                  id: app.sistema_Id,
                  label: app.sistema,
                  avatar: app.logo_Url,
                  url: app.url,
                };
              });
              const logOut = {
                id: 0,
                label: "Cerrar sesión",
                avatar:
                  "http://sistema.ieenayarit.org:9270/Imagenes/Sistemas/dbb9640f-dd18-4fc3-b530-7041d8594240.png",
                url: "",
              };
              const universoIEEN = {
                id: 0,
                label: "Ir a universo",
                avatar:
                  "http://sistema.ieenayarit.org:9270/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png",
                url: "",
              };

              appsArray.push(universoIEEN);
              appsArray.push(logOut);
              this.apps = appsArray;
            }
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

    //-----------------------------------------------------------
    //LOAD MODULOS
    async load_Modulos() {
      try {
        const sistema = encryptStorage.decrypt("sistema");
        const resp = await api.get(
          `/PermisosModulosUsuarios/Bysuario/${sistema}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.modulos = data.map((modulo) => {
                return {
                  siglas_Modulo: modulo.siglas_Modulo,
                  registrar: modulo.registrar,
                  actualizar: modulo.actualizar,
                  eliminar: modulo.eliminar,
                  leer: modulo.leer,
                };
              });
            }
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

    //-----------------------------------------------------------
    //GET INFORMATION BY USUARIO
    async get_Empleado_By_Usuario() {
      try {
        const resp = await api.get("/Empleados/ByUsuario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.usuario.id = data.id;
            this.usuario.area = data.area;
            this.usuario.puesto = data.puesto;
            this.usuario.nombres = data.nombres;
            this.usuario.solicitante_Id = data.id;
            this.usuario.puesto_Id = data.puesto_Id;
            this.usuario.solicitante_Area_Id = data.area_Id;
            this.usuario.apellido_Materno = data.apellido_Materno;
            this.usuario.tipo_Empleado_Id = data.tipo_Empleado_Id;
            this.usuario.apellido_Paterno = data.apellido_Paterno;
            this.usuario.nombre_Completo = `${data.nombres} ${data.apellido_Paterno} ${data.apellido_Materno}`;
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

    //-----------------------------------------------------------
    //GET RESPONSABLE DE ÁREA BY USUARIO
    async get_Responsable_By_Usuario() {
      try {
        const resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.responsable.id = data.id;
            this.responsable.area = data.area;
            this.responsable.area = data.area;
            this.responsable.activo = data.activo;
            this.responsable.area_Id = data.area_Id;
            this.responsable.empleado = data.empleado;
            this.responsable.puesto_Id = data.puesto_Id;
            this.responsable.created_at = data.created_at;
            this.responsable.empleado_Id = data.empleado_Id;
            this.responsable.fecha_Asignacion = data.fecha_Asignacion;
            this.responsable.fecha_destitucion = data.fecha_destitucion;
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
