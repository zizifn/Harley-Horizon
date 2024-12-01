<template>
    <div class="multi-tabs-container">
        <div class="tab-container">
            <button v-for="(tab, index) in tabGroup" :key="tab" :aria-selected="panelList.includes(index)? true:false" @click="selectTab(index)">{{ tab }}</button>
            <SegmentControl id="tab_layout" :options="['Single', 'Multiple']" c_style="width: 10rem; margin-left: auto;" @optionChange="layoutType = $event"></SegmentControl>
        </div>
        <div class="panels-container" :class="panelList.length>1? `card-${panelList.length}` : ''">
            <template  v-for="(tab, index) in panelList" :key="tab">
                <div class="panel" v-if="panelList.includes(tab)" :style="{order: index}">
                    <Panel v-if="tab === 0" :title="'Hello World'"></Panel>
                    <Panel v-if="tab === 1" :title="'Harley Vision'"></Panel>
                    <Panel v-if="tab === 2" :title="'Greeks Reloaded'"></Panel>
                    <Panel v-if="tab === 3" :title="'UX Development'"></Panel>
                    <Panel v-if="tab === 4" :title="'Accessibility'"></Panel>

                    <!-- <div class="resize-bar right"></div>
                    <div class="resize-bar bottom"></div> -->
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import SegmentControl from './SegmentControl.vue';
    import Panel from '../flexLayout/panel.vue';

    const panelList = ref([0]);
    const layoutType = ref('Single');
    // const tabGroupName = 'main-multiple-tab';
    // const activeIndex = ref(0);
    const tabGroup = ['Hello World', 'Harley Vision', 'Greeks Reloaded', 'UX Development', 'Accessibility'];


    onMounted(()=>{
        let panelContainer = document.createElement('Panel');
        let slotContent = document.createElement('template');
        slotContent.textContent = tabGroup[0];
        panelContainer.setAttribute('title', 'First Panel');
    });

    const selectTab = (index: number) =>{
        if (layoutType.value === 'Single'){
            panelList.value[0] = index;
        } else {
            if (!panelList.value.includes(index)){
                panelList.value.push(index);
            } else {
                if (panelList.value.length>1){
                    panelList.value = panelList.value.filter(item => item !== index);
                }  
            }
        }
    }

</script>

<style lang="scss" scoped>
    .multi-tabs-container {
        width: 100%;
        height: 100%;

        .tab-container {
            display: flex;
            border-bottom: 1px solid #ccc;
            gap: 1rem;
            padding: 0 1rem .75rem 1rem;

            button {
                height: 2.25rem;
                border-radius: 1.125rem;
                padding: 0 1rem;
                border: 1px solid #4169e1;
                color: #4169e1;
                background-color: #fff;
                font-size: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                outline: none!important;

                &[aria-selected="true"] {
                    color: #fff;
                    background-color: #4169e1;
                }
            }
        }

        .panels-container {
            padding: .75rem;
            height: calc(100% - 3rem);

            .panel {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: .75rem;
                position: relative;

                .resize-bar {
                    position: absolute;
                    &.right {
                        width: 1.5rem;
                        right: -.75rem;
                        height: 100%;
                        top: 0;
                        cursor:col-resize;
                    }

                    &.bottom{
                        height: 1.5rem;
                        width: 100%;
                        bottom: -.75rem;
                        left: 0;
                        cursor: row-resize;
                    }
                }
            }

            &.card-2 {
                display: flex;
                gap: .75rem;

                .panel {
                    width: calc(50% - .375rem);
                    border: 1px solid #a8a9ad;
                }
            }

            &.card-3 {
                display: flex;
                flex-wrap: wrap;
                gap: .75rem;

                .panel {
                    width: calc(50% - .375rem);
                    height: calc(50% - .375rem);
                    border: 1px solid #a8a9ad;

                    &:last-child {
                        width: 100%;
                    }
                }
            }

            &.card-3, &.card-4 {
                display: flex;
                flex-wrap: wrap;
                gap: .75rem;

                .panel {
                    width: calc(50% - .375rem);
                    height: calc(50% - .375rem);
                    border: 1px solid #a8a9ad;

                    &:last-child {
                        width: 100%;
                    }
                }
            }

            &.card-4 {
                .panel {
                    &:last-child {
                        width: calc(50% - .375rem);
                    }
                }
            }

            &.Multiple {
                .panel {
                    display: block;
                    width: 100%;
                    height: 20%;
                    
                }
            }
        }
    }
</style>