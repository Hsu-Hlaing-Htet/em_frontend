<template>
  <div
    class="grid grid-nogutter surface-section text-800 min-h-screen justify-content-center align-items-center"
  >
    <div class="col-12 lg:col-12 flex align-items-center">
      <div class="w-full mx-2 lg:mx-8 mb-8">
        <div
          class="flex flex-column justify-content-center align-items-center mb-5"
        >
          <img
            :src="require('@/assets/images/logo.png')"
            alt="Logo"
            class="fadeinup animation-duration-1000 block w-5rem mb-4"
          />
          <div class="text-2xl lg:text-4xl font-light mt-3 text-primary">
            Star City User Account Delete
          </div>
        </div>
        <div class="flex justify-content-center align-items-center">
          <form @submit.prevent="handleSubmit()">
            <div class="col-12">
              <label for="country code" class="block font-medium mb-2"
                >Country Code
              </label>
              <CountryPhoneCode
                v-model="state.countryCode"
                class="mb-1 w-full"
                defaultCountryCode="+95"
              />
            </div>
            <div class="col-12">
              <label for="phoneNumber" class="block font-medium mb-2"
                >Phone No.
              </label>
              <InputText
                id="phoneNumber"
                class="w-full"
                type="text"
                placeholder="9xxxxxxxxx"
                maxlength="11"
                v-model="state.identifier"
              />
              <small v-if="errors.has('identifier')" class="p-error">
                <div v-for="error in errors.get('identifier')" :key="error">
                  {{ error.replace("The identifier", "Phone number") }}
                </div>
              </small>
            </div>
            <div class="col-12">
              <label for="otpInput" class="block font-medium mb-2"
                >Passcode
              </label>
              <VOtpInput
                id="otpInput"
                ref="otpInput"
                v-model:value="state.passcode"
                :should-auto-focus="false"
                separator="-"
                :num-inputs="6"
                input-type="password"
                input-mode="number"
                :conditionalClass="[
                  'one',
                  'two',
                  'three',
                  'four',
                  'five',
                  'six',
                ]"
                input-classes="otp-input"
                @focus="removeAutoCursor"
              />
              <small v-if="errors.has('passcode')" class="p-error">
                <div v-for="error in errors.get('passcode')" :key="error">
                  {{ error }}
                </div>
              </small>
            </div>
            <div
              class="flex align-items-center justify-content-between mt-5"
            ></div>
            <Button type="submit" label="Delete" class="w-full" />
          </form>
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>

<script>
import CountryPhoneCode from "@/components/CountryPhoneCode";
import { defineComponent } from "vue";
import useAccountDelete from "./useAccountDelete";
import VOtpInput from "vue3-otp-input";
import Loading from "@/components/Loading.vue";
export default defineComponent({
  name: "AccountDelete",
  components: { VOtpInput, CountryPhoneCode, Loading },
  setup() {
    const {
      state,
      handleSubmit,
      errors,
      submitted,
      isLoading,
      removeAutoCursor,
      v$,
    } = useAccountDelete();

    return {
      state,
      handleSubmit,
      isLoading,
      errors,
      submitted,
      removeAutoCursor,
      v$,
    };
  },
});
</script>

<i18n src="./../locale.json">
      </i18n>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

.gradient-border {
  border-radius: 56px;
  padding: 0.3rem;
  background: linear-gradient(180deg, rgb(1, 114, 192), rgb(248, 151, 20) 30%);
}

.gradient-fill {
  border-radius: 53px;
  background: linear-gradient(
    180deg,
    var(--surface-50) 38.9%,
    var(--surface-0)
  );
}

.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
