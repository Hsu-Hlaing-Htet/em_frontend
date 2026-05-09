<template>
    <footer class="footer">
        <div class="container layout-columns">
            <div class="col-4">
                <h3>Rosewood Royale</h3>
                <p>Luxury real estate support for premium homes, condos, and commercial spaces.</p>
                <slot name="brand-extra" />
            </div>

            <div class="col-4">
                <h3>Contact</h3>
                <p>Phone: +95 9 55000001</p>
                <p>Email: hello@rosewoodroyale.com</p>
                <p>Office: No. 18, Yankin Township, Yangon</p>
            </div>

            <div class="col-4">
                <h3>Explore</h3>
                <router-link to="/">Home</router-link>
                <router-link to="/properties">Properties</router-link>
                <router-link to="/booking">Book Viewing</router-link>
                <router-link to="/contact">Contact</router-link>
                <slot name="links-extra" />
            </div>
        </div>

        <div class="container footer-bottom">
            <small>© {{ currentYear }} Rosewood Royale. All rights reserved.</small>
        </div>
    </footer>
</template>

<script setup>
defineProps({
    currentYear: {
        type: Number,
        required: true,
    },
});
</script>
