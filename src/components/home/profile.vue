<template>
    <aside :class="props.layoutDemo">
        <div class="pic-container">
            <div class="inner-container">
                <img src="../../assets/images/harley.png" alt="Harley Li">
            </div>
        </div>
        <div class="harley">
            <span>Harley Li</span>
            <span class="role">UX Developer</span>
            <div class="separate-bar"></div>
            <div class="team" :style="{display: props.layoutDemo? 'none': 'block'}">
                <span>BSO</span>
                <span>Domain</span>
            </div>
        </div>

        <div class="logo" :style="{right: props.layoutDemo? '57px': 'null', bottom: props.layoutDemo? '64px': 'null'}">
            <img src="../../assets/images/greeks.svg" alt="">
        </div>
    </aside>
</template>

<script setup lang="ts">
    const props = defineProps({
        layoutDemo: String
    });
</script>

<style lang="scss" scoped>
@font-face {
    font-family: "Khand";
    src: url(../../assets/font/Khand-Regular.ttf);
    font-weight: 400;
    font-style: normal;
}

aside {
    width: 300px;
    height: 100%;
    position: relative;
    overflow: hidden;
    
    * {
        font-family: 'Khand'!important;
    }

    .pic-container {
        width: 10rem;
        height: 25rem;
        border-radius: 0 0 10rem 10rem;
        background-color: #ff6600;
        transform: rotate(45deg);
        position: absolute;
        top: -67px;
        left: 152px;

        .inner-container {
            width: 200px;
            height: 300px;
            transform: rotate(-48deg) translate(-134px, 30px);
            border-radius: 0 0 150px 150px;
            overflow: hidden;
        }
    }

    .harley {
        position: absolute;
        top: 360px;
        display: flex;
        flex-direction: column;
        width: 100%;

        span {
            font-size: 42px;
            font-weight: 500;
            line-height: 4rem;
            display: block;
            margin: 0 auto;

            &.role {
                font-size: 20px;
                line-height: 2rem;
                background-color: #ff6600;
                color: #fff;
                font-weight: 600;
                padding: 0 1.125rem;
                border-radius: .25rem;
            }
        }

        .separate-bar {
            width: 128px;
            border-bottom: 1px solid #c0c0c0;
            height: 0;
            margin: 0 auto;
            position: relative;
            margin-top: 4rem;

            &:before,
            &:after {
                display: block;
                content: "";
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background-color: #c0c0c0;
                position: absolute;
                top: -2px;
                left: -2.5px;
            }

            &:after {
                left: unset;
                right: -2.5px;
            }
        }

        .team {
            margin: 4rem auto;

            span {
                display: block;
                font-size: 106px;
                font-weight: 300;

                &:nth-child(2) {
                    font-size: 54px;
                    color: #ff6600;
                    line-height: 1;
                    margin-top: .5rem;
                    text-align: center;
                }

                &:nth-child(3) {
                    font-size: 39px;
                    color: #ff6600;
                    line-height: 1;
                }
            }
        }
    }

    .logo {
        position: absolute;
        bottom: 85px;
        right: 43px;

        img {
            max-width: 220px;
        }
    }

    &.layout {
        * {
            font-family: 'Fidelity Sans'!important;
        }
        
        .pic-container {
            transform: rotate(-38deg);
            left: unset;

            .inner-container {
                transform: rotate(36deg) translate(92px, 83px);
            }
        }

        .pic-container, .role {
            background-color: #4169e1!important;
        }
    }
}
</style>
