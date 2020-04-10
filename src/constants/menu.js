const data = [
	{
		id: 'dashboards',
		icon: 'iconsminds-shop-4',
		label: 'Dashboards',
		to: '/'
	},
	{
		id: 'Users',
		icon: 'simple-icon-people',
		label: 'Users',
		to: '/users',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Users',
				to: '/users'
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add User',
				to: '/add-user'
			}
		]
	},
	{
		id: 'Listener',
		icon: 'simple-icon-people',
		label: 'Listener',
		to: '/listener',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Listener',
				to: '/listener'
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add Listener',
				to: '/add-listener'
			}
		]
	},
	{
		id: 'App Informations',
		icon: 'iconsminds-monitor---phone',
		label: 'App Informations',
		to: '/app-information'
	}
];
export default data;
