$(function(){
	var $addList = $('button'),
		$inputList = $('input[type=text]'),
		$listArea = $('ul.main-block_listBox');
		
	//ToDoを追加する	
	function makeList(text){
		//liを作成
		var $li = $('<li class="main-block_listBoxList">');
		var $text = $('<span class="main-block_listBoxListText">').text(text);
		//liを追加
		$li.append($text);	
	}

});