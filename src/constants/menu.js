const data = [
	{
		id: 'dashboards',
		icon: 'iconsminds-shop-4',
		label: 'Dashboards',
		to: '/',
	},
	{
		id: 'Users',
		icon: 'simple-icon-user',
		label: 'Users',
		to: '/users',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Users',
				to: '/users',
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add User',
				to: '/add-user',
			},
		],
	},
	{
		id: 'Groups',
		icon: 'simple-icon-people',
		label: 'Groups',
		to: '/groups',
		subs: [
			{
				icon: 'simple-icon-user',
				label: 'Private Groups',
				to: '/private-groups',
			},
			{
				icon: 'simple-icon-user',
				label: 'User Groups',
				to: '/users-groups',
			},
			{
				icon: 'iconsminds-add-user',
				label: 'Add Private Groups',
				to: '/add-private-group',
			},
		],
	},
	{
		id: 'App Informations',
		icon: 'iconsminds-monitor---phone',
		label: 'App Informations',
		to: '/app-information',
	},
];
export default data;
