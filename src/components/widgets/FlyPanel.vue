<template>
    <div class="fly-container" ref="fly-container" :class="{'fly': draggable}">
        <div class="panel-title" @mousedown="draggable && mouseDownHandler($event)">
            <span>{{ props.title }}</span>
            <div class="button-group">
                <button class="icon-only" @click="setupDragEle()" v-if="!draggable">
                    <svg fill="#000000" width="18px" height="18px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><title>popup</title><path d="M28,4H10A2.0059,2.0059,0,0,0,8,6V20a2.0059,2.0059,0,0,0,2,2H28a2.0059,2.0059,0,0,0,2-2V6A2.0059,2.0059,0,0,0,28,4Zm0,16H10V6H28Z" stroke="#4169e1"/><path stroke="#4169e1" d="M18,26H4V16H6V14H4a2.0059,2.0059,0,0,0-2,2V26a2.0059,2.0059,0,0,0,2,2H18a2.0059,2.0059,0,0,0,2-2V24H18Z"/></svg>
                </button>
                <RotateButton direction="right" @click="layoutStore.updateLayout('right-panel', true)" v-if="!draggable"></RotateButton>
                <CloseButton v-if="draggable" @closeEvent="closeDraggablePanel()"/>
            </div>
        </div>
        <slot></slot>
        <div class="resize-bar right"></div>
        <div class="resize-bar bottom"></div>
        <div class="resize-bar corner"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import RotateButton from '../common/rotateButton.vue';
    import CloseButton from './CloseButton.vue';
    import { flexibleLayoutStore } from '../../store/flexible-layout';

    const props = defineProps({
        title: String
    });

    const draggable = ref(false);
    const flyContainer = useTemplateRef('fly-container');
    const layoutStore = flexibleLayoutStore();

    const closeDraggablePanel = () => {
        layoutStore.updateLayout('right-panel', true);
        draggable.value = false;
    }

    const setupDragEle = () => {
        const ele = flyContainer.value as HTMLElement;
        const calcStyle = ele.getBoundingClientRect();
        ele.style.top = (calcStyle.top - 32)+'px';
        ele.style.left = (calcStyle.left - 32)+'px';
        ele.style.height = calcStyle.height +'px';
        layoutStore.updateLayout('fly');
        draggable.value = true;
    }

    //add ability of movement onto popup
    const mouseDownHandler = (e: MouseEvent) => {
        let dragEle = flyContainer.value as HTMLElement;
        let eleTop;
        let eleLeft;

        // The current position of mouse in current browser
        let startX = e.clientX;
        let startY = e.clientY;
        const newStyles = window.getComputedStyle(dragEle);
        eleTop = parseInt(newStyles.top, 10);
        eleLeft = parseInt(newStyles.left, 10);

        const mouseMoveHandler = function (mouse_e: MouseEvent) {
            dragEle.style.top = eleTop + mouse_e.clientY - startY + 'px';
            dragEle.style.left = eleLeft + mouse_e.clientX - startX + 'px';
        };

        const mouseUpHandler = function () {
            // Remove the handlers of 'mousemove' and 'mouseup'
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            dragEle.style.zIndex = '99999999';
       };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }
</script>

<style lang="scss" scoped>
    .fly-container {
        width: 330px;
        min-height: 100%;
        display: block;

        .panel-title {
            height: 3rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 .75rem 0 1rem;
            border-bottom: 1px solid #cccccc;

            span {
                font-size: 1rem;
                font-weight: 500;
            }

            .button-group {
                display: flex;
                gap: .5rem;
            }
        }

        .resize-bar {
            display: none;
        }

        &.fly {
            position: fixed;
            box-shadow: 0 0 1rem 0 #a8a9ad;
            border-radius: .75rem;
            background-color: #fff;
            min-height: unset;

            .panel-title {
                cursor: move;
            }

            .resize-bar {
                display: block;
                position: absolute;
                z-index: 1;

                &.right {
                    width: 1.5rem;
                    height: 100%;
                    top: 0;
                    right: -.75rem;
                    cursor:col-resize;
                }

                &.bottom {
                    width: 100%;
                    height: 1.5rem;
                    bottom: -.75rem;
                    left: 0;
                    cursor:row-resize;
                }

                &.corner {
                    width: 1.5rem;
                    height: 1.5rem;
                    right: -.5rem;
                    bottom: -.5rem;
                    cursor: se-resize;
                    z-index: 2;
                }
            }
        }
    }
</style>