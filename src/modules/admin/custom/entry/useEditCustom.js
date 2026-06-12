import { reactive, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useCustomStore } from "../store";
import { useRouter, useRoute } from "vue-router";
import EventBus from "@/libs/AppEventBus";
import "vue-advanced-cropper/dist/style.css";
import { Errors } from "@/utils/validation";
import { useConfirm } from "primevue/useconfirm";

export default function useEditCustom() {
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

  const handleSubmit = () => {
    updateCustom();
  };

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
        const item = response.data;
        state.id = item.id;
        state.name = item.name || "";
        state.email = item.email || "";
        state.mobile_code = item.mobile_code || "+95";
        state.mobile_number = item.mobile_number || "";
        state.type = item.type || "";
        state.description = item.description || "";
        state.price = item.price || "";
        state.currency = item.currency || "";
        state.duration = item.duration || "";
        state.duration_month = item.duration_month || "";
      }
      console.log("email", state.email);
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

  const updateCustom = async () => {
    isLoading.value = true;
    errors.clear();
    try {
      await store.update({
        id: state.id,
        name: state.name,
        email: state.email,
        mobile_code: state.mobile_code && state.mobile_code.code ? state.mobile_code.code : state.mobile_code,
        mobile_number: state.mobile_number ? state.mobile_number.toString() : "",
        type: state.type,
        description: state.description,
        price: state.price,
        currency: state.currency,
        duration: state.duration,
        duration_month: state.duration_month,
      });

      const response = store.getUpdateResponse;

      if (response) {
        router.push({ name: "customList" }).then(() => {
          EventBus.emit("show-toast", {
            severity: "success",
            summary: "",
            detail: response.message,
          });
        });
      }

      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
      //server validation
      if (error.status === 422) {
        const err = error.data.data;
        errors.record(err);
      }
    }
  };

  return {
    isLoading,
    handleSubmit,
    showConfirmDialog,
    submitted,
    errors,
    state,
  };
}
