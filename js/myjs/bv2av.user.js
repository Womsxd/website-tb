// ==UserScript==
// @name         bv2av
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Change bv to av
// @author       ouuan
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @grant        none
// ==/UserScript==

// Algorithm from https://www.zhihu.com/question/381784377/answer/1099438784

(function() {
    'use strict';

    var table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
    var tr = {};
    for (var i = 0; i < 58; ++i) {
        tr[table[i]] = i;
    }

    var s = [11,10,3,8,4,6];
    var xor = 177451812;
    var add = 8728348608;

    function dec(x) {
        var r = 0;
        for (var i = 0; i < 6; ++i) {
            r += tr[x[s[i]]] * (58 ** i);
        }
        return 'av' + String((r - add) ^ xor);
    }

    function bv2av(x) {
        var bvs = x.match(/[bB][vV][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/g);
        if (bvs) {
            for (var bv of bvs) {
                x = x.replace(bv, dec(bv));
            }
        }
        return x;
    }

    var url = window.location.href;
    var newUrl = bv2av(url);
    if (url != newUrl) {
        window.history.pushState(null, null, newUrl);
    }

    setInterval(function() {
        var nodes = document.querySelectorAll('a');
        for(var o of nodes) {
            if (o.href) {
                o.href = bv2av(o.href);
            }
        }
    }, 500);
})();
