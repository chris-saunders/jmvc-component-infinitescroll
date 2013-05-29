//js infinitescroll/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('infinitescroll/infinitescroll.html', {
		markdown : ['infinitescroll']
	});
});