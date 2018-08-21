// var marker = editor.session.addMarker(new Range(0, 0, 0, 1), "ace_highlight-marker", "fullLine");

// var wordBuffer = '';
// $('#input').on('keypress', function(e) {
//     var char = String.fromCharCode(e.which);
//     if ((char != ' ') && (e.which != 13)) {
//         wordBuffer += char;
//     } else {
//         if (wordBuffer == '@sep') {
//             slideCount++;
//             $('.ace_active-line').last()attr('id', 'ace_slide' + slideCount);
//         }
//         wordBuffer = '';
//     }
//
// });

function resizeIframe(obj) {
   obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
 }

function resetHighlight() {
    lines = editor.getSession().doc.getAllLines();
    // console.log(lines);
    slideCount = 0;
    var isComment = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/\<\!--/)) {
            isComment = true;
        }
        if (lines[i].match(/--\>/)) {
            isComment = false;
        }
        if (lines[i].match(/@sep/) && !lines[i].match(/\<\!--.*?@sep.*?--\>/) && !isComment) {
                // console.log('SEP');
                slideCount++;
                slideLine[slideCount] = i + 1;
                // console.log('slideLine: ' + slideCount + ' ' + slideLine[slideCount]);
            }
    }
}

function postprocess() {

    $('.slide_number').hide();

    // if ($('base').attr('present') != 1) {
        $('.slide').each(function() {
            $(this).prepend("<div class='separator' style='position:relative; width:100%; height:1.5em; text-align:center;' wbtag='ignore' slide=" + $(this).attr('slide') + "><hr style='border-top:2px dotted pink'/><div style='position:absolute;top:-0.75em;left:0;width:100%;text-align:center'><a href='javascript:void' style='font-size:1em;background-color:white;color:pink'>&nbsp;slide " + $(this).attr('slide') + "&nbsp;</a></div></div>");
        });
    // }

    var colchar = "▽";
    var expchar = "►";

    $('.collapsea').click(function() {
        if ($(this).hasClass('collapsed')) {
            $(this).removeClass('collapsed')
        } else {
            $(this).addClass('collapsed');
        }
        this.text = $(this).hasClass('collapsed') ? expchar : colchar;
    });

    // $('.slide').find("table").addClass("table table-bordered table-hover");
    $('.slide').find("table").addClass("table table-bordered");

    editor.container.style.pointerEvents="auto";
    editor.container.style.opacity=1; // or use svg filter to make it gray
    editor.renderer.setStyle("disabled", false);
    editor.focus();
    resetHighlight();

    $('#menu_container .dropdown-item').on({
        "click":function(e){
    	e.stopPropagation();
        }
    });

    $(document).ready(function() {
        $('.dropdown-submenu button').on('click', function(e) {
    	$(this).next('div').toggle();
    	$(this).next('div').css('max-height', 0.9*$(window).height());
    	$(this).next('div').css('width', 0.75*$(window).width());
    	e.stopPropagation();
    	e.preventDefault();
    	//  MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('toc_div')])
      if ($(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).addClass('btn-outline-info');
          $(this).removeClass('btn-primary');
      }  else  {
          $(this).addClass('active');
          $(this).addClass('btn-primary');
          $(this).removeClass('btn-outline-info');
      }
        });
    });

    $('#index_slider').on('input', function () {
        var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
        $(this).css('background-image',
    		'-webkit-gradient(linear, left top, right top, '
    		+ 'color-stop(' + val + ', SteelBlue), '
    		+ 'color-stop(' + val + ', #efefef)'
    		+ ')'
    	       );
    });

    updateTitle(slideIndex);

    $('.slide').on('click', function (e) {
        $('[data-toggle="popover"]').each(function() {
            $(this).popover('hide');
        });
    });

    // $('body').on('click', function (e) {
    //     $('[data-toggle="popover"]').each(function () {
    //         //the 'is' for buttons that trigger popups
    //         //the 'has' for icons within a button that triggers a popup
    //         if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
    //             $(this).popover('hide');
    //         }
    //     });
    // });

    var statements = new Array();
    $("div[wbname='statement']").each(function() {
        if (!($(this).attr('type') in statements)) {
            statements[$(this).attr('type')] = '';
        }

        var item = $(this).attr('chapter') + '.' + $(this).attr('num');
        var slide = $('div[chapter=' + $(this).attr('chapter') + '][num=' + $(this).attr('num') + ']').closest('.slide').attr('slide');

        // statements[$(this).attr('type')] += "<button class='btn btn-sm btn-outline-success' style='margin:1px;' href='javacript:void(0)' onclick=\"focusOn(" + slide + ")\">" + $(this).attr('chapter') + '.' + $(this).attr('num') + "</button>";
        statements[$(this).attr('type')] += "<a style='margin:1px 10px 1px 10px;' class='info_statements_num' href='javascript:void(0)' onclick=\"focusOn(" + slide + ");highlight('" + item + "')\">" + $(this).attr('chapter') + '.' + $(this).attr('num') + "</a>";
        // html += '<br/><a>' + $(this).attr('type') + ' ' + $(this).attr('chapter') + '.' + $(this).attr('num') + '</a>';
    });

    var html = '';
    for (var key in statements) {
        html += '<br/><span class="info_statements">' + key + '</span><em> ' + statements[key] + '</em>';
    }
    $('#info_statements').html(html);

    $('img').each(function() {
        if(!$(this).hasClass('exempt')) {
            attr = $(this).attr('src');

            if (typeof attr !== typeof undefined && attr !== false) {
                $(this).attr('data-src', $(this).attr('src'));
                $(this).removeAttr('src');
                $(this).addClass('lazy');
            }

            $(this).closest('.image').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
            $(this).closest('.image').css('height', '300px');
            $(this).closest('.dual-left').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
            $(this).closest('.dual-left').css('height', '150px');
            $(this).closest('.dual-right').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
            $(this).closest('.dual-right').css('height', '150px');
            $(this).hide();

        }
    });


    $('.slide').on('click', function() {
        var course = $(this).attr('course');
        //var slide = $(this).closest('.slide').attr('slide');
        var chapterType = $(this).attr('week') != '' ? 'Week' : 'Lecture';
        var chapter = chapterType == 'Week' ? $(this).attr('week') : $(this).attr('lecture');
        slideIndex = $(this).attr('slide');
        var slide = slideIndex;

        if (xmlSrc != "") {
            url = rootURL + '?xml=' + xmlSrc + '&present&slide=' + slide ;
        } else {
            url = rootURL + '?wb=' + wbSrc + '&present&slide=' + slide ;
        }

        updateTitle(slide);

        $('.item_button').css('background-color', '');
        $('#slide_info').show();
        $('.separator').css('font-weight', 'normal');
        $('.separator').find('a').css('color', 'pink');
        $(this).find('.separator').css('font-weight', 'bold');
        $(this).find('.separator').find('a').css('color', 'red');
        var line = slideLine[$(this).attr('slide')];
        editor.gotoLine(line);
        $('.current_slide').html('Slide ' + $(this).attr('slide'));
        $('#slide_keywords').html(keywords(this));
        $('[data-toggle="popover"]').popover();

        if ($('#s' + slideIndex).hasClass('collapsed')) {
            $('#uncollapse_button').text('Uncollapse');
        } else {
            $('#uncollapse_button').text('Collapse');
        }

        $('.url.share_text').html(url);

        $('.hyperlink.share_text').html('<a href="' + url + '" target="_blank" title="Course:' + course + '">' + 'Chapter ' + chapter + ' Slide ' + slide + '</a>');

        $('.hyperref.share_text').html('\\href{"' + url.replace('#', '\\#') + '"}{Chapter ' + chapter + ' Slide ' + slide + '}');
        $(this).find('img').each(function() {
            imagePostprocess(this);
        });
    });

    $('.slide_button').on('click', function() {
        console.log('SLIDE BUTTON PRESSED');
        var course = $(this).attr('course');
        var slide = $(this).closest('.slide').attr('slide');
        var chapterType = $(this).attr('week') != '' ? 'Week' : 'Lecture';
        var chapter = chapterType == 'Week' ? $(this).attr('week') : $(this).attr('lecture');

        if (xmlSrc != "") {
            url = rootURL + '?xml=' + xmlSrc + '&present&slide=' + slide ;
        } else {
            url = rootURL + '?wb=' + wbSrc + '&present&slide=' + slide ;
        }

        // if ($(this).closest('.slide').attr('keywords')) {
        //     var keywords = $(this).closest('.slide').attr('keywords').split(' ');
        //     keywords = keywords.filter(function(item, pos){
        //         return keywords.indexOf(item) == pos;
        //     });
        //     keywords.map(function(keyword) {
        //         if (keyword != '') {
        //             html += '<button button class="btn btn-outline-info btn-sm" style="margin-left:5px;margin-top:5px">' + keyword.replace(/__/g, ' ') + '</button>';
        //         }
        //     });
        // }

        $('#item_modal').find('#modal_keywords').html('');
        $('#item_modal').modal('toggle');
        $('#item_modal').find('#modal_title').html(course + ' - ' + chapterType + ' ' + chapter + ' - Slide ' + slide);

        // var url = rootURL + '?xml=' + xmlSrc + '&query=//slide[@slide=' + slide + ']';

        $('#item_modal').find('#item_modal_link').attr('href', url);

        $('#item_modal').find('#share_url').html(url);

        $('#item_modal').find('#share_hyperlink').html('<a href="' + url + '" target="_blank" title="Course:' + course + '">' + 'Chapter ' + chapter + ' Slide ' + slide + '</a>');

        $('#item_modal').find('#share_hyperref').html('\\href{"' + url.replace('#', '\\#') + '"}{Chapter ' + chapter + ' Slide ' + slide + '}');

        var html = '';

        $('#item_modal').find('#modal_keywords').html('<hr><b class=notkw>Keywords:</b>'+ keywords($(this).closest('.slide')[0]));

    });

    $('a.knowl').each(function() {
        $(this).attr('knowl', "");

        var chapter = $(this).attr('chapter');
        var num = $(this).attr('num');

        var knowl = $('base').attr('root') + "php/elephas_bare.php?wb=" + $('base').attr('wb-src') + "&query=//statement[@chapter='" + chapter + "'and@num='" + num + "']";

        $(this).attr('knowl', knowl);
        // var knowlID = 'knowl' + chapter + '-' + num;
        // $(this).after("<div id='" + knowlID  + "' style='display:none'></div>");

        // var statementID = 'statement'+ chapter + '-' + num;

        // if ($('#' + knowlID).find('div').length == 0) {
        //     $('#'+ statementID).clone().appendTo($('#' + knowlID));
        //     // $('#' + knowlID).find('div').first().removeAttr('id');
        //     $('#' + knowlID).find('div').first().addClass('clone');
        // }
        // $('#' + knowlID).find('.collapse').show();
        // $('#' + knowlID).find('.collapsea').hide();
        // $('#' + knowlID).find('blockquote').css('border', 'none');

        // $(this).addClass('id-ref');
        // $(this).attr('refid', knowlID);
        // $(this).attr('refid', statementID);

    });


    $('.item_button').on('click', function() {
        var course = $(this).attr('course');
        var item_type = $(this).attr('type');
        var chapter = $(this).attr('chapter');
        var item = $(this).attr('num');

        $('#item_modal').find('#modal_keywords').html('');
        $('#item_modal').modal('toggle');
        $('#item_modal').find('#modal_title').html(course + ' ' + item_type + ' ' + chapter + '.' + item);

        var slide = $(this).closest('.slide').attr('slide');

        if (xmlSrc != "") {
            var url = rootURL + '?xml=' + xmlSrc + '&present&slide=' + slide + '#item' + item;
        } else {
            var url = rootURL + '?wb=' + wbSrc + '&present&slide=' + slide + '#item' + item;
        }

        $('#item_modal').find('#item_modal_link').attr('href', url);

        $('#item_modal').find('#share_url').html(url);
        $('#item_modal').find('#share_hyperlink').html('<a href="' + url + '" target="_blank" title="Course:' + course + '">' + item_type + ' ' + chapter + '.' + item + '</a>');

        $('#item_modal').find('#share_hyperref').html('\\href{"' + url.replace('#', '\\#') + '"}{' + item_type + ' ' + chapter + '.' + item + '}');
    });


    if ($('base').attr('present') == 1) {
        $('#present_button').click();
    } else {
        // $('#output').scrollTo($('#s' + $('base').attr('slide')));
        focusOn(slideIndex);
    }

    $('.webwork').each(function() {
        var ww_id = $(this).attr('ww_id');
        var pgFile = $(this).attr('pg_file');
        var html= '<b class="webwork_label" style="display:none">WeBWork</b><div id="' + $(this).attr('ww_id') + '"><div id="ww_inner_' + ww_id + '" class="ww" style="overflow:auto"><img class="loading_icon exempt" src="icons/Loading_icon.gif"></div></div>';

        $(this).append(html);
        // onmouseover="this.innerHTML=\"' + $(this).attr('pg_file') +'\""

        console.log('PGFILE');
        console.log(pgFile);
        showWW(pgFile, ww_id);

        $('#ww_inner_' + ww_id).click(function() {
            $('#ww_modal').modal('toggle');
            showModalWW(ww_id);
        });
    });

    $('title').html(course + ' ' + chapterType + ' ' + chapter)

    $('iframe').on('load', function(){
        resizeIframe(this);
        $(this).contents().find('html').css('font-family', 'menlo,sans-serif');
    });

    MathJax.Hub.Queue(
        ["resetEquationNumbers", MathJax.InputJax.TeX],
        // ["PreProcess", MathJax.Hub, document.getElementById('output')],
        ["Reprocess", MathJax.Hub, document.getElementById('output')],
        ["Typeset", MathJax.Hub, document.getElementById('output')]
    );

}

