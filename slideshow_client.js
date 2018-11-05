document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchMove, false);

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.changedTouches[0].clientX;
    var yUp = evt.changedTouches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff )+$('#text').width()/1.25 ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            document.getElementById('right_button').click();
        } else {
            /* right swipe */
            document.getElementById('left_button').click();
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
        } else {
            /* down swipe */
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

var whichSteps = {};

function showStep(stepsId) {
    var stepsClass = document.getElementsByClassName(stepsId);

    if (whichSteps[stepsId] == null) {
        whichSteps[stepsId] = 0;
    }
    var whichStep = whichSteps[stepsId];
    // var step = stepsId + '.' + whichStep;
    console.log('STEP: ' + whichStep + ', class LENGTH: ' + stepsClass.length);
    if (whichStep < stepsClass.length/2) {
        stepsClass[whichStep].style.visibility = "visible";
        whichStep++;
    }

    if (!stepsClass[whichStep]) {
	document.getElementById("next"+stepsId).disabled = true;
    }
    document.getElementById("reset"+stepsId).disabled = false;
    whichSteps[stepsId] = whichStep;

    // if (whichSteps[stepsId] == null) {
    //     whichSteps[stepsId] = 0;
    // }
    // var whichStep = whichSteps[stepsId];
    // var step = 'steps' + stepsId + '.' + whichStep;
    // console.log('STEP: ' + step);
    // if (document.getElementById(step) != null) {
	// document.getElementById(step).style.visibility = "visible";
	// whichStep++;
    // }
    //
    // if (!document.getElementById(step)) {
	// document.getElementById("next"+stepsId).disabled = true;
    // }
    // document.getElementById("reset"+stepsId).disabled = false;
    // whichSteps[stepsId] = whichStep;
}

  //
  //  Enable the step button and disable the reset button.
  //  Hide the steps.
  //
function resetSteps(stepsId) {
    document.getElementById("next"+stepsId).disabled = false;
    document.getElementById("reset"+stepsId).disabled = true;
    var i = 0;
    var step;
    $('.' + stepsId).css('visibility', 'hidden');
    // while (step = document.getElementById('steps' + stepsId + '.' + i)) {
	// step.style.visibility = "hidden";
	// i++;
    // }
    whichSteps[stepsId] = 0;
}
function hide(pressed) {
    element = document.getElementById('cover_half');
    element.style.display="block";

    if(pressed) {
        $('#container').css('height', '50%');
        // $('.slide_container').css('position', 'absolute')
        // $('.slide_container').css('left', '0');
        // $('.slide_container').css('top', '0');
        // $('.slide_container').css('margin', '0 auto');
        // $('.slide_container').css('height', '50%');
        // $('.slide_container').css('overflow-y', 'auto');
    } else {
        $('.slide_container').css('position', '');
        unhide();
    }

}

function unhide() {
    element = document.getElementById('cover_half');
    element.style.display="none";
    document.getElementById('output').style.height="100%";
    document.getElementById('unhide').style.display="none";

    $('#container').css('position', '');
    $('#container').css('height', '');
    // $('.slide_container').removeAttr('style');
    // $('.slide_container').css('position', 'relative');
	// $('.slide_container').css('height', 'auto');
	// $('.slide_container').css('overflow-y', '');
}

function dim() {
    document.body.style.background = "#000";
    var i;
    var x = document.getElementsByClassName("page");
    x[0].style.background="#000";
    var x = document.getElementById("text");
    x.style.background="#000";
    x.style.color="#999";
}

function resizeFont(multiplier) {
  if (document.getElementById("output").style.fontSize == "") {
    document.getElementById("output").style.fontSize = "1.0em";
  }
  document.getElementById("output").style.fontSize = parseFloat(document.getElementById("output").style.fontSize) + 0.2*(multiplier) + "em";
}


function plusDivs(n) {

    if(editMode) {
        document.getElementById('edit_button').click();
    }

    slideIndex = parseInt(slideIndex) + parseInt(n);

    if (n > 0) {
    	    $("#output").animate({marginLeft:"-100%"}, 150, "linear", function() {$("#output").css({marginLeft: ''});showDivs(slideIndex);});
        } else {
            $("#output").animate({marginLeft:"100%"}, 150, "linear", function() {$("#output").css({marginLeft: ''});showDivs(slideIndex);});
	}

}

function showDivs(n) {

    $('.slide_mask').hide();

    var i;
    var x = document.getElementsByClassName("slide");


    if(x == null) {
        return 0;
    }


    slideIndex = (parseInt(n) + x.length) % x.length;
    slideIndex = slideIndex == 0 ? x.length : slideIndex;

    var nextSlide = (slideIndex + 1) % x.length;
    nextSlide = nextSlide == 0 ? x.length : nextSlide;
    var prevSlide = ((slideIndex - 1) + x.length) % x.length;
    prevSlide = prevSlide == 0 ? x.length : prevSlide;


    updateTitle(slideIndex);

	if ($('#s'+slideIndex).hasClass('all')) {
	    $('#s'+slideIndex+' .collapse').collapse('hide');
        $('#s'+slideIndex).addClass('collapsed');
        $('#s'+slideIndex).removeClass('all');
	}

    if ($('#s' + slideIndex).hasClass('collapsed')) {
        $('#uncollapse_button').text('Uncollapse');
    } else {
        $('#uncollapse_button').text('Collapse');
    }

    $('.slide').hide();
	// for (i = 0; i < x.length; i++) {
	//     x[i].style.display = "none";
	//     x[i].style['border'] = "";
	// }

	if($('#s' + slideIndex) != null) {
	    $('#s' + slideIndex).css('display', "table-cell");
	    $('#s' + slideIndex).css('vertical-align', "middle");


	    $("#s" + slideIndex).find('img').each(function() {
            imagePostprocess($(this));
        });

        $("#s" + nextSlide).find('img').each(function() {
            imagePostprocess($(this));
	    });
        $("#s" + prevSlide).find('img').each(function() {
            imagePostprocess($(this));
	    });

	    if(editMode) {
            removeTypeset();
        } else {
            console.log('SLIDEINDEX: ' + slideIndex);
            if (!($('#s' + slideIndex).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,$('#s' + slideIndex)[0]]);
                $('#s' + slideIndex).addClass('rendered');
            }

            if (!($('#s' + nextSlide).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[nextSlide]]);
                $('#s' + nextSlide).addClass('rendered');
            }

            if (!($('#s' + prevSlide).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[prevSlide]]);
                $('#s' + prevSlide).addClass('rendered');
            }
        }

    }

    $('.indicators').removeClass('active');
    $('#indicator' + slideIndex).addClass('active');


    var is = $('#index_slider');
    $('#index_slider').val(slideIndex);

    var val = (is.val() - is.attr('min')) / (is.attr('max') - is.attr('min'));
    is.css('background-image',
	   '-webkit-gradient(linear, left top, right top, '
	   + 'color-stop(' + val + ', SteelBlue), '
	   + 'color-stop(' + val + ', #ddd)'
		    + ')'
	  );

    $('#s'+slideIndex + ' iframe').each(function () {
	var attr = $(this).attr('src');
	if (typeof attr == typeof undefined || attr == false)
	    $(this).attr('src',$(this).attr('data-src'));
    });

    $('#s'+slideIndex).find('.show_ww').each(function () {
	if(!(($(this).hasClass('rendered')))) {
	    eval($(this).html());
	    $(this).addClass('rendered');
	}
    });

    $('#render_button').hide();

    //updateShowdown();
    //MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[slideIndex]]);

}

