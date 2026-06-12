<template>
  <div class="card p-4 md:p-6 border-none shadow-none">
    <div class="flex justify-content-between align-items-center mb-6">
      <div class="flex align-items-center">
        <h1 class="text-2xl font-bold m-0">Custom Details</h1>
      </div>
      <div class="flex gap-2">
        <router-link :to="{ name: 'customList' }">
          <Button label="Back" class="p-button-outlined p-button-secondary" />
        </router-link>
        <router-link
          v-if="state.id && $can('update', 'custom')"
          :to="{ name: 'editCustom', params: { id: state.id } }"
        >
          <Button
            type="button"
            icon="pi pi-pencil"
          class="p-button-primary p-button-outlined"
          />
        </router-link>
      </div>
    </div>

    <div class="grid px-2" v-if="!isLoading">
      <!-- Left Column (Package Details) -->
      <div class="col-12 md:col-6 mb-5 md:mb-0 pr-0 md:pr-8 py-4">
        <div class="mb-4"> 
          <div class="border-round-none custom-badge">{{ state.type }}</div>
        </div>

        <div class="mb-2">
          <h1 class="text-3xl font-bold m-0 text-900 line-height-2">
            {{ state.description }}
          </h1>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-bold m-0 text-900">
            {{ state.price }} {{ state.currency }}
          </h2>
        </div>
<Divider/>
        <div class="validity-section pt-5 mt-5">
          <label class="font-bold text-lg block mb-2 text-900">Validity</label>
          <div class="text-sm text-700 uppercase">
            {{ state.duration }} {{ state.duration_month }}
          </div>
        </div>
      </div>

      <!-- Right Column (Client Details) -->
      <div class="col-12 md:col-6 md:pl-8 py-4 border-left-1 border-300">
        <div class="p-fluid">
          <div class="field mb-4">
            <label for="name" class="font-semibold mb-2 block">Name</label>
              <InputText
                id="name"
                v-model="state.name"
                placeholder="Aung Aung"
                class="w-full"
                disabled
              />
          </div>

          <div class="field mb-4">
            <label for="email" class="font-semibold mb-2 block"
              >Email</label
            >
            <InputText
              id="email"
              v-model="state.email"
              class="w-full"
              disabled
            />
          </div>

          <div class="field mb-5">
            <label class="font-semibold mb-2 block text-700"
              >Phone Number</label
            >
            <div class="flex gap-2">
              <CountryPhoneCode
                v-model="state.mobile_code"
                :defaultCountryCode="state.mobile_code"
                disabled
              />
              <InputPhone
                v-model="state.mobile_number"
                class="w-full"
                disabled
              />
            </div>
          </div>

          <div class="mt-8">
            <Button
              label="Purchase Package"
              class="w-full py-3 font-bold purchase-btn border-none"
            />
          </div>
        </div>
      </div>
    </div>

    <Loading v-if="isLoading" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import CountryPhoneCode from "@/components/CountryPhoneCode";
import InputPhone from "@/components/InputPhone";
import Loading from "@/components/Loading.vue";
import useShowCustom from "./useShowCustom";
import Divider from "primevue/divider";

export default defineComponent({
  name: "ShowCustom",
  components: {
    Divider,
    CountryPhoneCode,
    InputPhone,
    Loading,
  },
  setup() {
    const { isLoading,submitted, errors, state } =
      useShowCustom();

    return {
      isLoading,
      submitted,
      state,
      errors,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-badge {
  background-color: #0b82a3;
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.purchase-btn {
  background-color: #0b82a3 !important;
  color: white !important;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
  }
}

</style>
