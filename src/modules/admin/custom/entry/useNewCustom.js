import { reactive, ref, onBeforeUnmount } from "vue";
import { useCustomStore } from "../store";
import { useRouter } from "vue-router";
import EventBus from "@/libs/AppEventBus";
import "vue-advanced-cropper/dist/style.css";
import { Errors } from "@/utils/validation";

export default function useNewCustom() {
  const store = useCustomStore();
  const router = useRouter();
  const isLoading = ref(false);
  const errors = new Errors();
  const submitted = ref(false);

  const state = reactive({
    type: '',
    description: '',
    price: '',
    currency: '',
    duration: '',
    duration_month: '',
    name: '',
    email: '',
    mobile_code: '',
    mobile_number: '',
  });


  const handleSubmit = () => {
    createCustom();
  };

  onBeforeUnmount(() => {
    store.$reset();
    store.$dispose();
  });

  const createCustom = async () => {
    isLoading.value = true;
    errors.clear();
    const payload = {
      type: state.type,
      description: state.description,
      price: state.price,
      currency: state.currency,
      duration: state.duration,
      duration_month: state.duration_month,
      name: state.name,
      email: state.email,
      mobile_code: state.mobile_code ? state.mobile_code.code : "",
      mobile_number: state.mobile_number ? state.mobile_number.toString() : "",
    };

    try {
      await store.add(payload);

      const response = store.getAddResponse;

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
      if (error.status === 422) {
        const err = error.data.data;
        errors.record(err);
      }
    }
  };

  return {
    isLoading,
    handleSubmit,
    submitted,
    errors,
    state,
  };
}