$(document).ready(function () {
	const $form = $('#form-block'),
		$addList = $('button'),
		$inputList = $('input[type=text]'),
		$listArea = $('<ul class="main-block_listBox">'),
		strageList = localStorage['todo.list'];
		
	if (strageList && strageList.length > 2) {
			$form.after($listArea);
			JSON.parse(strageList).forEach(function (item) {
				makeList(item.text, item.complete);
			});
	}

	function updateStrage() {
		let list = [];
		//現在のリスト情報を全て取得する
		$listArea.find('li').each((index, element) => {
			const $item = $(element);
			list.push({
				text: $item.find('.main-block_listBoxListTxt').text(),
				complete: $item.hasClass('complete')
			});
		});
		localStorage['todo.list'] = JSON.stringify(list);
	}

	//ToDoをul.listAreaに追加する	
	function makeList(text, isComplete) {
		//liを作成
		const $li = $('<li class="main-block_listBoxList">'),
			$text = $('<label class="main-block_listBoxListTxt">').text(text),
			$checkBox = $('<input type="checkbox">'),
			$deleteBtn = $('<span class="main-block_listBoxListBtn">Delete</span>'),
			$removeMessege = $('.box-removeMess');

		//liに追加
		$li.append($checkBox).append($text).append($deleteBtn);

		//完了済みの場合の処理
		if (isComplete) {
			$li.addClass('complete');
			$checkBox.prop('checked', true).prop('disabled', true);
		}

		//liを$listAreaに追加
		$listArea.append($li);

		// checkBoxにチェックを入れたときの処理
		$checkBox.on('click', (e) => {
			if ($(e.currentTarget).is(':checked')) {
				$li.addClass('complete');
				$checkBox.prop('checked', true).prop('disabled', true);
			}
			//ストレージの更新
			updateStrage();
		});

		//削除ボタンの処理
		$deleteBtn.on('click', () => {
			const $removeBtn = $('.box-removeMessBtn');
			$removeMessege.addClass('box-removeMessVisible');
			$removeBtn.click(() => {
				if ($li === 1) {
					$li.remove();
					//localStorage.clear();
					localStorage.removeItem('todo.list');
				} else {
					$li.remove();
					updateStrage();
				}
				$removeMessege.removeClass('box-removeMessVisible');
			});
		});
	}

	//ボタンを送信する時のFormの処理
	$form.bind('submit', () => {
		event.preventDefault();
		//input[type="text"]の中に入っている文言を取得する
		const text = $inputList.val();

		//ToDo list を追加
		makeList(text);

		//input[type="text"]の中を空にする
		$inputList.val('');
		//ストレージの更新
		updateStrage();
	}).one('submit', () => {
		//liを追加するulを最初のリスト追加時のみ追加する
		$form.after($listArea);
		return false;
	});


});
