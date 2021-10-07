//mobile detect
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 **/
(function(a) {
  (jQuery.browser = jQuery.browser || {}).mobile =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      a
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4)
    );
})(navigator.userAgent || navigator.vendor || window.opera);

//init
(function() {
  document.body.className += jQuery.browser.mobile ? " f-mobile" : " f-desktop";
  if (window.innerHeight)
    document.getElementById("page").style.minHeight = window.innerHeight + "px";

  $(function() {
    /* Auth */
    $("#login-form").on("submit", function() {
      var form = $(this).closest("form");
      var email_input = form.find('input[name="email"]');
      var password_input = form.find('input[name="password"]');
      var errors_block = form.find(".b-login_block-error");
      var data = form.serialize();
      var link = form.attr("action");

      $.post(link, data, function(res) {
        var response = JSON.parse(res);
        if (response["success"] == 1) {
          location.reload();
        } else {
          errors_block.removeClass("hidden");
          errors_block.html(response["error"]);
        }
      });

      return false;
    });
    /* Auth END */

    /* Register */
    $("#register-form").on("submit", function() {
      var form = $(this).closest("form");
      var errors_block = form.find(".b-login_block-error");
      var data = form.serialize();
      var link = form.attr("action");
      var check_email_button = $("#button-toggle-4");

      $.post(link, data, function(res) {
        var response = JSON.parse(res);
        if (response["success"] == 1) {
          check_email_button.click();
        } else {
          errors_block.removeClass("hidden");
          errors_block.html(response["error"]);
        }
      });

      return false;
    });
    /* Register END */

    /* Forgot password */
    $("#forgot-form").on("submit", function() {
      var form = $(this).closest("form");
      var errors_block = form.find(".b-login_block-error");
      var data = form.serialize();
      var link = form.attr("action");
      var check_email_button = $("#button-toggle-5");

      $.post(link, data, function(res) {
        var response = JSON.parse(res);
        if (response["success"] == 1) {
          check_email_button.click();
        } else {
          errors_block.removeClass("hidden");
          errors_block.html(response["error"]);
        }
      });

      return false;
    });
    /* Forgot password END */

    // search form activity
    function setLabel(nod, action) {
      nod.each(function() {
        var value = $(this).val();
        if (!value) {
          $(this).prev("label").css("display", action);
        }
      });
    }

    setLabel($("#search_form"), "inline");
    $('<a href="#" class="s-result-close" title="Очистить поле поиска"></a>')
      .insertAfter($("#search_form"))
      .on("click", function(e) {
        e.preventDefault();
        // $(this).hide();
        // $(this).prev()
        // 	.val('')
        // 	.trigger('focus');

        location.href = $(this).closest("form").attr("action");
      });
    $("#search_form")
      .on("focus", function() {
        $(this).prev("label").css("display", "none");
      })
      .on("keyup", function() {
        if ($(this).val()) {
          $(this).next(".s-result-close").css("display", "block");
        } else {
          $(this).next(".s-result-close").hide();
        }
      })
      .on("blur", function() {
        setLabel($(this), "inline");
      });

    setLabel($(".label-in"), "inline");
    $(".input-in")
      .focus(function() {
        $(this).prev("label").css("display", "none");
      })
      .blur(function() {
        setLabel($(this), "inline");
      });
    // search form activity END

    if (jQuery().tooltip) {
      $(".e-tooltip").tooltip({
        layer: "#layer",
        attr: "data-title",
        pos: "bottom"
      });

      $(".e-tooltip_info").tooltip({
        layer: "#layer",
        attr: "data-title",
        pos: "top",
        tooltipClass: "t-info"
      });

      $(".e-tooltip_map").tooltip({
        layer: "#layer",
        attr: "data-title",
        pos: "bottom",
        mode: "cursor"
      });
    }

    if (jQuery().checkup) {
      $(".e-checkup").checkup();
    }

    if (jQuery().select) {
      $(".e-select").select({
        small: false
      });
      $(".e-nselect").select({
        small: false
      });
    }

    if (jQuery().onefile) {
      $(".e-file_one").onefile();
    }

    if (jQuery().popup) {
      $(".e-popup_winner").popup({
        layer: "#layer",
        type: "ajax",
        width: 600,
        grouped: false,
        popupClass: "t-1",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        }
      });

      $(".e-popup_reg").popup({
        layer: "#layer",
        type: "ajax",
        width: 420,
        grouped: false,
        popupClass: "t-2",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        },
        onLoad: function(el, p) {
          p.on("error", ".e-errortip", function() {
            $(this).errortip({
              errorClass: "t-popup",
              layer: p.find(".popup-holder"),
              superposition: true,
              onError: function(el) {
                el.addClass("t-form_error").one("focus", function() {
                  el.trigger("unerror");
                });
              },
              onUnerror: function(el) {
                el.removeClass("t-form_error");
              }
            });
          });
          p.find(".e-errortip").trigger("error");
        }
      });

      $(".e-popup_test_wrong").each(function() {
        $(this).popup({
          layer: this.hasAttribute("data-popup-layer")
            ? this.getAttribute("data-popup-layer")
            : "#layer",
          type: "ajax",
          width: 460,
          blocked: false,
          grouped: false,
          popupClass: "t-5 p-1"
        });
      });

      $(".e-popup_levelup").popup({
        layer: "#layer",
        type: "ajax",
        width: 520,
        blocked: false,
        grouped: false,
        popupClass: "t-6"
      });

      $(".e-popup_form").popup({
        layer: "#layer",
        type: "ajax",
        width: 460,
        grouped: false,
        popupClass: "t-2",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        },
        onLoad: function(el, p) {
          p.on("error", ".e-errortip", function() {
            $(this).errortip({
              errorClass: "t-popup",
              layer: p.find(".popup-holder"),
              superposition: true,
              onError: function(el) {
                el.addClass("t-form_error").one("focus", function() {
                  el.trigger("unerror");
                });
              },
              onUnerror: function(el) {
                el.removeClass("t-form_error");
              }
            });
          });
          p.find(".e-errortip").trigger("error");
        }
      });

      var height = $(window).height();
      $(".e-popup_art").popup({
        layer: "#layer",
        type: "ajax",
        width: 770,
        popupClass: "t-3",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        },
        onLoad: function(e, p) {
          p.find(".e-slider_popup").nslider({
            navClass: "hidden",
            animation: 3,
            speed: 400,
            loop: true,
            onLoad: function(slider, slider_ar, prev, next) {
              slider_ar.bind("click", function() {
                next.trigger("click");
              });
            }
          });

          var block = e.parents("div.data-block[data-status='new']");
          if (block.length) {
            var block_trigger = block.find(".trigger_refresh");
            if (block_trigger.length) block_trigger.click();
          }

          var img = p.find("img"),
            wrap = p.find(".popup-wrapper"),
            wrap_h;

          if (img.length) {
            wrap.css("opacity", 0);

            img.css("display", "none");
            wrap_h = wrap.outerHeight(true);
            img.css("display", "");

            var h = height - wrap_h;
            h = h < 600 ? 600 : h;

            img.css("max-height", h);

            var w = img.width();
            w = w < 600 ? 600 : w;

            wrap.css("max-width", w);

            wrap.css("opacity", "");
          }
        }
      });

      $(".e-popup_image").popup({
        layer: "#layer",
        type: "image",
        popupClass: "t-4",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        },
        onLoad: function(e, p) {
          var block = e.parents("div.data-block[data-status='new']");
          if (block.length) {
            var block_trigger = block.find(".trigger_refresh");
            if (block_trigger.length) block_trigger.click();
          }
        }
      });

      $(".e-popup_news").popup({
        layer: "#layer",
        type: "ajax",
        width: 770,
        popupClass: "t-3",
        onOpen: function() {
          $(document.body).addClass("f-popup");
        },
        onClose: function() {
          $(document.body).removeClass("f-popup");
        },
        onLoad: function(e, p) {
          toggleBubble(p.find(".e-togglebubble"));

          p.find(".e-slider_popup > div").each(function() {
            $(this).attr(
              "data-nslider-preview",
              $(this).find("img").attr("src")
            );
          });
          p.find(".e-slider_popup").nslider({
            navClass: "hidden",
            pointClass: "t-outer",
            animation: 3,
            speed: 400,
            loop: true,
            onLoad: function(slider, slider_ar, prev, next, points, points_ar) {
              slider_ar.bind("click", function() {
                if ($(this).is(":nth-child(3n)") || $(this).is(":last-child")) {
                  $(".nslider.t-inner .nslider-nav-next").trigger("click");
                }
                next.trigger("click");
              });

              var n = 3,
                c = "f-column",
                wrapper = '<div class="' + c + '"></div>';
              for (var i = 0, l = points_ar.length; i < l; i += n) {
                points_ar.slice(i, i + n).wrapAll(wrapper);
              }
              points.children().each(function(i) {
                slider_ar
                  .slice(i * 3, i + 3)
                  .css("min-height", $(this).height());
              });
              points.nslider({
                sliderClass: "t-inner",
                navClass: "hidden",
                pointClass: "t-inner",
                animation: 1,
                loop: true,
                speed: 400
              });
            }
          });
        }
      });

      $(".e-popup_video").popup({
        overlay: "#overlay",
        layer: "#layer",
        type: "iframe",
        popupClass: "t-5",
        width: 870,
        height: 530,
        grouped: false
      });
      $(".e-popup_image_star").popup({
        overlay: "#overlay-1",
        layer: "#layer",
        popupClass: "t-5 star",
        type: "image",
        width: 800
      });
    }

    if (jQuery().oldslider) {
      $(".e-nslider_d-2").oldslider({
        nav: "hidden",
        scroll: "hidden",
        title: "hidden",
        animation: 2
      });
      $(".e-nslider_n-1").oldslider({
        point: "hidden",
        scroll: "hidden",
        title: "hidden",
        holderNav: $(".e-nslider_n-1"),
        // holder: 'cl-item clearfix',
        // count: 2,
        animation: 3
      });

      var mar = $(".e-nslider_n-1");
      if (mar.length) {
        mar
          .find(".cl-item")
          .prepend('<div class="cl-item-th"></div>')
          .prepend('<div class="cl-item-sc"></div>')
          .prepend('<div class="cl-item-ft"></div>');

        mar.find(".button.t-2h").on("click", function() {
          $(this).siblings(".e-popup_image_old").trigger("click");
        });

        if (!$(mar).find(".nslider-nav").length) {
          $("<div>").appendTo($(".e-nslider_n-1")).addClass("nslider-nav ");
        }
      }

      $(".e-nslider_n-2").oldslider({
        point: "hidden",
        scroll: "hidden",
        title: "hidden",
        animation: 2,
        loop: true,
        onLoad: function(sl, x) {
          var slideHeight = 0;
          $(x).each(function(i, el) {
            slideHeight =
              slideHeight < $(el).innerHeight()
                ? $(el).innerHeight()
                : slideHeight;
          });
          $(sl).find(".cb-item").css({ height: slideHeight });
        }
      });
      $(".e-nslider_n-3").oldslider({
        point: "hidden",
        scroll: "hidden",
        title: "hidden",
        animation: 2
      });
      $(".e-slider-static-art").oldslider({
        nav: "hidden",
        scroll: "hidden",
        title: "hidden",
        autoheight: "false",
        animation: 2,
        onLoad: function(hold, item, nav, point) {
          point.children().addClass("nslider-point-item");
        }
      });
      $(".e-nslider_g-s").oldslider({
        scroll: "hidden",
        animation: 2,
        holderNav: $("#nav-ns1"),
        holderPoint: $("#nav-ns1")
      });
    }

    if (jQuery().popup2) {
      function setPopup(el) {
        el.find(".e-popup_iframe_old").popup2({
          overlay: "#overlay-1",
          layer: "#layer",
          type: "iframe",
          width: 600,
          height: 430
        });
        el.find(".e-popup_html_old").popup2({
          overlay: "#overlay-1",
          layer: "#layer",
          type: "html",
          width: 760
        });
        el.find(".e-popup_image_old").popup2({
          overlay: "#overlay-1",
          layer: "#layer",
          popupClass: "t-old",
          type: "image",
          width: "auto"
        });

        el.find(".e-popup_ajax_old").popup2({
          overlay: "#overlay-1",
          layer: "#layer",
          type: "ajax",
          width: 760,
          request: {
            //ajax prop
            //type: 'GET',
            //data: {},
            //dataType: 'html'
          }
        });
        el.find(".e-popup_ajax_pp").popup2({
          overlay: "#overlay-1",
          layer: "#layer",
          type: "ajax",
          width: 760,
          request: {},
          onLoad: function(el, pp) {
            setPopup(pp);
            var ar1 = $(".e-hover");
            if (ar1.length) {
              hoverImage(ar1);
            }
            pp.find(".e-nslider_d-2").nslider({
              nav: "hidden",
              scroll: "hidden",
              title: "hidden",
              animation: 1
            });
          }
        });
      }
      function destroyPopup(el) {
        el
          .find(
            ".e-popup_iframe, .e-popup_html, .e-popup_ajax, .e-popup_ajax_pp"
          )
          .popup("destroy");
      }

      setPopup($(document));
    }

    var xar1 = $(".e-click");
    if (xar1.length) {
      xar1.css("cursor", "pointer");
      $(document).on("click", ".e-click", function() {
        $(this).find("a").get(0).click();
      });
    }

    var xar4 = $("#button-1");
    if (xar4.length) {
      xar4.bind("click", function() {
        var el = $(this.getAttribute("href"));
        el.append(
          '<div class="cl-item clearfix"><div class="cl-item-image"><span class="cli-h"><img src="img/img9.jpg" alt="" /></span></div><div class="cl-item-title"><a class="e-popup_ajax_pp" href="_ajax2.html">Необычный учебный день в солнечную погоду</a></div><div class="cl-item-text">Вчера, 20 мая 2014 года, на базе пожарной части № 19 второго отряда федеральной противопожарной службы по Ярославской области прошла экскурсия для учащихся одной из школ города Рыбинск.</div></div>'
        );
        if (jQuery().popup2) {
          destroyPopup($(document));
          setPopup($(document));
        }
        return false;
      });
    }

    if (jQuery().datepicker) {
      $.datepicker.setDefaults({
        firstDay: 1,
        dateFormat: "dd.mm.yy"
      });

      if (!document.site || document.site.version != "en") {
        $.datepicker.setDefaults({
          dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          dayNames: [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота"
          ],
          monthNamesMin: [
            "Янв",
            "Фев",
            "Март",
            "Апр",
            "Май",
            "Июнь",
            "Июль",
            "Авг",
            "Сен",
            "Окт",
            "Нояб",
            "Дек"
          ],
          monthNames: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
          ]
        });
      }

      $(".e-datepicker").datepicker();

      $(".e-datepicker_comp").each(function() {
        var el = $(this),
          h_link = el.find(".e-datepicker_comp-link"),
          h_date = el.find(".e-datepicker_comp-date"),
          h_month = el.find(".e-datepicker_comp-month"),
          h_year = el.find(".e-datepicker_comp-year"),
          input = $(
            '<input type="text" style="position: absolute; width: 0; height: 55px; margin: 0; padding: 0; border: 0; visibility: hidden;" />'
          );

        el.prepend(input);

        input.datepicker({
          onClose: function(date) {
            var temt = date.split(".");
            if (date) {
              h_date.val(temt[0]);
              h_month.val(temt[1]);
              h_year.val(temt[2]);
            }
          }
        });
        h_link.bind("click", function() {
          var temt = "",
            temp_date_v = h_date.val(),
            temp_date = parseInt(temp_date_v),
            temp_month_v = h_month.val(),
            temp_month = parseInt(temp_month_v),
            temp_year_v = h_year.val();
          temp_year = parseInt(temp_year_v);
          if (temp_date_v && isNaN(temp_date)) {
            temp_date = 1;
            h_date.val(1);
          }
          if (temp_month_v && isNaN(temp_month)) {
            temp_month = 1;
            h_month.val(1);
          }
          if (temp_year_v && isNaN(temp_year)) {
            temp_year = 2000;
            h_year.val(2000);
          }
          temt = temp_date + "." + temp_month + "." + temp_year;
          input.datepicker("setDate", temt);
          input.datepicker("show");
          return false;
        });
      });
    }

    if (jQuery().mediaelementplayer) {
      $("video").mediaelementplayer({
        startVolume: 1,
        features: [
          "playpause",
          "current",
          "duration",
          "progress",
          "volume",
          "fullscreen"
        ],
        alwaysShowControls: false,
        iPadUseNativeControls: true,
        iPhoneUseNativeControls: true,
        AndroidUseNativeControls: true,
        enableKeyboard: false,
        videoVolume: "horizontal",
        plugins: ["flash", "silverlight"],
        pluginPath: "/media/js/mediaelement/"
      });
      $("audio").mediaelementplayer({
        audioWidth: "100%",
        startVolume: 1,
        features: ["playpause", "current", "duration", "progress", "volume"],
        alwaysShowControls: false,
        iPadUseNativeControls: true,
        iPhoneUseNativeControls: true,
        AndroidUseNativeControls: true,
        enableKeyboard: false,
        audioVolume: "horizontal",
        plugins: ["flash", "silverlight"],
        pluginPath: "/media/js/mediaelement/"
      });
    }

    var ar1 = $(".e-togglelogin");
    if (ar1.length) {
      ar1.each(function() {
        var el = $(this),
          ar_but = el.find(".e-togglelogin-button"),
          cur;
        ar_but.each(function(i) {
          var but = $(this),
            holder = $(this.getAttribute("data-togglelogin")),
            trigger = false;

          but.toggleloginId = i;

          but.bind("click", function() {
            if (cur && cur.toggleloginId != i) {
              cur.trigger("hide");
            }
            if (!trigger) {
              cur = but;
              but.trigger("show");
              return false;
            }
          });
          but.bind("show", function() {
            trigger = true;
            but.addClass("f-active");
            holder.addClass("f-active");
          });
          but.bind("hide", function() {
            trigger = false;
            but.removeClass("f-active");
            holder.removeClass("f-active");

            var error_blocks = holder.find(".b-login_block-error");
            if (error_blocks.length) {
              error_blocks.html("");
              error_blocks.addClass("hidden");
            }
          });
        });
      });
    }

    var ar3 = $(".e-toggledetach");
    if (ar3.length) {
      ar3.each(function() {
        var el = $(this),
          h = $(this.getAttribute("data-toggledetach")),
          p = h.prev(),
          trigger = el.is(":checked"),
          fn_set = function() {
            if (trigger) {
              p.after(h);
            } else {
              h.detach();
            }
          };

        el.bind("change", function() {
          trigger = el.is(":checked");
          fn_set();
        });

        fn_set();
      });
    }

    var ar4 = $(".e-togglechecked");
    if (ar4.length) {
      ar4.each(function() {
        var el = $(this),
          h = $(this.getAttribute("href")),
          top = h.offset().top;

        el.bind("click", function() {
          if (h.is(":checked")) {
            h.prop("checked", false).trigger("change");
            trigger = false;
          } else {
            $("html, body").scrollTop(top);
            h.prop("checked", true).trigger("change");
            trigger = true;
          }
          return false;
        });
      });
    }

    var ar5 = $(".e-autowrapper"),
      ar5_fn = function() {
        var el = $(this),
          ar = el.children(),
          n = parseInt(this.getAttribute("data-autowrapper")),
          c = this.getAttribute("data-autowrapper-class"),
          wrapper = '<div class="' + c + '"></div>';

        for (var i = 0, l = ar.length; i < l; i += n) {
          ar.slice(i, i + n).wrapAll(wrapper);
        }
      };
    if (ar5.length) {
      ar5.each(ar5_fn);
    }

    var ar6 = $(".e-toggletabs");
    if (ar6.length) {
      ar6.each(function() {
        var e = $(this),
          ar = this.hasAttribute("data-toggletabs-el")
            ? e.find(this.getAttribute("data-toggletabs-el"))
            : e.children(),
          last_el,
          last_h,
          cur = ar.filter(".f-active"),
          trigger = false;
        if (!cur.length) cur = ar.first().addClass("f-active");
        ar.each(function() {
          var el = $(this),
            h = $(
              this.getAttribute("data-toggletabs-holder") ||
                this.getAttribute("href")
            ),
            type = el[0].tagName,
            set = type == "INPUT" || type == "LABEL" ? false : true;
          h.hide();
          el.bind("click", function() {
            if (el.hasClass("f-active") && trigger && set) return false;
            else if (el.hasClass("f-active") && trigger) return;
            if (last_el) last_el.removeClass("f-active");
            if (last_h) last_h.hide();
            el.addClass("f-active");
            h.show();
            last_el = el;
            last_h = h;
            trigger = true;
            if (set) return false;
          });
        });
        cur.trigger("click");
      });
    }

    var ar7 = $(".e-validemptyform");
    ar7.each(function() {
      var el = $(this),
        input = el.find("input, textarea");

      el.bind("submit", function() {
        var trigger = false;
        input.each(function() {
          if (!$(this).val()) {
            $(this).addClass("t-form_error").one("focus", function() {
              $(this).removeClass("t-form_error");
            });
            trigger = true;
          }
        });
        if (trigger) return false;
      });
    });

    var ar8 = $(".e-togglebubble"),
      ar8_fn = function(els) {
        if (els.length) {
          var ar8_last,
            ar8_timer,
            ar8_reset = true,
            ar8_fn_close = function() {
              clearTimeout(ar8_timer);
              if (!ar8_reset) {
                ar8_reset = true;
                return;
              }
              ar8_timer = setTimeout(function() {
                if (ar8_last) ar8_last.trigger("bubble_close");
                $(document).unbind("click", ar8_fn_close);
              }, 100);
            };

          els.each(function() {
            var el = $(this.getAttribute("href")),
              but = $(this),
              trigger = false;
            but
              .bind("click", function() {
                if (ar8_last) ar8_last.trigger("bubble_close");
                if (!trigger) {
                  el.addClass("f-active");
                  ar8_last = but;
                  trigger = true;
                  $(document).bind("click", ar8_fn_close);
                }
                return false;
              })
              .bind("bubble_close", function() {
                clearTimeout(ar8_timer);
                el.removeClass("f-active");
                trigger = false;
                ar8_reset = true;
                $(document).unbind("click", ar8_fn_close);
              });
            el.bind("click", function() {
              ar8_reset = false;
            });
          });
        }
      };
    window.toggleBubble = ar8_fn;
    ar8_fn(ar8);

    if (jQuery().nslider) {
      $(".e-slider_p").nslider({
        navClass: "hidden",
        animation: 2,
        speed: 400
      });

      $(".e-slider_3p").nslider({
        navClass: "hidden",
        animation: 3,
        speed: 400,
        onLoad: function(s, ar, p, n, pn, pn_ar, h) {
          ar.css("height", h);
        }
      });

      var slider_g_title = $('<div class="nslider-title"></div>');
      $(".e-nslider_g").nslider({
        scroll: "hidden",
        animation: 2,
        onLoad: function(sl, x) {
          var slideHeight = 0;
          x.each(function(i, el) {
            slideHeight =
              slideHeight < $(el).innerHeight()
                ? $(el).innerHeight()
                : slideHeight;
          });
          sl.find(".cb-item").css({ height: slideHeight });
        },
        onSet: function(sl, x, cur, total) {
          sl.find(".nslider-control").append(slider_g_title);
          slider_g_title.html(x[cur].getAttribute("title"));
        }
      });

      var title = $('<div class="b-slider_title"></div>');
      $(".e-slider_inv").nslider({
        pointClass: "hidden",
        animation: 2,
        speed: 400,
        onLoad: function(s, ar, p, n, pn, pn_ar, h, ind) {
          ar.css("height", h);
          s.find(".nslider-control").prependTo(s).append(title);
        },
        onSet: function(s, ar, cur, total) {
          title.text(ar[cur].getAttribute("data-title"));
          $(ar[cur]).find(".e-inventoryitems").trigger("update_inventory");
        }
      });
    }
  });

  $(document).ready(function() {
    if ($(".popup_hero") || $(".popup_news")) {
      toggleBubble($(".e-togglebubble"));

      $(".e-slider_popup > div").each(function() {
        $(this).attr("data-nslider-preview", $(this).find("img").attr("src"));
      });

      $(".e-slider_popup").nslider({
        navClass: "hidden",
        pointClass: "t-outer",
        animation: 3,
        speed: 400,
        loop: true,
        onLoad: function(slider, slider_ar, prev, next, points, points_ar) {
          var slider = $("div.nslider"),
            slider_ar = $("div.bs-item"),
            next = $(".nslider-nav-next"),
            prev = $(".nslider-nav-prev"),
            points = $(".nslider-point"),
            points_ar = $(".nslider-point-item");

          slider_ar.bind("click", function() {
            if ($(this).is(":nth-child(3n)") || $(this).is(":last-child")) {
              $(".nslider.t-inner .nslider-nav-next").trigger("click");
            }
            next.trigger("click");
          });

          var n = 3,
            c = "f-column",
            wrapper = '<div class="' + c + '"></div>';
          for (var i = 0, l = points_ar.length; i < l; i += n) {
            points_ar.slice(i, i + n).wrapAll(wrapper);
          }
          var max = 0;
          points.children().each(function() {
            max = $(this).height() > max ? $(this).height() : max;
          });
          slider_ar.css("min-height", max);
          points.nslider({
            sliderClass: "t-inner",
            navClass: "hidden",
            pointClass: "t-inner",
            animation: 1,
            speed: 400,
            loop: true
          });
        }
      });
    }
  });

  $(window).bind("load", function() {
    if (jQuery().errortip) {
      $(document).on("error", ".e-errortip", function() {
        $(this).errortip({
          errorClass: "t-popup",
          layer: $(this).parent(),
          superposition: true,
          onError: function(el) {
            el.addClass("t-form_error").one("focus", function() {
              el.trigger("unerror");
            });
          },
          onUnerror: function(el) {
            el.removeClass("t-form_error");
          }
        });
      });
      $(".e-errortip").trigger("error");
    }

    var ar2 = $(".e-ankerconvoy");
    if (ar2.length) {
      ar2.each(function() {
        var el = $(this),
          ar = el.find(".e-ankerconvoy-item"),
          total = ar.length,
          cur = -1,
          points = [],
          line_top = 0,
          line_bottom = 0,
          line_first = 0,
          line_last = 0,
          fn_set = function(top) {
            if (top < line_first) return true;
            if (top < line_top) {
              line_top = points[cur - 1];
              line_bottom = points[cur];
              $(ar[cur]).removeClass("f-active");
              cur--;
              $(ar[cur]).addClass("f-active");
              fn_set(top);
            } else if (top > line_bottom) {
              if (cur == total - 1) return true;
              $(ar[cur]).removeClass("f-active");
              cur++;
              $(ar[cur]).addClass("f-active");
              line_top = points[cur];
              line_bottom = points[cur + 1];
              fn_set(top);
            }
          };

        if (total < 2) return;

        ar.each(function() {
          var h = $($(this).find("a").attr("href"));
          points.push(h.offset().top);
        });
        line_bottom = points[0];
        line_first = points[0];
        line_last = points[total - 1];

        $(document).bind("scroll", function() {
          var top = $(document).scrollTop() + 100;
          fn_set(top);
        });
      });
    }

    var ar9 = $(".e-stickyblock");
    if (ar9.length) {
      ar9.each(function() {
        var el = $(this),
          h,
          l = el.height(),
          top = el.offset().top - 90,
          bottom = $(".l-footer").offset().top - l - 90,
          offset = bottom - top,
          pos = 0;

        if (l > bottom) return;

        el.wrap(
          '<div class="b-fixed_container"><div class="b-fixed_container-holder"></div></div>'
        );
        h = el.parent().parent();

        setTimeout(function() {
          $(document).trigger("scroll");
        }, 100);

        $(document).bind("scroll", function() {
          var cur = $(this).scrollTop();
          if (cur < top) {
            if (pos == 1) return;
            pos = 1;
            h.removeClass("f-fixed f-absolut").css("top", "");
          } else if (cur > bottom) {
            if (pos == 3) return;
            pos = 3;
            h.removeClass("f-fixed").addClass("f-absolut").css("top", offset);
          } else {
            if (pos == 2) return;
            pos = 2;
            h.removeClass("f-absolut").addClass("f-fixed").css("top", "");
          }
        });
      });
    }

    var ar10 = $(".label-in");
    if (ar10.length) {
      function setLabel(nod, action) {
        nod.each(function() {
          var value = $(this).val();
          if (!value) {
            $(this).prev("label").css("display", action);
          }
        });
      }

      setLabel($(".label-in"), "inline");
      $(".label-in")
        .next("input")
        .focus(function() {
          $(this).prev("label").css("display", "none");
        })
        .blur(function() {
          setLabel($(this), "inline");
        });
    }

    var ar11 = $(".b-theme-sidesort");
    if (ar11.length) {
      ar11.find(".c-block").each(function(i, el) {
        if (i % 2 == 0) {
          $(el).appendTo($(".b-theme-sidesort .cell").eq(0));
        } else {
          $(el).appendTo($(".b-theme-sidesort .cell").eq(1));
        }
      });
    }
  });
})();

