const routes = [
  {
    path: "/customs",
    name: "custom",
    children: [
      {
        path: "",
        name: "customList",
        component: () => import("@/modules/custom/list/CustomList.vue"),
        meta: {
          action: "view",
          resource: "custom",
          layout: "default",
          title: "Custom",
          breadcrumbs: [
            { title: "Custom List", routeName: "customList" },
          ],
        },
      },
      {
        path: "create",
        name: "newCustom",
        component: () => import("@/modules/custom/entry/NewCustom.vue"),
        meta: {
          action: "create",
          resource: "custom",
          layout: "default",
          title: "Create Custom",
          breadcrumbs: [
            { title: "Custom List", routeName: "customList" },
            { title: "New", routeName: "newCustom" },
          ],
        },
      },
      {
        path: ":id/edit",
        name: "editCustom",
        component: () =>
          import("@/modules/custom/entry/EditCustom.vue"),
        meta: {
          action: "update",
          resource: "custom",
          layout: "default",
          title: "Edit Custom",
          breadcrumbs: [
            { title: "Custom List", routeName: "customList" },
            { title: "Edit", routeName: "editCustom" },
          ],
        },
      },
      {
        path: ":id",
        name: "showCustom",
        component: () =>
          import(
            "@/modules/custom/entry/ShowCustom.vue"
          ),
        meta: {
          action: "view",
          resource: "custom",
          layout: "default",
          title: "Show Custom",
          breadcrumbs: [
            { title: "Custom List", routeName: "customList" },
            {
              title: "Show Custom",
              routeName: "showCustom",
            },
          ],
        },
      },
    ],
  },
];

export default routes;