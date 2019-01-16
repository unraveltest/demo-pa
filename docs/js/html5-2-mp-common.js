$(document).ready(function () {
    //Get code snippets dynamically, called also in LoadContent for ajax:
    getEmbedCode();

    /*Accordion glyphs:*/
    $(document.body).on('click', '.panel-heading', function (event) {
        $(this).toggleClass('active');
    });
    
    $(document.body).on('click', '.feedback-panel .btn', function (e) {
        e.preventDefault();
        
        var button = $(this);
        var id = this.id;
        var isactive = button.hasClass('active');
        
        $('.feedback-panel .btn').removeClass('active');
        
        if (isactive) {
            button.removeClass('active');
        } else {
            button.addClass('active');
        }
        
        //Show feedback link if 'no' is active
        if ($('#feedback-no-btn, #feedback-yes-btn.toggle-yes').hasClass('active')) {
            $('#email-feedback.toggle-feedback').slideDown('slow');
        } else {
            $('#email-feedback.toggle-feedback').slideUp('slow');
        }
    });  
    
    $(document.body).on('keypress', 'form .search-field', function (e) {
        if(e.which === 13){
            /*Note: trigger click doesn't work, need to use this*/
            $('.selected-searchresultitem a')[0].click();
            $('form .search-field').blur();
        }
        return e.which !== 13;
    });
});

function setActiveTocline() {
    // set the active link in the toc on first load. No hash or querystring included
    var path = decodeURI(window.location.href.split('#')[0]);
    
    path = path.replace(/\?.*$/, '');
    
    //Clean slate
    $("aside ul.toc a").parent().removeClass("active").removeClass("opened");
    
    var links = $('aside ul.toc a');
    
    for (var i = 0; i < links.length; i++) {
        var thisLink = links[i];
        // element
        
        var $thisLink = $(links[i]);
        // jquery object
        
        var href = decodeURI(thisLink.href);
        
        //Bug in Chrome on Windows makes regex test fail, so checking for equality
        if (href === path) {
            $thisLink.parent().addClass("active");
            $thisLink.parents("li").addClass("opened");
            return false;
        }
    }
}

function buildSectionToc() {
    
    if ($(".section-toc").length) {
        
        //Checks for the current actual chunk topic, even if an internal section in another chunk is clicked, to build section TOC then too
        var currentChunkId = $('#topic-content > section').attr('id');
        var regex = new RegExp(".*" + currentChunkId + "\.html$");
        if ($('#topic-content > section').is('[data-permalink]')) {
            currentChunkId = $('#topic-content > section').attr('data-permalink');
            var currentChunkIdDecoded = decodeURI(currentChunkId);
            regex = new RegExp(".*" + currentChunkIdDecoded + "$");
        }
        var toc = $('aside ul.toc');
        
        var currentChunkListitem = toc.find('li.opened>a').filter(function () {
            var hrefdecoded = decodeURI(this.href);
            return hrefdecoded.match(regex);
        }).parent();
        
        var links = currentChunkListitem.find(">ul");
        var linklistitems = currentChunkListitem.find("li");
        
        //First check there are actual listitems in the list, otherwise remove the section toc
        if (linklistitems.length == 0) {
            $(".section-toc").remove();
        } else {
            var sectionTocLinks = links.clone();
            //Only show first level children, section TOCS could get very long otherwise
            sectionTocLinks.find('ul').remove();
            sectionTocLinks.find('.glyphicon').remove();
            sectionTocLinks.appendTo(".section-toc");
            //Make sure the section TOC is displayed even if the main TOC sub topics are collapsed
            $(".section-toc ul").css('display', 'block');
        }
    }
}

function chunkedPrevNext() {
    var toc = $('aside ul.toc');
    var links = toc.find('a').filter(function () {
        return this.href.match(/.*\.html?$/);
    });
    
    var nextlink = $('.pager .next a');
    var prevlink = $('.pager .previous a');
    
    var next = '';
    var prev = '';
    
    /*Looping the toc to create correct prev/next navigation corresponding to toc options.*/
    for (var index = 0; index < links.length; index++) {
        var minusone = links[index - 1];
        var plusone = links[index + 1];
        if (typeof minusone !== "undefined") {
            if (minusone.parentElement.classList.contains('active')) {
                var jqueryObj = $(links[index]);
                next = jqueryObj.attr('href');
                nextlink.attr('href', next);
            }
        }
        
        if (typeof plusone !== "undefined") {
            if (plusone.parentElement.classList.contains('active')) {
                var jqueryObj = $(links[index]);
                prev = jqueryObj.attr('href');
                prevlink.attr('href', prev);
            }
        }
    };
    
    
    if (next == '') {
        /*If there is no next in the TOC, it means the standard transform has created a next from an internal link, which we don't want.
        Not needed for prev, because it will always be the index for that situation (first topic). */
        nextlink.remove();
    }
}

function displayAccordionTarget(id) {
    if ($(id).length && $(id).hasClass('accordion') && $(id).is(':hidden')) {
        var parentbody = $(id).parent('.panel-body');
        var parentheading = $(id).parent('.panel-body').prev('.panel-heading');
        
        parentheading.addClass('active');
        parentbody.addClass('in');
    }
}

function getEmbedCode(){
    $("pre.embedcode").each(function () {
        var resource = $(this).data("resource");
        if(resource.match(/^https/)){
            var _this = $(this);
            $.ajax({
                type: "GET",
                url: resource,
                success: function (data, status) {
                    _this.text(data);
                    $('pre.embedcode').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }
            });
        }

    });
}