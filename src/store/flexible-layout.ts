import { defineStore } from 'pinia';
enum Layout {
  'LMR' = 'left-main-right',
  'M' = 'main',
  'LM' = 'left-main',
  'MR' = 'main-right'
};

export const flexibleLayoutStore = defineStore('layout', {
  state: () => ({
    layout: Layout.LM + ''
  }),
  getters: {
    getCurrentLayout(state) {
      return state.layout
    },
  },
  actions: {
    updateLayout(layoutTrigger: string, collapse?: boolean) {
      if (layoutTrigger === 'right-panel'){
        if (this.layout === Layout.LMR && collapse){
          this.layout = Layout.LM;
        } else if (this.layout === Layout.MR && collapse){
          this.layout = Layout.M;
        } else if (this.layout === Layout.LM) {
          this.layout = Layout.LMR;
        } else if (this.layout === Layout.M) {
          this.layout = Layout.MR;
        } else if (this.layout.includes('fly') && collapse) {
          this.layout = this.layout.split(" ")[0];
          if (this.layout === Layout.LMR) {
            this.layout = Layout.LM;
          } else {
            this.layout = Layout.M;
          }
        }
      } else if (layoutTrigger === 'left-panel'){
        if (this.layout === Layout.M) {
          this.layout = Layout.LM;
        } else if (this.layout === Layout.LM) {
          this.layout = Layout.M;
        } else if (this.layout === Layout.LMR) {
          this.layout = Layout.MR;
        } else if (this.layout === Layout.MR) {
          this.layout = Layout.LMR;
        }
      } else {
        this.layout = this.layout + ' ' + 'fly';
      }
    },
  },
})