// function updateShowdown() {
//     var converter = new showdown.Converter({extensions: ['table']});
//     $('#s' + slideIndex).find('.markdown').each(function() {
//         var original = $(this).html();
//         var html = converter.makeHtml(original);
//         //$(this).html('');
//         //$(this).append('<div class="markdown_original">' + original + '</div>');
//         //$(this).append('<div class="markup">' + html + '</div>');
//         $(this).html(html);
//     });
// }

function showCurrentDiv(index) {

    if(showall) {
        if ($('#edit_box').prop('checked'))
        $('#edit_button').click();
        $('#save_button').hide();
    }

    slideIndex=index;

    //$('.slide_number').css('position', 'fixed');

    if(showall) {
        $('#s'+slideIndex+' .collapse').collapse('hide');

        $('#s'+slideIndex).addClass('collapsed');

        var anchors = document.getElementsByClassName("collapsea");
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].text = "\u25ba";
        }

        showall = false;

    }


    showDivs(slideIndex);

    document.getElementById('showall_button').className='btn btn-outline-info btn-sm menu_button';
    // var z =  document.getElementsByClassName("slide_number");
    // for (i = 0; i < z.length; i++) {
	//   z[i].style.display = "";
    //   }

    document.getElementById('left_button').style.display = 'block';
    document.getElementById('right_button').style.display = 'block';

    $('#showall_button').removeClass('active');
    $('.slide').removeClass('slide_hover');
    $('#index_bar').hide();

}

function showAll(hover) {

    showall = true;

    $('#save_button').show();

    if ($('#edit_box').prop('checked'))
	$('#edit_button').click();

    var i;

    var anchors = document.getElementsByClassName("collapsea");
    for (i = 0; i < anchors.length; i++) {
	anchors[i].text = "";
    }


    $('#page').css('position', 'absolute');
    $('#page').css('width', '100%');
    $('#page').css('top', '12.5%');
    $('#page').css('height', '75%');
    $('#text').css('height', '');
    $('#text').css('margin-top', '0');

    $('#text').css('white-space', 'nowrap');
    $('#text').css('padding', '0');
    $('#page').css('overflow-x', 'auto');
    $('#page').css('overflow-y', 'auto');

    $('.slide_mask').show();

   var x = document.getElementsByClassName("slide");
    for (i = 0; i < x.length; i++) {

	x[i].style.display = "";
	x[i].style['vertical-align'] = "top";
	x[i].style['width'] = "18cm";
	x[i].style['display'] = "inline-block";
	x[i].style['height'] = "100%";
	x[i].style['white-space'] = 'normal';
	x[i].style['border-right'] = '1px solid #cfcfcf';
	x[i].style['padding-left'] = '1em';
	x[i].style['padding-right'] = '1em';
    }

    $('slide').css('position','relative');
    $('.slide').show();

    $('.slide_number').css('position', 'relative');
    $('.slide_number').css('text-align', 'right');
    $('.slide_number').css('top', '0');
    $('.slide_number').css('right', '0');
    $('.comments_button').css('margin-top', '0');

    if (slideIndex > 0)
	document.getElementById('s' + slideIndex).focus();


    $('.collapse').collapse('show');

    document.getElementById('left_button').style.display = 'none';
    document.getElementById('right_button').style.display = 'none';


    if(!hover)
	$('.slide').prop('onclick',null).off('click');

    $('.slide').removeClass('collapsed');
    $('.slide').addClass('all');

}

