<template>
    <Menu ref="languageMenu" :model="languageMenuItems" :popup="true">
      <template #item="{ item }">
        <div @click="changeLocale(item.code)" class="p-menuitem-link">
          <div class="cursor-pointer flex align-items-center">
            <img alt="flag" :src="item.image" style="width: 1.5rem" />
            <span class="ml-2 text-primary">{{ item.label }}</span>
          </div>
        </div>
      </template>
    </Menu>
    <Button
      type="button"
      class="p-button-text h-full"
      @click="toggleLanguageMenu"
    >
      <img alt="logo" :src="getFlagUrl()" style="width: 1.5rem" />
      <span class="mx-2 p-button-label hidden lg:flex">{{
        $t(localeStore.getCurrentLanguage)
      }}</span>
      <i class="pi pi-angle-down hidden lg:flex"></i>
    </Button>
  </template>
  <script>
  import { useLocaleStore } from "@/store/localeStore"
  import { ref, defineComponent, onMounted, onUnmounted } from "vue"
  import i18n from "@/libs/i18n"
  
  import Button from "primevue/button"
  import Menu from "primevue/menu"
  
  export default defineComponent({
    name: "Locale",
    components: { Button, Menu },
    setup() {
      const localeStore = useLocaleStore()
      const languageMenu = ref()
      const languageMenuItems = ref([
        {
          label: "Myanmar",
          image: require("@/assets/flags/mm.png"),
          code: "mm"
        },
        {
          label: "English",
          image: require("@/assets/flags/en.png"),
          code: "en"
        }
      ])
  
      onMounted(() => {
        window.addEventListener("scroll", handleScroll)
      })
  
      onUnmounted(() => {
        window.addEventListener("scroll", handleScroll)
      })
  
      const handleScroll = () => {
        if(languageMenu.value){
          languageMenu.value.hide()
        }
        
      }
  
      const getFlagUrl = () => {
        return localeStore.getCurrentLanguage === "mm"
          ? require("@/assets/flags/mm.png")
          : require("@/assets/flags/en.png")
      }
  
      const changeLocale = (locale) => {
        localeStore.setLanguage(locale)
        i18n.global.locale = locale
        languageMenu.value.hide()
      }
  
      const toggleLanguageMenu = (event) => {
        languageMenu.value.toggle(event)
      }
  
      return {
        languageMenu,
        localeStore,
        languageMenuItems,
        toggleLanguageMenu,
        getFlagUrl,
        changeLocale
      }
    }
  })
  </script>
  