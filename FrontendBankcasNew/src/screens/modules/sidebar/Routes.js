export default  [
  {icon: 'mdi mdi-home', caption: 'Home', link: '/'},
  {
    icon: 'ti-map', caption: 'Product',
    children: [
      {icon: 'fa fa-car', caption: 'Motor', link: '/product/motor'},
      {icon: 'fa fa-home', caption: 'House', link: '/product/house'}
    ]
  },
  {icon: 'mdi mdi-table', caption: 'Requests', link: '/requests'},
  {icon: 'mdi mdi-av-timer', caption: 'Policies', link: '/policies'},
  {
    icon: 'ti-bar-chart', caption: 'Reports',
    children: [
      {icon: 'ti-layout-width-default', caption: 'Commission report', link: '/reports/commission'},
      {icon: 'ti-layout-width-default', caption: 'Revenue report', link: '/reports/revenue'},
      {icon: 'ti-layout-width-default', caption: 'To-be-expired policies', link: '/reports/policy-expired'}
    ]
  }
];