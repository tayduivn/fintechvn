export default  [
  {icon: 'mdi mdi-av-timer', caption: 'Dashboard', link: '/'},
  {icon: 'fa fa-user', caption: 'Users', link: '/users'},
  {icon: 'fa fa-sitemap', caption: 'Groups', link: '/groups', admin: 1},
  {
    icon: 'mdi mdi-apps', caption: 'Categories', admin: 0,
    children: [
      {icon: 'ti-layout-width-default', caption: 'Channel', link: '/categories/channels', admin: 0},
      {icon: 'ti-layout-width-default', caption: 'Agency', link: '/categories/agency', admin: 0},
      {icon: 'ti-layout-width-default', caption: 'API key', link: '/categories/api-key', admin: 0},
      {icon: 'ti-layout-width-default', caption: 'Privilege', link: '/categories/privileges', admin: 0},
    ]
  },
  {
    icon: 'fa fa-cogs', caption: 'Setting', admin: 0,
    children: [
      {icon: 'fa fa-envelope', caption: 'Mailer', link: '/settings/mailer'}
    ]
  }
];
