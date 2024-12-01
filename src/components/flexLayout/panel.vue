<template>
    <div class="panel-container">
        <h3>{{ props.title }}</h3>
        
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: String
    });
</script>

<style lang="scss" scoped>
    .panel-container {
        padding: .75rem;

        h3 {
            font-size: 2rem;
        }
    }
</style>