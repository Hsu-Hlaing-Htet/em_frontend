<script setup>
import { reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { submitContactMessage } from '@/modules/public/service';

const toast = useToast();
const sending = ref(false);

const form = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
});

async function submit() {
    sending.value = true;

    try {
        await submitContactMessage(form);
        toast.add({ severity: 'success', summary: 'Message Sent', detail: 'We will contact you shortly.', life: 3000 });
        form.name = '';
        form.email = '';
        form.phone = '';
        form.message = '';
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Failed', detail: error.response?.data?.message || 'Could not send message.', life: 3500 });
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <section class="rr-section">
        <div class="rr-container rr-layout-columns">
            <div class="rr-col-6 rr-card" style="padding: 1rem">
                <h1 style="margin-top: 0">Contact Rosewood Royale</h1>
                <p class="rr-muted">Phone: +95 9 55000001</p>
                <p class="rr-muted">Email: hello@rosewoodroyale.com</p>
                <p class="rr-muted">Office: No. 18, Yankin Township, Yangon</p>
                <div class="rr-card" style="margin-top: 1rem; min-height: 170px; display: grid; place-items: center">
                    <span class="rr-muted">Map Placeholder</span>
                </div>
            </div>
            <div class="rr-col-6 rr-card" style="padding: 1rem">
                <p class="rr-title" style="font-size: 0.75rem">Contact Form</p>
                <div class="rr-grid">
                    <div>
                        <label class="rr-muted">Name</label>
                        <PvInputText v-model="form.name" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Email</label>
                        <PvInputText v-model="form.email" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Phone</label>
                        <PvInputText v-model="form.phone" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Message</label>
                        <PvTextarea v-model="form.message" rows="5" style="width: 100%" />
                    </div>
                </div>
                <PvButton :loading="sending" label="Send Message" style="margin-top: 1rem" @click="submit" />
            </div>
        </div>
    </section>
</template>