function print() {

    if(mode == 'dual' || mode == 'compose') {
        $('#print_content').html($('#output').html());
    } else if(mode == 'present'){
        $('.title_box').first().clone().appendTo($('#print_content'));
        $('#print_content').find('.title_box').css('font-size', '0.5em');
        $('#print_content').find('.title_box').css('padding-bottom', '1em');
        $('#print_content').find('.title_box').find('h3').css('color', '#888');
        $('#print_content').append($('#s' + slideIndex).html());
    }

    $('#print').show();

    $('#container').hide();

    $('#print_content').removeClass('text');
    $('#print_content').addClass('output_dual');
    $('#print_content').find('.slide').css('display', 'block');
    $('#print_content').find('.slide').css('height', 'auto');
    $('#print_content').find('.slide').show();
    // $('#print_content').find('.slide_number').hide();

    $('#print_content').find('.statement').after('<hr/>');
    $('#print_content').find('.substatement').after('<hr/>');

    // $('#print_content').find('.separator').hide();
    $('#print_content').find('.separator').html(".&nbsp&nbsp&nbsp&nbsp.&nbsp&nbsp&nbsp&nbsp.&nbsp&nbsp&nbsp&nbsp.");
    $('#print_content').find('blockquote').each(function() {
        $(this).after($(this).html());
        $(this).remove();
    });
    $('#print_content').find('.collapsea').hide();
    $('#print_content').find('.collapse').show();
    $('#print_content').find('img').each(function() {
        imagePostprocess(this);
    });
    $('#print_content').find('.steps').css('visibility', 'visible');
    // MathJax.Hub.Queue(
    //     ["Typeset", MathJax.Hub, document.getElementById('print')]
    // );

}

// function print(hover) {
//   var i;
//
//   var anchors = document.getElementsByClassName("collapsea");
//     for (i = 0; i < anchors.length; i++) {
//      anchors[i].text = "";
//     }
//
//    var x = document.getElementsByClassName("slide");
//     for (i = 0; i < x.length; i++) {
// 	showDivs(i);
// 	x[i].className = hover ? "slide slide_hover" : "slide";
// 	x[i].style.display = "";
//     }
//
//     $('.slide').show();
//
//     var z =  document.getElementsByClassName("slide_number");
//     for (i = 0; i < z.length; i++) {
// 	z[i].style.display = "none";
//     }
//
//     var y = document.getElementsByClassName("collapse");
//     for (i = 0; i < y.length; i++) {
//      y[i].style.display = "block";
//   }
//
//     document.getElementById('left_button').style.display = 'none';
//     document.getElementById('right_button').style.display = 'none';
//
//     showall = true;
//
//     if(!hover)
// 	$('.slide').prop('onclick',null).off('click');
//
// }

function collapseToggle() {
    // $('.slide').each(function() {
    //     if ($(this).hasClass('collapsed')) {
    //         $(this).find('.collapsea').each(function () {
    //             if($(this).hasClass('collapsed')) {
    //                 $(this).click();
    //             }
    //         });
    //         $(this).removeClass('collapsed');
    //         $('#uncollapse_button').text('Collapse');
    //     } else {
    //         $(this).find('.collapsea').each(function () {
    //             if(!$(this).hasClass('collapsed'))
    //             $(this).click();
    //         });
    //         $(this).addClass('collapsed');
    //         $('#uncollapse_button').text('Uncollapse');
    //     }
    // });
    if ($('#s' + slideIndex).hasClass('collapsed')) {
	$('#s'+slideIndex+' .collapsea').each(function () {
	    if($(this).hasClass('collapsed')) {
		$(this).click();
	    }
	});
	$('#s' + slideIndex).removeClass('collapsed');
	$('#uncollapse_button').text('Collapse');
    } else {
	$('#s'+slideIndex+' .collapsea').each(function () {
	    if(!$(this).hasClass('collapsed'))
		$(this).click();
	});
	$('#s' + slideIndex).addClass('collapsed');
	$('#uncollapse_button').text('Uncollapse');
    }
}


function removeTypeset() {

    console.log('removeTypset called ' + slideIndex);
    var HTML = MathJax.HTML;

    if(!showall) {
        var jax = MathJax.Hub.getAllJax('output');
    } else {
        var jax = MathJax.Hub.getAllJax();
    }

    for (var i = 0, m = jax.length; i < m; i++) {
        var script = jax[i].SourceElement(), tex = jax[i].originalText;
        var display = 0;

        if (script.type.match(/display/)) {
            display = 1;
            if (!tex.match(/begin{equation}/))
            tex = "\\["+tex+"\\]";
        } else {tex = "$"+tex+"$"}

        jax[i].Remove();
        var preview = script.previousSibling;
        if (preview && preview.className === "MathJax_Preview") {
            preview.parentNode.removeChild(preview);
        }

        preview = HTML.Element("span",{className:"latexSource"},[tex]);
        if (display == 1) {
            preview.style.display = "block";
        }
        script.parentNode.insertBefore(preview,script);
        script.parentNode.removeChild(script);
    }

    // document.getElementById('source_button').disabled = false;

}

function showComments(checked) {
    document.getElementById('title').style.display = checked ?'none':'';

    var commentsClass = "comments";
    var pageId = "page";

    if (checked) {
	document.getElementById(pageId).style.width = '100%';

	$('#page').css('width', '100%');

	document.getElementById('text').style.width = '95%';
	var z =  document.getElementsByClassName('slide_container');
	for (i = z.length - 1; i > -1; i--) {
	    z[i].className = 'slide_container_comments';

	}
	var z =  document.getElementsByClassName(commentsClass);
	for (i = 0; i < z.length; i++) {
	    z[i].style.display = 'block';
	}
	z =  document.getElementsByClassName("comments_button");
	for (i = z.length - 1; i > -1; i--) {
	    z[i].className ='btn btn-primary btn-sm comments_button';
	}

    } else { /* !checked */
	document.getElementById(pageId).style.width = '';
	document.getElementById('text').style.width = '';
	var z =  document.getElementsByClassName(commentsClass);
	for (i = 0; i < z.length; i++) {
	    z[i].style.display = "none";
	}
	z =  document.getElementsByClassName("comments_button");
	for (i = z.length - 1; i > -1; i--) {
	    z[i].className ='btn btn-outline-info btn-sm comments_button';
	}
	var z =  document.getElementsByClassName('slide_container_comments');
	for (i = z.length - 1; i > -1; i--) {
	    z[i].className = 'slide_container';
	}
    }
    z =  document.getElementsByClassName("comments_box");
    for (i = 0; i < z.length; i++) {
	z[i].checked = checked;
    }
}

