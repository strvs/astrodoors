$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            var file = curInput[0].files[0];
            var curSize = file.size;
            var curSizeUnit = 'b';
            if (curSize > 1024) {
                curSize = (curSize / 1024).toFixed(0);
                curSizeUnit = 'kb';
            }
            if (curSize > 1024) {
                curSize = (curSize / 1024).toFixed(0);
                curSizeUnit = 'mb';
            }
            curField.find('.form-file-input span').html('<em>' + curName + '<strong>' + curSize + curSizeUnit + '</strong>' + '<a href="#"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#file-remove"></use></svg></a></em>');
            curField.addClass('full');
        } else {
            curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
            curField.removeClass('full');
        }
    });

    $('body').on('click', '.form-file-input span em a', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.removeClass('full');
        curField.find('input').val('');
        curField.find('.form-file-input span').html(curField.find('.form-file-input span').attr('data-placeholder'));
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.header-menu-link', function(e) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('menu-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        e.preventDefault();
    });

    $('body').on('click', '.menu-close-link', function(e) {
        $('html').removeClass('menu-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('.catalogue-white-gallery-list').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider[0], {
            loop: false,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    });

    $('.catalogue-section-more a').click(function(e) {
        var curLink = $(this);
        var curSection = curLink.parents().filter('.catalogue-section');
        if (!curSection.find('.catalogue-section-more').hasClass('loading')) {
            curSection.find('.catalogue-section-more').addClass('loading');
            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                curSection.find('.catalogue-list').append($(html).find('.catalogue-list').html());
                if ($(html).find('.catalogue-section-more').length == 1) {
                    curSection.find('.catalogue-section-more a').attr('href', $(html).find('.catalogue-section-more a').attr('href'));
                } else {
                    curSection.find('.catalogue-section-more').remove();
                }
                curSection.find('.catalogue-section-more').removeClass('loading');
            });
        }
        e.preventDefault();
    });

    $('.catalogue-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 1,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                1200: {
                    slidesPerView: 3
                },
                1681: {
                    slidesPerView: 4
                }
            },
        });
    });

    $('.detail-gallery').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: true,
            slidesPerView: 1,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
        });
    });

    $('.detail-filter-menu-item').click(function() {
        var curItem = $(this);
        if (!curItem.hasClass('active')) {
            $('.detail-filter-menu-item.active').removeClass('active');
            curItem.addClass('active');
            var curIndex = $('.detail-filter-menu-item').index(curItem);
            $('.detail-filter-content.active').removeClass('active');
            $('.detail-filter-content').eq(curIndex).addClass('active');
        }
    });

    $('.detail-filter-models-list').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 'auto',
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
        });
    });

    $('.detail-filter-dividers-list').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 6,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
        });
    });

    $('.detail-filter input').change(function() {
        if ($(window).width() > 1199) {
            $('.detail-left').addClass('loading');
            var curForm = $('.detail-filter form');
            var formData = new FormData(curForm[0]);
            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                processData: false,
                contentType: false,
                dataType: 'html',
                data: formData,
                cache: false
            }).done(function(html) {
                $('.detail-left').html(html);
                $('.detail-gallery').each(function() {
                    var curSlider = $(this);
                    var swiper = new Swiper(curSlider.find('.swiper')[0], {
                        loop: true,
                        slidesPerView: 1,
                        navigation: {
                            nextEl: curSlider.find('.swiper-button-next')[0],
                            prevEl: curSlider.find('.swiper-button-prev')[0]
                        },
                    });
                });
                $('.detail-left').removeClass('loading');
            });
        }
    });

    $('body').on('click', '.detail-filter-mobile-link a', function(e) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('detail-filter-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        e.preventDefault();
    });

    $('body').on('click', '.detail-filter-header-close', function(e) {
        $('html').removeClass('detail-filter-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('.detail-filter-apply a').click(function(e) {
        $('html').removeClass('detail-filter-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        $('.detail-left').addClass('loading');
        var curForm = $('.detail-filter form');
        var formData = new FormData(curForm[0]);
        $.ajax({
            type: 'POST',
            url: curForm.attr('action'),
            processData: false,
            contentType: false,
            dataType: 'html',
            data: formData,
            cache: false
        }).done(function(html) {
            $('.detail-left').html(html);
            $('.detail-gallery').each(function() {
                var curSlider = $(this);
                var swiper = new Swiper(curSlider.find('.swiper')[0], {
                    loop: true,
                    slidesPerView: 1,
                    navigation: {
                        nextEl: curSlider.find('.swiper-button-next')[0],
                        prevEl: curSlider.find('.swiper-button-prev')[0]
                    },
                });
            });
            $('.detail-left').removeClass('loading');
        });
        e.preventDefault();
    });

    $('.detail-info-item-title').click(function() {
        var curItem = $(this).parent();
        if (curItem.hasClass('open')) {
            curItem.removeClass('open');
        } else {
            $('.detail-info-item.open').removeClass('open');
            curItem.addClass('open');
        }
        $(window).trigger('resize');
    });

    $('.systems-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 'auto',
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
            breakpoints: {
                1200: {
                    slidesPerView: 6
                },
                1681: {
                    slidesPerView: 8
                }
            },
        });
    });

    $('.collection-about-gallery').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: true,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            scrollbar: {
                el: curSlider.find('.swiper-scrollbar')[0],
            },
        });
    });

    $('.detail-projects-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 'auto',
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            }
        });
    });

    $('.coop-prefs-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 1,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                1200: {
                    slidesPerView: 3
                },
                1441: {
                    slidesPerView: 4
                },
                1681: {
                    slidesPerView: 5
                }
            },
        });
    });

    $('.news-more a').click(function(e) {
        var curLink = $(this);
        if (!$('.news-more').hasClass('loading')) {
            $('.news-more').addClass('loading');
            $.ajax({
                type: 'POST',
                url: curLink.attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.news').append($(html).find('.news').html());
                if ($(html).find('.news-more').length == 1) {
                    $('.news-more a').attr('href', $(html).find('.news-more a').attr('href'));
                } else {
                    $('.news-more').remove();
                }
                $('.news-more').removeClass('loading');
            });
        }
        e.preventDefault();
    });

    $('.news-detail-gallery').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: true,
            autoHeight: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        });
    });

    function popupCenter(url, title) {
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (480 / 2)) + dualScreenLeft;
        var top = ((height / 3) - (360 / 3)) + dualScreenTop;
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + 375 + ', height=' + 280 + ', top=' + top + ', left=' + left);
        if (window.focus) {
            newWindow.focus();
        }
    }

    $('body').on('click', '.news-detail-share-vk', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://vk.com/share.php?url=' + curUrl + '&description=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('body').on('click', '.news-detail-share-tg', function(e) {
        var curTitle = encodeURIComponent($('title').html());
        var curUrl = encodeURIComponent(window.location.href);

        popupCenter('https://telegram.me/share/url?url=' + curUrl + '&text=' + curTitle, curTitle);

        e.preventDefault();
    });

    $('.news-other-slider').each(function() {
        var curSlider = $(this);
        var swiper = new Swiper(curSlider.find('.swiper')[0], {
            loop: false,
            slidesPerView: 1,
            navigation: {
                nextEl: curSlider.find('.swiper-button-next')[0],
                prevEl: curSlider.find('.swiper-button-prev')[0]
            },
            breakpoints: {
                768: {
                    slidesPerView: 2
                },
                1200: {
                    slidesPerView: 3
                },
                1681: {
                    slidesPerView: 4
                }
            },
        });
    });

    $('.services-page-menu ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.services-page-menu ul li.active').removeClass('active');
            curLi.addClass('active');
            var curIndex = $('.services-page-menu ul li').index(curLi);
            $('.services-page-content.active').removeClass('active');
            $('.services-page-content').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.services-page-content h3').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('body').on('click', '[data-lightbox]', function(e) {
        var curItem = $(this);
        var curGroup = curItem.attr('data-lightbox');
        if (curGroup == '') {
            var curGallery = curItem;
        } else {
            var curGallery = $('[data-lightbox="' + curGroup + '"]');
        }
        var curIndex = curGallery.index(curItem);

        var curWidth = $(window).width();
        var curScroll = $(window).scrollTop();
        var curPadding = $('.wrapper').width();
        $('html').addClass('window-photo-open');
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});
        $('html').data('scrollTop', curScroll);
        $('.wrapper').css({'top': -curScroll});

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-slider swiper">' +
                                    '<div class="window-photo-slider-list swiper-wrapper">';

        var galleryLength = curGallery.length;

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.eq(i);
            var curTitle = '';
            if (typeof(curGalleryItem.attr('data-title')) !== 'undefined' && curGalleryItem.attr('data-title') != '') {
                curTitle = curGalleryItem.attr('data-title');
            }
            windowHTML +=               '<div class="window-photo-slider-list-item swiper-slide">' +
                                            '<div class="window-photo-slider-list-item-inner"><img alt="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjM4cHgiIGhlaWdodD0iMzhweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTQyMDI2IiBzdHJva2Utd2lkdGg9IjEwIiByPSIzNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTY0LjkzMzYxNDMxMzQ2NDE1IDU2Ljk3Nzg3MTQzNzgyMTM4Ij4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGR1cj0iMXMiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiIGtleVRpbWVzPSIwOzEiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9jaXJjbGU+CjwhLS0gW2xkaW9dIGdlbmVyYXRlZCBieSBodHRwczovL2xvYWRpbmcuaW8vIC0tPjwvc3ZnPg==" data-src="' + curGalleryItem.attr('href') + '" data-title="' + curTitle + '" /></div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                    '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-slider-prev"></use></svg></div>' +
                                    '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-slider-next"></use></svg></div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-photo-close"></use></svg></a>';
        windowHTML +=           '<div class="window-photo-title"></div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        $('.window-photo-slider').each(function() {
            var curSlider = $(this);

            var swiper = new Swiper(curSlider[0], {
                loop: false,
                initialSlide: curIndex,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    afterInit: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        if (curIMG.attr('data-title') != '') {
                            $('.window-photo-title').addClass('visible').html(curIMG.attr('data-title'));
                        } else {
                            $('.window-photo-title').removeClass('visible').html('');
                        }
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    },
                    slideChangeTransitionStart: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');
                        var curIMG = currentSlide.find('img');
                        if (curIMG.attr('data-title') != '') {
                            $('.window-photo-title').addClass('visible').html(curIMG.attr('data-title'));
                        } else {
                            $('.window-photo-title').removeClass('visible').html('');
                        }
                    },
                    slideChangeTransitionEnd: function () {
                        var currentSlide = $('.window-photo-slider-list .swiper-slide-active');

                        var curIMG = currentSlide.find('img');
                        if (curIMG.attr('data-title') != '') {
                            $('.window-photo-title').addClass('visible').html(curIMG.attr('data-title'));
                        } else {
                            $('.window-photo-title').removeClass('visible').html('');
                        }
                        if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                            var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                            $('body').append(newIMG);
                            newIMG.one('load', function(e) {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                newIMG.remove();
                            });
                            newIMG.attr('src', curIMG.attr('data-src'));
                            window.setTimeout(function() {
                                curIMG.attr('src', curIMG.attr('data-src'));
                                if (newIMG) {
                                    newIMG.remove();
                                }
                            }, 3000);
                        }
                    }
                }
            });
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowParamsClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window-params')) {
            windowParamsClose();
        }
    });

    $('body').on('click', '.window-params-close', function(e) {
        windowParamsClose();
        e.preventDefault();
    });

    $('.window-params-link').click(function(e) {
        windowParamsOpen();
        e.preventDefault();
    });

    $('.window-params-group-title').click(function() {
        $(this).parent().toggleClass('open');
    });

    $('.buy-list-ctrl a').click(function(e) {
        $('html').toggleClass('buy-list-open');
        e.preventDefault();
    });

    $('.buy-search-form-input input').focus(function() {
        $('.buy-search-results').addClass('visible');
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.buy-search').length == 0) {
            $('.buy-search-results').removeClass('visible');
        }
    });

    $('.buy-search-form-input input').attr('autocomplete', 'off');
    $('.buy-search-form-input input').on('keydown', function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    });

    $('.buy-search-form-input input').on('keyup', function() {
        $('.buy-search-form-submit button').trigger('click');
    });

    $('.buy-search-form form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        if (validator) {
            validator.destroy();
        }
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                $('.buy-search-results').addClass('loading');
                var curData = curForm.serialize();
                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    dataType: 'html',
                    data: curData,
                    cache: false
                }).done(function(html) {
                    $('.buy-search-results').html(html);
                    $('.buy-search-results').removeClass('loading');
                });
            }
        });
    });

    $('body').on('click', '.buy-search-results a', function(e) {
        var curLink = $(this);
        $('.buy-search-current-title span').html(curLink.html());
        $('.buy-search').addClass('selected');
        if (ymaps) {
            ymaps.geocode(curLink.html(), {
                results: 1
            }).then(function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                var coords = firstGeoObject.geometry.getCoordinates();
                myMap.panTo(coords);
                $('.buy-search-results').removeClass('visible');
            });
        }
        e.preventDefault();
    });

    $('.buy-search-current-title a').click(function(e) {
        $('.buy-search').removeClass('selected');
        $('.buy-search-form-input input').focus();
        e.preventDefault();
    });

    new WOW().init();

});

