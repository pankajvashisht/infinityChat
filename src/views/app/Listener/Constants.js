export const quillModules = {
	toolbar: [
		[ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
		[ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
		[ 'link', 'image' ],
		[ 'clean' ]
	]
};

export const initialState = {
	name: '',
	email: '',
	password: '',
	profile: '',
	user_type: 1,
	description: '',
};

export const quillFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image'
];
