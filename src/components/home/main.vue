<template>
    <main>
        <div class="title-group" :data-step="activeIndex">
            <div class="title">Components</div>
            <div class="title">Applications</div>
            <div class="title">Layouts</div>
        </div>
        <wheel @updateActiveIndex="updateIndex"></wheel>
        <cards :activeIndex="activeIndex" ></cards>
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import wheel from './wheel.vue';
    import cards from './cards.vue';

    const activeIndex = ref(0);

    function updateIndex(data: number){
        activeIndex.value = data;
    }
</script>

<style lang="scss" scoped>
    main {
        flex-grow: 1;
        min-width: calc(100% - 300px);
        overflow: hidden;
        position: relative;

        .title-group {
            position: absolute;
            left: 2rem;
            top: 3rem;
            width: 800px;
            height: 3rem;

            &>div {
                font-family: "Khand"!important;
            }

            @for $i from 1 through 6 {
                &[data-step="#{$i}"] {
                    .title:nth-child(#{$i}) {
                        left: 0%;
                        transition:  left .6s linear;
                    }
                }
            }
        }

        .title {
            line-height: 1;
            display: block;
            position: absolute;
            white-space: nowrap;
            color: #ff6600;
            font-size: 4.5rem;
            left: -300%;
            transition: left .6s linear;
            font-family: 'Fidelity Sans';
            font-weight: 600;
        }
    }
</style>
