<template>
    <button :class="direction">
        <div class="arrow" :class="{rotate: props.rotate}"></div>
    </button>
</template>

<script setup lang="ts">
    const props = defineProps({
        direction: String,
        rotate: Boolean
    });
</script>

<style lang="scss" scoped>
    button {
        width: 1.5rem;
        height: 1.5rem;
        background-color: transparent;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
            box-shadow: 0 0 4px 0 #a8a9ad;
            border-radius: .75rem;
        }

        .arrow {
            width: 16.4px;
            height: 16.4px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform .4s linear;

            &:before {
                content:"";
                display: block;
                border: 2px solid #000;
                border-bottom: none;
                border-right: none;
                transform-origin: center;
                transform: rotate(-45deg);
                width: .5rem;
                height: .5rem;
                position: relative;
                left: 2px;
            }

            &.rotate {
                transform: rotate(180deg);
            }
        }

        &.right {
            .arrow {
                transform: rotate(180deg);
                &.rotate {
                    transform: rotate(0deg);
                }
            }
        }

        &.up {
            .arrow {
                transform: rotate(90deg);
                &.rotate {
                    transform: rotate(-90deg);
                }
            }
        }

        &.down {
            .arrow {
                transform: rotate(-90deg);
                &.rotate {
                    transform: rotate(90deg);
                }
            }
        }
    }
</style>