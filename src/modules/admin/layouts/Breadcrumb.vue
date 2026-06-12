<template>
    <div class="align-items-center hidden lg:flex">
      <div class="text-2xl font-bold">
        {{ $route.meta.title }}
      </div>
      <Divider v-if="breadcumbs.length > 0" layout="vertical" class="mr-0" />
  
      <Breadcrumb v-if="breadcumbs.length > 0" :home="home" :model="breadcumbs">
        <template #item="{ item }">
          <router-link
            :to="{ name: item.routeName }"
            custom
            v-slot="{ href, navigate, isActive, isExactActive }"
          >
            <a
              :href="href"
              @click="navigate"
              class="text-breadcrumb text-base cursor-auto"
              :class="{
                'text-primary cursor-pointer': !isActive || !isExactActive,
              }"
              >{{ item.title }}</a
            >
          </router-link>
        </template>
      </Breadcrumb>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from "vue";
  import { useRoute } from "vue-router";
  
  import Breadcrumb from "primevue/breadcrumb";
  import Divider from "primevue/divider";
  
  export default defineComponent({
    name: "Breadcrumb",
    components: { Breadcrumb, Divider },
    setup() {
      const route = useRoute();
      const home = ref({
        routeName: "dashboard",
        to: "/admin/dashboard",
        title: "Home",
      });
  
      const breadcumbs = computed(() => {
        // if (route.meta.breadcrumbs) {
        //   let paths = route.path.split("/")
        //   paths.splice(0, 1) //remove home route
        //   let breadcrumb = route.meta.breadcrumbs
        //   paths.forEach((path, i) => {
        //     if (breadcrumb[i]) {
        //       breadcrumb[i].title = breadcrumb[i].title
        //         ? breadcrumb[i].title
        //         : path
        //     }
        //   })
        //   return breadcrumb
        // }
        return route.meta.breadcrumbs || [];
      });
  
      return { breadcumbs, home };
    },
  });
  </script>
  <style scoped>
  .p-breadcrumb {
    border: none !important;
    background-color: transparent !important;
  }
  .text-breadcrumb:hover {
    color: var(--primary-color) !important;
  }
  </style>
  