function showTypeset(show) {
    //var oldElems = document.getElementById('s'+slideIndex).getElementsByClassName("latexSource");
    var oldElems = document.getElementById('output').getElementsByClassName("latexSource");


    for(var i = oldElems.length - 1; i >= 0; i--) {
        var oldElem = oldElems.item(i);
        var parentElem = oldElem.parentNode;
        var innerElem;

        while (innerElem = oldElem.firstChild)
        {
            // insert all our children before ourselves.
            parentElem.insertBefore(innerElem, oldElem);
        }
        parentElem.removeChild(oldElem);
    }


    if (!show) {
        if (showall) {
            $('.slide').removeClass('rendered');
        }
        MathJax.Hub.Queue(
            ["PreProcess", MathJax.Hub, document.getElementById('output')],
            ["resetEquationNumbers", MathJax.InputJax.TeX],
            ["Reprocess", MathJax.Hub, document.getElementById('output')],
            ["Typeset", MathJax.Hub, document.getElementById('output')]
        );
        editor.container.style.pointerEvents="auto";
        editor.container.style.opacity=1; // or use svg filter to make it gray
        editor.renderer.setStyle("disabled", false);
        editor.focus();
    } else {
        removeTypeset();
        editor.container.style.pointerEvents="none";
        editor.container.style.opacity=0.5; // or use svg filter to make it gray
        editor.renderer.setStyle("disabled", true);
        editor.blur();
    }

    document.getElementById('output').contentEditable = show;
    document.getElementById('edit_button').className = show ? 'btn btn-danger btn-sm menu_button' : 'btn btn-outline-info btn-sm menu_button';
    // document.getElementById('source_button').style.display = show ? 'block':'none';editMode=!editMode;
    document.getElementById('wb_button').style.display = show ? 'block':'none';editMode=!editMode;

}

function getXMLNode() {
    var theContent = document.getElementById('output');

    var clone = theContent.cloneNode(true);

    var oldElems = clone.getElementsByClassName("latexSource");

    for(var i = oldElems.length - 1; i >= 0; i--) {
    var oldElem = oldElems.item(i);
    var parentElem = oldElem.parentNode;
    var innerElem;

    while (innerElem = oldElem.firstChild)
    {
        // insert all our children before ourselves.
        parentElem.insertBefore(innerElem, oldElem);
    }
    parentElem.removeChild(oldElem);
    }

    var editedContent = clone.innerHTML;
    console.log("SOURCE NODE: " + clone.innerHTML);

    var doc = new DOMParser().parseFromString(editedContent, 'text/html');
    var result = new XMLSerializer().serializeToString(doc);
    var doc = new DOMParser().parseFromString(result, "application/xml");
    var body = doc;
    console.log(new XMLSerializer().serializeToString(body));
    console.log('getXMLNode: ');
    console.log(body);
    return body;
}

function showXML() {

    $('#source_text').val('');
    $('#source_text').val($('#xml').html());

    $('#wb_modal').find('button.save').attr('ext', 'xml');
    $('#wb_modal').find('.modal-title').html('Elephas XML');

    // var xsltProcessor = new XSLTProcessor();

    // $.ajax({
    //     url: 'xsl/html2elephas.xsl',
    //     success: function(xsl) {
    //         xsltProcessor.importStylesheet(xsl);
    //         var oParser = new DOMParser();
    //         var fragment = oParser.parseFromString($('slides').html(), "text/html");
    //         console.log(fragment);
    //         fragmentStr = new XMLSerializer().serializeToString(fragment);
    //         $('#source_text').val('');
    //         var xml = fragmentStr.replace(/\n\n+/g, "\n");
    //         $('#source_text').val(xml);
    //     }
    // });

    // $.ajax({
    //     url: 'xsl/elephas2wb.xsl',
    //     success: function(xsl) {
    //         var oParser = new DOMParser();
    //         var fragment = oParser.parseFromString($('#xml').html(), "application/xml");
    //         xsltProcessor.importStylesheet(xsl);
    //         console.log(fragment);
    //         fragmentStr = new XMLSerializer().serializeToString(fragment);
    //         $('#source_text').val('');
    //         var xml = fragmentStr.replace(/\n\n+/g, "\n");
    //         $('#source_text').val(xml);
    //     }
    // });
}

