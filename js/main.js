$(function () {

    $('#gallery').each(function() {
        
        var $container = $(this),
            $more_btn = $('#more_btn'), // 追加ボタン
            $filter = $('#gallery_filter'), // フィルタリングフォーム
            add_count = 16, // 1度に表示するアイテム数
            added_count = 0, // 表示済みアイテム数
            all_data = [], // すべてのJSONデータ
            filtered_data = []; // フィルタリングされたJSONデータ
        
        // Masonryオプション
        $container.masonry({
            columnWidth : 230,
            gutter : 10,
            itemSelector : '.gallery_item'
        });

        $.getJSON('./data/content.json', init);

        /*
        init - 初期化
        */
        function init (data) {
            all_data = data; // 取得したデータぜんぶ
            filtered_data = all_data; // 最初はフィルタリングしない
            add_items(); // 表示

            // 追加ボタンがクリックされたら追加表示
            $more_btn.on('click', add_items);

            // ラジオボタンが変更されたらフィルタリングを実行
            $filter.on('change', 'input[type="radio"]', filter_items);
        }


        /*
        add_items - アイテムを追加表示する
        */
        function add_items (filter) {
            var elements = [],
                slice_data = filtered_data.slice(added_count, added_count + add_count);

            $.each(slice_data, function(i, item) {
                var itemHTML =
                    '<li class="gallery_item is_loading">' +
                        '<a href="' + item.images.large + '">' +
                            '<img src="' + item.images.thumb + '" alt="">' +
                            '<span class="caption"></span>' +
                        '</a>'
                    '</li>';
            
                elements.push($(itemHTML).get(0)); // DOM情報を保存
            });

            $container.append(elements); // DOM挿入

            // 画像ダウンロード完了で実行
            $container.imagesLoaded(function () {
                $(elements).removeClass('is_loading'); // 表示可能にする
                $container.masonry('appended', elements); // Masonryレイアウト

                // フィルタリング時に再配置
                if (filter) {
                    $container.masonry();
                }
            });

            added_count += slice_data.length; // 追加済みアイテム数を更新

            // データ数に応じて追加ボタンの表示/非表示を切替
            if (added_count < filtered_data.length) {
                $more_btn.show();
            } else {
                $more_btn.hide();
            }
        }

        /*
        filter_items - アイテムをフィルタリングして表示する
        */
        function filter_items() {
            var key = $(this).val(), // チェックされたラジオボタンのvalue
                masonry_items = $container.masonry('getItemElements'); // 追加済みアイテム

            // 現在のアイテムを削除
            $container.masonry('remove', masonry_items);

            // フィルタリングをリセット
            filtered_data = [];
            added_count = 0;

            // フィルタリング

            // allのとき
            if (key == 'all') {
                filtered_data = all_data;
            } else {
            // all以外ならキーと一致するデータを抽出
                filtered_data = $.grep(all_data, function(item) {
                    return item.category == key;
                });
            }
            // アイテムを追加
            add_items(true);
        }


    })
})