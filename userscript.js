// ==UserScript==
// @name         VK dialogs switcher
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Allows to switch between open dialogs using Ctrl + 1, 2 ... shortcut
// @author       Andrew Kuchev
// @match        https://new.vk.com/*
// @match        https://vk.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/soon/VkDialogSwitcher/master/userscript.js
// ==/UserScript==

(function() {
    'use strict';
    var getDialogNode = function(index) {
        return document.querySelector('#im_dialogs li:nth-child(' + index + ') > div');
    };

    var helperClassName = '_dialog-switcher-helper';

    var createHelper = function(text, top, left) {
        var helper = document.createElement("DIV");
        helper.classList.add(helperClassName);
        helper.textContent = text;
        helper.style.cssText = (
            'position: absolute;' +
            'top: ' + top + 'px;' +
            'left: ' + left + 'px;' +
            'padding: 3px 3px;' +
            'background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(255, 247, 133)), to(rgb(255, 197, 66)));' +
            'border: 1px solid rgb(227, 190, 35);');
        return helper;
    };

    var getDialogsSearchBox = function() {
        return document.getElementById('im_dialogs_search');
    };

    var createHelperForSearchBox = function() {
        var searchBoxParent = getDialogsSearchBox().parentNode;
        var helper = createHelper('F', 12, 15);
        searchBoxParent.style.cssText = "position:relative;";
        searchBoxParent.appendChild(helper);
    };

    var appendHelperToDialogNode = function(index) {
        var dialog = getDialogNode(index);
        if (!dialog) return;

        dialog.style.cssText = "position:relative;";
        var helper = createHelper(index, 20, 14);
        dialog.appendChild(helper);
    };

    var drawHelpers = function() {
        for (var i = 1; i < 10; ++i) {
            appendHelperToDialogNode(i);
        }

        createHelperForSearchBox();
    };

    var getHelpers = function() {
        return document.getElementsByClassName(helperClassName);
    };

    var removeHelpers = function() {
        var helpers = getHelpers();

        while(helpers[0]) {
            helpers[0].parentNode.removeChild(helpers[0]);
        }
    };

    var hasHelpers = function() {
        return getHelpers().length > 0;
    };

    document.onkeydown = function(event) {
        event = event || window.event;
        if (event.ctrlKey && !hasHelpers()) {
            drawHelpers();
        }

        if (hasHelpers()) {
            if (event.keyCode >= 49 && event.keyCode <= 57) {
                var index = event.keyCode - 48;
                var dialog = getDialogNode(index);
                dialog.click();
                document.getElementById('im_dialogs').scrollTop += dialog.getBoundingClientRect().top - 212;
                return false;
            }
            if (event.keyCode == 70) {
                getDialogsSearchBox().focus();
                removeHelpers();
                return false;
            }
        }

        return true;
    };

    document.onkeyup = function(event) {
        event = event || window.event;
        if (!event.ctrlKey || (event.ctrlKey && event.keyCode == 9)) {
            removeHelpers();
        }

        return true;
    };

    window.onblur = function(event) {
        removeHelpers();
        return true;
    };
})();