function showLatex() {
    // if ((showall == 1) || (document.getElementById('s'+slideIndex) == null)) {
	// var theContent = document.getElementById('text');
    // } else
	// var theContent = document.getElementById('s'+slideIndex);

    // var body = getXMLNode();
    var xsltProcessor = new XSLTProcessor();

    $('#wb_modal').find('button.save').attr('ext', 'tex');
    $('#wb_modal').find('.modal-title').html('LaTeX');

    // $.ajax({
    //     url: '../html2elephas.xsl',
    //     success: function(xsl) {
    //         var xsltProcessor = new XSLTProcessor();
    //         xsltProcessor.importStylesheet(xsl);
    //         fragment = xsltProcessor.transformToFragment(body,document);
    //         console.log(fragment);
    //         fragmentStr = new XMLSerializer().serializeToString(fragment);
    //         $('#source_text').val('');
    //         var xml = fragmentStr.replace(/\n\n+/g, "\n");
    //         var elephasXML = xml;
    //
    //         var xmlDOM = new DOMParser().parseFromString(elephasXML, 'text/xml');
    //
    //         var xsltProcessor = new XSLTProcessor();
    //
    //         $.ajax({
    //             url: '../elephas2latex.xsl',
    //             success: function(xsl) {
    //                 xsltProcessor.importStylesheet(xsl);
    //                 fragment = xsltProcessor.transformToFragment(xmlDOM,document);
    //                 console.log(fragment);
    //                 fragmentStr = new XMLSerializer().serializeToString(fragment);
    //                 $('#source_text').val('');
    //                 var xml = fragmentStr.replace(/\n\n+/g, "\n");
    //                 $('#source_text').val(xml);
    //             }
    //         });
    //     }
    // });

    $.ajax({
        url: 'xsl/elephas2latex.xsl',
        success: function(xsl) {
            var oParser = new DOMParser();
            var xml = $('#xml').html();
            xml = xml.replace(/&lt;(div|table|thead|tr|td|th|a)\s*.*?&gt;/g, '<$1>');
            xml = xml.replace(/&lt;\/(div|table|thead|tr|td|th|a)\s*&gt;/g, '</$1>');
            xml = xml.replace(/#/g, '\#');
            console.log(xml);
            var xmlDOM = oParser.parseFromString(xml, "application/xml");
            xsltProcessor.importStylesheet(xsl);
            fragment = xsltProcessor.transformToFragment(xmlDOM,document);
            console.log(fragment);
            fragmentStr = new XMLSerializer().serializeToString(fragment);
            $('#source_text').val('');
            var latex = fragmentStr.replace(/\n\n\n+/g, "\n\n");
            latex = latex.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            latex = latex.replace(/\<!--.*?--\>/g, '');
            latex = latex.replace(/&amp;/g, "&");
            // latex = latex.replace(/\\class{.*?}{(.*?)}/g, '$1');
            latex = latex.replace(/\\class{.*?}/g, '');
            latex = latex.replace(/&ocirc/g, '\\^o');
            $('#source_text').val(latex);
        }
    });
}
//
// function showWb() {
//     var elephasXML = $('#source_text').val();
//
//     var xmlDOM = new DOMParser().parseFromString(elephasXML, 'text/xml');
//
//     var xsltProcessor = new XSLTProcessor();
//
//     $.ajax({
//         url: 'xsl/elephas2wb.xsl',
//         success: function(xsl) {
//             xsltProcessor.importStylesheet(xsl);
//             fragment = xsltProcessor.transformToFragment(xmlDOM,document);
//             console.log(fragment);
//             fragmentStr = new XMLSerializer().serializeToString(fragment);
//             $('#input').val('');
//             editor.setValue(fragmentStr.replace(/\n\n+/g, "\n").replace(/\s*\n+\@linebreak/g, "\n\n"));
//             // $('#input').val(fragmentStr.replace(/\n\n+/g, "\n").replace(/\s*\n+@linebreak/g, "\n").replace(/^\n/s, ''));
//         }
//     });
//
// }

function commitWb() {
    var theContent = document.getElementById('output');

    var clone = theContent.cloneNode(true);

    var oldElems = clone.getElementsByClassName("latexSource");

    for(var i = oldElems.length - 1; i >= 0; i--) {
	var oldElem = oldElems.item(i);
	var parentElem = oldElem.parentNode;
	var innerElem;

	while (innerElem = oldElem.firstChild)
	{
	    // insert all our children before ourselves.
	    parentElem.insertBefore(innerElem, oldElem);
	}
	parentElem.removeChild(oldElem);
    }

    var editedContent = clone.innerHTML;
    console.log("SOURCE NODE: " + clone.innerHTML);

    var doc = new DOMParser().parseFromString(editedContent, 'text/html');
    var result = new XMLSerializer().serializeToString(doc);
    var doc = new DOMParser().parseFromString(result, "application/xml");
    var body = doc;
    console.log(new XMLSerializer().serializeToString(body));
    console.log('XML again: ');
    console.log(body);


    $.ajax({
        url: 'xsl/html2elephas.xsl',
        success: function(xsl) {
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            fragment = xsltProcessor.transformToFragment(body,document);
            console.log(fragment);
            fragmentStr = new XMLSerializer().serializeToString(fragment);
            $('#source_text').val('');
            var xml = fragmentStr.replace(/\n\s*\n+/g, "\n").replace(/  +/g, "  ");

            $('#xml').html(formatXml(xml));

            var elephasXML = xml;

            var xmlDOM = new DOMParser().parseFromString(elephasXML, 'text/xml');

            var xsltProcessor = new XSLTProcessor();

            $.ajax({
                url: 'xsl/elephas2wb.xsl',
                success: function(xsl) {
                    xsltProcessor.importStylesheet(xsl);
                    fragment = xsltProcessor.transformToFragment(xmlDOM,document);
                    console.log(fragment);
                    fragmentStr = new XMLSerializer().serializeToString(fragment);
                    editor.setValue(fragmentStr.replace(/\n\s*\n+/g, "\n").replace(/\s*\n+@linebreak/g, "\n\n").replace(/\n\s*\n+/g, "\n\n").replace(/  +/g, "  "), 1);
                    resetHighlight();
                }
            });
        }
    });
}

function openWb(filePath) {

    course = '';
    chapter = '';
    chapterType = '';
    topic = '';

    var file    = filePath.files[0];
    var reader  = new FileReader();

    console.log('READER');
    console.log(file);

    reader.addEventListener("load", function () {
        console.log('READER RESULT');
        console.log(reader.result);
        // preview.src = reader.result;
        $('#wb').html(reader.result)
        editor.setValue($('#wb').html(), 1);
    }, false);

    if (file) {
        reader.readAsText(file);
        // https://stackoverflow.com/questions/857618/javascript-how-to-extract-filename-from-a-file-input-control
        var fullPath = filePath.value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
        }
        $('base').attr('wb-src', filename);
    }
}

