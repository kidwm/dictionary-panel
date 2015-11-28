var self = require("sdk/self");
var contextMenu = require("sdk/context-menu");
var preference = require('sdk/simple-prefs');
var utils = require('sdk/window/utils');
var position = preference.prefs['position'];
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
		url: (query) => `http://tw.dictionary.yahoo.com/dictionary?p=${query}`
	},
	{
		id: 'moedict',
		name: '萌典',
		url: (query) => `http://www.moedict.tw/${query}`
	},
	{
		id: 'goo',
		name: 'goo辞書',
		url: (query) => `http://dictionary.goo.ne.jp/srch/all/${query}/m0u/`
	},
	{
		id: 'google',
		name: 'Google Translate',
		url: (query) => `https://translate.google.com/#en/zh-TW/${query}`
	}
];

var panel = require("sdk/panel").Panel({
	contentURL: data.url("loading.html"),
	onHide: function() {
		panel.contentURL = data.url("loading.html");
	}
});

var items = [];
var setMenu = function(dictionary) {
	return contextMenu.Item({
		label: dictionary.name,
		image: data.url(dictionary.id + ".ico"),
		// Show this item when a selection exists.
		context: contextMenu.SelectionContext(),
		// When this item is clicked, post a message back with the selection
		contentScript:
			`self.on("click", function () {
				var text = window.getSelection().toString();
				self.postMessage(text);
			});
			self.on("context", function () {
				var text = window.getSelection().toString();
				if (text.length > 20)
					text = text.substr(0, 20) + "...";
					return "${dictionary.name}: " + text;
			});`,
		// When we receive a message, look up the item
		onMessage: function (item) {
			let window = utils.getMostRecentBrowserWindow();
			panel.contentURL = dictionary.url(encodeURIComponent(item));
			panel.show({
				position: positions[preference.prefs['position']],
				width: parseInt(window.innerWidth / 2, 10),
				height: parseInt(window.innerHeight / 2, 10)
			});
		}
	});
};

exports.main = function(options, callbacks) {

	dictionaries.forEach(function(dictionary, index, array){
		items[dictionary.id] = preference.prefs[dictionary.id] ? setMenu(dictionary) : null;
		preference.on(dictionary.id, function() {
			if (preference.prefs[dictionary.id])
				items[dictionary.id] = setMenu(dictionary);
			else
				items[dictionary.id].destroy();
		});
	});

};
