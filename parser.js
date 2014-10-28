(function (global) {

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = gaCookieParser;
  } else {
    global.gaCookieParser = gaCookieParser;
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

    try {
      rawCookie.replace(/(?:^| |;)__(utm[^;$]*)/g, function (_, tagMatch) {
        var type = tagMatch.slice(0, 4);
        var contentStr = tagMatch.slice(5);
        var content = contentStr.split('.');
        var resObj = res[type];
        if (!resObj) {
          return;
        }

        if (type === 'utma') {
          resObj.domainHash = content[0];
          resObj.userId = content[1]; // GA userId
          resObj.initialVisitTs = content[2] && Number(content[2]); // unix timestamp
          resObj.previousVisitTs = content[3] && Number(content[3]); // unix timestamp
          resObj.currentVisitTs = content[4] && Number(content[4]); // unix timestamp
          resObj.pageViews = content[5] && Number(content[5]); // pageview count in this 30 min session
        }
        else if (type === 'utmb') {
          resObj.domainHash = content[0];
          resObj.pageViews = content[1] && Number(content[1]);
          resObj.outboundClick = content[2] && Number(content[2]);
          resObj.currentVisitTs = content[3] && Number(content[3]) // unix timestamp
        }
        else if (type === 'utmc') {
          resObj.domainHash = content[0];
        }
        else if (type === 'utmz') {
          resObj.domainHash = !isNaN(content[0]) ? content[0] : undefined;
          resObj.lastCookiesUpdateTs = content[1] && Number(content[1]); // unix timestamp
          resObj.sessionCounter = content[2] && Number(content[2]); // number of sessions from incoming sites
          resObj.resourceCounter = content[3] && Number(content[3]); // number of sites, which user comes from

          // utmcsr: 'google' - source
          // utmccn: 'partner_287' - campaign name
          // utmcmd: 'organic' - medium
          // utmctr: 'search term' - term(s)
          // utmcct: '/ref.php - content (referring page in case of referrals)
          var utmzParams = contentStr.slice(contentStr.indexOf('utm'));
          if (utmzParams) {
            utmzParams.split('|').map(function (p) {
              p = p.split('=');
              try {
                resObj[p[0]] = global.unescape(/^\(.*\)$/.test(p[1]) ? p[1].replace(/^\(?(.*?)\)?$/, '$1') : p[1]);
              } catch (e) {
                resObj[p[0]] = p[1];
              }
            });
          }
        }
      });
    } catch (e) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error(e);
      }
    }

    return res;
  }

})(typeof window !== 'undefined' ? window : global);