function saveWb() {
    var dummyLink = document.createElement('a');
    uriContent = "data:application/octet-stream," + encodeURIComponent(editor.session.getValue());
    dummyLink.setAttribute('href', uriContent);
    console.log($("base").attr('wb-src'));

    var match_wb = $("base").attr('wb-src').match(/((((?!\/).)*?)\.wb)$/);
    var match_xml = $("base").attr('xml-src').match(/((((?!\/).)*?)\.xml)$/);
    if (match_wb || match_xml) {
        var match = match_wb ? match_wb : match_xml;
        var filename = match[2];
    } else {
        var filename = 'untitled';
    }

    dummyLink.setAttribute('download', filename + '.wb');
    dummyLink.click();
}

function saveXML() {

    var xml = new DOMParser().parseFromString(generateXML(), "application/xml");

    var xsltProcessor = new XSLTProcessor();

    $.ajax({
        url: 'xsl/elephas.xsl',
        success: function(xsl) {
            xsltProcessor.importStylesheet(xsl);
            var auxXml = xsltProcessor.transformToFragment(xml, document);
            var auxString = new XMLSerializer().serializeToString(auxXml);
            $('#xml').html(auxString);
            var xmlDoc = new DOMParser().parseFromString(auxString, "application/xml");

            var xmlStr = new XMLSerializer().serializeToString(xmlDoc);
            xmlStr = xmlStr.replace(/\n\n+/g, "\n");
            xmlStr = formatXml(xmlStr);
            saveText(xmlStr, 'xml');
        }
    });

}

function saveText(text, extension) {
    var dummyLink = document.createElement('a');
    uriContent = "data:application/octet-stream," + encodeURIComponent(text);
    console.log('URICONTENT');
    console.log(uriContent);
    dummyLink.setAttribute('href', uriContent);

    var match_wb = $("base").attr('wb-src').match(/((((?!\/).)*?)\.\w+)$/);
    var match_xml = $("base").attr('xml-src').match(/((((?!\/).)*?)\.\w+)$/);
    if (match_wb || match_xml) {
        var match = match_wb ? match_wb : match_xml;
        var filename = match[2];
    } else {
        var filename = 'untitled';
    }
    dummyLink.setAttribute('download', filename + '.' + extension);
    dummyLink.click();
}

function destroyClickedElement(event)
{
// remove the link from the DOM
    document.body.removeChild(event.target);
}

function sendText(data, source_div) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
	    var text = new Blob([xhttp.responseText], {type:'text/plain'});

	    $(source_div).val(xhttp.responseText);

	}
    };

    // Set up our request
    xhttp.open("POST", "wittenberg/luther.php", true);

    // Add the required HTTP header for form data POST requests
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhttp.send("text="+encodeURIComponent(data));

}

function showWW(pgpath, id) {
//    $("#ww_inner_" + id).empty();
    $.ajax({
	// url: 'https://www.math.cuhk.edu.hk/~pschan/elephas/ww/repeater.php?id=' + id,
	url: 'ww/repeater.php?id=' + id,
	data: "sourceFilePath=" + pgpath,
	type: 'POST',
	success: function(output){
	    console.log("repeat sucess");
	    $("#ww_inner_" + id).find('.loading_icon').remove();
	    $("#ww_inner_" + id).html(output);
	    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#ww_inner_" + id)[0]]);
	    $("#ww_inner_" + id).find('p').css('padding', '1em');
	    $("#ww_inner_" + id).find('p').css('max-width', '100%');
	    $("#ww_inner_" + id).find('p').css('word-wrap', 'break-word');
	    $("#ww_inner_" + id).find('p').css('overflow', 'auto');
	    $("#ww_inner_" + id).find('input[type="submit"]').hide()
//	    $("#ww_inner_" + id).find('input[type="submit"]').addClass('btn-sm btn-outline-secondary');
//	    $("#ww_inner_" + id).find('input[type="submit"]').css('font-size', '0.5em');
//	    $("#ww_inner_" + id).find('input[type="submit"]').prop({disabled : true});

	    $("#ww_inner_" + id).find('#footer').detach().appendTo("#mainform_" + id);

	    $("#ww_inner_" + id).css('font-size', '0.95em');
	    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#ww_inner_" + id)[0]]);
	    $('#ww_footer').empty();

	    return true;
	}
    })

}

function iframeWW(pgpath, id) {
    $("#ww_inner_" + id).find('.loading_icon').remove();
    // $("#ww_inner_" + id).html("<iframe scrolling='no' src='http://webwork.math.cuhk.edu.hk/webwork2/html2xml?sourceFilePath=" + pgpath + "&answersSubmitted=0&problemSeed=123567890&displayMode=MathJax&courseID=daemon_course&userID=daemon&course_password=daemon&outputformat=simple'></iframe>");
    $("#ww_inner_" + id).html("<iframe scrolling='no' src='https://demo.webwork.rochester.edu/webwork2/html2xml?sourceFilePath=" + pgpath + "&answersSubmitted=0&problemSeed=123567890&displayMode=MathJax&courseID=daemon_course&userID=daemon&course_password=daemon&outputformat=simple'></iframe>");
}

function showModalWW(id) {
    $("#ww_window").empty();
    $("#ww_footer").empty();

    $("#ww_inner_" + id).clone().appendTo("#ww_window");
//    $("#" + id + "_clone").remove();

//    $("#ww_window").find('#footer').insertAfter("#mainform_" + id);

    updateSubmit(id);
    $("#ww_window").show();
    $("#ww_footer").show();
    $('.problem-content').css('background-color', '');
}

