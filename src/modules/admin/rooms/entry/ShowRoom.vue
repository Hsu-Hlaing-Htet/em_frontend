<template>
        <div class="flex justify-end p-4">
            <div class="flex gap-2">
                <router-link :to="{ name: 'roomList' }">
                    <Button label="Back" />
                </router-link>
                <router-link v-if="state.id" :to="{ name: 'editRoom', params: { id: state.id } }">
                    <Button
                icon="pi pi-pencil"
                text
                severity="info"
                class="p-2"
            />
                </router-link>
            </div>
        </div>

        <div class="admin-panel relative mx-auto max-w-6xl p-2">
            <div v-if="roomImages.length" class="mt-8">

<h2
    class="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]"
>
    Image Gallery
</h2>

<div class="overflow-hidden">
    <img
        v-if="coverImage"
        :src="coverImage.image_url"
        :alt="coverImage.description"
        class="h-[420px] w-full object-cover"
    >
    <p class="text-md text-[var(--admin-text)] pt-2">
        {{ coverImage.description }}
    </p>
</div>

<div class="mt-4 flex flex-wrap gap-3">
    <button
        v-for="image in roomImages"
        :key="image.id"
        type="button"
        class="overflow-hidden border transition"
        :class="
            coverImage?.id === image.id
                ? 'border-[var(--admin-primary)]'
                : 'border-[var(--admin-border)]'
        "
        @click="selectCoverImage(image.id)"
    >
        <img
            :src="image.image_url"
            :alt="image.description"
            class="h-20 w-28 object-cover"
        >
  
    </button>
</div>

</div>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2">

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Building
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.building_name }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm text-[var(--admin-text-muted)]">
        Room Number
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.room_number }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Floor Number
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.floor_number }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Area (sqft)
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.area_sqft }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Type
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.type }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Status
    </p>

    <p class="text-sm text-[var(--admin-primary)]">
        {{ state.status }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Sale Price
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.sale_price || '-' }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Rent Price
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.rent_price || '-' }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Rent Deposit Price
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.rent_deposit_price || '-' }}
    </p>
</div>

<div class="p-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Booking Deposit Price
    </p>

    <p class="text-sm text-[var(--admin-text)]">
        {{ state.booking_deposit_price || '-' }}
    </p>
</div>

<div class="p-2 md:col-span-2">
    <p class="mb-2 text-sm uppercase tracking-wider text-[var(--admin-text-muted)]">
        Description
    </p>

    <p class="leading-7 text-sm  text-[var(--admin-text)]">
        {{ state.description || '-' }}
    </p>
</div>

</div>
        </div>

        <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useShowRoom from './useShowRoom';

export default defineComponent({
    name: 'ShowRoom',
    components: { InputText, Textarea, Button, Loading },
    setup() {
        return useShowRoom();
    },
});
</script>
