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
                var itemHTML ='';
                if(item.category == "original") {
                   itemHTML =
                    '<li class="gallery_item is_loading">' +
                        '<img class="gallery_img" src="' + item.images.thumb + '" alt="">' +
                        '<div class="content_bg"></div>' +
                        '<div class="content">' +
                            '<img class="content_img" src="' + item.images.large + '" alt="">' +
                            '<div class="content_text">' + 
                                '<h1>' + item.title +
                                    '<time class="date" datatime="' + item.date + '">' +
                                        item.date.replace(/-0?/g, '/') +
                                    '</time>' + '</br>' +
                                '</h1>' +
                                '<p>オリジナルWebデザイン</p>' +
                                '<hr>' +
                                '<p>お題 : ' + item.content.odai + '</p>' +
                                '<p>コンセプト : ' + item.content.concept + '</p>' +
                                '<p>工夫点 : ' + item.content.description + '</p>' +
                                '<br>' +
                                '<p>リンク :</p>' +
                                    '<ul>' +
                                        '<li><a href="' + item.content.link.xd + '">デザインカンプ(PC版/Adobe XD)</a></li>' +
                                        '<li><a href="' + item.content.link.webpage + '">公開Webページ</a></li>' +
                                        '<li><a href="' + item.content.link.github + '">GitHub</a></li>' +
                                        '<li><a href="' + item.content.link.design_article + '">デザイン制作まとめ記事</a></li>' +
                                        '<li><a href="' + item.content.link.coding_article + '">コーディングまとめ記事</a></li>' +
                                    '</ul>' +
                            '</div>' +
                            '<div class="toggle_btn">' +
                                '<span>戻る</span>' +
                            '</div>' +
                        '</div>'
                    '</li>';

                } else if (item.category == "copy") {
                    itemHTML =
                    '<li class="gallery_item is_loading">' +
                        '<a class="gallery_img" href="' + item.images.large + '">' +
                            '<img src="' + item.images.thumb + '" alt="">' +
                            '<span class="caption">' +
                            '</span>' +
                        '</a>' + 
                    '</li>';
                } else if (item.category == "workbook") {
                    itemHTML =
                    '<li class="gallery_item is_loading">' +
                        '<a class="gallery_img" href="' + item.images.large + '">' +
                            '<img src="' + item.images.thumb + '" alt="">' +
                            '<span class="caption">' +
                            '</span>' +
                        '</a>' + 
                    '</li>';
                } else {
                    itemHTML =
                    '<li class="gallery_item is_loading">' +
                        '<a class="gallery_img" href="' + item.images.large + '">' +
                            '<img src="' + item.images.thumb + '" alt="">' +
                            '<span class="caption">' +
                            '</span>' +
                        '</a>' + 
                    '</li>';
                }
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

            /* モーダルウィンドウの処理 */

            /* 画像をクリックしたら他画像は非表示にして、各情報を表示(モーダルウィンドウ) */
            $('.gallery_img').on('click', function() {
                $('.gallery_img').hide();
                $('.content').show();
                $('.content_bg').show();
                $('.content a').show();

                $('.gallery_item').css('width', '100%');
                /* 背景を画面一杯に表示するための処理*/
                var content_height = $('.content').outerHeight();
                var fix_height = 110 * 2;
                $('.gallery_item .content_bg').css('height', content_height + fix_height);
            });
            /* 戻るを押したらモーダルウィンドウを非表示、画像は表示*/
            $('.content span').on('click', function() {
                $('.content').hide();
                $('.content_bg').hide();
                $('.gallery_item').css('width', 'auto');

                $('.gallery_img').show();
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
    });

    // jQuery UI Button
    $('.filter_form input[type="radio"]').button({
        icons: {
            primary: 'icon-radio'
        }
    });
});