function updateSubmit(id) {
    $("#ww_window").find('.mainform').submit(function(event) {
	console.log('submit form');
	event.preventDefault();
	var mydefaultRequestObject = encodeURI($(this).serialize());
	console.log("serialize: " + mydefaultRequestObject);
	$.ajax({
	    traditional: true,
	    type:'POST',
	    url: 'ww/repeater.php?id=' + id,
	    data: mydefaultRequestObject,
	    timeout: 10000, //milliseconds
	    success: function (data) {
		$('#ww_window').empty();
		$('#ww_window').html(data);
		$("#ww_footer").empty();
		updateSubmit(id);
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#ww_window")[0]]);
	    },
	    error: function (data) {
		alert(basicWebserviceURL+': '+data.statusText);
	    },
	});
    });
    updateForm(id);

}

function updateForm(id) {
    $("#ww_window").find('input[type="submit"]').each(function() {
	var button_name = $(this).attr('name');
	var button_id = button_name + '_' + id;
	$(this).addClass(button_name);
	$(this).prop({disabled : false});
	$(this).click(function() {
	    $("#ww_window").find('.mainform').append('<input type="hidden" name="' + button_name + '" value=1>');
	    console.log('added form');
	    console.log("courier ajax: added form"+ button_id);
	});
	$(this).clone().prop({id : button_id + "_clone", name : button_id + "_clone"}).appendTo($('#ww_footer'));
	$('#' + button_id + '_clone').click(function() {$('#ww_window').find('.' + button_name).click()});
	$('#' + button_id + '_clone').show();
	$(this).hide();
    });
    $("#ww_footer").find('input[type="submit"]').removeClass('btn-outline-secondary');
    $("#ww_footer").find('input[type="submit"]').addClass('btn btn-primary');
    $("#ww_footer").find('input[type="submit"]').css('margin', '2px');
    $("#ww_window").find('.attemptResults').addClass('table table-bordered table-striped');
}

function focusOn(slide) {
    $('#output').scrollTo('#s' + slide, 150);
    $('#s' + slide).click();
}

function highlight(item) {
    var matches = item.match(/(\d+)\.(\d+)/);

    $('.item_button').css('background-color', '');
    $('div[chapter=' + matches[1] + '][num=' + matches[2] + ']').find("button").first().css('background-color', '#ff0');

}

function imagePostprocess(image) {

    if (!$(image).hasClass('exempt')) {
        if ($(image).attr("src") != $(image).attr("data-src"))
        $(image).attr("src", $(image).attr("data-src"));
    }
    var image_width = $(image).closest('.image').css('width');
    $(image).show();

    $(image).closest('.image').css('background', '');
    $(image).closest('.image').css('height', '');
    $(image).closest('.dual-left').css('background', '');
    $(image).closest('.dual-left').css('height', '');
    $(image).closest('.dual-right').css('background', '');
    $(image).closest('.dual-right').css('height', '');

    var override = !((typeof $(image).closest('.image').css('width') === typeof undefined)|| ($(image).closest('.image').css('width') === false) || ($(image).closest('.image').css('width') === '0px') || (image_width == '600px'));

    if(/svg/.test($(image).attr('src'))) {
        if (($(image).closest('.dual-left').length > 0) || ($(image).closest('.dual-right').length > 0)) {
            var width = 300;
            var height = 300;
            $(image).attr('width', width);
        } else if (!override) {
            var width = 450;
            var height = 450;
            $(image).closest('.image').css('width', '450');
            $(image).attr('width', width);
        } else {
            $(image).css('width', '100%');
        }
    } else if (!override) {
        $(image).removeAttr('style');
        $(image).removeAttr('width');
        $(image).removeAttr('height');
        var width = $(image).get(0).naturalWidth;
        var height = $(image).get(0).naturalHeight;

        if (width > height) {
            if (width > 600) {
                $(image).css('width', '100%');
                $(image).css('max-height', '100%');
            } else {
                $(image).css('max-width', '100%');
                $(image).css('height', 'auto');
            }
        } else {
            if (height > 560) {
                if (($(image).closest('.dual-left').length > 0) || ($(image).closest('.dual-right').length > 0)) {
                    $(image).css('width', '100%');
                    $(image).css('max-height', '100%');
                } else {
                    if((typeof $(image).closest('.image').css('width') === typeof undefined)|| ($(image).closest('.image').css('width') === false) || ($(image).closest('.image').css('width') === '0px') || (image_width == '600px')){
                        $(image).css('height', '560px');
                        $(image).css('width', 'auto');
                    } else {
                        $(image).css('height', 'auto');
                        $(image).css('max-width', '100%');
                    }
                }
            } else {
                if((typeof $(image).closest('.image').css('width') === typeof undefined)|| ($(image).closest('.image').css('width') === false) || ($(image).closest('.image').css('width') === '0px')) {
                    $(image).css('max-width', '100%');
                    $(image).css('height', 'auto');
                } else {
                    $(image).css('max-width', '100%');
                    $(image).css('height', 'auto');
                }
            }
        }
    } else {
        $(image).css('width', '100%');
    }

}

function keywords(node) {
    var keywords = [];

    $(node).find(".keywords").first().find(".keyword").each(function() {
        // var local_chapter = chapter == "" ? "" : $(node).closest(".slide").attr('chapter');

        var text = $(this).html();
        if (!(text.match(/Embed|URL|Example\s*|Exercise|Claim|Notation|^Theorem|Corollary|Definition|^Lemma|Answer|Solution|Claim|Proof|Terminology|Note|Remark/i))) {
            keywords.push(text);
        }

    });


    var keywords = Array.from(new Set(keywords));

    var html = '';
    for(var i = 0; i < keywords.length; i++) {
        var kw = keywords[i];

        var links = '';

        $(".keyword[slide!='all']").each(function() {
            if($(this).html() == kw) {
                var slide = $(this).attr('slide');
                //links += "<a class=\'dropdown-item\' href=\'" + url + "&slide=" + slide + "\' target=\'_blank\'>Slide " + slide + "</a>";
                links += "<a class='dropdown-item' href='javascript:void(0)' onclick='focusOn(" + slide + ")'>Slide " + slide + "</a>";
            }
        });

        html += '<button type="button" class="btn btn-outline-info btn-sm" style="margin-left:5px;margin-top:5px" data-html=true data-container="body" data-toggle="popover"  data-placement="bottom" data-content="' + links + '">' + keywords[i].replace(/[^\(\)a-zA-Z0-9\$]$/g, '') + '</button>';
    }

    return html;

}


