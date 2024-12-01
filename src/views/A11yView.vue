<template>
    <div class="a11y-view-container">
        <Nav title="Accessibility"></Nav>
        <div class="main-content-area">
            <main>
                <h1>Web Accessibility sense and basis</h1>
                <InputCarousel></InputCarousel>
            </main>
            <aside aria-labelledby="sidebar_title">
                <A11yAside/>
            </aside>
        </div>
        <Footer/>
    </div>
</template>

<script lang="ts" setup>
    import Nav from '../components/common/nav.vue'
    import Footer from '../components/common/footer.vue'
    import InputCarousel from '../components/a11y/InputCarousel.vue'
    import A11yAside from "../components/a11y/Aside.vue";
</script>

<style lang="scss" scoped>
        @use '../assets/style/common.scss';

        .a11y-view-container {
            background-color: #f2f2f2;
            display: flex;
            flex-direction: column;
            min-height: 100%;
            min-width: 100%;
    
            .main-content-area {
                flex-grow: 1;
                background-color: #ebebeb;
                padding: .75rem;
                column-gap: .75rem;
                display: flex;
                overflow: hidden;
    
                &>* {
                    border-radius: .75rem;
                    background-color: #fff;
                    overflow: hidden;
                }
    
                main {
                    flex-grow: 1;
                    min-width: calc(100% - 2rem - 330px);
                    padding: 1rem;
    
                    h1 {
                        font-size: 2.5rem;
                        font-weight: 400;
                        color: #141414;
                        margin-bottom: 1.5rem;
                    }
                }
    
                aside {
                    min-width: 330px;
                    max-width: 330px;
                    position: relative;
                }
    
                @media screen and (max-width: 1200px) {
                    flex-direction: column;
                    column-gap: 0;
                    row-gap: .75rem;
    
                    aside {
                        max-width: unset;
                        width: 100%;
                    }
                }
            }
        }
</style>