/* animated achievements add */
function showAchievement(classname, count, el_from, el_to) {
  var h = $(
      '<div class="b-achieve_ball"><div class="b-achieve_item t-small ' +
        classname +
        '"><div class="b-achieve_item-holder"><span class="b-achieve_item-count">+' +
        count +
        "</span></div></div></div>"
    ),
    ia = $(
      '<div class="b-achieve_list-item"><div class="b-achieve_item t-small ' +
        classname +
        '"><div class="b-achieve_item-holder"><span class="b-achieve_item-count">+' +
        count +
        "</span></div></div></div>"
    ),
    ir = el_to.find("." + classname),
    add = ir.length ? false : true,
    body = $("body");

  if (add) {
    ia.addClass("f-hide");
    el_to.append(ia);
    el_to = ia;
  } else {
    el_to = ir;
  }

  var w = 80,
    x_from = el_from.offset().left + el_from.outerWidth() / 2 - w / 2,
    y_from = el_from.offset().top + el_from.outerHeight() / 2 - w / 2,
    x_to = el_to.offset().left,
    y_to = el_to.offset().top;

  body.append(h);
  h.css({ top: y_from, left: x_from }).addClass("f-animate");
  setTimeout(function() {
    h.css({ top: y_to, left: x_to });

    setTimeout(function() {
      h.remove();
      if (add) ia.removeClass("f-hide");
    }, 400);
  }, 400);
}
