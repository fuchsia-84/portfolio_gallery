$(function () {

    $('#gallery').each(function() {
        
        var $container = $(this),
            $more_btn = $('#more_btn'), // 追加ボタン
            $filter = $('#gallery_filter'), // フィルタリングフォーム
            add_count = 16, // 1度に表示するアイテム数
            added_count = 0, // 表示済みアイテム数
            all_data = [], // すべてのJSONデータ
            filtered_data = []; // フィルタリングされたJSONデータ
        
        var gallery_item_id = '',
            gallery_content = '',
            gallery_content_bg = '',
            window_height = $(window).outerHeight(),
            gallery_item_off_left = 0;

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
                    var id_str = i.toString();
                   itemHTML =
                   '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
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
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
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
                                '<br>' +
                                '<p>リンク :</p>' +
                                '<ul>' +
                                    '<li><a href="' + item.content.link.src + '">模写元サイト</a></li>' +
                                    '<li><a href="' + item.content.link.xd + '">模写したデザインカンプ(PC/Adobe XD)</a></li>' +
                                    '<li><a href="' + item.content.link.webpage + '">公開Webページ</a></li>' +
                                    '<li><a href="' + item.content.link.github + '">GitHub</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="toggle_btn">' +
                                '<span>戻る</span>' +
                            '</div>' +
                        '</div>'
                    '</li>';
                    console.log(id_str);
                } else if (item.category == "workbook") {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
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
                                '<p>オープンな練習用の課題</p>' +
                                '<hr>' +
                                '<br>' +
                                '<p>リンク :</p>' +
                                '<ul>' +
                                    '<li><p>課題制作 : <a href="' + item.content.link.src_twitter + '">' + item.content.link.src_twitter_name + '</a> さん</p></li>' +
                                    '<li><a href="' + item.content.link.src_article + '">課題の公開記事</a></li>' +
                                    '<li><a href="' + item.content.link.webpage + '">公開Webページ</a></li>' +
                                    '<li><a href="' + item.content.link.github + '">GitHub</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="toggle_btn">' +
                                '<span>戻る</span>' +
                            '</div>' +
                        '</div>'
                    '</li>';
                } else {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
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
                                '<p>自作ロゴ</p>' +
                                '<hr>' +
                                '<br>' +
                                '<p>' + item.content.description + '</p>' +
                                '<p>コンセプト : ' + item.content.concept + '</p>' +
                                '<p>リンク :</p>' +
                                '<ul>' +
                                    '<li><a href="' + item.content.link.webpage + '">素材使用サイト</a></li>' +
                                    '<li><a href="' + item.content.link.logo_article + '">公開Webページ</a></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="toggle_btn">' +
                                '<span>戻る</span>' +
                            '</div>' +
                        '</div>'
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
                gallery_item_id = $(this).parent().attr('id');
                gallery_content = '#'+ gallery_item_id + '> .content';
                gallery_content_bg = '#'+ gallery_item_id + '> .content_bg';

                var gallery_item_off = $(this).parent().offset();
                gallery_item_off_left = gallery_item_off.left;

                $('.gallery_img').hide();
                $('#' + gallery_item_id).css('width', '100%');
                $('#'+ gallery_item_id).css('left', 0);
                $('#'+ gallery_item_id).css('top', 0);
                $(gallery_content).show();
                $(gallery_content_bg).show();
                $(gallery_content + ' a').show();

                $(gallery_content_bg).css('height', window_height + 110);
            });
            /* 戻るを押したらモーダルウィンドウを非表示、画像は表示*/
            $('.content span').on('click', function() {
                $(gallery_content).hide();
                $(gallery_content_bg).hide();
                $('#' + gallery_item_id).css('width', 'auto');
                $('#' + gallery_item_id).css('left', gallery_item_off_left - 10);
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