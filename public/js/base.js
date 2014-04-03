// offcanvas
$(document).ready(function() {
  $("#nav_btn").on('click', function(){
    isClicked=$(this).data('clicked');
    if (isClicked) {isClicked=false;} else {isClicked=true;}
    $(this).data('clicked',isClicked);
    if(isClicked){
      $('.aside').removeClass('visible-md visible-lg').addClass('hidden-md hidden-lg');
      $('.aside3').removeClass('col-md-8 col-lg-8').addClass('col-md-12 col-lg-12');
      $('.aside3-content').removeClass('col-md-12').addClass('col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1');
      $('#nav_btn i').removeClass('fa-angle-left').addClass('fa-angle-right');
    }else{
      $('.aside').addClass('visible-md visible-lg').removeClass('hidden-md hidden-lg')
      $('.aside3').removeClass('col-md-12 col-lg-12').addClass('col-md-8 col-lg-8');
      $('.aside3-content').removeClass('col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1').addClass('col-md-12');
      $('#nav_btn i').removeClass('fa-angle-right').addClass('fa-angle-left');
    }
  });
  $("#content_btn").on('click', function(){
    isClicked=$(this).data('clicked');
    if (isClicked) {isClicked=false;} else {isClicked=true;}
    $(this).data('clicked',isClicked);
    if(isClicked){
      $('#content_table').show();
      $('#content_btn i').removeClass('fa-angle-down').addClass('fa-angle-up');
    }else{
      $('#content_table').hide();
      $('#content_btn i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
  });
  $(document).pjax('.pjaxlink', '#pjax', { fragment: "#pjax", timeout: 10000 });
  $(document).on("pjax:end", function() {
    if($("body").find('.container').width() < 992)
      $('#nav_btn').click();
    $('.aside3').scrollTop(0);
    contentEffects();
  });
  $('body').on('click', '.show-commend', function(){
    var ds_loaded = false;
    window.disqus_shortname = $('.show-commend').attr('name');
    $.ajax({
      type: "GET",
      url: "http://" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });
  });
  contentEffects();
});
function contentEffects(){
  //remove the asidebar
  $('.row-offcanvas').removeClass('active');
  if($("#nav")){
    $("#content > h2,#content > h3,#content > h4,#content > h5,#content > h6").each(function(i) {
        var current = $(this);
        current.attr("id", "title" + i);
        tag = current.prop('tagName').substr(-1);
        $("#nav").append("<div style='margin-left:"+15*(tag-1)+"px'><a id='link" + i + "' href='#title" +i + "'>" + current.html() + "</a></div>");
    }); 
    $("pre").addClass("prettyprint");
    prettyPrint(); 
    $('#content img').addClass('img-thumbnail').parent('p').addClass('center');
  }
}
