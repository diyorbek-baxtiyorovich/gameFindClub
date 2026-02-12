import { h } from 'vue'

const aliases = {
  calendar: 'ti ti-calendar',
  collapse: 'ti ti-chevron-up',
  complete: 'ti ti-check',
  cancel: 'ti ti-x',
  close: 'ti ti-x',
  delete: 'ti ti-circle-x-filled',
  clear: 'ti ti-circle-x',
  success: 'ti ti-circle-check',
  info: 'ti ti-info-circle',
  warning: 'ti ti-alert-triangle',
  error: 'ti ti-alert-circle',
  prev: 'ti ti-chevron-left',
  ratingEmpty: 'ti ti-star',
  ratingFull: 'ti ti-star-filled',
  ratingHalf: 'ti ti-star-half-filled',
  next: 'ti ti-chevron-right',
  delimiter: 'ti ti-circle',
  sort: 'ti ti-arrow-up',
  expand: 'ti ti-chevron-down',
  menu: 'ti ti-menu-2',
  subgroup: 'ti ti-caret-down',
  dropdown: 'ti ti-chevron-down',
  edit: 'ti ti-pencil',
  loading: 'ti ti-refresh',
  first: 'ti ti-player-skip-back',
  last: 'ti ti-player-skip-forward',
  unfold: 'ti ti-arrows-move-vertical',
  file: 'ti ti-paperclip',
  plus: 'ti ti-plus',
  minus: 'ti ti-minus',
  sortAsc: 'ti ti-arrow-up',
  sortDesc: 'ti ti-arrow-down',
}

export const iconify = {
  component: (props) =>
    h(props.tag, {
      ...props,
      class: [props.icon],
      tag: undefined,
      icon: undefined,
    }),
}

export const icons = {
  defaultSet: 'iconify',
  aliases,
  sets: {
    iconify,
  },
}
