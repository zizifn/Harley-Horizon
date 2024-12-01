<template>
    <div class="carousel-container" aria-labelledby="key1" role="application">
        <rotateButton direction="left"  @click="moveBackward()"></rotateButton>
        <div class="slide-container" :class="moveDirection" id="carousel_section" role="region" aria-live="polite" aria-atmoic="true" aria-label="carousel" ref="slide-container">
            <div aria-hidden="false" class="slide active">
                <h3>Keyboard Navigation</h3>
                <ul>
                    <li>Focus order -- Naturally from top to bottom, from left to right;
                        <span style="margin-left: 105px;">Special purpose: eg: skip to certain content(logic control)</span>
                    </li>
                    <li>Focus trap</li>
                </ul>
            </div>
            <div aria-hidden="true" class="slide">
                <h3>Screen reader -- Aria* basic knowledge</h3>
                <ul>
                    <li>Name -- label, description</li>
                    <li>Role -- tab panel, modal, combobox, group... Semantic HTML (landmark)</li>
                    <li>Status -- aria-selected, aria-disabled, aria-collapsed, aria-invalid, aria-hidden...</li>
                    <li>Properties -- aria-haspopup, aria-controls, aria-live, aria-required...</li>
                </ul>
            </div>
            <div aria-hidden="true" class="slide">
                <h3>Screenreader mode</h3>
                <ul>
                    <li>Browser mode</li>
                    <li>Application mode</li>
                </ul>
            </div>
            <div aria-hidden="true" class="slide">
                <h3>Screenreader compatbility</h3>
                <ul>
                    <li>Mac -- voiceover + safari</li>
                    <li>Win -- nvda + chrome</li>
                    <li>Win -- jaws + chrome</li>
                    <li>Win -- narrator + edge</li>
                </ul>
            </div>
        </div>
        <rotateButton direction="right" @click="moveForward()"></rotateButton>
    </div>
</template>

<script lang="ts" setup>
    import { ref, useTemplateRef, onMounted } from 'vue';
    import rotateButton from '../common/rotateButton.vue';

    const slideContainer = useTemplateRef('slide-container');
    const activeIndex = ref(0);
    const slides = ref([]);
    const moveDirection = ref('');
    
    onMounted(()=>{
        slides.value = Array.from(slideContainer.value?.querySelectorAll('.slide')!);
    }) 
    
    function moveForward(){
        if (activeIndex.value + 1 < slides.value.length){
            const current = slides.value[activeIndex.value] as HTMLElement;
            const next = slides.value[activeIndex.value + 1] as HTMLElement;
            next.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                moveDirection.value = 'forward';
            }, 1);
            setTimeout(()=>{
                moveDirection.value = '';
                next.classList.add('active');
                if (slideContainer.value!.querySelectorAll('.slide.active').length >1) {
                    current.className = 'slide previous';
                    current.setAttribute('aria-hidden', 'true');
                }
            }, 400);
            activeIndex.value ++;
        }
    }

    function moveBackward () {
        if (activeIndex.value > 0){
            const current = slides.value[activeIndex.value] as HTMLElement;
            const pre = slides.value[activeIndex.value - 1] as HTMLElement;
            pre.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                moveDirection.value = 'backward';
            }, 1);

            setTimeout(()=>{
                moveDirection.value = '';
                pre.className ='slide active';
                current.className = 'slide';
                current.setAttribute('aria-hidden', 'true');
            }, 400);
            activeIndex.value --;
        }
    }
</script>

<style lang="scss" scoped>
    .carousel-container {
        width: 100%;
        display: flex;
        column-gap: 1.25rem;
        height: 260px;
        align-items: center;

        button.navigator {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-width: 1.5rem;
            height: 1.5rem;
            border: none;
            background-color: transparent;
            outline: none;
        }

        .slide-container {
            height: 100%;
            flex-grow: 1;
            padding: .25rem;
            position: relative;

            .slide {
                height: calc(100% - .5rem);
                width: calc(100% - .5rem);
                box-shadow: 0 0 16px 0 #a8a9ad;
                border-radius: .5rem;
                position: absolute;
                top: .25rem;
                background-color: #fff;
                display: none;
                flex-direction: column;
                padding: 1rem;
                left: .25rem;
                transition: left .4s linear;

                &.active {
                    display: flex;
                }

                &[aria-hidden="false"]:not(.active) {
                    left: 100%;
                    display: flex;
                }

                &[aria-hidden="false"].previous {
                    left: -100%;
                    display: flex;
                }

                h3 {
                    color: #4169e1;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                ul{
                    li {
                        list-style-type: none;
                        padding-left: 1.5rem;
                        margin-bottom: 1rem;
                        font-size: 1rem;
                        line-height: 1.5;
                        position: relative;
                        font-weight: 500;

                        span {
                            display: block;
                        }

                        &:before {
                            content: "";
                            display: block;
                            width: .25rem;
                            height: .25rem;
                            background-color: #4169e1;
                            transform: rotate(-45deg);
                            position: absolute;
                            left: .75rem;
                            top: .625rem;
                        }
                    }
                }
            }

            &.forward {
                .slide {
                    &.active {
                        left: -100%;
                    }

                    &[aria-hidden="false"]:not(.active) {
                        left: .25rem;
                    }
                }
            }

            &.backward {
                .slide {
                    &.active {
                        left: 100%;
                    }

                    &[aria-hidden="false"].previous {
                        left: .25rem;
                    }
                }
            }
        }
    }
</style>