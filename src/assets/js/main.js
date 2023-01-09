import $ from 'jquery';

$(document).ready(function () {
  const resB = 1920
  const resXL = 1200
  const resL = 992
  const resM = 768
  const resS = 540
  const resXS = 320

  const pageWrapper = $('.body')
  
  let contentWidth, contentHeight, screenWidth, multiplier

  // body show
  displayPage(pageWrapper)

  // mobile screen height fix
  fixWindowHeight()
  $(window).resize('resize', fixWindowHeight)
  
  // responsive scale
  setResponsiveScale(pageWrapper)
  $(window).resize(function () {
    setResponsiveScale(pageWrapper)
  })

  // functions
  function fixWindowHeight () {
    $(document).css('--app-height', '${window.innerHeight}px')
  }
  function displayPage (elem) {
    elem.addClass('is-loaded')
  }
  function setResponsiveScale (contentWrapper) {
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