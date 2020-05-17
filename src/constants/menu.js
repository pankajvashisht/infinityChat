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
		id: 'Category',
		icon: 'iconsminds-switch',
		label: 'Category',
		to: '/category',
		subs: [
			{
				icon: 'simple-icon-direction',
				label: 'Category Listing',
				to: '/categories',
			},
			{
				icon: 'iconsminds-add-basket',
				label: 'Add Category',
				to: '/add-category',
			},
		],
	},
	{
		id: 'Article',
		icon: 'iconsminds-file-horizontal',
		label: 'Article',
		to: '/article',
		subs: [
			{
				icon: 'iconsminds-files',
				label: 'Article Listing',
				to: '/articles',
			},
			{
				icon: 'iconsminds-folder-add--',
				label: 'Add Article',
				to: '/add-article',
			},
		],
	},
	{
		id: 'Goal',
		icon: 'simple-icon-clock',
		label: 'Goal',
		to: '/Goal',
		subs: [
			{
				icon: 'simple-icon-organization',
				label: 'Goal Listing',
				to: '/goals',
			},
			{
				icon: 'simple-icon-energy',
				label: 'Add Goal',
				to: '/add-goal',
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
