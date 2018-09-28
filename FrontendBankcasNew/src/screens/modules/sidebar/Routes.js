export default  [
  {icon: 'mdi mdi-av-timer', caption: 'Home', link: '/'},
  {
    icon: 'mdi mdi-apps', caption: 'Categories',
    children: [
      {icon: 'ti-layout-width-default', caption: 'Years', link: '/categories/years'},
      {icon: 'ti-layout-width-default', caption: 'Seats payload', link: '/categories/seats-payload'},
      {icon: 'ti-layout-width-default', caption: 'Rule extends', link: '/categories/rule-extend'},
    ]
  },
  {icon: 'mdi mdi-av-timer', caption: 'Request', link: '/requests'}
];