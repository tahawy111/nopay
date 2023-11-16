var responsiveDesign = {
    isResponsive: false,
    isDesktop: false,
    isTablet: false,
    isPhone: false,
    windowWidth: 0,
    responsive: function () {
        'use strict';
        var html = jQuery("html");
        this.windowWidth = jQuery(window).width();
        var triggerEvent = false;

        var isRespVisible = jQuery("#kangndoresp").is(":visible");
        if (isRespVisible && !this.isResponsive) {
            html.addClass("responsive").removeClass("desktop");
            this.isResponsive = true;
            this.isDesktop = false;
            triggerEvent = true;
        } else if (!isRespVisible && !this.isDesktop) {
            html.addClass("desktop").removeClass("responsive responsive-tablet responsive-phone");
            this.isResponsive = this.isTablet = this.isPhone = false;
            this.isDesktop = true;
            triggerEvent = true;
        }

        if (this.isResponsive) {
            if (jQuery("#kangndoresp-t").is(":visible") && !this.isTablet) {
                html.addClass("responsive-tablet").removeClass("responsive-phone");
                this.isTablet = true;
                this.isPhone = false;
                triggerEvent = true;
            } else if (jQuery("#kangndoresp-m").is(":visible") && !this.isPhone) {
                html.addClass("responsive-phone").removeClass("responsive-tablet");
                this.isTablet = false;
                this.isPhone = true;
                triggerEvent = true;
            }
        }

        if (triggerEvent) {
            jQuery(window).trigger("responsive", this);
        }

        jQuery(window).trigger("responsiveResize", this);
    },
    initialize: function () {
        "use strict";
        jQuery("<div id=\"kangndoresp\"><div id=\"kangndoresp-m\"></div><div id=\"kangndoresp-t\"></div></div>").appendTo("body");
        jQuery(window).resize(function () {
            responsiveDesign.responsive();
        });
        jQuery(window).trigger("resize");
    }
};

function responsiveAbsBg(responsiveDesign, el, bg) {
    "use strict";
    if (bg.length === 0)
        return;

    var desktopBgTop = bg.attr("data-bg-top");
    var desktopBgHeight = bg.attr("data-bg-height");

    if (responsiveDesign.isResponsive) {
        if (typeof desktopBgTop === "undefined" || desktopBgTop === false) {
            bg.attr("data-bg-top", bg.css("top"));
            bg.attr("data-bg-height", bg.css("height"));
        }

        var elTop = el.offset().top;
        var elHeight = el.outerHeight();
        bg.css("top", elTop + "px");
        bg.css("height", elHeight + "px");
    } else if (typeof desktopBgTop !== "undefined" && desktopBgTop !== false) {
        bg.css("top", desktopBgTop);
        bg.css("height", desktopBgHeight);
        bg.removeAttr("data-bg-top");
        bg.removeAttr("data-bg-height");
    }
}

jQuery(window).bind("responsive", function (event, responsiveDesign) {
    'use strict';
    responsiveCollages(responsiveDesign);
    responsiveImages(responsiveDesign);
    responsiveVideos(responsiveDesign);
});

function responsiveImages(responsiveDesign) {
    'use strict';
    jQuery("img[width]").each(function () {
        var img = jQuery(this), newWidth = "", newMaxWidth = "", newHeight = "";
        if (responsiveDesign.isResponsive) {
            newWidth = "auto";
            newHeight = "auto";
            newMaxWidth = "100%";

            var widthAttr = img.attr("width");
            if (widthAttr !== null && typeof(widthAttr) === "string" && widthAttr.indexOf("%") === -1) {
                newWidth = "100%";
                newMaxWidth = parseInt(jQuery.trim(widthAttr), 10) + "px";
            } 
        }
        img.css("width", newWidth).css("max-width", newMaxWidth).css("height", newHeight);
    });
}

function responsiveCollages(responsiveDesign) {
    'use strict';
    if (jQuery.browser.msie && jQuery.browser.version <= 8) return;
    jQuery(".kangndocollage").each(function () {
        var collage = jQuery(this);
        var sliderObject = collage.find(".kangndoslider").data("slider");
        var responsiveImage = jQuery("img#" + collage.attr("id"));

        if (responsiveDesign.isResponsive) {
            if (responsiveImage.length) { return true; }
            if (jQuery.support.transition) {
                collage.find(".kangndoslider").trigger(jQuery.support.transition.event);
            }
            if (sliderObject) {
                sliderObject.stop();
            }
            var activeSlide = collage.find(".kangndoslide-item.active");
            if (!activeSlide.length) {
                var slides = collage.find(".kangndoslide-item");
                if (slides.length) {
                    activeSlide = jQuery(slides.get(0));
                }
            }
            activeSlide.css("background-image", "");
            var bg = activeSlide.css("background-image").replace(/url\(['"]?(.+?)['"]?\)/i, "$1");
            jQuery("<img>").attr({
                "src": bg,
                "id": collage.attr("id")
            }).insertBefore(collage);
        } else if (responsiveImage.length) {
            responsiveImage.remove();
            if (sliderObject) {
                if (sliderObject.settings.animation !== "fade") {
                    collage.find(".kangndoslide-item").css("background-image", "none");
                }
                sliderObject.start();
            }
        }
    });
}

function responsiveVideos(responsiveDesign) {
    "use strict";
    jQuery("iframe,object,embed").each(function () {
        var obj = jQuery(this);
        var container = obj.parent(".kangndoresponsive-embed");
        if (responsiveDesign.isResponsive) {
            if (container.length !== 0)
                return;
            container = jQuery("<div class=\"kangndoresponsive-embed\">").insertBefore(obj);
            obj.appendTo(container);
        } else if (container.length > 0) {
            obj.insertBefore(container);
            container.remove();
        }
    });
}

jQuery(window).bind("responsive", function (event, responsiveDesign) {
    "use strict";
    responsiveLayoutCell(responsiveDesign);
});

function responsiveLayoutCell(responsiveDesign) {
    "use strict";
    jQuery(".kangndocontent .kangndocontent-layout-row,.kangndofooter .kangndocontent-layout-row").each(function () {
        var row = jQuery(this);
        var rowChildren = row.children(".kangndolayout-cell");
        if (rowChildren.length > 1) {
            if (responsiveDesign.isTablet) {
                rowChildren.addClass("responsive-tablet-layout-cell").each(function (i) {
                    if ((i + 1) % 2 === 0) {
                        jQuery(this).after("<div class=\"cleared responsive-cleared\">");
                    }
                });
            } else {
                rowChildren.removeClass("responsive-tablet-layout-cell");
                row.children(".responsive-cleared").remove();
            }
        }
    });
}



jQuery(responsiveDesign.initialize);
