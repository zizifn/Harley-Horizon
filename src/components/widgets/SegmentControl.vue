<template>
    <span class="sr-only" :id="props.id" aria-hidden="true">Action</span>
    <div class="segment-control" role="radiogroup" :aria-labelledby="props.id" :style="c_style">
        <input type="radio" :name="props.id" v-for="(option, index) in props.options" :data-label="option" :key="index" v-bind:checked="index === 0" :value="option" @change="optionChange($event)">
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        id : String,
        options: Array,
        c_style: String
    });

    const emits = defineEmits(['optionChange']);

    const optionChange = (e: Event) =>{
        emits('optionChange', (e.target as HTMLInputElement).value);
    }
</script>

<style lang="scss" scoped>
    .segment-control {
        background-color: #fff;
        border: 0.0625rem solid #888;
        border-radius: .5rem;
        padding: .25rem;
        height: 2.25rem;
        display: flex;
        column-gap: 5px!important;
        box-sizing: border-box;
        position: relative;
        width: 6rem;

        *{
            box-sizing: border-box;
        }

        &:before {
            border-left: 0.0625rem solid #888;
            height: 1.25rem;
            display: block;
            content: "";
            position: absolute;
            left: calc(50% - .25px);
            top: 0.5rem;
        }


        input[type="radio"] {
            appearance: none;
            height: 1.625rem;
            line-height: 1.625rem;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: calc(50% - 0.15625rem);
            border-radius: .25rem;
            padding: 0;
            box-sizing: border-box;
            cursor: pointer;
            outline: none!important;

            &:before {
                content: attr(data-label);
                display: block;
                color: #141414;
                font-size: .875rem;
            }

            &:checked {
                background-color: #4169e1;
                &:before {
                    color: #fff;
                }
            }
        }
    }
</style>