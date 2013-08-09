var self = require("self");
var contextMenu = require("context-menu");
var preference = require('simple-prefs');
var alignment = preference.prefs['alignment'];
const data = self.data;
const positions = {
    C: {},
    L: {left: 0, bottom: 0},
    R: {right: 0, bottom: 0}
};
var position = positions[alignment];

preference.on("alignment", function() {
    alignment = preference.prefs['alignment'];
    position = positions[alignment];
    setpanel();
});

var panel;
function setpanel() {
    panel = require("panel").Panel({
        width: 680,
        height: 550,
        position: position,
        contentURL: data.url("loading.html"),
        onHide: function() {
            panel.contentURL = data.url("loading.html");
        }
    });
}
setpanel();

exports.main = function(options, callbacks) {
 
	var widget = require("widget").Widget({
	  id: "kimo",
	  label: "奇摩字典",
	  contentURL: data.url("kimo.ico"),
	  panel: panel,
	  onClick: function() {
		panel.contentURL = "http://tw.dictionary.yahoo.com/";
	  }
	});
 
	var menuItem = contextMenu.Item({
		label: "奇摩字典",
		image: data.url("kimo.ico"),
		// Show this item when a selection exists.
		context: contextMenu.SelectionContext(),
		// When this item is clicked, post a message back with the selection
		contentScript: 'self.on("click", function () {' +
		               '  var text = window.getSelection().toString();' +
		               '  self.postMessage(text);' +
		               '});' + 
		               'self.on("context", function () {' +
		               '  var text = window.getSelection().toString();' +
		               '  if (text.length > 20)' +
		               '    text = text.substr(0, 20) + "...";' +
		               '  return "奇摩字典: " + text;' +
		               '});',
		// When we receive a message, look up the item
		onMessage: function (item) {
			panel.contentURL = "http://tw.dictionary.yahoo.com/dictionary?p=" + item;
			panel.show();
		}
	});
	
	var widget2 = require("widget").Widget({
	  id: "goo",
	  label: "goo辞書",
	  contentURL: data.url("goo.ico"),
	  panel: panel,
	  onClick: function() {
		panel.contentURL = "http://dictionary.goo.ne.jp/";
	  }
	});
 
	var menuItem2 = contextMenu.Item({
		label: "goo辞書",
		image: data.url("goo.ico"),
		// Show this item when a selection exists.
		context: contextMenu.SelectionContext(),
		// When this item is clicked, post a message back with the selection
		contentScript: 'self.on("click", function () {' +
		               '  var text = window.getSelection().toString();' +
		               '  self.postMessage(text);' +
		               '});' + 
		               'self.on("context", function () {' +
		               '  var text = window.getSelection().toString();' +
		               '  if (text.length > 20)' +
		               '    text = text.substr(0, 20) + "...";' +
		               '  return "goo辞書: " + text;' +
		               '});',
		// When we receive a message, look up the item
		onMessage: function (item) {
			panel.contentURL = "http://dictionary.goo.ne.jp/srch/all/" + item + "/m0u/";
			panel.show();
		}
	});
};

