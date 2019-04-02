'use strict';

/* global $, sr, ScrollReveal, Headroom, console, setTimeout, Plugins, setInterval, clearInterval */

/**
 * Declare global variables
 */
var $document = $(document),
    $window = $(window),
    $body = $('body'),
    $html = $('html'),
    $header = $('header'),
    $card = $('.portfolio-item'),
    $teamMember = $('.team-member'),
    $workLink = $('.menu-item-49 a'),
    $dropdownMenu = $('.dropdown-menu'),
    $menuBtn = $('.menu-button'),
    $mobileMenu = $('.mobile-menu');

/**
 * Wrap each word in an individual span
 */
function wordSpanWrap(selector) {
  var $selector = $(selector),
      words = void 0,
      newString = void 0,
      spanWrap = void 0;

  $selector.each(function () {
    words = $(this).html().split(' ');
    newString = [];

    for (var i = 0; i < words.length; i++) {
      spanWrap = '<span class="word-wrap__wrapper"><span class="word-' + i + '">' + words[i] + '</span></span> ';

      newString.push(spanWrap);
    }

    $(this).html(newString);
  });
}

/**
 * Detect if element is in viewport
 */
function elementVisible(selector) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var $element = $(selector),
      scrolled = $window.scrollTop();

  $element.each(function () {
    var $this = $(this),
        elementPos = $this.offset().top;

    if (elementPos <= scrolled + offset) {
      $this.addClass('visible');
    }
  });
}

/**
 * Homepage Quote Slideshow
 */
function quoteSlideshow(selector) {
  var $selector = $(selector),
      $active = void 0;

  $selector.first().addClass('active initial');

  setTimeout(function () {
    $selector.first().removeClass('initial');
  }, 6000);

  var quoteTimeout = setTimeout(function () {
    setInterval(function () {
      if ($selector.last().hasClass('active')) {
        $selector.removeClass('active').first().addClass('active');
      } else {
        $active = $(selector + '.active');
        $active.removeClass('active').next().addClass('active');
        clearInterval(quoteTimeout);
      }
    }, 4000);
  }, 1800);
}

/**
 * Offset Scrolling on Team Member Bios
 */
function teamMemberParallax() {
  var scrolled = $window.scrollTop();

  $teamMember.each(function () {
    var $this = $(this),
        $image = $this.find('.team-member__image'),
        imageTop = $this.offset().top - 50,
        imagePos = (scrolled - imageTop) * 0.15;

    if ($window.width() > 768) {
      $image.css({
        transform: 'translate3d(0, ' + (0 - imagePos) + 'px, 0)'
      });
    } else {
      $image.css({
        transform: 'translate3d(0, 0, 0)'
      });
    }
  });
}

/**
 * Case Study Slideshow
 */
var slideshowSettings = {
  slide: '.slide',
  dots: true,
  slidesToShow: 1,
  centerMode: true,
  arrows: false,
  infinite: false
};

var $caseStudySlideshow = $('.project-overview__slideshow');

// Unslick slideshow on larger monitors
function unslickSlideshow() {
  if ($window.width() > 600) {
    if ($caseStudySlideshow.hasClass('slick-initialized')) {
      $caseStudySlideshow.slick('unslick');
    }

    return;
  }

  if (!$caseStudySlideshow.hasClass('slick-initialized')) {
    return $caseStudySlideshow.slick(slideshowSettings);
  }
}

/**
 * Scroll Reveal
 */
function scrollReveal() {
  // Default Settings
  window.sr = ScrollReveal({
    duration: 750,
    scale: 1,
    distance: '30px',
    viewFactor: 0.2
  });

  // media query event handler
  if (matchMedia) {
    var mq = window.matchMedia('(hover: none)');
    mq.addListener(touchDevice);
    touchDevice(mq);
  }

  // media query change
  function touchDevice(mq) {
    if (mq.matches) {// Touch Device

    } else {
      // Not a touch device
      sr.reveal('.our-experience', { duration: 750 });
    }
  }

  sr.reveal('.project-overview', { viewFactor: 0, distance: '100px' });
  sr.reveal('.press-link');
}

/**
 * Contact Form
 */

// Update signature
$('.first-name').keyup(function () {
  $('.first-name-2').val($(this).val());
});

// Resize input based on character count
Plugins.AutosizeInput.getDefaultOptions().space = 10;
$('input').autosizeInput();

// Format Phone Number
$('.phone').mask('000-000-0000');

// Get the form.
var $form = $('.form');

// Get the messages div.
var $formMessages = $('.form-messages');

// Set up an event listener for the contact form.
$form.submit(function (e) {
  // Stop the browser from submitting the form.
  e.preventDefault();

  // Serialize the form data.
  var formData = $form.serialize();

  // Submit the form using AJAX.
  $.ajax({
    type: 'POST',
    url: $form.attr('action'),
    data: formData
  }).done(function (response) {
    // Make sure that the formMessages div has the 'success' class.
    $formMessages.removeClass('error');
    $formMessages.addClass('success');

    // Set the message text.
    $formMessages.text(response);
  }).fail(function (data) {
    // Make sure that the formMessages div has the 'error' class.
    $formMessages.removeClass('success');
    $formMessages.addClass('error');

    // Set the message text.
    if (data.responseText !== '') {
      $formMessages.text(data.responseText);
    } else {
      $formMessages.text('Oops! An error occured and your message could not be sent.');
    }
  });
});

/**
 * Hide Header When Scrolling Down
 */
function headroomMobile() {
  if ($window.width() < 768) {
    var header = document.querySelector('header');

    var headroom = new Headroom(header, {
      offset: 20,
      tolerance: {
        up: 20,
        down: 0
      }
    });

    headroom.init();
  }
}

/**
 * Initialize Armor Application
 */
var Armor = {
  init: function init() {
    // Once document loads, add transitions back
    $body.removeClass('preload');

    // Initialize Functions
    wordSpanWrap('.word-wrap');
    quoteSlideshow('.overview .word-wrap');

    // Click Event
    $workLink.on('click', function (e) {
      var $this = $(this);

      $this.toggleClass('dropdown-menu--open');
      $dropdownMenu.toggleClass('dropdown-menu--open');

      e.preventDefault();
    });

    $menuBtn.on('click', function () {
      var $this = $(this);

      $this.toggleClass('menu-button--active');
      $mobileMenu.toggleClass('mobile-menu--open');
      $body.toggleClass('no-scroll');
      $html.toggleClass('no-scroll');
      $header.toggleClass('mobile-menu--open');
    });

    $document.on('keydown', function (e) {
      if (e.which === 27) {
        if ($dropdownMenu.hasClass('dropdown-menu--open')) {
          $workLink.removeClass('dropdown-menu--open');
          $dropdownMenu.removeClass('dropdown-menu--open');
        } else if ($mobileMenu.hasClass('mobile-menu--open')) {
          $menuBtn.removeClass('menu-button--active');
          $mobileMenu.removeClass('mobile-menu--open');
          $body.removeClass('no-scroll');
          $html.removeClass('no-scroll');
          $header.removeClass('mobile-menu--open');
        }
      }
    });

    setTimeout(function () {
      $('.overview, .our-work, .introduction, .project-overview__intro').addClass('visible');
      $header.addClass('visible');
    }, 250);
  }

  /**
   * Window Events
   */
};$window.on('load resize', function () {
  headroomMobile();
  unslickSlideshow();
});

$window.on('scroll', function () {
  teamMemberParallax();
});

/**
 * Document Ready
 */
$(function () {
  Armor.init();
});