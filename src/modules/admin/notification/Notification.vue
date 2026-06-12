<template>
  <div class="flex align-items-center h-full px-3 cursor-pointer">
    <i
      v-if="!notiCount"
      class="ri-notification-line ri-lg text-primary"
      @click="togglePanel"
    ></i>
    <i
      v-else
      class="ri-notification-line ri-lg text-primary"
      v-badge.danger="notiCount > 0 && notiCount <= 99 ? notiCount : '99+'"
      @click="togglePanel"
    ></i>
  </div>

  <OverlayPanel
    @show="showNotiToggle"
    ref="userPanel"
    :style="{ width: '380px' }"
  >
    <div class="p-0 m-0">
      <div
        class="p-4 bg-primary border-round-top-md w-full flex justify-content-between align-items-center"
      >
        <div class="text-white text-xl font-bold">Notification</div>
        <div
          v-if="notiCount > 0"
          @click="markAsAll()"
          class="text-white text-sm font-bold cursor-pointer"
        >
          Mark all as read
        </div>
        <div v-else class="text-white text-sm font-bold cursor-pointer">
          Mark all as read
        </div>
      </div>

      <TabView
        v-model:activeIndex="active"
        @tab-change="changeTabIndex($event)"
        :scrollable="true"
      >
        <TabPanel
          v-for="tab in visibleTabs"
          :key="tab.key"
          :header="tab.title"
          :disabled="!visible(tab)"
        >
          <div class="noti-body">
            <TransitionGroup tag="ul" name="list" class="container">
              <div v-for="noti in notifications" :key="noti.id">
                <div
                  class="p-4 flex align-items-center cursor-pointer"
                  :class="noti.seen_at ? '' : 'bg-gray-200'"
                  @click="gotoLink(noti)"
                >
                  <div class="w-full">
                    <div class="flex justify-content-between flex-1">
                      <div class="text-lg font-bold">
                        {{ noti.title }}
                      </div>
                      <div class="text-sm text-gray-500 flex-none ml-1">
                        {{ fromNow(noti.created_at) }}
                      </div>
                    </div>
                    <div class="flex justify-content-between mt-3">
                      <div class="text-lg mt-auto text-gray-600">
                        {{ noti.message }}
                      </div>
                    </div>
                  </div>
                </div>
                <Divider class="p-0 m-0" />
              </div>
            </TransitionGroup>
            <div v-if="!isLoading && notifications.length === 0">
              <div class="p-4 text-center cursor-pointer">
                <div class="pl-4 w-full">Empty</div>
              </div>
            </div>
            <div v-if="!lastPage" class="text-center p-4">
              <Button
                type="button"
                :label="isLoading ? 'Loading' : 'Load More'"
                class="p-button-rounded"
                :loading="isLoading"
                @click="fetchNotifications"
              />
            </div>
            <div v-else class="text-center p-4">
              You have reached the last page
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </OverlayPanel>
</template>
<script>
import { defineComponent } from "vue";

import Divider from "primevue/divider";
import OverlayPanel from "primevue/overlaypanel";

import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";

import useNotification from "./useNotification";

export default defineComponent({
  name: "AppNotification",
  components: {
    Divider,
    OverlayPanel,
    TabPanel,
    TabView,
  },
  setup() {
    const {
      user,
      userPanel,
      notiCount,
      notifications,
      isLoading,
      lastPage,
      togglePanel,
      fromNow,
      fetchNotifications,
      notificationStore,
      gotoLink,
      changeTabIndex,
      active,
      showNotiToggle,
      tabs,
      visible,
      visibleTabs,
      markAsAll,
    } = useNotification();

    return {
      user,
      userPanel,
      notiCount,
      notifications,
      isLoading,
      lastPage,
      togglePanel,
      fromNow,
      fetchNotifications,
      notificationStore,
      gotoLink,
      changeTabIndex,
      active,
      showNotiToggle,
      tabs,
      visible,
      visibleTabs,
      markAsAll,
    };
  },
});
</script>
<style>
.user-menu {
  min-width: 100px;
}
.p-overlaypanel .p-overlaypanel-content {
  padding: 0 !important;
}
.noti-body {
  height: 300px;
  overflow-x: scroll;
}
.container {
  position: relative;
  padding: 0;
  margin: 0;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.p-tabview .p-tabview-panels {
  padding: 0 !important;
}
</style>
