// offcanvas
$(document).ready(function() {
  $("#nav_btn").toggle(
    function () {
      $('.aside').removeClass('visible-md visible-lg').addClass('hidden-md hidden-lg');
      $('.aside3').removeClass('col-md-8 col-lg-8').addClass('col-md-12 col-lg-12');
      $('.aside3-content').removeClass('col-md-12').addClass('col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1');
    },
    function () {
      $('.aside').addClass('visible-md visible-lg').removeClass('hidden-md hidden-lg')
      $('.aside3').removeClass('col-md-12 col-lg-12').addClass('col-md-8 col-lg-8');
      $('.aside3-content').removeClass('col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1').addClass('col-md-12');
    }
  );
  $(document).pjax('.pjaxlink', '#pjax', { fragment: "#pjax", timeout: 10000 });
  $(document).on("pjax:end", function() {
      $('.aside3').scrollTop(0);
      contentEffects();
  });
  $('.show-commend').live('click',function(){
    var ds_loaded = false;
    window.disqus_shortname = 'suyan-zh';
    $.ajax({
      type: "GET",
      url: "http://" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });
  });
  contentEffects();
});
var CodePenEmbed={width:"100%",init:function(){this.showCodePenEmbeds(),this.listenToParentPostMessages()},showCodePenEmbeds:function(){var e=document.getElementsByClassName("codepen");for(var t=e.length-1;t>-1;t--){var n=this._getParamsFromAttributes(e[t]);n=this._convertOldDataAttributesToNewDataAttributes(n);var r=this._buildURL(n),i=this._buildIFrame(n,r);this._addIFrameToPage(e[t],i)}},_getParamsFromAttributes:function(e){var t={},n=e.attributes;for(var r=0,i=n.length;r<i;r++)name=n[r].name,name.indexOf("data-")===0&&(t[name.replace("data-","")]=n[r].value);return t},_convertOldDataAttributesToNewDataAttributes:function(e){return e.href&&(e["slug-hash"]=e.href),e.type&&(e["default-tab"]=e.type),e.safe&&(e["safe"]=="true"?e.animations="run":e.animations="stop-after-5"),e},_buildURL:function(e){var t=this._getHost(e),n=e.user?e.user:"anon",r="?"+this._getGetParams(e),i=[t,n,"embed",e["slug-hash"]+r].join("/");return i.replace(/\/\//g,"//")},_getHost:function(e){return e.host?e.host:document.location.protocol=="file:"?"http://codepen.io":"//codepen.io"},_getGetParams:function(e){var t="",n=0;for(var r in e)t!==""&&(t+="&"),t+=r+"="+encodeURIComponent(e[r]);return t},_buildIFrame:function(e,t){var n={id:"cp_embed_"+e["slug-hash"].replace("/","_"),src:t,scrolling:"no",frameborder:"0",height:this._getHeight(e),allowTransparency:"true","class":"cp_embed_iframe",style:"width: "+this.width+"; overflow: hidden;"},r="<iframe ";for(var i in n)r+=i+'="'+n[i]+'" ';return r+="></iframe>",r},_getHeight:function(e){return e.height?e["height"]=="auto"?300:e.height:300},_addIFrameToPage:function(e,t){if(e.parentNode){var n=document.createElement("div");n.innerHTML=t,e.parentNode.replaceChild(n,e)}else e.innerHTML=t},listenToParentPostMessages:function(){var eventMethod=window.addEventListener?"addEventListener":"attachEvent",eventListener=window[eventMethod],messageEvent=eventMethod=="attachEvent"?"onmessage":"message";eventListener(messageEvent,function(e){try{var dataObj=eval("("+e.data+")"),iframe=document.getElementById("cp_embed_"+dataObj.hash);iframe&&(iframe.height=dataObj.height)}catch(err){}},!1)}};
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
  CodePenEmbed.init();
}
