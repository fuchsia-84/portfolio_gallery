$(function () {

    /* プログレス表示 */
    window.onload = images_progress();
    /*
    images_progress - 画像の読み込み状況を表示する
    */
    function images_progress() {
        var $progress = $('#progress'), // プログレス表示全体のコンテナ
        $progress_bar = $progress.find('.progress_bar'), // プログレス表示のバー部分
        $progress_text = $progress.find('.progress_text'), // プログレス表示のテキスト部分

        // imagesLoadedライブラリでbody要素内の画像の読み込み状況を監視、
        // body全体の画像総数をカウント
        img_load = imagesLoaded('body'),
        img_total = img_load.images.length,

        // 読込完了した画像カウンターとプログレス表示の現在値
        img_loaded = 0,
        current = 0,

        // 1秒間に60回のペースで読込状況をチェックして表示を更新
        progress_timer = setInterval(update_progress, 1000/60);

        // imagesLoadedで画像読込をカウント
        img_load.on('progress', function() {
            img_loaded++;
        });

        /*
        update_progress - 画像読込の状況をもとにプログレス表示を更新する
        */
        function update_progress () {
            var target = (img_loaded / img_total) * 100; // 読込完了パーセンテージ

            current += (target - current) * 0.1; // currentとtarget間の距離をもとにイージング

            // 表示バーの幅とテキストにcurrentの値を反映
            $progress_bar.css({width: current + '%'});
            $progress_text.text(Math.floor(current) + '%');

            // currentが100になったら終了
            if(current >= 100) {
                clearInterval(progress_timer);
                $progress.addClass('progress_complete');
                $progress_bar.add($progress_text)
                        .delay(500)
                        .animate({opacity: 0}, 500, function() {
                            $progress.animate({top: '-100%'}, 1000, 'easeInOutQuint');
                        });
                $('body').css({overflow: 'visible'});
                $('.main').css({height: 'auto'});
            }
            // currentが99.9より大きければ終了と判定する
            if (current > 99.99) {
                current = 100;
            }
        }
    }
    /*自己紹介用ボタンの処理*/
    var window_width; // ウィンドウサイズ(横幅)
    var border_pc_tab = 1025; // PCとタブレットの境界(レスポンシブ対応用)
    switch_about_menu(); // 自己紹介用メニューの表示/非表示を切り替える
    $(window).on('resize', function(){
        switch_about_menu(); // ウィンドウリサイズ時も同様にする
    });
    /*
    switch_about_menu - 自己紹介用メニューの表示/非表示を切り替える
    */
    function switch_about_menu() {
        window_width = $(window).width();

        if (window_width > border_pc_tab) {

            // PC閲覧時は写真円枠ボタンにマウスオーバーで
            $('#about_btn').mouseover(function() {
                $('.about_menu').addClass('open');
            });
            $('#about_btn').mouseout(function() {
                $('.about_menu').removeClass('open');
            });
            $('#about_btn').on('click', function() {
                $('.about_menu').toggleClass('open'); // クリックでも閉じられるように
            });

        } else {

            // スマホ閲覧時は+/-のボタンクリックで
            $('.circle_btn_tab').on('click', function(){
                if ($('.circle_btn_tab').hasClass('open')) {
                    $('.circle_btn_tab').removeClass('open');
                    $('.about_menu').removeClass('open');
                } else {
                    $('.circle_btn_tab').addClass('open');
                    $('.about_menu').addClass('open');
                }
            });
        }
    }

    /*自己紹介の詳細情報とメニューの表示/非表示を切り替える*/
    $('#about_btn').each(function() {
        // PC、タブレット閲覧時はFuchsia の文字クリックで
        $('#view_about').on('click', function() {
            $('#about').show();
            $('#about_btn').hide();
        });
        // スマホ時はアイコンクリックで
        $('#view_about_sp').on('click', function() {
            $('#about').show();
            $('#about_btn').hide();
        });
        $('#about_toggle_btn').on('click', function() {
            $('#about').hide();
            $('#about_btn').show();
        });
    });

    /* 画像ギャラリーの処理*/
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
            gallery_item_off_top = 0, // クリックした画像アイテムサムネイルの元のtop
            content_height = 0, // クリックした画像アイテムの情報コンテナの高さ
            image_height = 0, // クリックした画像アイテムの画像の高さ
            window_height = $(window).outerHeight(), // ウィンドウの高さ
            header_height = 0, // ヘッダーの高さ
            main_padding_left = 0, // コンテンツ左に設定した余白の幅
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
                                '<div class="content_left">' +
                                    '<img src="' + item.images.large + '" alt="">' +
                                '</div>' +
                                '<div class="content_right">' + 
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
                                        '<ul>' +
                                            '<li><a href="' + item.content.link.xd + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-edit"></i>Adobe XD</a></li>' +
                                            '<li><a href="' + item.content.link.webpage + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-desktop"></i>Webpage</a></li>' +
                                            '<li><a href="' + item.content.link.github + '" target="_blank" rel="noopener noreferrer" ><i class="fab fa-github"></i>GitHub</a></li>' +
                                            '<li><a class="link_article_design" href="' + item.content.link.design_article + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-book"></i>Article of Design</a></li>' +
                                            '<li><a class="link_article_coding" href="' + item.content.link.coding_article + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-book"></i>Article of Coding</a></li>' +
                                        '</ul>' +
                                    '</div>' +
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
                                '<div class="content_left">' +
                                    '<img src="' + item.images.large + '" alt="">' +
                                '</div>' +
                                '<div class="content_right">' + 
                                    '<div class="content_text">' + 
                                        '<h1>' + item.title +
                                        '<span><time class="date" datatime="' + item.date + '">' +
                                            item.date.replace(/-0?/g, '/') +
                                        '</time></span>' + '</br>' +
                                        '</h1>' +
                                        '<h2>Copy of Real Web Site</h2>' +
                                        '<hr>' +
                                        '<ul>' +
                                            '<li><a href="' + item.content.link.src + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-desktop"></i>Original</a></li>' +
                                            '<li><a href="' + item.content.link.xd + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-edit"></i>Adobe XD (Copy)</a></li>' +
                                            '<li><a href="' + item.content.link.github + '" target="_blank" rel="noopener noreferrer" ><i class="fab fa-github"></i>GitHub (Copy)</a></li>' +
                                            '<li><a href="' + item.content.link.webpage + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-desktop"></i>Webpage (Copy)</a></li>' +
                                        '</ul>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="toggle_btn">' +
                                    '<span></span>' +
                                    '<span></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    '</li>';
                } else if (item.category == "workbook") {
                    var id_str = i.toString();
                    itemHTML =
                    '<li class="gallery_item is_loading" id="gallery_item_' + id_str + '">' +
                        '<img class="gallery_img" src="' + item.images.thumb + '" alt="">' +
                        '<div class="content">' +
                            '<div class="content_inner">' +
                                '<div class="content_left">' +
                                    '<img src="' + item.images.large + '" alt="">' +
                                '</div>' +
                                '<div class="content_right">' + 
                                    '<div class="content_text">' + 
                                        '<h1>' + item.title +
                                        '<span><time class="date" datatime="' + item.date + '">' +
                                            item.date.replace(/-0?/g, '/') +
                                        '</time></span>' + '</br>' +
                                        '</h1>' +
                                        '<h2>Training Workbook Published</h2>' +
                                        '<hr>' +
                                        '<h3>課題制作</h3>' + 
                                        '<p>' + item.content.link.src_twitter_name + 'さん</p>' +
                                        '<ul>' +
                                            '<li><a href="' + item.content.link.src_twitter + '" target="_blank" rel="noopener noreferrer" ><i class="fab fa-twitter"></i>Author Twitter</a></li>' +
                                            '<li><a class="link_article_workbook" href="' + item.content.link.src_article + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-edit"></i>Article of Workbook</a></li>' +
                                            '<li><a href="' + item.content.link.webpage + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-desktop"></i>Webpage</a></li>' +
                                            '<li><a href="' + item.content.link.github + '" target="_blank" rel="noopener noreferrer" ><i class="fab fa-github"></i>GitHub</a></li>' +
                                        '</ul>' +
                                    '</div>' +
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
                                '<div class="content_left">' +
                                '<img src="' + item.images.large + '" alt="">' +
                                '</div>' +
                                '<div class="content_right">' + 
                                    '<div class="content_text">' + 
                                        '<h1>' + item.title +
                                        '<span><time class="date" datatime="' + item.date + '">' +
                                            item.date.replace(/-0?/g, '/') +
                                        '</time></span>' + '</br>' +
                                        '</h1>' +
                                        '<h2>Original Logo Design</h2>' +
                                        '<hr>' +
                                        '<h3>お題</h3>' + '<p>' + item.content.description + '</p>' +
                                        '<h3>コンセプト</h3>' + '<p>' + item.content.concept + '</p>' +
                                        '<ul>' +
                                            '<li><a href="' + item.content.link.webpage + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-desktop"></i>Webpage</a></li>' +
                                            '<li><a href="' + item.content.link.logo_article + '" target="_blank" rel="noopener noreferrer" ><i class="fas fa-book"></i>Article</a></li>' +
                                        '</ul>' +
                                    '</div>' +
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
                gallery_item_off_top = gallery_item_off.top; // 元のtop値

                //$('.gallery_img').hide(); // 他画像を隠す
                $('#' + gallery_item_id).css('width', '100%'); // 横幅を画面いっぱいに
                // 開始位置を左上端からにする
                $('#'+ gallery_item_id).css('left', 0);
                $('#'+ gallery_item_id).css('top', 0);

                // トップにスクロール
                scrollTo(0,0);

                // モーダルウィンドウを表示
                $(gallery_content).show();
                $(gallery_content_inner).show();
                $(gallery_content + ' a').show();

                // 自己紹介用コンテンツを非表示にする
                $('#about_btn').hide();

                // PC閲覧時はスクロールをOFF
                if (window.matchMedia('(min-width: 600px)').matches) {
                    $('body').css('overflow', 'hidden');
                // スマホ閲覧時はスクロールをON、バックの画像とヘッダーを非表示
                } else if (window.matchMedia('(max-width: 599px)').matches) {
                    $('body').css('overflow', 'visible');
                    $('.gallery_img').hide();
                    $('#gallery').css('height', '0');
                    $('#header').hide();
                }
                /*
                ToDo : このままだとスマホではスクロールOFFにならない。
                レスポンシブ対応時に注意
                */

                // 全画面表示のための高さ調整
                /*
                content_height = $(gallery_content).outerHeight(); // クリックしたアイテムのコンテナの高さ
                image_height = $(gallery_content + ' img').outerHeight(); // クリックした画像アイテムの高さ

                // 画像の高さがウィンドウサイズより大きいとき、コンテナのheightを画像の高さにする
                if(image_height > window_height) {
                    $(gallery_content).css('height', image_height);
                }
                */

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

                // 元の位置に戻す
                header_height = $("header").outerHeight(); // ヘッダーの高さを取得
                main_padding_left = parseInt($('.main').css('padding-left')); // mainコンテンツの左余白を取得
                
                $('#' + gallery_item_id).css('left', gallery_item_off_left - main_padding_left); // left値を直す
                $('#' + gallery_item_id).css('top', gallery_item_off_top - header_height); // top値を直す

                // 自己紹介用コンテンツを表示する
                $('#about_btn').show();
                // スクロールをONにする
                $('body').css('overflow', 'scroll');
                // スマホ時非表示になったヘッダーも表示
                $('#header').show();
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

    // スクロール時にヘッダーを変化させる
    header_height = $("header").outerHeight(); // ヘッダーの高さを取得
    window.addEventListener('scroll', function(e){
        // ヘッダーの高さ分スクロールしたらfixedクラスでスタイルを変える
        if ( $(window).scrollTop() > header_height ) {
            $("header").addClass("fixed");
 
        // クラスを削除して元に戻す
        } else if ( $("header").hasClass("fixed") ) {
            $("header").removeClass("fixed");
        }
    });
});