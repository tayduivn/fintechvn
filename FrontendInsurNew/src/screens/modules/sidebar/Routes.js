export default  [
  {icon: 'mdi mdi-av-timer', caption: 'Home', link: '/'},
  {
    icon: 'mdi mdi-apps', caption: 'Categories',
    children: [
      {icon: 'ti-layout-width-default', caption: 'Years', link: '/categories/years'},
      {icon: 'ti-layout-width-default', caption: 'Car type', link: '/categories/car-type'},
      {icon: 'ti-layout-width-default', caption: 'Seats', link: '/categories/seats'},
      // {icon: 'ti-layout-width-default', caption: 'Seats payload', link: '/categories/seats-payload'},
      {icon: 'ti-layout-width-default', caption: 'Rule extends', link: '/categories/rule-extends'},
      {icon: 'ti-layout-width-default', caption: 'Year House', link: '/categories/year-house'},
      {icon: 'ti-layout-width-default', caption: 'Fee name extends house', link: '/categories/fee-name-extends-house'},
      {icon: 'ti-layout-width-default', caption: 'Fee house', link: '/categories/fee-house'},
      {icon: 'ti-layout-width-default', caption: 'Fee asset house', link: '/categories/fee-asset-house'},
    ]
  },
  {icon: 'mdi mdi-credit-card', caption: 'Request', link: '/requests'},
  {icon: 'mdi mdi-calendar-multiple', caption: 'Policies', link: '/policies'},
  {
    icon: 'fa fa-cogs', caption: 'Setting',
    children: [
      {icon: 'fa fa-envelope', caption: 'Mailer', link: '/settings/mailer'},
      {icon: 'ti-layout-width-default', caption: 'Discount', link: '/settings/discount'},
    ]
  }
];