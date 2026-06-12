import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { multisortConvert } from "@/utils/multisort";
import { useDebounceFn } from "@/utils/debounce";
import { Errors } from "@/utils/validation";
import { useCustomStore } from "../store";

export const useCustomList = () => {
  /**
   * Initialize set data
   */
  const dt = ref();
  const search = ref("");
  const totalRecords = ref(10);
  const isLoading = ref(false);
  const custom = ref([]);
  const selectedType = ref(null);
  const typeOptionData = ref([]);
  const lazyParams = ref({});
  const store = useCustomStore();
  const errors = new Errors();

  onBeforeUnmount(() => {
    store.$reset();
    store.$dispose();
  });

  const resetPagination = () => {
    lazyParams.value = {
      page: 0,
      rows: dt.value.rows,
      multiSortMeta: [],
      first: 0,
    };
  };

  const onPage = (event) => {
    lazyParams.value = event;
    lazyParams.value.page = event.page;
    loadingData();
  };

  const onSort = (event) => {
    lazyParams.value = event;
    lazyParams.value.page = 0;
    lazyParams.value.first = 0;
    loadingData();
  };

  const loadingData = async () => {
    isLoading.value = true;

    await store.fetchAll({
      page: lazyParams.value.page + 1,
      per_page: lazyParams.value.rows,
      order: multisortConvert(lazyParams.value.multiSortMeta),
      type: selectedType.value,
      search: search.value,
    });

    const response = store.getAllResponse;

    if (response) {
      const { data } = response;
      custom.value = data.data || [];
      totalRecords.value = response.data.total;
    }
    isLoading.value = false;
  };

  // const fetchTypes = async () => {
  //   await store.fetchTypes();
  //   const response = store.getTypesResponse;
  //   if (response && response.data) {
  //     typeOptionData.value = response.data;
  //   }
  // };

  onMounted(() => {
    resetPagination();
    loadingData();
    // fetchTypes();
  });

  const resetSearch = () => {
    resetPagination();
    search.value = "";
    selectedType.value = null;
  };

  watch([selectedType], () => {
    lazyParams.value.page = 0;
    loadingData();
  });

  watch(
    [search],
    useDebounceFn(() => {
      resetPagination();
      loadingData();
    }, 500)
  );

  return {
    selectedType,
    custom,
    typeOptionData,
    errors,
    isLoading,
    totalRecords,
    lazyParams,
    dt,
    search,
    onSort,
    onPage,
    resetSearch,
  };
};