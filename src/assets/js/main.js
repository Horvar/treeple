import $ from 'jquery'
require('jquery-ui/dist/jquery-ui')
require('@fancyapps/fancybox')
require('slick-slider/slick/slick')
require('select2/dist/js/select2')
import datepicker from 'js-datepicker'

$(document).ready(function () {
    const resB = 1920
    const resXL = 1440
    const resL = 992
    const resM = 768
    const resS = 540
    const resXS = 320

    const pageWrapper = $('.body__wrapper')

    let contentWidth, contentHeight, screenWidth, multiplier

    // body show
    displayPage(pageWrapper)

    // mobile screen height fix
    fixWindowHeight()
    $(window).resize('resize', fixWindowHeight)
    
    // set height of screen
    setScreenHeight()
    $(window).resize(setScreenHeight)
    
    function setScreenHeight() {
        let
            elem = $('[data-screen-height]'),
            height = $(window).height(),
            breakpoint = elem.attr('data-screen-height')

        if ($(window).width() <= breakpoint) {
            elem.each(function () {
                let that = $(this)
                that.height(height / multiplier)
            })  
        }
    }

    // responsive scale
    setResponsiveScale(pageWrapper)
    $(window).resize(function () {
        setResponsiveScale(pageWrapper)
    })
    
    // select2
    const selectMain = $('[data-select-main]')
    selectMain.select2({
        dropdownParent: $('.intro-search-select__dropdown'),
        selectionCssClass: 'intro-search-select__button',
        // scrollAfterSelect: false,

        language: {
            noResults: function (params) {
                return 'Нет результатов';
            }
        }
    })
    $(document).on('select2:open', function () {
        document.querySelector('.select2-search__field').focus()
    })
    
    // datepicker
    if ($('#datepickerMain').length) {
        const datepickerMain = '#datepickerMain'
        let datepickerMainY,
            datepickerMainM,
            datepickerMainD
        const pickerMain = datepicker(datepickerMain, {
            onSelect: (instance, date) => {
                datepickerMainY = instance.currentYear
                datepickerMainM = instance.currentMonth + 1
                datepickerMainD = $(this).find('.qs-active').text()

                $(this).find('output').text(`${datepickerMainD}.${datepickerMainM}.${datepickerMainY}`).addClass('is-selected')
            },
            onShow: instance => {
                $(datepickerMain).addClass('is-active')
            },
            onHide: instance => {
                $(datepickerMain).removeClass('is-active')
            },
            customDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
        })
        $(datepickerMain).click(function (e) {
            let that = $(this)
            if (that.hasClass('is-active')) {
                that.removeClass('is-active')}

            e.stopPropagation()

            const isHidden = pickerMain.calendarContainer.classList.contains('qs-hidden')
            pickerMain[isHidden ? 'show' : 'hide']()
        })
    }
    
    // fancybox
    $('[data-fancybox]').fancybox({
        animationDuration: 500,
        animationEffect: 'fade'
    })
    $('[data-fancy-trigger]').click(function () {
        $.fancybox.open( $('[data-fancybox=galleryTour]'), {
            animationDuration: 500,
            animationEffect: 'fade',
            thumbs : {
                autoStart: true
            }
        }, 0 )
    })
    
    // slick
    const sliderGuide = $('[data-slider-guide]')
    sliderGuide.slick({
        infinite: false,
        slidesToShow: 1,
        variableWidth: true,
        prevArrow: $(this).find('[data-slider-guide-nav=prev]'),
        nextArrow: $(this).find('[data-slider-guide-nav=next]')
    })

    // folders
    const
        folderTrigger = $('[data-folder-trigger]'),
        folderContent = $('[data-folder-content]')
    
    if (folderTrigger.length) {
        folderContent.slideUp(0)
        
        folderTrigger.each(function () {
            let that = $(this)
            that.click(function () {
                that.toggleClass('is-unfolded')
                that.next(folderContent).slideToggle(500)
            })
        })
    }

    // sticky fixed
    mozStickyScaleFix()
    $(window).scroll(mozStickyScaleFix)

    function mozStickyScaleFix() {
        $('[data-sticky-wrapper]').each(function () {
            let wrapper = $(this)
            let content = wrapper.find($('[data-sticky-content]'))

            let scrollTop = $(window).scrollTop()

            let wrapperOffset = wrapper.offset().top
            let contentOffset = content.offset().top
            let wrapperH = wrapper.height()
            let contentH = content.height()

            let offsetTop = 0

            let position

            if ((scrollTop > wrapperOffset - offsetTop)) {
                if (navigator.userAgent.indexOf("Firefox") !== -1) {
                    position = (scrollTop - wrapperOffset + offsetTop) / multiplier
                } else {
                    position = scrollTop - wrapperOffset + offsetTop
                }
            } else {
                position = 0
            }
            if (position > ((wrapperH - contentH))) {
                position = (wrapperH - contentH)
            }

            content.css({
                'transform': 'translateY('+position+'px)'
            })
        })
    }
    
    // menu
    const
        menuButton = $('[data-menu-button]'),
        menuFrame = $('[data-menu-dropdown]')

    menuButton.click(function () {
        toggleMenu()
    })

    menuFrame.find('a').click(function () {
        toggleMenu()
    })

    function toggleMenu() {
        menuButton.toggleClass('is-active')
        menuFrame.slideToggle(500)
    }
    
    // range bar
    $(function() {
        const
            rangeSlider = $('#priceRangeSlider'),
            rangeOutputStart = $('#priceRangeStart'),
            rangeOutputEnd = $('#priceRangeEnd'),
            rangeMin = parseInt(rangeSlider.attr('data-min')),
            rangeMax = parseInt(rangeSlider.attr('data-max'))
        
        rangeSlider.slider({
            range: true,
            min: rangeMin,
            max: rangeMax,
            values: [rangeMin, rangeMax - rangeMin],
            slide: function(event, ui) {
                rangeOutputStart.text(ui.values[0]),
                rangeOutputEnd.text(ui.values[1])
            }
        })
        rangeOutputStart.text(rangeSlider.slider('values', 0))
        rangeOutputEnd.text(rangeSlider.slider('values', 1))
    })
    
    // functions
    function fixWindowHeight() {
        $(document).css('--app-height', '${window.innerHeight}px')
    }

    function displayPage(elem) {
        elem.addClass('is-loaded')
    }

    function setResponsiveScale(contentWrapper) {
        contentWidth = contentWrapper.outerWidth()
        contentHeight = $('html').outerHeight()
        screenWidth = $(window).outerWidth()
        multiplier = screenWidth / contentWidth

        if (navigator.userAgent.indexOf('Firefox') !== -1) {
            $('.body__wrapper').css({
                'transform-origin': 'top left',
                transform: 'scale(' + multiplier + ')',
                height: '' + contentHeight / multiplier + 'px'
            })
        } else {
            $('.body__wrapper').css({
                zoom: multiplier
            })
        }

        return multiplier
    }
})