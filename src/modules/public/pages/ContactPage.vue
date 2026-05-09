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
    <section class="section">
        <div class="container layout-columns">
            <div class="col-6 card" style="padding: 1rem">
                <h1 style="margin-top: 0">Contact Rosewood Royale</h1>
                <p class="muted">Phone: +95 9 55000001</p>
                <p class="muted">Email: hello@rosewoodroyale.com</p>
                <p class="muted">Office: No. 18, Yankin Township, Yangon</p>
                <div class="card" style="margin-top: 1rem; min-height: 170px; display: grid; place-items: center">
                    <span class="muted">Map Placeholder</span>
                </div>
            </div>
            <div class="col-6 card" style="padding: 1rem">
                <p class="title" style="font-size: 0.75rem">Contact Form</p>
                <div class="grid">
                    <div>
                        <label class="muted">Name</label>
                        <PvInputText v-model="form.name" style="width: 100%" />
                    </div>
                    <div>
                        <label class="muted">Email</label>
                        <PvInputText v-model="form.email" style="width: 100%" />
                    </div>
                    <div>
                        <label class="muted">Phone</label>
                        <PvInputText v-model="form.phone" style="width: 100%" />
                    </div>
                    <div>
                        <label class="muted">Message</label>
                        <PvTextarea v-model="form.message" rows="5" style="width: 100%" />
                    </div>
                </div>
                <PvButton :loading="sending" label="Send Message" style="margin-top: 1rem" @click="submit" />
            </div>
        </div>
    </section>
</template>
