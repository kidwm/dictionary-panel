function kimo(info) {
	chrome.windows.create({
		'type': 'panel',
		'url': "http://tw.dictionary.yahoo.com/dictionary?p=" + info.selectionText
	});
}

chrome.contextMenus.create({
	"title": '奇摩字典: %s',
	"contexts": ['selection'],
	"onclick": kimo
});
