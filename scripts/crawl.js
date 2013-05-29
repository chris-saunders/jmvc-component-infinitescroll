// load('infinitescroll/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("infinitescroll/infinitescroll.html","infinitescroll/out")
});
