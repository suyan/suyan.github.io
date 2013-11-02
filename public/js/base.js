// offcanvas
$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
  $(document).pjax('.pjaxlink', '#pjax', { fragment: "#pjax", timeout: 10000 });
  $(document).on("pjax:end", function() {
      $('.aside3').scrollTop(0);
      contentEffects();
  });
  contentEffects();
});
function contentEffects(){
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
    $('#content img').addClass('img-thumbnail').parent('p').addClass('center');
  }
  // Lazy loading Disqus
  var ds_loaded = false;
  var top = $("#disqus_thread").offset().top;
  var identifier = $('#identifier').text();
  window.disqus_shortname = 'suyan-zh';
  window.disqus_identifier = identifier;

  function check(){
    if ( !ds_loaded && $('.aside3').scrollTop() + $('.aside3').height() >= top ) {
      $.ajax({
        type: "GET",
        url: "http://" + disqus_shortname + ".disqus.com/embed.js",
        dataType: "script",
        cache: true
      });
      ds_loaded = true;
    }
  }
  $('.aside3').scroll(check);
  check();
}
