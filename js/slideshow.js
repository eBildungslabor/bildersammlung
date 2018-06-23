var showall = false;
var editMode = false;
var slideIndex = 1;

var whichSteps = {};

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
	    //        document.getElementById('left_button').click();
	    document.getElementById('right_button').click();
//	    $("#text").animate({marginLeft:"-100%"}, 200, "linear", function() {document.getElementById('right_button').click();$("#text").css({marginLeft: ''});});
        } else {
	    /* right swipe */
	    document.getElementById('left_button').click();
//            $("#text").animate({marginLeft:"100%"}, 200, "linear", function() {document.getElementById('left_button').click();$("#text").css({marginLeft: ''});});

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


function showStep(stepsId) {
    if (whichSteps[stepsId] == null)
	whichSteps[stepsId] = 0;
    var whichStep = whichSteps[stepsId];
    var step = 'steps' + stepsId + '.' + whichStep;
    console.log('STEP: ' + step);
    if (document.getElementById(step) != null) {
	document.getElementById(step).style.visibility = "visible";
	whichStep++;
    }

    if (!document.getElementById(step)) {
	document.getElementById("next"+stepsId).disabled = true;
    }
    document.getElementById("reset"+stepsId).disabled = false;
    whichSteps[stepsId] = whichStep;
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
    while (step = document.getElementById('steps' + stepsId + '.' + i)) {
	step.style.visibility = "hidden";
	i++;
    }
    whichSteps[stepsId] = 0;
}
function hide(pressed) {
    element = document.getElementById('cover_half');
    element.style.display="block";

    if(pressed) {
	$('.slide_container').css('position', 'absolute')
	$('.slide_container').css('left', '0');
	$('.slide_container').css('top', '0');
	$('.slide_container').css('margin', '0 auto');
	$('.slide_container').css('height', '50%');
	$('.slide_container').css('overflow-y', 'auto');


    } else {
	$('.slide_container').css('position', '');
	unhide();
    }

}

function unhide() {
    element = document.getElementById('cover_half');
    element.style.display="none";
    document.getElementById('text').style.height="100%";
    document.getElementById('unhide').style.display="none";

        var z = document.getElementsByClassName("slide_container");
    	$('.slide_container').css('position', '');
	$('.slide_container').css('left', '');
	$('.slide_container').css('top', '');
	$('.slide_container').css('margin', '');
	$('.slide_container').css('height', '');
	$('.slide_container').css('overflow-y', '');
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
  if (document.getElementById("text").style.fontSize == "") {
    document.getElementById("text").style.fontSize = "1.0em";
  }
  document.getElementById("text").style.fontSize = parseFloat(document.getElementById("text").style.fontSize) + 0.2*(multiplier) + "em";
}


function plusDivs(n) {
    if(editMode)
	document.getElementById('edit_button').click();

    slideIndex = parseInt(slideIndex) + parseInt(n);

    if (n > 0) {
    	    $("#text").animate({marginLeft:"-100%"}, 150, "linear", function() {$("#text").css({marginLeft: ''});showDivs(slideIndex);});
        } else {
            $("#text").animate({marginLeft:"100%"}, 150, "linear", function() {$("#text").css({marginLeft: ''});showDivs(slideIndex);});
	}

}

function showDivs(n) {

    // $('.slide_number').removeAttr('style');

    $('#page').css('position', '');
    $('#text').css('padding', '');
    $('#page').css('width', '');
    $('#page').css('top', '');
    $('#page').css('height', '');
    $('#text').css('height', '');
    $('#text').css('margin-top', '');
    $('#text').css('margin-left', '');

    $('#text').css('white-space', '');
    $('#page').css('overflow-x', '');
    $('#page').css('overflow-y', '');

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

    // slideIndex = (parseInt(n) + x.length) % x.length;
    // var nextSlide = (slideIndex + 1) % x.length;
    // var prevSlide = ((slideIndex - 1) + x.length) % x.length;

    // updateTitle(slideIndex);


	if ($('#s'+slideIndex).hasClass('all')) {
	    $('#s'+slideIndex+' .collapse').collapse('hide');
        $('#s'+slideIndex).addClass('collapsed');
        $('#s'+slideIndex).removeClass('all');
	}

    if ($('#s' + slideIndex).hasClass('collapsed'))
        $('#uncollapse_button').text('Uncollapse');
    else
        $('#uncollapse_button').text('Collapse');


	for (i = 0; i < x.length; i++) {
	    x[i].style.display = "none";
	    x[i].style['border'] = "";
	}

	if(x[slideIndex - 1] != null) {
	    x[slideIndex - 1].style.display = "table-cell";
	    x[slideIndex - 1].style['vertical-align'] = "middle";


	    $("#" + x[slideIndex - 1].id).find('img').each(function() {
            if (!$(this).hasClass('exempt')) {
                if ($(this).attr("src") != $(this).attr("data-src"))
                $(this).attr("src", $(this).attr("data-src"));
            }
        });

        $("#" + x[nextSlide - 1].id).find('img').each(function() {
            if (!$(this).hasClass('exempt')) {
                if ($(this).attr("src") != $(this).attr("data-src"))
                $(this).attr("src", $(this).attr("data-src"));
            }
	    });
        $("#" + x[prevSlide - 1].id).find('img').each(function() {
            if (!$(this).hasClass('exempt')) {
                if ($(this).attr("src") != $(this).attr("data-src"))
                $(this).attr("src", $(this).attr("data-src"));
            }
	    });

	    if(editMode) {
            removeTypeset();
        } else {
            if (!($('#' + x[slideIndex - 1].id).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[slideIndex]]);
                $('#' + x[slideIndex - 1].id).addClass('rendered');
            }

            if (!($('#' + x[nextSlide - 1].id).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[nextSlide]]);
                $('#' + x[nextSlide].id).addClass('rendered');
            }

            if (!($('#' + x[prevSlide - 1].id).hasClass('rendered'))) {
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,x[prevSlide]]);
                $('#' + x[prevSlide - 1].id).addClass('rendered');
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

function updateShowdown() {
    var converter = new showdown.Converter({extensions: ['table']});
    $('#s' + slideIndex).find('.markdown').each(function() {
        var original = $(this).html();
        var html = converter.makeHtml(original);
        //$(this).html('');
        //$(this).append('<div class="markdown_original">' + original + '</div>');
        //$(this).append('<div class="markup">' + html + '</div>');
        $(this).html(html);
    });
}

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
    var z =  document.getElementsByClassName("slide_number");
    for (i = 0; i < z.length; i++) {
	  z[i].style.display = "";
      }

    document.getElementById('controls').style.display = '';
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

function print(hover) {
  var i;

  var anchors = document.getElementsByClassName("collapsea");
    for (i = 0; i < anchors.length; i++) {
     anchors[i].text = "";
    }

   var x = document.getElementsByClassName("slide");
    for (i = 0; i < x.length; i++) {
	showDivs(i);
	x[i].className = hover ? "slide slide_hover" : "slide";
	x[i].style.display = "";
    }

    $('.slide').show();

    var z =  document.getElementsByClassName("slide_number");
    for (i = 0; i < z.length; i++) {
	z[i].style.display = "none";
    }

    var y = document.getElementsByClassName("collapse");
    for (i = 0; i < y.length; i++) {
     y[i].style.display = "block";
  }

    document.getElementById('left_button').style.display = 'none';
    document.getElementById('right_button').style.display = 'none';

    showall = true;

    if(!hover)
	$('.slide').prop('onclick',null).off('click');

}

function collapseToggle() {
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
        var jax = MathJax.Hub.getAllJax('s'+slideIndex);
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

    document.getElementById('source_button').disabled = false;

    updateShowdown();

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
    var oldElems = document.getElementById('s'+slideIndex).getElementsByClassName("latexSource");


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
            ["resetEquationNumbers", MathJax.InputJax.TeX, document.getElementById('s'+slideIndex)],
            ["PreProcess", MathJax.Hub, document.getElementById('s'+slideIndex)],
            ["Reprocess", MathJax.Hub, document.getElementById('s'+slideIndex)],
            ["Typeset", MathJax.Hub, document.getElementById('s'+slideIndex)]
        );
    } else {
        removeTypeset();
    }

    document.getElementById('text').contentEditable = show;
    document.getElementById('edit_button').className = show ? 'btn btn-danger btn-sm menu_button' : 'btn btn-outline-info btn-sm menu_button';
    document.getElementById('source_button').style.display = show ? 'block':'none';editMode=!editMode;

}

function editText() {
    if ((showall == 1) || (document.getElementById('s'+slideIndex) == null)) {
	var theContent = document.getElementById('text');
    } else
	var theContent = document.getElementById('s'+slideIndex);

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

    sendText(editedContent, '#source_text');

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
    $("#ww_window").find('.attemptResults').addClass('table table-bordered table-striped');
}

function updateTitle(slideIndex) {
    var course = $('#s' + slideIndex).attr('course');
    var chapter_type = $('#s' + slideIndex).attr('chapter_type');
    var chapter = $('#s' + slideIndex).attr('chapter');
    var topic = $('#s' + slideIndex).attr('topic');

    var url = 'TBA';

    $('#title').html(
        '<a href="'+ url +'" target=_blank><h5 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h5></a>'
    );
}
