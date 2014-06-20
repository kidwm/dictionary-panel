var self = require("sdk/self");
var contextMenu = require("sdk/context-menu");
var preference = require('sdk/simple-prefs');
var alignment = preference.prefs['alignment'];
const data = self.data;
const positions = {
    C: null,
    L: {left: 0, bottom: 0},
    R: {right: 0, bottom: 0}
};
const dictionaries = [
	{
		id: 'kimo',
		name: '奇摩字典',
		url: 'http://tw.dictionary.yahoo.com/dictionary?p=',
		append: ''
	},
	{
		id: 'goo',
		name: 'goo辞書',
		url: 'http://dictionary.goo.ne.jp/srch/all/',
		append: '/m0u/'
	}
];

var position = positions[alignment];

preference.on("alignment", function() {
    alignment = preference.prefs['alignment'];
    position = positions[alignment];
    setpanel();
});

var panel;
function setpanel() {
    panel = require("sdk/panel").Panel({
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

var items = {};

exports.main = function(options, callbacks) {

	dictionaries.forEach(function(dictionary, index, array){
		items[dictionary.id] = contextMenu.Item({
			label: dictionary.name,
			image: data.url(dictionary.id + ".ico"),
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
				           '  return "' + dictionary.name + ': " + text;' +
				           '});',
			// When we receive a message, look up the item
			onMessage: function (item) {
				panel.contentURL = dictionary.url + item + dictionary.append;
				panel.show();
			}
		});
	});

};

