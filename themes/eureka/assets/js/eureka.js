(function () {
  'use strict';

  var root = document.documentElement;
  var modeButton = document.getElementById('color-mode');
  var navButton = document.querySelector('.nav-toggle');
  var navPanel = document.getElementById('nav-panel');

  if (modeButton) {
    modeButton.addEventListener('click', function () {
      var dark = root.classList.toggle('dark');
      localStorage.setItem('eureka-color-mode', dark ? 'dark' : 'light');
    });
  }

  if (navButton && navPanel) {
    navButton.addEventListener('click', function () {
      var open = navPanel.classList.toggle('open');
      navButton.setAttribute('aria-expanded', String(open));
    });
  }

  var markdownLink = document.getElementById('markdown-source');
  var markdownData = document.getElementById('markdown-data');
  if (markdownLink && markdownData) {
    markdownLink.addEventListener('click', function (event) {
      event.preventDefault();
      var markdown;
      try { markdown = JSON.parse(markdownData.textContent); } catch (error) { return; }
      var url = URL.createObjectURL(new Blob([markdown], {type: 'text/markdown;charset=utf-8'}));
      var download = document.createElement('a');
      download.href = url;
      download.download = markdownLink.getAttribute('data-filename') || 'article.md';
      download.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  var recentComments = document.getElementById('recent-comments');
  if (recentComments && recentComments.dataset.api) {
    fetch(recentComments.dataset.api).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(function (payload) {
      var comments = Array.isArray(payload) ? payload : (payload.data || []);
      recentComments.innerHTML = '';
      comments.slice(0, 10).forEach(function (comment) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = (comment.url || '/') + (comment.objectId ? '#' + comment.objectId : '');
        var author = document.createElement('span');
        author.className = 'comment-author';
        author.textContent = comment.nick || comment.author || '访客';
        link.appendChild(author);
        link.appendChild(document.createTextNode('：' + String(comment.comment || comment.content || '').replace(/<[^>]+>/g, '').slice(0, 28)));
        item.appendChild(link);
        recentComments.appendChild(item);
      });
      if (!comments.length) recentComments.innerHTML = '<li class="muted">暂无回复</li>';
    }).catch(function () {
      recentComments.innerHTML = '<li class="muted">最近回复加载失败</li>';
    });
  }

  var content = document.querySelector('.article-card .content');
  var toc = document.getElementById('toc-list');
  if (content && toc) {
    var headings = Array.prototype.slice.call(content.querySelectorAll('h2, h3'));
    if (!headings.length) {
      toc.closest('.toc').style.display = 'none';
    } else {
      toc.innerHTML = '';
      headings.forEach(function (heading, index) {
        if (!heading.id) heading.id = 'section-' + (index + 1);
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        if (heading.tagName === 'H3') link.className = 'sub';
        toc.appendChild(link);
      });

      if ('IntersectionObserver' in window) {
        var links = toc.querySelectorAll('a');
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) { link.classList.remove('active'); });
            var active = toc.querySelector('a[href="#' + CSS.escape(entry.target.id) + '"]');
            if (active) active.classList.add('active');
          });
        }, { rootMargin: '-20% 0px -70% 0px' });
        headings.forEach(function (heading) { observer.observe(heading); });
      }
    }
  }
})();