function updateTitle(index) {
    var course = $('#s' + index).attr('course') ? $('#s' + index).attr('course') : '';
    var chapter_type = $('#s' + index).attr('chapter_type') ? $('#s' + index).attr('chapter_type'):'';
    var chapter = $('#s' + index).attr('chapter') ? $('#s' + index).attr('chapter') : '';
    var topic = $('#s' + index).attr('topic') ? $('#s' + index).attr('topic').replace(/&lt;br\/&gt;/g,'<br/>') : '';

    // var html = '<a href="javascript:void(0)" onclick="displayResult(generateXML())" target=_blank><h3 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h3></a>';
    // var html = '<h3>Slide ' + index + '</h3><a href="' + $('base').attr('url') + '" target=_blank><h3 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h3></a>';
    var html = '<a href="' + $('base').attr('url') + '" target=_blank><h3 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h3></a>';

    if (course != '' || chapter != '' || topic != '') {
        $('.title_box').html(html);
        $('.info_half').find('.title_box').show();
    } else {
        $('.title_box').hide();
    }

    $('#info_keywords').html(keywords($('#output')[0]));
    $('[data-toggle="popover"]').popover();
}

// function updateTitle(slideIndex) {
//     var course = $('#s' + slideIndex).attr('course');
//     var chapter_type = $('#s' + slideIndex).attr('chapter_type');
//     var chapter = $('#s' + slideIndex).attr('chapter');
//     var topic = $('#s' + slideIndex).attr('topic');
//
//     var url = 'TBA';
//
//     $('#title').html(
//         '<a href="'+ url +'" target=_blank><h5 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h5></a>'
//     );
// }

function displayResult(xmlString) {

    console.log('XML: ');
    console.log(xmlString);

    var xml = new DOMParser().parseFromString(xmlString, "application/xml");

    var xsltProcessor = new XSLTProcessor();

    $.ajax({
        // url: '../elephas.xsl',
        url: 'xsl/elephas.xsl',
        type: "post",
        data:{},
        dataType: "xml",
        success: function(xslFile) {
            xsltProcessor.importStylesheet(xslFile);
            var auxXml = xsltProcessor.transformToFragment(xml, document);
            var auxString = new XMLSerializer().serializeToString(auxXml);
            // auxString = auxString.replace(/&lt;([a-z]\d*)&gt;(.*?)&lt;\/([a-z]\d*)&gt;/gi, '<$1>$2</$1>');
            $('#xml').html(formatXml(auxString));
            var xmlDoc = new DOMParser().parseFromString(auxString, "application/xml");
            console.log('XMLFRAGMENT');
            console.log(xmlDoc);
            $.ajax({
                url: 'xsl/wb.xsl',
                data:{},
                type: "GET",
                dataType: "xml",
                success: function(wbxslFile) {
                    var xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(wbxslFile);
                    fragment = xsltProcessor.transformToFragment(xmlDoc, document);
                    $('#output').html('');
                    $('#output').append(fragment);
                    // MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('title')]);
                    $('#output').scrollTo($('#s' + slideIndex));
                    postprocess();
                }
            });

        }
    });

}

function getBare(xml, $node) {
    console.log('XML: ');
    console.log(xml);

    var xsltProcessor = new XSLTProcessor();

    $.ajax({
        url: 'xsl/elephas.xsl',
        success: function(xsl) {
            xsltProcessor.importStylesheet(xsl);
            var auxXml = xsltProcessor.transformToFragment(xml, document);
            var auxString = new XMLSerializer().serializeToString(auxXml);
            $('#xml').html(auxString);
            console.log('#XML AUXSTRING');
            console.log(auxString);
            var xmlDoc = new DOMParser().parseFromString(auxString, "application/xml");
            console.log('XMLFRAGMENT');
            console.log(xmlDoc);
            $.ajax({
                url: 'xsl/wb.xsl',
                success: function(wbxsl) {
                    var xsltProcessor = new XSLTProcessor();
                    xsltProcessor.importStylesheet(wbxsl);
                    fragment = xsltProcessor.transformToFragment(xmlDoc, document);
                    // $('#output_bare').html('');
                    // $('#output_bare').append(fragment);
                    // MathJax.Hub.Queue(["Typeset",MathJax.Hub, document.getElementById('output')]);
                    var fragmentStr = new XMLSerializer().serializeToString(fragment);
                    console.log('FRAGMENT');
                    console.log(fragmentStr);
                    $node.html(fragmentStr);
                }
            });

        }
    });
}


function query(queryString, $node) {
    xml_str = $('#xml').html();
    xml_str = xml_str.replace(/BEGINTAG/g,'<').replace(/ENDTAG/g, '>');
    console.log('XML_STR FROM DIV');
    console.log(xml_str);
    var oParser = new DOMParser();
    var oDom = oParser.parseFromString(xml_str, "application/xml");

    var queries = oDom.evaluate(queryString, oDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    var queryDom = document.implementation.createDocument("", "", null);
    var bare = queryDom.createElement("bare");

    for ( var i = 0 ; i < queries.snapshotLength; i++ ) {
        console.log('QUERY RESULT: ' + queries.snapshotItem(i).textContent);
        var linebreak = queryDom.createElement("linebreak");
        bare.appendChild(linebreak);
        bare.appendChild(queries.snapshotItem(i));
    }

    queryDom.appendChild(bare);
    getBare(queryDom, $node);
}
