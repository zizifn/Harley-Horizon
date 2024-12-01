<template>
    <div class="cards-container" :class="{direction, widget: showWidgetFlag}">
        <div class="card" :class="{active: props.activeIndex === 1, 'past': props.activeIndex! > 1}">
            <div class="url-list">
                <a href="javascript:void(0)" v-for="(widget, index) of widgetList" :key="index" @click="showWidget(widget)">{{ widget }}</a>
            </div>
        </div>
        <div class="card" :class="{active: props.activeIndex === 2, 'past': props.activeIndex! > 2}">
            <div class="url-list">
                <router-link v-for="(app, index) of AppList" :key="index" :to="'/' + app.toLowerCase().replaceAll(' ','-')">{{ app }}</router-link>
            </div>
        </div>
        <div class="card" :class="{active: props.activeIndex === 3, 'past': props.activeIndex! > 3}">To be continued...</div>
        <div class="card">To be continued...</div>
        <div class="card">To be continued...</div>
        <div class="card">To be continued...</div>

        <div class="widget-container">
            <CloseButton @closeEvent="hideWidget()"></CloseButton>
            <harley-calendar refer-id="date_label" dark-mode="light"></harley-calendar>
        </div>
        <div class="bg"></div>
    </div>
</template>

<script setup lang="ts">
    import { watch, ref } from 'vue';
    import  '../widgets/Calendar.js';
    import CloseButton from '../widgets/CloseButton.vue';

    const widgetList = ['Calendar', 'Carousel', 'Dropdown List', 'ComboBox', 'Group Tab', 'Responsive Mobile Navigation'];
    //const AppList = ['Hackathon 2024', 'Hackathon 2023', 'Conversational UI', 'Accessibility', 'Self Custody'];
    const AppList = ['Accessibility', 'Flexible-Layout'];
    const direction = ref('forward');
    const props = defineProps({
        activeIndex: Number
    });

    const showWidgetFlag = ref(false);

    watch(()=> props.activeIndex, (newValue, oldValue)=>{
        newValue! > oldValue! ? direction.value = 'forward' : 'backward';
    })

    const showWidget = (widgetName: string) => {
        console.log(widgetName);
        widgetName = '';
        showWidgetFlag.value = true;
    }

    const hideWidget = () => {
        showWidgetFlag.value = false;
    }

</script>

<style lang="scss" scoped>
    .cards-container {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;

        &.widget {
            .widget-container {
                width: 1176px;
                height: 568px;
                left: 380px;
                top: 16rem;
                display: flex;
                z-index: 1000;
                visibility: visible;
                padding-top: 2rem;
                padding-left: 5rem;
                transition: all .4s linear;
            }

            .bg {
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0, .2);
                backdrop-filter: blur(5px);
                position: absolute;
                z-index: 999;
                top: 0;
                left: 0;
            }
        }
    }

    .widget-container {
        position: absolute;
        width: 0;
        height: 0;
        left: 50%;
        top: 50%;
        overflow: hidden;
        transition: all .4s linear;
        z-index: 2;
        visibility: hidden;
        z-index: 1000;
        background-color: #fff;
        box-shadow: 0 0 1rem 0 #a8a9ad;
        border-radius: .75rem;
        
        button {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
        }
    }

    .bg {
        z-index: -999;
    }

    .card {
        visibility: hidden;
        transform-origin: left center;
        transform: rotate(90deg);
        position: absolute;
        padding: 16rem 4rem 16rem 380px;
        width: 100%;
        height: 100%;
        transition: all .6s linear;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        &>.url-list {
            width: 100%;
            display: flex;
            gap: 2rem;
            flex-wrap: wrap;
            align-items: flex-start;
            height: fit-content;
            a {
                text-decoration: none;
                cursor: pointer;
                font-size: 2rem;
                color: #007c55;

                &:nth-child(2n) {
                    color: #ff6600;
                }
                &:nth-child(3n) {
                    color: #368727;
                }
                &:nth-child(4n) {
                    color: #4db8ff;
                }
                &:nth-child(5n) {
                    color: #a8a9ad;
                }
                &:nth-child(6n) {
                    color: #ffcd00;
                }

                &:hover {
                    color: #141414;
                }

            }
        }

        &.active {
            visibility: visible;
            transition: all .6s linear;
            transform: rotate(0deg);
        }

        &.past {
            visibility: hidden;
            transition: all .6s linear;
            transform: rotate(-90deg);
        }
    }
</style>