var mainMoreSwiper;

$(window).on('load resize', function() {

    $('footer').each(function() {
        var curWidth = $('footer').outerWidth();
        var curHeight = $('footer').outerHeight();
        var newWidth = curWidth;
        var newHeight = curWidth * 0.5625;
        if (newHeight < curHeight) {
            newWidth = curHeight / 0.5625;
            newHeight = curHeight;
        }
        $('.footer-bg').css({'width': newWidth, 'height': newHeight});
    });

    $('.main-welcome').each(function() {
        var curWidth = $('.main-welcome').outerWidth();
        var curHeight = $('.main-welcome').outerHeight();
        var newWidth = curWidth;
        var newHeight = curWidth * 0.5625;
        if (newHeight < curHeight) {
            newWidth = curHeight / 0.5625;
            newHeight = curHeight;
        }
        $('.main-welcome-bg').css({'width': newWidth, 'height': newHeight});
    });

    if ($(window).width() > 1199) {
        $('.main-more-list').each(function() {
            var curSlider = $(this);
            if (curSlider.hasClass('swiper-initialized') && mainMoreSwiper) {
                mainMoreSwiper.destroy();
            }
        });
    } else {
        $('.main-more-list').each(function() {
            var curSlider = $(this);
            if (!curSlider.hasClass('swiper-initialized')) {
                mainMoreSwiper = new Swiper(curSlider[0], {
                    slidesPerView: 'auto',
                    freeMode: true
                });
            }
        });
    }

    $('.page-welcome').each(function() {
        var curWidth = $('.page-welcome').outerWidth();
        var curHeight = $('.page-welcome').outerHeight();
        var newWidth = curWidth;
        var newHeight = curWidth * 0.5625;
        if (newHeight < curHeight) {
            newWidth = curHeight / 0.5625;
            newHeight = curHeight;
        }
        $('.page-welcome-bg').css({'width': newWidth, 'height': newHeight});
    });

    $('.coop-form-side').each(function() {
        $('.coop-form-side-inner').width($('.coop-form-side').width());
        $('.coop-form-side').height($('.coop-form-side-inner').height());
    });

    $('.detail-right').each(function() {
        $('.detail-right-inner').width($('.detail-right').width());
        $('.detail-right').height($('.detail-right-inner').height());
    });

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(window).scrollTop();

    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.coop-form-side').each(function() {
        if (windowScroll > $('.coop-form-side').offset().top) {
            $('.coop-form-side').addClass('fixed');
            if (windowScroll + $('.coop-form-side').height() > $('.coop-form form').offset().top + $('.coop-form form').height()) {
                $('.coop-form-side-inner').css({'margin-top': ($('.coop-form form').offset().top + $('.coop-form form').height()) - (windowScroll + $('.coop-form-side-inner').height())});
            } else {
                $('.coop-form-side-inner').css({'margin-top': 0});
            }
        } else {
            $('.coop-form-side').removeClass('fixed');
            $('.coop-form-side-inner').css({'margin-top': 0});
        }
    });

    $('.detail-right').each(function() {
        if (windowScroll > $('.detail-right').offset().top) {
            $('.detail-right').addClass('fixed');
            if (windowScroll + $('.detail-right').height() > $('.detail').offset().top + $('.detail').height()) {
                $('.detail-right-inner').css({'margin-top': ($('.detail').offset().top + $('.detail').height()) - (windowScroll + $('.detail-right-inner').height())});
            } else {
                $('.detail-right-inner').css({'margin-top': 0});
            }
        } else {
            $('.detail-right').removeClass('fixed');
            $('.detail-right-inner').css({'margin-top': 0});
        }
    });

    $('.about-boss-photo-inner').each(function() {
        var startAnimation = $('.about-boss-photo-inner').offset().top - windowHeight;
        var stopAnimation = $('.about-boss-photo-inner').offset().top + $('.about-boss-photo-inner').outerHeight();
        var curPercent = 0;
        if (windowScroll > startAnimation) {
            if (windowScroll < stopAnimation) {
                curPercent = (windowScroll - startAnimation) / (stopAnimation - startAnimation);
            } else {
                curPercent = 1;
            }
        } else {
            curPercent = 0;
        }
        var curOffset = $('.about-boss-photo-inner img').outerHeight() - $('.about-boss-photo-inner').outerHeight();
        $('.about-boss-photo-inner img').css({'transform': 'translateY(-' + (curOffset * curPercent) + 'px)'});
        $('.about-boss-autograph img').css({'transform': 'translateY(-' + (curOffset * curPercent * 2) + 'px)'});
        $('.about-boss-text svg').css({'transform': 'translateY(-' + (curOffset * curPercent / 2) + 'px)'});
    });
});

