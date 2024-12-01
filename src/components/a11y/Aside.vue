<template>
    <div class="title" :style="{display: props.layoutDemo? 'none': 'block'}">
        <span id="sidebar_title" aria-hidden="true">Accessibility Practice</span>
    </div>
    <div class="contract-list" ref="contract-list">
        <div class="contract" aria-label="option contract">
            <span class="sr-only" id="btn_desc" aria-hidden="true">option contract information</span>
            <button aria-controls="opt_leg1" aria-expanded="false" class="expand-btn" aria-describedby="btn_desc">
                <div><span>APR 27, 2024 105.00 CALL</span></div>
                <div><span>BUY TO OPEN 1 at $5.25</span></div>
            </button>
            <div class="expandable" id="opt_leg1">
                <div>
                    <SegmentControl id="opt_class_leg1" :options="['Buy', 'Sell']"></SegmentControl>
                    <div class="input-container">
                        <label for="qty_leg1">Quantity</label>
                        <input type="number" id="qty_leg1" step="1" value="1">
                    </div>
                </div>

                <ul aria-label="option contract information">
                    <li><span>Bid</span> <span>$5.00</span></li>
                    <li><span>Ask</span> <span>$5.12</span></li>
                    <li><span>Vol</span> <span>100</span></li>
                    <li><span>Open interest</span> <span>200</span></li>
                </ul>
            </div>

            <div class="options">
                <button class="icon-only trash" aria-label="remove this contract">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                            stroke="#000" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="icon-only more" aria-label="more action" aria-haspopup="listbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#4169e1"/>
                        <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#4169e1"/>
                        <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#4169e1"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="contract" aria-label="option contract">
            <button aria-controls="opt_leg2" aria-expanded="false" class="expand-btn" aria-describedby="btn_desc">
                <div><span>APR 27, 2024 105.00 CALL</span></div>
                <div><span>SELL TO OPEN 1 at $5.25</span></div>
            </button>
            <div class="expandable" id="opt_leg2">
                <div>
                    <SegmentControl id="opt_class_leg2" :options="['Buy', 'Sell']"></SegmentControl>
                    <div class="input-container">
                        <label for="qty_leg2">Quantity</label>
                        <input type="number" id="qty_leg2" step="1" value="1">
                    </div>
                </div>

                <ul aria-label="option contract information">
                    <li><span>Bid</span> <span>$5.00</span></li>
                    <li><span>Ask</span> <span>$5.12</span></li>
                    <li><span>Vol</span> <span>100</span></li>
                    <li><span>Open interest</span> <span>200</span></li>
                </ul>
            </div>

            <div class="options">
                <button class="icon-only trash" aria-label="remove this contract">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                            stroke="#000" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="icon-only more" aria-label="more action" aria-haspopup="listbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#4169e1"/>
                        <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#4169e1"/>
                        <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#4169e1"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="contract" aria-label="option contract">
            <button aria-controls="opt_leg3" aria-expanded="false" class="expand-btn" aria-describedby="btn_desc">
                <div><span>APR 27, 2024 105.00 CALL</span></div>
                <div><span>BUY TO OPEN 1 at $5.25</span></div>
            </button>
            <div class="expandable" id="opt_leg3">
                <div>
                    <SegmentControl id="opt_class_leg3" :options="['Buy', 'Sell']"></SegmentControl>
                    <div class="input-container">
                        <label for="qty_leg3">Quantity</label>
                        <input type="number" id="qty_leg3" step="1" value="1">
                    </div>
                </div>

                <ul aria-label="option contract information">
                    <li><span>Bid</span> <span>$5.00</span></li>
                    <li><span>Ask</span> <span>$5.12</span></li>
                    <li><span>Vol</span> <span>100</span></li>
                    <li><span>Open interest</span> <span>200</span></li>
                </ul>
            </div>

            <div class="options">
                <button class="icon-only trash" aria-label="remove this contract">
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 6.77273H9.2M19 6.77273H14.8M9.2 6.77273V5.5C9.2 4.94772 9.64772 4.5 10.2 4.5H13.8C14.3523 4.5 14.8 4.94772 14.8 5.5V6.77273M9.2 6.77273H14.8M6.4 8.59091V15.8636C6.4 17.5778 6.4 18.4349 6.94673 18.9675C7.49347 19.5 8.37342 19.5 10.1333 19.5H13.8667C15.6266 19.5 16.5065 19.5 17.0533 18.9675C17.6 18.4349 17.6 17.5778 17.6 15.8636V8.59091M9.2 10.4091V15.8636M12 10.4091V15.8636M14.8 10.4091V15.8636"
                            stroke="#000" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <button class="icon-only more" aria-label="more action" aria-haspopup="listbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#4169e1"/>
                        <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#4169e1"/>
                        <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#4169e1"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="summary">
        <ul class="quote-list" aria-label="multi legs quote information">
            <li><span>Net bid</span><span>$5.08</span></li>
            <li><span>Midpoint</span><span>$5.15</span></li>
            <li><span>Net ask</span><span>$5.20</span></li>
        </ul>

        <div class="input-container">
            <label for="qty_leg1">Order Type</label>
            <select name="" id="">
                <option value="netDebit" selected>Net Debit</option>
                <option value="netCrebit">Net Credit</option>
            </select>
   
        </div>
        <div class="input-container">
            <label for="eva_price">Evaluation Price</label>
            <input type="number" id="eva_price" value="22.48">
        </div>
    </div>

    <div class="bottom-section">
        <div class="gain-loss-group" role="group" aria-label="gain or loss estimated information">
            <div role="region" aria-live="polite" aria-atomic="true" aria-label="estimated max gain">
                <span aria-hidden="true">Estimated max gain</span>
                <span style="color: #368727">Unlimited</span>
            </div>
            <div role="region" aria-live="polite" aria-atomic="true" aria-label="estimated max loss">
                <span aria-hidden="true">Estimated max loss</span>
                <span style="color: rgba(224,22,22, .75);">-$1,748.00</span>
            </div>
            <div role="region" aria-live="polite" aria-atomic="true" aria-label="break even">
                <span aria-hidden="true">Break even</span>
                <span>AAPL at $185.02 and $222.48</span>
            </div>
            <div role="region" aria-live="polite" aria-atomic="true" aria-label="probability of profit">
                <span aria-hidden="true">Probability of profit</span>
                <div class="possible-circle" data-rate="67%">
                    
                </div>
            </div>
        </div>
        <button>Ship it</button>
    </div>
</template>

<script setup lang="ts">
    import { onMounted,useTemplateRef } from "vue";
    import SegmentControl from "../widgets/SegmentControl.vue";

    const props = defineProps({
        layoutDemo : String
    })

    const contractList = useTemplateRef('contract-list');

    onMounted(()=>{
        contractList.value?.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e)=>{
                let expBtn = (e.target as HTMLElement).closest('button');
                let status = expBtn?.getAttribute('aria-expanded') === 'true'? 'false' : 'true';
                contractList.value?.querySelector('button[aria-expanded="true"]')?.setAttribute('aria-expanded', 'false');
                expBtn?.setAttribute('aria-expanded', status);
            })
        })
    })
</script>

<style lang="scss" scoped>
    @use "../../assets/style/a11yAside.scss"
</style>