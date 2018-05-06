$(document).ready(function(){
	var $form = $('#form-block'),
		$input = $('#form-block input[type="text"]'),
		$main = $('<dl class="main"></dl>'),
		$mainTerm = '<dt class="main-term">住所検索結果</dt>';
	
	//ボタンを送信する時のFormの処理
	$($form).bind('submit', function (event) {
		event.preventDefault();
		///住所表示エリアを追加
		$($form).after($main);
		//zipcloudのAPIのURL
		var sendURL = "http://zipcloud.ibsnet.co.jp/api/search?callback=?";
		$.getJSON(sendURL,
			{
				zipcode: $input.val()
			}
		)
		//結果を取得したら
		.done(function(res){
			// 中身が空でなければ、その値を［住所］欄に反映
			if(res.results){
				var results = res.results[0];
				$($main).html($mainTerm + '<dd class="main-description">' + results.address1 + results.address2 + results.address3 + '</dd>');
			} else {
				//エラーの場合
				$($main).html($mainTerm + '<dd class="main-description main-error">該当する住所が存在しません。</dd>');	
				}
		});

		//input[type="text"]の中を空にする
		$input.val('');
	});

});