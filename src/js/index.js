import bear from './bear'


window.light_bear_main_function = function (pageType){
	switch (pageType) {
		case 'bear':
			bear();
			break;
	
		default:
			break;
	}
}