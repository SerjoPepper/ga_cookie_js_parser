# Google Analytics cookie JS parser

> Allows you to parse with JS
> https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage#gajs

## Install
    $ npm install ga_cookie_js_parser

    $ var gaCookieParser = require('ga_cookie_js_parser')

    Or download parser.js

## Getting Started
    console.log(gaCookieParser(document.cookie))

    {
        utma: {
            domainHash: '12345',
            userId: '123', // GA userId
            initialVisitTs: 1294887021, // unix timestamp
            previousVisitTs: 1294887021, // unix timestamp
            currentVisitTs: 1294887021, // unix timestamp
            pageViews: 5 // page views count in this 30 min session
        },

        utmb: {
            domainHash: '12345',
            pageViews: 5, // page views count in this 30 min session
            outboundClick: 10, // number of outbound links clicked counting down from 10
            currentVisitTs: 1294887021, // unix timestamp
        },

        utmc: {
            domainHash: '12345'
        },

        utmz: {
            domainHash: '12345',
            lastCookiesUpdateTs: 1294887021, // unix timestamp
            sessionCounter: 1, // number of sessions from incoming sites
            resourceCounter: 1, // number of sites, which user comes from
            utmcsr: 'google', // source
            utmccn: 'partner_287', // campaign name
            utmcmd: 'organic', // medium
            utmctr: 'search term', // term(s)
            utmcct: '/ref.php', // content (referring page in case of referrals)
            utmgclid: 'CI7wh8C6tKYCFU2DpAod7z97IQ' // gclid, linking referral back to adwords
        }
    }

