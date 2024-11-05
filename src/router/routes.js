const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/inicio",
        name: "inicio",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/mis_Actividades",
        name: "mis_Actividades",
        component: () =>
          import("../modulos/mis_Actividades/pages/IndexPage.vue"),
      },
      {
        path: "/mis_Solicitudes",
        name: "mis_Solicitudes",
        component: () =>
          import("../modulos/mis_Solicitudes/pages/IndexPage.vue"),
      },
      {
        path: "/tipo_Solicitudes",
        name: "tipo_Solicitudes",
        component: () =>
          import("../modulos/tipos_Solicitudes/pages/IndexPage.vue"),
      },
      {
        path: "/tablero",
        name: "tablero",
        component: () => import("../modulos/tablero/pages/IndexPage.vue"),
      },
      {
        path: "/tickets",
        name: "tickets",
        component: () => import("../modulos/tickets/pages/IndexPage.vue"),
      },
      {
        path: "/cancelaciones",
        name: "cancelaciones",
        component: () =>
          import("../modulos/solicitudes_Cancelacion/pages/IndexPage.vue"),
      },
      {
        path: "/inventario",
        name: "inventario",
        component: () => import("../modulos/inventarios/pages/IndexPage.vue"),
      },
      {
        path: "/configuracion",
        name: "configuracion",
        component: () => import("../modulos/configuracion/pages/IndexPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
