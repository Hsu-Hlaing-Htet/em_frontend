import { reactive, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useCustomStore } from "../store";
import { useRouter, useRoute } from "vue-router";
import EventBus from "@/libs/AppEventBus";
import "vue-advanced-cropper/dist/style.css";
import { Errors } from "@/utils/validation";
import { useConfirm } from "primevue/useconfirm";

export default function useShowCustom() {
  const store = useCustomStore();
  const router = useRouter();
  const route = useRoute();
  const isLoading = ref(true);
  const errors = new Errors();
  const submitted = ref(false);
  const confirm = useConfirm();

  const state = reactive({
    id: null,
    type: "",
    description: "",
    price: "",
    currency: "",
    duration: "",
    duration_month: "",
    name: "",
    email: "",
    mobile_code: "+95",
    mobile_number: "",
  });

  watch(() => route.params.id, (newId) => {
    if (newId) {
      fetchCustom();
    }
  });

  onMounted(() => {
    fetchCustom();
  });

  onBeforeUnmount(() => {
    store.$reset();
    store.$dispose();
  });

  const showConfirmDialog = (id) => {
    confirm.require({
      message: "Are you sure?",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes, delete it",
      rejectLabel: "Cancel",
      acceptClass: "p-button-danger",
      rejectClass: "p-button-danger p-button-text",
      accept: () => {
        deleteCustom(id);
      },
      reject: () => {
        //callback to execute when user rejects the action
      },
      onHide: () => {
        //Callback to execute when dialog is hidden
      },
    });
  };


  const fetchCustom = async () => {
    isLoading.value = true;
    try {
      await store.fetchOne({ id: route.params.id });
      const response = store.getOneResponse;
      console.log("Full Response:", response);

      if (response && response.data) {
        state.id = response.data.id;
        state.name = response.data.name || "";
        state.email = response.data.email || "";

        state.mobile_code = response.data.mobile_code || "+95";
        state.mobile_number = response.data.mobile_number || "";
        state.type = response.data.type || "";
        state.description = response.data.description || "";
        state.price = response.data.price || "";
        state.currency = response.data.currency || "";
        state.duration = response.data.duration || "";
        state.duration_month = response.data.duration_month || "";
      }
      console.log("type", state.type);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteCustom = async (id) => {
    isLoading.value = true;

    await store.delete({ id: id });

    const response = store.getDeleteResponse;

    if (response) {
      router.push({ name: "customList" });
      EventBus.emit("show-toast", {
        severity: "success",
        summary: "",
        detail: response.message,
      });
    }

    isLoading.value = false;
  };

  return {
    isLoading,
    showConfirmDialog,
    submitted,
    errors,
    state,
  };
}