// Code borrowed from https://stackoverflow.com/questions/30906807/word-frequency-in-javascript
function wordFreq(string) {
    var words = string.replace(/[.]/g, '').split(/\s/);
    var freqMap = {};
    words.forEach(function(w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    return freqMap;
}

function wordPool(chapter) {
    var fows = '';
    // console.log(chapter + $('.wordpool.chapter' + chapter).html());
    if (chapter != "") {
        var freq = wordFreq($('.wordpool.chapter' + chapter).html());
    } else {
        var html = "";
        $('.wordpool').each(function() {
            html += $(this).html();
        });
        var freq = wordFreq(html);
    }

    var values = Object.keys( freq ).map(function ( key ) { return freq[key]; });
    var max = Math.max.apply( null, values );

    Object.keys(freq).forEach(function(word) {
        console.log('wordPool: ' + word);
	if (freq[word] >= Math.max(3, 0.1*max)) {
	    var n = freq[word];
	    fows += "<span style='padding-left:1em;color:hsla(0,0%,0%," + Math.max(Math.min(1, 3*Math.round(10*n/max)/10), 0.2) + ");font-size:" + Math.max(Math.min(Math.round(20*(n/max))/10, 1.2), 0.8) + "em'><i>" + word.replace(/[^a-zA-Z0-9]$/, '') + "</i></span> ";
	}
    });
    console.log('FOWS: ' + fows);
    return fows;
}


$('.fows').each(function() {
    console.log('chapter' + $(this).attr('chapter'));
    $(this).append(wordPool($(this).attr('chapter')));
});

$(document).ready(function() {
    if (!showall) {
        $('img').each(function() {
            if(!$(this).hasClass('exempt')) {
                attr = $(this).attr('src');

                if (typeof attr !== typeof undefined && attr !== false) {
                    $(this).attr('data-src', $(this).attr('src'));
                    $(this).removeAttr('src');
                    $(this).addClass('lazy');
                }

                $(this).closest('.image').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
                $(this).closest('.image').css('height', '300px');
                $(this).closest('.dual-left').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
                $(this).closest('.dual-left').css('height', '150px');
                $(this).closest('.dual-right').css('background', 'url(icons/Loading_icon.gif) center center no-repeat');
                $(this).closest('.dual-right').css('height', '150px');
                $(this).hide();

            }
        });
    }

    //         var image_width = $(this).closest('.image').css('width');
    //
    //
    //         $(this).show();
    //
    //         if (!$(this).hasClass('exempt')) {
    //
    //             $(this).closest('.image').css('background', '');
    //             $(this).closest('.image').css('height', '');
    //             $(this).closest('.dual-left').css('background', '');
    //             $(this).closest('.dual-left').css('height', '');
    //             $(this).closest('.dual-right').css('background', '');
    //             $(this).closest('.dual-right').css('height', '');
    //
    //
    //             var override = !((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px') || (image_width == '600px'));
    //
    //             if(/svg/.test($(this).attr('src'))) {
    //                 if (($(this).closest('.dual-left').length > 0) || ($(this).closest('.dual-right').length > 0)) {
    //                     var width = 300;
    //                     var height = 300;
    //                     $(this).attr('width', width);
    //                 } else if (!override) {
    //                     var width = 450;
    //                     var height = 450;
    //                     $(this).closest('.image').css('width', '450');
    //                     $(this).attr('width', width);
    //                 } else {
    //                     $(this).css('width', '100%');
    //                 }
    //             } else if (!override) {
    //                 $(this).removeAttr('style');
    //                 $(this).removeAttr('width');
    //                 $(this).removeAttr('height');
    //                 var width = $(this).get(0).naturalWidth;
    //                 var height = $(this).get(0).naturalHeight;
    //
    //                 if (width > height) {
    //                     if (width > 600) {
    //                         $(this).css('width', '100%');
    //                         $(this).css('height', 'auto');
    //                     } else {
    //                         $(this).css('max-width', '100%');
    //                         $(this).css('height', 'auto');
    //                     }
    //                 } else {
    //                     if (height > 560) {
    //                         if (($(this).closest('.dual-left').length > 0) || ($(this).closest('.dual-right').length > 0)) {
    //                             $(this).css('width', '100%');
    //                             $(this).css('height', 'auto');
    //                         } else {
    //                             if((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px') || (image_width == '600px')){
    //                                 $(this).css('height', '560px');
    //                                 $(this).css('width', 'auto');
    //                             } else {
    //                                 $(this).css('height', 'auto');
    //                                 $(this).css('max-width', '100%');
    //                             }
    //                         }
    //                     } else {
    //                         if((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px')) {
    //                             $(this).css('max-width', '100%');
    //                             $(this).css('height', 'auto');
    //                         } else {
    //                             $(this).css('max-width', '100%');
    //                             $(this).css('height', 'auto');
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 $(this).css('width', '100%');
    //             }
    //         }
    //     });
    //     $('iframe').each(function() {
    //         if(!$(this).hasClass('exempt')) {
    //             attr = $(this).attr('src');
    //             if (typeof attr !== typeof undefined && attr !== false) {
    //                 $(this).attr('data-src', $(this).attr('src'));
    //                 $(this).removeAttr('src');
    //             }
    //         }
    //     });
    // }

});
