<template>
  <div class="card custom-border">
    <div class="grid">
      <div class="field col-12 md:col-3">
        <label class="label-sm">Type</label>
        <Dropdown
          v-model="selectedType"
          :options="typeOptionData"
          :filter="true"
          :showClear="true"
          optionLabel="name"
          optionValue="name"
          placeholder="Type"
          class="w-full"
        />
      </div>

      <div class="field col-12 md:col-3">
        <label class="label-sm">Reset</label>
        <Button
          icon="ri-filter-off-line ri-lg"
          class="p-button-secondary p-button-outlined p-button-md w-full"
          @click="resetSearch"
        />
      </div>
    </div>
  </div>
  <div class="card custom-border">
    <DataTable
      ref="dt"
      data-key="id"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      current-page-report-template="Showing {first} to {last} of {totalRecords} entries"
      responsive-layout="scroll"
      sortMode="multiple"
      scrollHeight="50vh"
      :scrollable="true"
      :lazy="true"
      :paginator="true"
      :value="custom"
      :multiSortMeta="lazyParams.multiSortMeta"
      :totalRecords="totalRecords"
      :rows="10"
      :first="lazyParams.first"
      :rows-per-page-options="[10, 25, 50]"
      @page="onPage($event)"
      @sort="onSort($event)"
      removableSort
    >
      <template #header>
        <div class="flex flex-wrap justify-content-between align-items-center">
          <h5 class="m-0 md:mb-2 block lg:hidden">Custom</h5>

          <div class="mt-3 md:mt-0 ml-0 lg:ml-auto">
            <span class="p-input-icon-left w-full md:w-auto">
              <i class="pi pi-search" />
              <InputText
                v-model="search"
                placeholder="Keyword Search"
                class="w-full md:w-auto"
              />
            </span>

            <router-link
              v-if="$can('create', 'custom')"
              :to="{ name: 'newCustom' }"
            >
              <Button label="Create" class="p-button-primary ml-2" />
            </router-link>
          </div>
        </div>
      </template>
      <template #empty> Custom data not found. </template>
      <template #loading> Loading custom data. Please wait. </template>
      
      <Column field="name" header="Name" :sortable="true" style="min-width: 150px">
        <template #body="{ data }">
          <router-link
            v-if="$can('view', 'custom')"
            :to="{ name: 'showCustom', params: { id: data.id } }"
          >
            {{ data.name }}
          </router-link>
          <span v-else>{{ data.name }}</span>
        </template>
      </Column>

      <Column field="email" header="Email" :sortable="true" style="min-width: 200px" />

      <Column header="Phone Number" style="min-width: 150px">
        <template #body="{ data }">
          {{ data.mobile_code }} {{ data.mobile_number }}
        </template>
      </Column>

      <Column field="type" header="Package Type" :sortable="true" style="min-width: 150px" />

      <Column
        field="description"
        header="Description"
        style="min-width: 250px; overflow-wrap: anywhere !important"
      />

      <Column field="price" header="Price" :sortable="true" style="min-width: 120px">
        <template #body="{ data }">
          {{ data.price }} {{ data.currency }}
        </template>
      </Column>

      <Column header="Duration" field="duration" :sortable="true"  style="min-width: 150px">
        <template #body="{ data }">
          {{ data.duration }} {{ data.duration_month }}
        </template>
      </Column>
    </DataTable>

    <Loading v-if="isLoading"></Loading>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useCustomList } from "./useCustomList";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Loading from "@/components/Loading.vue";

export default defineComponent({
  name: "CustomList",
  components: {
    DataTable,
    InputText,
    Column,
    Loading,
  },
  setup() {
    const {
      custom,
      errors,
      isLoading,
      totalRecords,
      lazyParams,
      dt,
      search,
      onSort,
      typeOptionData,
      onPage,
      selectedType,
      resetSearch,
    } = useCustomList();

    return {
      errors,
      custom,
      typeOptionData,
      isLoading,
      totalRecords,
      selectedType,
      lazyParams,
      dt,
      search,
      onSort,
      onPage,
      resetSearch,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@/assets/css/custom-table.scss";
.custom-border {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 1rem;
  position: relative;
  margin-top: 0px;
}
</style>