(function () {

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = gaCookieParser;
  } else {
    window.gaCookieParser = gaCookieParser;
  }

  /**
   * @param {String} rawCookie - cookie string (document.cookie for browser)
   */
  function gaCookieParser (rawCookie) {
    var res = {
      utma: {},
      utmb: {},
      utmc: {},
      utmz: {}
    };

    if (!rawCookie) {
      return res;
    }

    document.cookie.replace(/(?:^| |;)__(utm[^;$]*)/g, function (_, tagMatch) {
      var type = tagMatch.slice(0, 4);
      var content = tagMatch.slice(5).split('.');
      var resObj = res[type];

      if (!resObj) {
        return;
      }

      if (type === 'utma') {
        resObj.domainHash = content[0];
        resObj.userId = content[1]; // GA userId
        resObj.initialVisitTs = Number(content[2]); // unix timestamp
        resObj.previousVisitTs = Number(content[3]); // unix timestamp
        resObj.currentVisitTs = Number(content[4]); // unix timestamp
        resObj.pageViews = Number(content[5]); // pageview count in this 30 min session
      }
      else if (type === 'utmb') {
        resObj.domainHash = content[0];
        resObj.pageViews = Number(content[1]);
        resObj.outboundClick = Number(content[2]);
        resObj.currentVisitTs = Number(content[3]) // unix timestamp
      }
      else if (type === 'utmc') {
        resObj.domainHash = content[0];
      }
      else if (type === 'utmz') {
        resObj.domainHash = content[0];
        resObj.lastCookiesUpdateTs = Number(content[1]); // unix timestamp
        resObj.sessionCounter = Number(content[2]); // number of sessions from incoming sites
        resObj.resourceCounter = Number(content[3]); // number of sites, which user comes from

        // utmcsr: 'google' - source
        // utmccn: 'partner_287' - campaign name
        // utmcmd: 'organic' - medium
        // utmctr: 'search term' - term(s)
        // utmcct: '/ref.php - content (referring page in case of referrals)
        content[4].split('|').map(function (p) {
          p = p.split('=');
          resObj[p[0]] = decodeURIComponent(p[1].replace(/^\(?(.*?)\)?$/, '$1'));
        });
      }
    });

    return res;
  }

})();