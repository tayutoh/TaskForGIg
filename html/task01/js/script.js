$(function () {
	var $form = $('#form-block'),
		$addList = $('button'),
		$inputList = $('input[type=text]'),
		$listArea = $('<ul class="main-block_listBox">'),
		strageList = localStorage['todo.list'];
		
		if(strageList){
			JSON.parse(strageList).forEach(function(item){
			makeList(item.text,item.complete);
			});
		}
	
	function updateStrage(){
		var list = [];
		//現在のリスト情報を全て取得する
		$listArea.find('li').each(function(){
			var $item = $(this);
			
			list.push({
				text:$item.find('.main-block_listBoxListTxt').text(),
				complete:$item.hasClass('complete')
			});
		});
		
		localStorage['todo.list'] = JSON.stringify(list);
	}
		
	//ToDoをul.listAreaに追加する	
	function makeList(text){
		//liを作成
		var $li = $('<li class="main-block_listBoxList">'),
			$text = $('<label class="main-block_listBoxListTxt">').text(text),
			$checkBox = $('<input type="checkbox">'),
			$deleteBtn = $('<span class="main-block_listBoxListBtn">Delete</span>'),
			$removeMessege = $('.box-removeMess');
		
		//liに追加
		$li.append($checkBox).append($text).append($deleteBtn);
		//liを$listAreaに追加
		$listArea.append($li);
		
		// checkBoxにチェックを入れたときの処理
		$checkBox.on('click', function(){
			if($(this).is(':checked')){
				$li.addClass('complete');
				$checkBox.prop('checked', true).prop('disabled', true);
			} else {
				$li.removeClass('complete');
			}
			//ストレージの更新
			updateStrage();
			
		});
		
		//削除ボタンの処理
		$deleteBtn.on('click', function(){
			$removeMessege.addClass('box-removeMessVisible');
			var $removeBtn = $('.box-removeMessBtn');
			$removeBtn.click(function(){
				$li.remove();
				$removeMessege.removeClass('box-removeMessVisible');
			});
			//ストレージの更新
			updateStrage();
		});
	}
	
	//ボタンを送信する時のFormの処理
	$($form).bind('submit', function(event){
		
		event.preventDefault();
		
		//$('.count_txt').text(count_num); 
		//input[type="text"]の中に入っている文言を取得する
		var text = $inputList.val();
		
		//ToDo list を追加
		makeList(text);
		
		//input[type="text"]の中を空にする
		$inputList.val('');
		//ストレージの更新
		updateStrage();
	}).one('submit',function(){
		//liを追加するulを最初のリスト追加時のみ追加する
		$($form).after($listArea);
		return false;
	});
	
	
});
