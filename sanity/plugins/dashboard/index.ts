import {definePlugin} from 'sanity'
import {DashboardIcon} from '@sanity/icons'
import {DashboardTool} from './DashboardTool'

export const dashboardPlugin = definePlugin({
  name: 'dro-dashboard',
  tools: [
    {
      name: 'dashboard',
      title: 'Dashboard',
      icon: DashboardIcon,
      component: DashboardTool,
    },
  ],
})
