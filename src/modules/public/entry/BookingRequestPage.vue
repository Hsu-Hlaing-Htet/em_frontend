<script setup>
import { reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { submitViewingRequest } from '@/modules/public/service';

const toast = useToast();
const submitting = ref(false);

const form = reactive({
    property_id: null,
    requester_name: '',
    email: '',
    phone: '',
    message: '',
    preferred_date: null,
    request_type: 'viewing',
});

const typeOptions = [
    { label: 'Viewing', value: 'viewing' },
    { label: 'Booking', value: 'booking' },
];

async function submit() {
    submitting.value = true;

    try {
        await submitViewingRequest({
            ...form,
            preferred_date: form.preferred_date ? form.preferred_date.toISOString().slice(0, 10) : null,
        });

        toast.add({ severity: 'success', summary: 'Submitted', detail: 'Your request has been submitted.', life: 3000 });
        Object.assign(form, {
            property_id: null,
            requester_name: '',
            email: '',
            phone: '',
            message: '',
            preferred_date: null,
            request_type: 'viewing',
        });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Failed', detail: error.response?.data?.message || 'Failed to submit request.', life: 3500 });
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <section class="rr-section">
        <div class="rr-container" style="max-width: 760px">
            <div class="rr-card" style="padding: 1rem">
                <p class="rr-title" style="font-size: 0.76rem">Viewing / Booking Request</p>
                <p class="rr-muted">Submit your details and preferred viewing date. For booking, provide the target property ID.</p>

                <div class="rr-grid" style="grid-template-columns: 1fr 1fr">
                    <div>
                        <label class="rr-muted">Property ID</label>
                        <PvInputNumber v-model="form.property_id" :min="1" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Request Type</label>
                        <PvDropdown v-model="form.request_type" :options="typeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Your Name</label>
                        <PvInputText v-model="form.requester_name" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Phone</label>
                        <PvInputText v-model="form.phone" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Email</label>
                        <PvInputText v-model="form.email" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Preferred Date</label>
                        <PvCalendar v-model="form.preferred_date" date-format="yy-mm-dd" style="width: 100%" />
                    </div>
                    <div style="grid-column: span 2">
                        <label class="rr-muted">Message</label>
                        <PvTextarea v-model="form.message" rows="4" style="width: 100%" />
                    </div>
                </div>

                <PvButton :loading="submitting" label="Submit Request" style="margin-top: 1rem" @click="submit" />
            </div>
        </div>
    </section>
</template>
