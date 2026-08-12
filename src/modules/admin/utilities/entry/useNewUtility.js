import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatter';
import { useUtilityStore } from '../store';
import { useRoomStore } from '@/modules/admin/rooms/store';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';
import { useBuildingStore } from '@/modules/admin/buildings/store';
import { formatBillingMonth, formatOptionalUnitValue, formatUnitValue, recalcEntry } from '../utils/utilityFormHelpers';

let nextRowId = 1;

const createReadingRow = ({ roomId = null, roomLabel = '', billingMonth = null } = {}) => ({
    id: nextRowId++,
    room_id: roomId,
    room_label: roomLabel,
    billing_month: billingMonth,
    utility_type_id: null,
    previous_reading: 0,
    current_reading: 0,
    usage: 0,
    unit_price: null,
    amount: 0,
    isRowLoading: false,
    rowError: '',
});

export default function useNewUtility() {
    const store = useUtilityStore();
    const roomStore = useRoomStore();
    const utilityTypeStore = useUtilityTypeStore();
    const buildingStore = useBuildingStore();
    const router = useRouter();
    const isLoading = ref(false);
    const isSaving = ref(false);
    const errors = new Errors();
    const roomOptions = ref([]);
    const buildingOptions = ref([]);
    const utilityTypeOptions = ref([]);
    const readingRows = ref([createReadingRow()]);

    const backRoute = { name: 'utilityList' };

    const createState = reactive({
        building_id: null,
        room_id: null,
        billing_month: null,
    });

    const selectedRoomLabel = computed(() => (
        roomOptions.value.find((room) => room.value === createState.room_id)?.label || ''
    ));

    const canAddRow = computed(() => (
        Boolean(createState.building_id)
        && Boolean(createState.room_id)
        && Boolean(formatBillingMonth(createState.billing_month))
    ));

    const syncRowsContext = () => {
        const billingMonth = createState.billing_month instanceof Date
            ? new Date(createState.billing_month)
            : createState.billing_month;

        readingRows.value = readingRows.value.map((row) => ({
            ...row,
            room_id: createState.room_id,
            room_label: selectedRoomLabel.value,
            billing_month: billingMonth,
        }));
    };

    const ensureDefaultRow = () => {
        if (readingRows.value.length === 0) {
            readingRows.value = [createReadingRow()];
        }
    };

    const loadBuildingRooms = async (buildingId) => {
        if (!buildingId) {
            roomOptions.value = [];
            createState.room_id = null;
            return;
        }

        await roomStore.fetchAll({
            per_page: 200,
            building_id: buildingId,
        });

        const rooms = roomStore.getAllResponse;
        roomOptions.value = (rooms?.data?.data || []).map((room) => ({
            label: room.room_number,
            value: room.id,
        }));

        if (!roomOptions.value.some((room) => room.value === createState.room_id)) {
            createState.room_id = null;
        }
    };

    const patchReadingRow = (rowId, patch) => {
        readingRows.value = readingRows.value.map((row) => {
            if (row.id !== rowId) {
                return row;
            }

            const updated = { ...row, ...patch };
            recalcEntry(updated);

            return updated;
        });
    };

    const loadRowData = async (rowId) => {
        const row = readingRows.value.find((entry) => entry.id === rowId);

        if (!row) {
            return;
        }

        const billingMonth = formatBillingMonth(row.billing_month);

        if (!row.utility_type_id) {
            patchReadingRow(rowId, {
                previous_reading: 0,
                unit_price: null,
                rowError: '',
            });

            return;
        }

        patchReadingRow(rowId, { isRowLoading: true, rowError: '' });

        try {
            if (row.room_id && billingMonth) {
                const response = await store.fetchFormData({
                    utility_type_id: row.utility_type_id,
                    billing_month: billingMonth,
                    room_ids: [row.room_id],
                });

                const previous = response?.data?.rooms?.[0];
                patchReadingRow(rowId, {
                    previous_reading: Number(previous?.previous_reading || 0),
                    unit_price: Number(response.data.unit_price),
                    isRowLoading: false,
                    rowError: '',
                });

                return;
            }

            const response = await store.fetchActiveRate({
                utility_type_id: row.utility_type_id,
            });

            patchReadingRow(rowId, {
                previous_reading: 0,
                unit_price: Number(response.data.unit_price),
                isRowLoading: false,
                rowError: '',
            });
        } catch (error) {
            const rowError = error?.data?.message
                || 'No active utility rate found for the selected utility type.';

            patchReadingRow(rowId, {
                previous_reading: row.room_id && billingMonth ? row.previous_reading : 0,
                unit_price: null,
                isRowLoading: false,
                rowError,
            });
        }
    };

    const handleCurrentReadingChange = (rowId, value) => {
        patchReadingRow(rowId, { current_reading: value ?? 0 });
    };

    const addReadingRow = () => {
        if (!canAddRow.value) {
            return;
        }

        const billingMonth = createState.billing_month instanceof Date
            ? new Date(createState.billing_month)
            : createState.billing_month;

        readingRows.value.push(createReadingRow({
            roomId: createState.room_id,
            roomLabel: selectedRoomLabel.value,
            billingMonth,
        }));
    };

    const removeReadingRow = (rowId) => {
        if (readingRows.value.length <= 1) {
            readingRows.value = [createReadingRow()];
            syncRowsContext();
            return;
        }

        readingRows.value = readingRows.value.filter((row) => row.id !== rowId);
    };

    const handleUtilityTypeChange = async (rowId, utilityTypeId) => {
        patchReadingRow(rowId, { utility_type_id: utilityTypeId });
        await loadRowData(rowId);
    };

    watch(() => createState.building_id, async (buildingId) => {
        createState.room_id = null;
        createState.billing_month = null;
        readingRows.value = [createReadingRow()];

        await loadBuildingRooms(buildingId);
    });

    watch(
        () => [createState.room_id, createState.billing_month],
        async () => {
            syncRowsContext();

            await Promise.all(
                readingRows.value
                    .filter((row) => row.utility_type_id)
                    .map((row) => loadRowData(row.id)),
            );
        },
    );

    onMounted(async () => {
        isLoading.value = true;

        try {
            await Promise.all([
                buildingStore.fetchAll({ per_page: 100 }),
                utilityTypeStore.fetchAll({ per_page: 100, status: 'active' }),
            ]);

            const buildings = buildingStore.getAllResponse;
            if (buildings?.data?.data) {
                buildingOptions.value = buildings.data.data.map((building) => ({
                    label: building.building_name,
                    value: building.id,
                }));
            }

            const types = utilityTypeStore.getAllResponse;
            if (types?.data?.data) {
                utilityTypeOptions.value = types.data.data.map((type) => ({
                    label: type.name,
                    value: type.id,
                }));
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load utility form data.');
        } finally {
            isLoading.value = false;
            ensureDefaultRow();
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const totalAmount = computed(() => (
        readingRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0)
    ));

    const canCreate = computed(() => (
        Boolean(createState.building_id)
        && Boolean(createState.room_id)
        && Boolean(formatBillingMonth(createState.billing_month))
        && readingRows.value.length > 0
        && readingRows.value.every((row) => (
            Boolean(row.utility_type_id)
            && Boolean(row.room_id)
            && Boolean(formatBillingMonth(row.billing_month))
            && !row.rowError
            && Number(row.unit_price) > 0
            && Number(row.current_reading) >= Number(row.previous_reading)
        ))
    ));

    const handleSubmit = async () => {
        isSaving.value = true;
        errors.clear();

        const groupedRows = readingRows.value.reduce((groups, row) => {
            const billingMonth = formatBillingMonth(row.billing_month);
            const key = `${row.utility_type_id}:${billingMonth}`;

            if (!groups[key]) {
                groups[key] = {
                    utility_type_id: row.utility_type_id,
                    billing_month: billingMonth,
                    entries: [],
                };
            }

            groups[key].entries.push({
                room_id: row.room_id,
                current_reading: row.current_reading,
                previous_reading: row.previous_reading,
                unit_price: row.unit_price,
            });

            return groups;
        }, {});

        try {
            const batches = Object.values(groupedRows);
            let lastMessage = '';

            for (const batch of batches) {
                await store.addBatch(batch);
                lastMessage = store.getBatchAddResponse?.message || lastMessage;
            }

            if (lastMessage) {
                EventBus.emit('show-toast', { severity: 'success', summary: '', detail: lastMessage });
            }

            await router.push({ name: 'utilityList' });
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to save utility.');
            }
        } finally {
            isSaving.value = false;
        }
    };

    return {
        backRoute,
        isLoading,
        isSaving,
        errors,
        createState,
        readingRows,
        roomOptions,
        buildingOptions,
        utilityTypeOptions,
        canAddRow,
        totalAmount,
        formatCurrency,
        formatUnitValue,
        formatOptionalUnitValue,
        handleCurrentReadingChange,
        addReadingRow,
        removeReadingRow,
        handleUtilityTypeChange,
        handleSubmit,
        canCreate,
    };
}
