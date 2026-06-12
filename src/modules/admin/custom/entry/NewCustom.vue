<template>
  <div class="card p-4 md:p-6">
    <div class="flex align-items-center mb-4">
      <i class="ri-2x mr-2 text-primary"></i>
      <h1 class="text-2xl font-bold m-0">Create New Custom Package</h1>
    </div>

    <div class="grid px-2">
      <!-- Left Column (Package Configuration) -->
      <div class="col-12 md:col-6 mb-5 md:mb-0 md:pr-4">
        
        <div class="field mb-4">
          <label for="type" class="font-semibold text-sm mb-2 block">Package Type</label>
            <InputText id="type" v-model="state.type" placeholder="Individual" class="w-full" />
            <small v-if="errors.has('type')" class="p-error">
              <div v-for="error in errors.get('type')" :key="error">{{ error }}</div>
            </small>  
        </div>

        <div class="field mb-4">
          <label for="description" class="font-semibold text-sm mb-2 block">Description</label>
            <InputText id="description" v-model="state.description" placeholder="" class="w-full" />
            <small v-if="errors.has('description')" class="p-error">
              <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
            </small>

        </div>

        <div class="grid">
          <div class="field col-12 md:col-6 mb-4">
            <label for="price" class="font-semibold text-sm mb-2 block">Price</label>  
              <InputText id="price" v-model="state.price" placeholder="4,500,000.00" class="w-full" />
              <small v-if="errors.has('price')" class="p-error">
              <div v-for="error in errors.get('price')" :key="error">{{ error }}</div>
            </small>
          </div>

          <div class="field col-12 md:col-6 mb-4">
            <label for="validity" class="font-semibold text-sm mb-2 block">Currency</label>  
              <InputText id="validity" v-model="state.currency" placeholder="MMK" class="w-full" />
              <small v-if="errors.has('currency')" class="p-error">
              <div v-for="error in errors.get('currency')" :key="error">{{ error }}</div>
            </small>
          </div>
        </div>

        <div class="grid">
          <div class="field col-12 md:col-6 mb-4">
            <label for="price" class="font-semibold text-sm mb-2 block">Duration</label>  
              <InputText id="price" v-model="state.duration" placeholder="3" class="w-full" />
              <small v-if="errors.has('duration')" class="p-error">
              <div v-for="error in errors.get('duration')" :key="error">{{ error }}</div>
            </small>
          </div>

          <div class="field col-12 md:col-6 mb-4">
            <label for="validity" class="font-semibold text-sm mb-2 block">Duration Month</label>  
              <InputText id="validity" v-model="state.duration_month" placeholder="Month" class="w-full" />
              <small v-if="errors.has('duration_month')" class="p-error">
              <div v-for="error in errors.get('duration_month')" :key="error">{{ error }}</div>
            </small>
          </div>
        </div>
      </div>

      <!-- Right Column (Client Details) -->
      <div class="col-12 md:col-6 md:pl-5 border-left-1 border-300">
        
        <form class="p-fluid" @submit.prevent="handleSubmit()">
          <div class="field mb-4">
            <label for="cust_name" class="font-semibold text-sm mb-2 block">Full Name</label>
              <InputText
                id="cust_name"
                v-model="state.name"
                placeholder="Aung Aung"
                class="w-full"
              />
            <small v-if="errors.has('name')" class="p-error">
              <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
            </small>
          </div>

          <div class="field mb-4">
            <label for="cust_email" class="font-semibold text-sm mb-2 block">Email Address</label>
            
              <InputText
                id="cust_email"
                type="email"
                v-model="state.email"
                placeholder="aungaung@gmail.com"
                class="w-full"
              />
            
            <small v-if="errors.has('email')" class="p-error">
              <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
            </small>
          </div>

          <div class="field mb-4">
            <label class="font-semibold text-sm mb-2 block">Phone Number</label>
            <div class="flex gap-2">
              <CountryPhoneCode
                v-model="state.mobile_code"
                placeholder="Country Code"
                defaultCountryCode="+95"
              />
          
                <InputPhone
                v-model="state.mobile_number"
                id="mobile_number"
                class="w-full"
              ></InputPhone>
          
            </div>
            <small v-if="errors.has('mobile_number')" class="p-error">
              <div v-for="error in errors.get('mobile_number')" :key="error">{{ error }}</div>
            </small>
            <small v-if="errors.has('mobile_code')" class="p-error">
              <div v-for="error in errors.get('mobile_code')" :key="error">{{ error }}</div>
            </small>
          </div>

          <Button
            type="submit"
            label="Purchase Package"
            class="w-full mt-4 font-bold"
            style="background-color: #0b82a3; border-color: #0b82a3; padding: 0.75rem"
          />
        </form>
      </div>
    </div>

    <Loading v-if="isLoading" />
     <div class="col-12 md:col-12 flex justify-content-end">
      <router-link :to="{ name: 'customList' }">
        <div>
          <Button label="Cancel" class="mt-2 p-button-outlined" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import CountryPhoneCode from "@/components/CountryPhoneCode";
import InputPhone from "@/components/InputPhone";
import useNewCustom from "./useNewCustom";

export default defineComponent({
  name: "NewCustom",
  components: {
    CountryPhoneCode,
    InputPhone,
  },
  setup() {
    const {
      isLoading,
      handleSubmit,
      submitted,
      errors,
      state,
      packageDetails,
    } = useNewCustom();

    return {
      isLoading,
      packageDetails,
      handleSubmit,
      submitted,
      state,
      errors,
    };
  },
});
</script>

<style lang="scss"></style>