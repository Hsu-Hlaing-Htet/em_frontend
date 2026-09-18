<script setup>
const quotes = [
    {
        quote: 'The process felt calm and considered. Rosewood helped me find a home that finally matched how I want to live.',
        name: 'Thiri Aung',
        role: 'Homeowner, Bahan',
    },
    {
        quote: 'Clear guidance, beautiful residences, and a team that never rushed the decision. Rare in this market.',
        name: 'James Holt',
        role: 'Relocating executive',
    },
    {
        quote: 'From first shortlist to keys in hand, everything felt elevated without being loud.',
        name: 'May Zaw',
        role: 'Resident, Yankin',
    },
];
</script>

<template>
    <section class="rw-section rw-section--alt reveal">
        <div class="container">
            <div class="rw-section-head">
                <div>
                    <p class="rw-kicker">Voices</p>
                    <h2>Trusted quietly</h2>
                </div>
            </div>

            <div class="rw-quotes reveal-stagger">
                <blockquote
                    v-for="item in quotes"
                    :key="item.name"
                    class="rw-quote"
                >
                    <p>“{{ item.quote }}”</p>
                    <footer>
                        <strong>{{ item.name }}</strong>
                        <span>{{ item.role }}</span>
                    </footer>
                </blockquote>
            </div>
        </div>
    </section>
</template>

<style scoped>
.rw-quotes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.rw-quote {
    margin: 0;
    padding: 1.6rem;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
}

.rw-quote p {
    margin: 0;
    color: #f5f2ee;
    line-height: 1.7;
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.25rem;
}

.rw-quote footer {
    display: grid;
    gap: 0.2rem;
    margin-top: 1.25rem;
}

.rw-quote strong {
    color: #f4f0e8;
    font-weight: 500;
}

.rw-quote span {
    color: #777b82;
    font-size: 0.85rem;
}

@media (max-width: 900px) {
    .rw-quotes {
        grid-template-columns: 1fr;
    }
}
</style>
