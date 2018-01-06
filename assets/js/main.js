---
layout: null
---

$(function() {
  var toc     = $('.toc-link'),
      sidebar = $('#sidebar'),
      main    = $('#main'),
      menu    = $('#menu'),
      posttoc = $('#post-toc-menu'),
      x1, y1;

  // run this function after pjax load.
  var afterPjax = function() {
    // open links in new tab.
    $('#main').find('a').filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

    // generate toc
    var toc = $('#post-toc-ul');
    // Empty TOC and generate an entry for h1
    toc.empty().append('<li class="post-toc-li post-toc-h1"><a href="#post-title" class="js-anchor-link">' + $('#post-title').text() + '</a></li>');

    // Generate entries for h2 and h3
    $('.post').children('h2,h3').each(function() {
      // Generate random ID for each heading
      $(this).attr('id', function() {
        var ID = "", alphabet = "abcdefghijklmnopqrstuvwxyz";

        for(var i=0; i < 5; i++) {
          ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return ID;
      });

      if ($(this).prop("tagName") == 'H2') {
        toc.append('<li class="post-toc-li post-toc-h2"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
      } else {
        toc.append('<li class="post-toc-li post-toc-h3"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
      }
    });

    // Smooth scrolling
    $('.js-anchor-link').on('click', function() {
      var target = $(this.hash);
      main.animate({scrollTop: target.offset().top + main.scrollTop() - 70}, 500);
    });

    // discus comment.
    {% if site.disqus.shortname %}
      var ds_loaded = false;
      window.disqus_shortname = "{{ site.disqus.shortname }}";
      main.scroll(function(){
        var nScrollHight = $(this)[0].scrollHeight;
        var nScrollTop = $(this)[0].scrollTop;
        if(!ds_loaded && nScrollTop + main.height() >= nScrollHight - 100) {
          $.ajax({
            type: 'GET',
            url: 'http://' + disqus_shortname + '.disqus.com/embed.js',
            dataType: 'script',
            cache: true
          });
          ds_loaded = true;
        }
      });
    {% endif %}
    // your scripts
  };
  afterPjax();

  // NProgress
  NProgress.configure({ showSpinner: false });

  // Pjax
  $(document).pjax('#sidebar-avatar, .toc-link', '#main', {
    fragment: '#main',
    timeout: 3000
  });

  $(document).on({
    'pjax:click': function() {
      NProgress.start();
      main.removeClass('fadeIn');
    },
    'pjax:end': function() {
      afterPjax();
      NProgress.done();
      main.scrollTop(0).addClass('fadeIn');
      // only remove open in small screen
      if($(window).width() <= 1024) {
        menu.add(sidebar).add(main).removeClass('open');
      }
    }
  });

  // Tags Filter
  $('#sidebar-tags').on('click', '.sidebar-tag', function() {
    var filter = $(this).data('filter');
    toc.hide();
    if (filter === 'recent') {
      toc.slice(0, {{ site.recent_num }}).fadeIn(350);
    } else {
      $('.toc-link[data-tags~=' + filter + ']').fadeIn(350);
    }
    $(this).addClass('active').siblings().removeClass('active');
  });
  // Only show recent
  toc.hide();
  toc.slice(0, {{ site.recent_num }}).fadeIn(350);

  // Menu
  menu.on('click', function() {
    $(this).add(sidebar).add(menu).add(main).toggleClass('open');
  });

  // right toc
  posttoc.on('click', function() {
    $('#post-toc').toggleClass('open');
  });

  // Search
  $('#search-input').on('input', function(e){
    var blogs = $(".toc-link").filter(function() {
      var reg = new RegExp($('#search-input').val(), "i");
      return reg.test($(this).text());
    });
    toc.hide();
    blogs.fadeIn(350);
  });

});
