<template>
    <button class="close-btn" @click="close()"></button>
</template>

<script lang="ts" setup>
    const emits = defineEmits(['closeEvent']);

    const close = () => {
        emits('closeEvent', null);
    }

</script>

<style lang="scss" scoped>
    .close-btn {
        width: 1.5rem;
        height: 1.5rem;
        overflow: hidden;
        border-radius: 50%;
        background-color: transparent;
        border: none;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:before, &:after {
            width: 0;
            height: 1rem;
            border-left: 1px solid #141414;
            position: relative;
            display: block;
            content: "";
            transform: rotate(-45deg);
        }

        &:after {
            transform: rotate(45deg);
            left: -.5px;
        }
    }
</style>