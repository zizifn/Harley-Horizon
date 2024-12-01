<template>
    <div class="wheel" :data-step="activeIndex" :class="isSlideOut? 'slide-out' : ''">
        <div class="circle">
            <div class="slide" v-for="index in 6" :data-index="index" @click="switchViewContainer(index)"></div>
            <div class="bar"></div>
        </div>
        <div class="center" @click="slideOut()" v-text="centerContent[activeIndex]"></div>
    </div>
</template>

<style lang="scss" scoped>
    @use "../../assets/style/wheel.scss";
</style>

<script lang="ts" setup>
    import {ref, watch} from 'vue';

    const isSlideOut = ref(false);
    const activeIndex = ref(0);
    const centerContent = ref(["Harley's Lib", "Widgets", "Apps", "Layouts"]);
    const emits = defineEmits(['updateActiveIndex']);
    
    watch(activeIndex, (newValue)=>emits('updateActiveIndex', newValue))

    function slideOut () {
        if (!isSlideOut.value) {
            isSlideOut.value = true;
            setTimeout(() => {
                activeIndex.value = 1;
            }, 600);
            
        }
    }

    function switchViewContainer (index: number) {
        if (index <4 && isSlideOut.value) {
            activeIndex.value = index;
        }
    }
</script>