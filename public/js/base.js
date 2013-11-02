// offcanvas
$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});
$(document).pjax('.pjaxlink', '#pjax', { fragment: "#pjax", timeout: 10000 });
$(document).on("pjax:end", function() {
    $('#container').scrollTop(0);
    $('.row-offcanvas').removeClass('active');
    if($("#nav")){
      $("#content > h2,#content > h3,#content > h4,#content > h5,#content > h6").each(function(i) {
          var current = $(this);
          current.attr("id", "title" + i);
          tag = current.prop('tagName').substr(-1);
          $("#nav").append("<div style='margin-left:"+15*(tag-1)+"px'><a id='link" + i + "' href='#title" +i + "'>" + current.html() + "</a></div>");
      }); 
      $("pre").addClass("prettyprint linenums");
      prettyPrint(); 
    }
    $('#content img').addClass('img-thumbnail').parent('p').addClass('center');
    var disqus_shortname = 'suyan-zh';
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
});