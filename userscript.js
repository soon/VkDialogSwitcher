// ==UserScript==
// @name         VK dialogs switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows to switch between open dialogs using Ctrl + 1, 2 ... shortcut
// @author       Andrew Kuchev
// @match        https://new.vk.com/im*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = function(event) {
        event = event || window.event;
        if (event.ctrlKey && event.keyCode >= 49 && event.keyCode <= 57) {
            var index = event.keyCode - 48;
            var dialog = document.querySelector('#im_dialogs > li:nth-child(' + index + ') > div');
            dialog.click();
            document.getElementById('im_dialogs').scrollTop += dialog.getBoundingClientRect().top - 212; // 212 px should be enough for everyone
            return false;
        }
        return true;
    };
})();
