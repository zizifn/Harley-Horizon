<template>
    <div class="tabs-container">
        <div class="tab-container">
            <input type="radio" :name="tabGroupName" role="tab" v-for="(tab, index) in tabGroup" :key="tab" :aria-selected="index === activeIndex? true:false"
            :aria-controls="tab.replaceAll(' ', '_')" :aria-label="tab" v-bind:checked="index === activeIndex" :id="tab.replaceAll(' ', '_')+index"/>
        </div>
        <div class="group-tab-panel" role="tabpanel" v-for="(tab, index) in tabGroup" :key="tab" :id="tab.replaceAll(' ', '_')" :aria-labelledby="tab.replaceAll(' ', '_')+index"></div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const tabGroupName = 'main-multiple-tab';
    const activeIndex = ref(0);
    const tabGroup = ['Hello', 'World', 'Harley', 'Vision', 'UX Development', 'Frameworks'];
</script>

<style lang="scss" scoped>

</style>