/* Cookie consent banner. Google Analytics loads only after "Accept". */
(function () {
  var KEY = 'pt-consent';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function clearGaCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/' + d;
        });
      }
    });
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.className = 'cookie-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<p>We use Google Analytics cookies to see which pages are useful, so we can improve the site. ' +
      'They\'re only set if you accept. <a href="/privacy/#cookies">Privacy policy</a></p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn cookie-reject" data-choice="denied">Reject</button>' +
      '<button type="button" class="cookie-btn cookie-accept" data-choice="granted">Accept</button>' +
      '</div>';
    b.addEventListener('click', function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!choice) return;
      var previous = getChoice();
      setChoice(choice);
      hideBanner();
      if (choice === 'granted') {
        if (window.loadAnalytics) window.loadAnalytics();
      } else {
        clearGaCookies();
        if (previous === 'granted') location.reload();
      }
    });
    document.body.appendChild(b);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!link) return;
    e.preventDefault();
    showBanner();
  });

  if (!getChoice()) showBanner();
})();
