var self = require("self");
var contextMenu = require("context-menu");
const data = self.data;
 
exports.main = function(options, callbacks) {
 
	var panel = require("panel").Panel({
		width: 680,
		height: 550,
		contentURL: data.url("loading.html"),
		onHide: function() {
			panel.contentURL = data.url("loading.html");
		}
	  });
 
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
};

