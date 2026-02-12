import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visible: false,
    text: '',
    color: 'success',
    timeout: 4000,
  }),
  actions: {
    showSnackbar({ text, color = 'success', timeout = 4000 }) {
      this.text = text
      this.color = color
      this.timeout = timeout
      this.visible = true
    },
    hideSnackbar() {
      this.visible = false
    },
  },
})
