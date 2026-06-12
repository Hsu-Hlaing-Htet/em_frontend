import { ref, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/modules/auth/authStore";
import { useRouter } from "vue-router";
import Pushy from "pushy-sdk-web";
import EventBus from "@/libs/AppEventBus";
import ability from "@/libs/acl/ability";

import { useNotificationStore } from "@/modules/notification/notificationStore";
import { fromNow } from "@/utils/formatter";
import { useUserProfileStore } from '@/modules/user/userProfileStore';
import { encryptData } from "@/utils/encrypt";

export default function useNotification() {
  const authStore = useAuthStore();
  const router = useRouter();
  const userPanel = ref();
  const notifications = ref([]);
  const notiCount = ref(0);
  const user = authStore.getUserData;
  const notificationStore = useNotificationStore();
  const page = ref(0);
  const perPage = ref(20);
  const lastPage = ref(false);
  const isLoading = ref(false);
  const active = ref(0);
  const type = ref();
  const profileStore = useUserProfileStore();

  const tabs = ref([
    { key: "ALL", title: "All" },
    {
      key: "RESIDENT",
      title: "Resident",
      action: "view",
      resource: "resident",
    },
    {
      key: "CASE-MANAGEMENT",
      title: "Star Assit",
      action: "view",
      resource: "case|case-category",
    },
    {
      key: "SCSC",
      title: "SCSC",
      action: "view",
      resource: "scsc-member|scsc-subscription|scsc-prepaid-package",
    },
    {
      key: "FACILITY-BOOKING",
      title: "Facility Booking",
      action: "view",
      resource: "facility|facility-slot|facility-booking|facility-court",
    },
    { key: "CMS", title: "CMS", action: "view", resource: "content" },
    // {
    //   key: "BILL",
    //   title: "Bill Payment",
    //   action: "view",
    //   resource: "bill",
    // },
    // { key: "FEED", title: "Feed", action: "view", resource: "content" },
  ]);

  const visibleTabs = ref([]);

  onMounted(() => {
    tabs.value.forEach((tab) => {
      if (visible(tab)) {
        visibleTabs.value.push(tab);
      }
    });

    // Handle push notifications (only when web page is open)
    Pushy.setNotificationListener(function (data) {
      // Print notification payload data
      // console.log("Received notification: " + JSON.stringify(data));

      // Attempt to extract the "message" property from the payload: {"message":"Hello World!"}
      let message = data.message || "Test notification";

      // Display an alert with message sent from server
      // alert("Received notification: " + message);

      playNoti();
      fetchNotiCount();

      EventBus.emit("noti-toast", {
        severity: "info",
        summary: "New notification !",
        detail: message,
      });
    });
    window.addEventListener("scroll", handleScroll);
    fetchNotiCount();
    fetchProfile();
  });

  onUnmounted(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onBeforeUnmount(() => {
    authStore.$reset();
    notificationStore.$reset();
    authStore.$dispose();
    notificationStore.$dispose();
  });

  const togglePanel = (event) => {
    userPanel.value.toggle(event);
  };

  const fetchProfile = async () => {
    try {
      if (!user.value?.profile_picture) {
        throw new Error("Missing profile_picture");
      }
      const response = await fetch(user.value.profile_picture, {
        method: "GET",
        cache: "no-cache",
      });
      if (!response.ok) {
        throw new Error("Response not ok");
      }
    } catch (error) {
      const token = authStore.getToken;
      await profileStore.showUserProfileAction(token);
      const userData = profileStore.getShowUserProfile;
      if (userData?.data) {
        localStorage.setItem("userData", encryptData(JSON.stringify(userData.data)));
        authStore.setUserData(userData.data);
      }
    }
  };
  const fetchNotifications = async () => {
    isLoading.value = true;
    page.value++;

    // if(tabs.value[active.value].key == )
    type.value = visibleTabs.value[active.value].key;
    // //fetch API
    await notificationStore.allNotificationAction({
      page: page.value,
      per_page: perPage.value,
      type: type.value,
      platform: "DASHBORD",
    });
    //get response
    const response = notificationStore.getAllNotification;
    //assign value
    if (response) {
      isLoading.value = false;
      const data = response.data.data;
      notifications.value.push(...data);
      lastPage.value = notifications.value.length >= response.data.total;
    }
  };

  const fetchNotiCount = async () => {
    await notificationStore.unseenCountNotificationAction();

    const response = notificationStore.getUnseenCountNotification;
    if (response) {
      notiCount.value = response.data;
    }
  };

  const handleScroll = () => {
    if (userPanel.value) {
      userPanel.value.hide();
    }
  };

  const gotoLink = async (noti) => {
    const type = noti.type;
    const id = noti.id;
    const payload = noti.payload;

    if (type == "CASE-MANAGEMENT") {
      router.push({ name: "UpdateCase", params: { id: payload.id } });
    } else if (type == "CMS") {
      router.push({
        name: "editContent",
        params: { id: payload.id, type: "none" },
      });
    } else if (type == "FACILITY-BOOKING") {
      router.push({
        name: "detailBooking",
        params: { id: payload.timeslot_id },
        query: { bookingId: payload.id },
      });
      // } else if (type == "BILL") {
      //   router.push({
      //     name: "editContent",
      //     params: { id: payload.id, type: "none" },
      //   });
    } else if (type == "RESIDENT") {
      router.push({
        name: "PendingResidentDetail",
        params: { id: payload.id },
      });
    } else if (type == "SCSC") {
      // const packageType = payload.prepaid_package_id
      //   ? "prepaid"
      //   : "subscription";
      router.push({
        name: "MemberDetail",
        params: {
          id: payload.id,
          // name: "pending",
          // type: packageType,
        },
      });
    }

    await notificationStore.showMarkAsSeenNotificationAction({
      id: id,
    });

    const response = notificationStore.getShowMarkAsSeenNotification;
    userPanel.value.hide();

    if (response) {
      notifications.value = [];
      page.value = 0;
      fetchNotiCount();
      fetchNotifications();
    }
  };

  const markAsAll = async () => {
    isLoading.value = true;
    await notificationStore.markAsAllNotificationAction();

    const response = notificationStore.getMarkAsAllNotification;

    if (response) {
      isLoading.value = false;
      notifications.value = [];
      page.value = 0;
      fetchNotiCount();
      fetchNotifications();
    }
  };

  const showNotiToggle = () => {
    page.value = 0;
    perPage.value = 20;
    lastPage.value = false;
    notifications.value = [];
    fetchNotifications();
  };

  const changeTabIndex = ($event) => {
    active.value = $event.index;
    notifications.value = [];
    page.value = 0;
    fetchNotifications();
  };

  const sound = require("@/assets/sounds/notification.mp3");
  const playNoti = () => {
    let notiSound = new Audio(sound);
    notiSound.addEventListener("canplaythrough", () => {
      notiSound.play();
    });
  };

  const visible = (item) => {
    if (item.resource) {
      const myResource = item.resource.split("|");

      return myResource.some((resource) =>
        ability.can(item.action || "view", resource)
      );
    }

    return true;
  };

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
}