function initForm(curForm) {
    curForm.find('input.phoneRU').attr('autocomplete', 'off');
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input input, .form-input textarea').focus(function() {
        $(this).parent().addClass('focus');
    });

    curForm.find('.form-input input, .form-input textarea').blur(function(e) {
        $(this).parent().removeClass('focus');
        if ($(this).val() == '') {
            $(this).parent().removeClass('full');
        } else {
            $(this).parent().addClass('full');
        }
    });

    curForm.find('.form-input textarea').each(function() {
        $(this).css({'height': this.scrollHeight, 'overflow-y': 'hidden'});
        $(this).on('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    curForm.find('input[autofocus]').trigger('focus');

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (!curForm.find('.form-submit button').prop('disabled')) {
                if (curForm.hasClass('window-form')) {
                    curForm.find('.form-submit button').prop('disabled', true);
                    var formData = new FormData(form);
                    windowOpen(curForm.attr('action'), formData);
                } else {
                    form.submit();
                }
            }
        }
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#menu-close-link"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#menu-close-link"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });

        $('.window-city-form-input input').attr('autocomplete', 'off');
        $('.window-city-form-input input').on('keydown', function(e) {
            if (e.keyCode == 13) {
                return false;
            }
        });

        $('.window-city-form-input input').on('keyup blur change', function() {
            $('.window-city-form-submit button').trigger('click');
        });

        $('.window-city-form form').each(function() {
            var curForm = $(this);
            var validator = curForm.validate();
            if (validator) {
                validator.destroy();
            }
            curForm.validate({
                ignore: '',
                submitHandler: function(form) {
                    $('.window-city-results').addClass('loading');
                    var curData = curForm.serialize();
                    $.ajax({
                        type: 'POST',
                        url: curForm.attr('action'),
                        dataType: 'html',
                        data: curData,
                        cache: false
                    }).done(function(html) {
                        $('.window-city-results').html(html);
                        $('.window-city-results').removeClass('loading');
                    });
                }
            });
        });

    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}

function windowParamsOpen(linkWindow, dataWindow) {
    var curPadding = $('.wrapper').width();
    var curScroll = $(window).scrollTop();
    $('html').addClass('window-params-open');
    curPadding = $('.wrapper').width() - curPadding;
    $('body').css({'margin-right': curPadding + 'px'});

    $('.wrapper').css({'top': -curScroll});
    $('.wrapper').data('curScroll', curScroll);
}

function windowParamsClose() {
    $('html').removeClass('window-params-open');
    $('body').css({'margin-right': 0});
    $('.wrapper').css({'top': 0});
    $(window).scrollTop($('.wrapper').data('curScroll'));
}

function createBuyMap() {
    var objectsArray = [];
    var newHTML = '';
    var placemarks = [];
    var swiper;
    for (var i = 0; i < pointers.length; i++) {
        var curPoint = pointers[i];
        var myPlacemark = new ymaps.Placemark(curPoint.coords, {
            hintContent: curPoint.title
        }, mapIcon);
        myMap.geoObjects.add(myPlacemark);
        objectsArray.push({
            type: 'Point',
            coordinates: curPoint.coords
        });
        myPlacemark.events
            .add('mouseenter', function (e) {
                e.get('target').options.set('iconImageClipRect', [[52, 0], [103, 51]]);
            })
            .add('click', function (e) {
                var curPlacemark = e.get('target');
                $('html').addClass('buy-list-open');
                window.setTimeout(function() {
                    $('.buy-list-item').addClass('hidden');
                    for (var k = 0; k < placemarks.length; k++) {
                        if (curPlacemark == placemarks[k]) {
                            var curItem = $('.buy-list-item').eq(k);
                            curItem.removeClass('hidden');
                        }
                    }
                    $('.buy-list-item').removeClass('first-child');
                    $('.buy-list-item:not(.hidden)').eq(0).addClass('first-child');
                    swiper.update();
                }, 100);
            })
            .add('mouseleave', function (e) {
                e.get('target').options.set('iconImageClipRect', [[0, 0], [51, 51]]);
            });
        placemarks.push(myPlacemark);
        newHTML +=  '<div class="buy-list-item">';
        if (typeof(curPoint.photos) !== 'undefined' && curPoint.photos.length > 0) {
            newHTML +=      '<div class="buy-list-item-photos">' +
                                '<div class="swiper">' +
                                    '<div class="swiper-wrapper">';
            for (var j = 0; j < curPoint.photos.length; j++) {
                newHTML +=              '<div class="swiper-slide"><div class="buy-list-item-photo" style="background-image:url(' + curPoint.photos[j] + ')"></div></div>';
            }
            newHTML +=              '</div>' +
                                    '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-slider-prev"></use></svg></div>' +
                                    '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#catalogue-slider-next"></use></svg></div>' +
                                '</div>' +
                            '</div>';
        }
        newHTML +=      '<div class="buy-list-item-title"><a href="#">' + curPoint.title + '</a></div>';
        newHTML +=      '<div class="buy-list-item-address">' + curPoint.address + '</div>';
        newHTML +=      '<div class="buy-list-item-phone"><a href="tel:' + curPoint.phone.replace(/\ /g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '') + '"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#btn-phone"></use></svg>' + curPoint.phone + '</a></div>';
        newHTML +=      '<div class="buy-list-item-schedule">' + curPoint.schedule + '</div>';
        newHTML +=  '</div>';
    }
    $('.buy-list-content > .swiper > .swiper-wrapper > .swiper-slide').html(newHTML);
    swiper = new Swiper($('.buy-list-content > .swiper')[0], {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
        },
        mousewheel: true,
    });
    $('.buy-list-item-photos').each(function() {
        var curPhotos = $(this);
        var swiperPhotos = new Swiper(curPhotos.find('.swiper')[0], {
            slidesPerView: 2,
            navigation: {
                nextEl: curPhotos.find('.swiper-button-next')[0],
                prevEl: curPhotos.find('.swiper-button-prev')[0],
            },
        });
    });
    var objects = ymaps.geoQuery(objectsArray);
    myMap.events.add(['boundschange', 'datachange', 'objecttypeschange'], function () {
        $('.buy-list-item').addClass('hidden');
        var visibleObjects = objects.searchInside(myMap);
        for (var i = 0; i < visibleObjects._objects.length; i++) {
            var curVisibleObject = visibleObjects._objects[i];
            for (var j = 0; j < objects._objects.length; j++) {
                var curObject = objects._objects[j];
                if (curObject == curVisibleObject) {
                    $('.buy-list-item').eq(j).removeClass('hidden');
                }
            }
        }
        $('.buy-list-item').removeClass('first-child');
        $('.buy-list-item:not(.hidden)').eq(0).addClass('first-child');
        swiper.update();
    });

    $('.buy-list-item-title a').click(function(e) {
        var curIndex = $('.buy-list-item').index($(this).parents().filter('.buy-list-item'));
        var coords = pointers[curIndex].coords;
        myMap.panTo(coords);
        for (var i = 0; i < placemarks.length; i++) {
            placemarks[i].options.set('iconImageClipRect', [[0, 0], [51, 51]]);
        }
        placemarks[curIndex].options.set('iconImageClipRect', [[52, 0], [103, 51]]);
        e.preventDefault();
    });
}