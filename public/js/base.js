// offcanvas
$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});
$(document).pjax('.pjaxtest', '#pjax', { fragment: "#pjax", timeout: 10000 });
$(document).on("pjax:end", function() {
    $('#container').scrollTop(0);
    $('.row-offcanvas').removeClass('active');
    $("#content > h2,#content > h3,#content > h4,#content > h5,#content > h6").each(function(i) {
        var current = $(this);
        current.attr("id", "title" + i);
        tag = current.prop('tagName').substr(-1);
        $("#nav").append("<div style='margin-left:"+15*(tag-1)+"px'><a id='link" + i + "' href='#title" +i + "'>" + current.html() + "</a></div>");
    });
    $("pre").addClass("prettyprint linenums");
    prettyPrint();
});