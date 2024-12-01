<template>
    <nav>
        <a href="javascript:void(0)" class="site-logo"></a> <span>{{ props.title }}</span>
    </nav>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: String
    });

</script>

<style lang="scss" scoped>
    nav {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        background-color: #fff;
        
        .site-logo {
            height: 36px;
            display: inline-block;
            width: 120px;
            background-image: url(../../assets/images/logo_2.svg);
            background-repeat: no-repeat;
            background-size: 280px;
            background-position: -15px center;
            cursor: pointer;
            border: none!important;
            outline: none!important;
        }

        span {
            color: #141414;
            font-size: 1.25rem;
            font-weight: 400;
        }
    }
</style>