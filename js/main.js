$(function () {

    $('#gallery').each(function() {
        
        var $container = $(this),
            $more_btn = $('#more_btn'), // 追加ボタン
            $filter = $('#gallery_filter'), // フィルタリングフォーム
            add_count = 16, // 1度に表示するアイテム数
            added_count = 0, // 表示済みアイテム数
            all_data = [], // すべてのJSONデータ
            filtered_data = []; // フィルタリングされたJSONデータ

        /* モーダルウィンドウ用*/
        var gallery_item_id = '', // クリックした画像アイテムのid
            gallery_content = '', // クリックした画像アイテムの情報コンテナクラス
            gallery_content_inner = '', // クリックした画像アイテムのコンテナ内部クラス
            gallery_item_off_left = 0, // クリックした画像アイテムサムネイルの元のleft
            content_height = 0, // クリックした画像アイテムの情報コンテナの高さ
            image_height = 0, // クリックした画像アイテムの画像の高さ
            window_height = $(window).outerHeight(), // ウィンドウの高さ
            gallery_content_link_list = '', // クリックした画像アイテムのリンクリストクラス
            link_list = []; // // クリックした画像アイテムのリンクリスト

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
                        '<div class="content">' +
                            '<div class="content_inner">' +
                                '<img class="content_img" src="' + item.images.large + '" alt="">' +
                                '<div class="content_text">' + 
                                    '<h1>' + item.title +
                                        '<span><time class="date" datatime="' + item.date + '">' +
                                            item.date.replace(/-0?/g, '/') +
                                        '</time></span>' + '</br>' +
                                    '</h1>' +
                                    '<h2>Original Web Design</h2>' +
                                    '<hr>' +
                                    '<h3>お題</h3>' + '<p>' + item.content.odai + '</p>' +
                                    '<h3>コンセプト</h3>' + '<p>' + item.content.concept + '</p>' +
                                    '<h3>工夫点</h3>' + '<p>' + item.content.description + '</p>' +
                                    '<br>' +
                                    '<h3>リンク</h3>' +
                                    '<ul>' +
                                        '<li><a href="' + item.content.link.xd + '">デザインカンプ(PC版/Adobe XD)</a></li>' +
                                        '<li><a href="' + item.content.link.webpage + '">公開Webページ</a></li>' +
                                        '<li><a href="' + item.content.link.github + '">GitHub</a></li>' +
                                        '<li><a href="' + item.content.link.design_article + '">デザイン制作まとめ記事</a></li>' +
                                        '<li><a href="' + item.content.link.coding_article + '">コーディングまとめ記事</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="toggle_btn">' +
                                    '<span></span>' +
                                    '<span></span>' +
                                '</div>' +
                            '</div>'
                        '</div>' +
                    '</li>';

                } else if (item.category == "copy") {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
                        '<img class="gallery_img" src="' + item.images.thumb + '" alt="">' +
                        '<div class="content">' +
                            '<div class="content_inner">' +
                                '<img class="content_img" src="' + item.images.large + '" alt="">' +
                                '<div class="content_text">' + 
                                    '<h1>' + item.title +
                                    '<span><time class="date" datatime="' + item.date + '">' +
                                        item.date.replace(/-0?/g, '/') +
                                    '</time></span>' + '</br>' +
                                    '</h1>' +
                                    '<h2>Copy of Real Web Site</h2>' +
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
                                    '<span></span>' +
                                    '<span></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    '</li>';
                    console.log(id_str);
                } else if (item.category == "workbook") {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
                        '<img class="gallery_img" src="' + item.images.thumb + '" alt="">' +
                        '<div class="content">' +
                            '<div class="content_inner">' +
                                '<img class="content_img" src="' + item.images.large + '" alt="">' +
                                '<div class="content_text">' + 
                                    '<h1>' + item.title +
                                    '<span><time class="date" datatime="' + item.date + '">' +
                                        item.date.replace(/-0?/g, '/') +
                                    '</time></span>' + '</br>' +
                                    '</h1>' +
                                    '<h2>Training Workbook Published</h2>' +
                                    '<hr>' +
                                    '<h3>課題制作</h3>' + 
                                    '<p><a href="' + item.content.link.src_twitter + '">' + item.content.link.src_twitter_name + '</a> さん</p>' +
                                    '<h3>リンク</h3>' +
                                    '<ul>' +
                                        '<li><a href="' + item.content.link.src_article + '">課題の公開記事</a></li>' +
                                        '<li><a href="' + item.content.link.webpage + '">公開Webページ</a></li>' +
                                        '<li><a href="' + item.content.link.github + '">GitHub</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="toggle_btn">' +
                                    '<span></span>' +
                                    '<span></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>';
                } else {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
                        '<img class="gallery_img" src="' + item.images.thumb + '" alt="">' +
                        '<div class="content">' +
                            '<div class="content_inner">' +
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
                                        '<li><a href="' + item.content.link.webpage + '">ロゴ使用サイト</a></li>' +
                                        '<li><a href="' + item.content.link.logo_article + '">ロゴ制作まとめ記事</a></li>' +
                                    '</ul>' +
                                '</div>' +
                                '<div class="toggle_btn">' +
                                    '<span></span>' +
                                    '<span></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
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

            /* 画像をクリックしたら各情報を表示(モーダルウィンドウ) */
            $('.gallery_img').on('click', function() {
                gallery_item_id = $(this).parent().attr('id'); // クリックしたアイテムのidを取得
                gallery_content = '#'+ gallery_item_id + ' > .content'; // クリックしたアイテムのコンテナクラス
                gallery_content_inner = gallery_content + ' .content_inner'; // コンテナクラスのインナー
                gallery_content_link_list = gallery_content + ' li'; // クリックしたアイテムのリンクリストクラス

                // ウィンドウを閉じた時に元の位置に戻すため、元の位置を取得
                var gallery_item_off = $(this).parent().offset();
                gallery_item_off_left = gallery_item_off.left; // 元のleft値

                //$('.gallery_img').hide(); // 他画像を隠す
                $('#' + gallery_item_id).css('width', '100%'); // 横幅を画面いっぱいに
                // 開始位置を左上端からにする
                $('#'+ gallery_item_id).css('left', 0);
                $('#'+ gallery_item_id).css('top', 0);

                // モーダルウィンドウを表示
                $(gallery_content).show();
                $(gallery_content_inner).show();
                $(gallery_content + ' a').show();

                // 全画面表示のための高さ調整
                content_height = $(gallery_content).outerHeight(); // クリックしたアイテムのコンテナの高さ
                image_height = $(gallery_content + ' img').outerHeight(); // クリックした画像アイテムの高さ

                // 画像の高さがウィンドウサイズより大きいとき、コンテナのheightを画像の高さにする
                if(image_height > window_height) {
                    $(gallery_content).css('height', image_height);
                }

                // リンクのリスト中、中身が"#"のものは非表示にする
                link_list = $(gallery_content_link_list).find('a'); // リンクのリストを取得

                $(link_list).each(function(i, link) {
                    var get_href = $(link).attr('href'); // リンク先を取得
                    if(get_href == "#") {
                        $(link).hide(); // '#'のとき非表示
                    }
                });


            });
            /* 閉じるボタンを押したらモーダルウィンドウを非表示、画像は表示*/
            $('.toggle_btn').on('click', function() {
                $(gallery_content_inner).hide();
                $(gallery_content).hide();
                $('.gallery_img').show(); // 画像を表示し直す

                $('#' + gallery_item_id).css('width', 'auto');
                $('#' + gallery_item_id).css('left', gallery_item_off_left - 150); // 元の位置に直す
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