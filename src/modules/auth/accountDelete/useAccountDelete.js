import { reactive, ref } from "vue";
import { useAuthStore } from "../authStore";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { Errors } from "@/utils/validation";
import EventBus from "@/libs/AppEventBus";

export default function useAccountDelete() {
  const store = useAuthStore();
  const submitted = ref(false);
  const isLoading = ref(false);
  const errors = new Errors();

  const state = reactive({
    identifier: "",
    passcode: "",
    countryCode: "",
  });
  const rules = {
    identifier: { required },
    passcode: { required },
    countryCode: {},
  };

  const v$ = useVuelidate(rules, state);

  const handleSubmit = async () => {
    submitted.value = true;
    accountDelete();
  };

  const accountDelete = async () => {
    errors.clear();
    isLoading.value = true;

    // Preprocess the identifier to remove the leading '0' if it starts with '09'
    const processedIdentifier = state.identifier.startsWith("09")
      ? state.identifier.replace(/^0/, "")
      : state.identifier;

    try {
      await store.setAccountDeleteAction({
        identifier: processedIdentifier.trim(),
        passcode: state.passcode.trim(),
        country_code: state.countryCode.code,
      });
      const response = await store.getAccountDelete;
      if (response) {
        EventBus.emit("show-toast", {
          severity: "success",
          summary: "Success",
          detail: response.message,
        });
        state.identifier = "";
        state.passcode = "";
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
    state,
    v$,
    handleSubmit,
    errors,
    submitted,
    isLoading,
  };
}
