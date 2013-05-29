steal("funcunit", function(){
	module("infinitescroll test", { 
		setup: function(){
			S.open("//infinitescroll/infinitescroll.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})