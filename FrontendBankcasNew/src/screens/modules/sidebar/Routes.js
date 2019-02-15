
export default  [
  {icon: 'mdi mdi-home', caption: 'Home', lang: "home", link: '/'},
  {
    icon: 'ti-map', caption: 'Product', lang: "product",
    children: [
      {icon: 'fa fa-car', caption: 'Motor', lang: "product_motor", link: '/product/motor'},
      {icon: 'fa fa-home', caption: 'House', lang: "product_house", link: '/product/house'}
    ]
  },
  {icon: 'mdi mdi-table', caption: 'Requests', lang: "request", link: '/requests'},
  {icon: 'mdi mdi-av-timer', caption: 'Policies', lang: "policy", link: '/policies'},
  {
    icon: 'ti-bar-chart', caption: 'Reports', lang: "reports",
    children: [
      {icon: 'ti-layout-width-default', lang: "reports_revenue", caption: 'Revenue report', link: '/reports/revenue'},
      {icon: 'ti-layout-width-default', lang: "reports_policy_expired", caption: 'To-be-expired policies', link: '/reports/policy-expired'}
    ]
  }
];