<script type="text/javascript" charset="utf-8">
$('.slide').find("table").addClass("table table-bordered table-hover");


$('.slide_button').on('click', function() {
    var course = $(this).attr('course');
    var slide = $(this).attr('slide');
    var chapter_type = $(this).attr('chapter_type');
    var chapter = $(this).attr('chapter');

    var keywords = $(this).closest('.slide').attr('keywords').split(' ');

    $('#item_modal').find('#modal_keywords').html('');
    $('#item_modal').modal('toggle');
    $('#item_modal').find('#modal_title').html(course + ' - ' + chapter_type + ' ' + chapter + ' - Slide ' + slide);

    var url = '';
    $('#item_modal').find('#item_modal_link').attr('href', url);

    $('#item_modal').find('#share_url').html(url);

    $('#item_modal').find('#share_hyperlink').html('<a href="' + url + '" target="_blank" title="Course:' + course + '">' + 'Chapter ' + chapter + ' Slide ' + slide + '</a>');

    $('#item_modal').find('#share_hyperref').html('\\href{"' + url.replace('#', '\\#') + '"}{Chapter ' + chapter + ' Slide ' + slide + '}');

    var html = '';
    keywords = keywords.filter(function(item, pos){
        return keywords.indexOf(item) == pos;
    });
    keywords.map(function(keyword) {
        if (keyword != '') {
            html += '<button button class="btn btn-outline-info btn-sm" style="margin-left:5px;margin-top:5px">' + keyword.replace(/__/g, ' ') + '</button>';
        }
    });
    $('#item_modal').find('#modal_keywords').html('<hr><b class=notkw>Keywords:</b>'+html);
});

$('.item_button').on('click', function() {
    var course = $(this).attr('course');
    var item_type = $(this).attr('type');
    var chapter = $(this).attr('chapter');
    var item = $(this).attr('item');

    $('#item_modal').find('#modal_keywords').html('');
    $('#item_modal').modal('toggle');
    $('#item_modal').find('#modal_title').html(course + ' ' + item_type + ' ' + chapter + '.' + item);

    var url = '';
    $('#item_modal').find('#item_modal_link').attr('href', url);

    $('#item_modal').find('#share_url').html(url);
    $('#item_modal').find('#share_hyperlink').html('<a href="' + url + '" target="_blank" title="Course:' + course + '">' + item_type + ' ' + chapter + '.' + item + '</a>');

    $('#item_modal').find('#share_hyperref').html('\\href{"' + url.replace('#', '\\#') + '"}{' + item_type + ' ' + chapter + '.' + item + '}');
});

function update_title(slideIndex) {
    var course = $('#s' + slideIndex).attr('course');
    var chapter_type = $('#s' + slideIndex).attr('chapter_type');
    var chapter = $('#s' + slideIndex).attr('chapter');
    var topic = $('#s' + slideIndex).attr('topic');

    var url = '';
    $('#title').html(
        '<a href="'+ url +'" target=_blank><h5 class=notkw>'+ course + '<br>' + chapter_type + ' ' + chapter + '<br>' + topic + '</h5></a>'
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

function keywords(chapter) {
    var keywords = [];
    var tags = ['b', 'h5'];
    for (var i = 0; i < tags.length; i++) {
//	$(tags[i] + '.chapter' + chapter).each(function() {
	$(tags[i]).each(function() {
        var local_chapter = chapter == "" ? "" : $(this).closest(".slide").attr('chapter');

	    var text = $(this).html();
	    if (!($(this).hasClass('notkw')) && (local_chapter == chapter) && !(text.match(/Embed|URL|Example\s*|Exercise|Claim|Notation|^Theorem|Corollary|Definition|^Lemma|Answer|Solution|Claim|Proof|Terminology|Note|Remark/i))) {
            keywords.push(text);
            //		console.log(chapter + ' ' + text);
            $(this).closest(".slide").addClass("kw_" + text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());

            var kw_str = $(this).closest('.slide').attr('keywords');
            kw_str += ' ' + text.replace(/ /g, '__').toLowerCase();
            kw_str = kw_str.replace(/^ /, '');
            $(this).closest('.slide').attr('keywords', kw_str);
        }

	});
    }

    keywords = Array.from(new Set(keywords));

    //    $(function () {
    //	$('[data-toggle="popover"]').popover();
    //    })

    var html = '';
    for(var i = 0; i < keywords.length; i++) {
        var kw = keywords[i];

        var links = '';
        var kwLower = kw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        $(".slide.kw_" + kwLower).each(function() {
            if(typeof $(this).attr('id') !== 'undefined') {
                var id = $(this).attr('id').replace(/s/, '');
                links += "<a class=\'dropdown-item\' href=\'<?php echo ""?>&slide=" + id + "\' target=\'_blank\'>Slide " + id + "</a>";
            }
        });

        html += '<button type="button" class="btn btn-outline-info btn-sm" style="margin-left:5px;margin-top:5px" data-html=true data-container="body" data-toggle="popover"  data-placement="bottom" data-content="' + links + '">' + keywords[i].replace(/[^a-zA-Z0-9\$]$/g, '') + '</button>';
    }


    $('.keywords.chapter' + chapter).append(html);

}

$('.keywords').each(function() {
//    console.log('chapter ' + $(this).attr('chapter'));
    keywords($(this).attr('chapter'));
});

$('[data-toggle="popover"]').popover();

$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
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

		    $(this).closest('.image').css('background', 'url(wittenberg/Loading_icon.gif) center center no-repeat');
		    $(this).closest('.image').css('height', '300px');
		    $(this).closest('.dual-left').css('background', 'url(wittenberg/Loading_icon.gif) center center no-repeat');
		    $(this).closest('.dual-left').css('height', '150px');
		    $(this).closest('.dual-right').css('background', 'url(wittenberg/Loading_icon.gif) center center no-repeat');
		    $(this).closest('.dual-right').css('height', '150px');
		    $(this).hide();

		} else {
//		  $(this).attr('src', $(this).attr('data-src'));
		}
	    });
	    $('iframe').each(function() {
		if(!$(this).hasClass('exempt')) {
		  attr = $(this).attr('src');
		  if (typeof attr !== typeof undefined && attr !== false) {
		    $(this).attr('data-src', $(this).attr('src'));
		    $(this).removeAttr('src');
		  }
		}
	    });
	}

	$('img').<?php if(!isset($_GET['print'])) {echo "on('load',";} else {echo "each(";} ?> function() {


	  var image_width = $(this).closest('.image').css('width');
//	    $(this).on('click', function(){alert(image_width)});


	    $(this).show();

	    if (!$(this).hasClass('exempt')) {

	      $(this).closest('.image').css('background', '');
	      $(this).closest('.image').css('height', '');
	      $(this).closest('.dual-left').css('background', '');
	      $(this).closest('.dual-left').css('height', '');
	      $(this).closest('.dual-right').css('background', '');
	      $(this).closest('.dual-right').css('height', '');


	      var override = !((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px') || (image_width == '600px'));

	      if(/svg/.test($(this).attr('src'))) {
		if (($(this).closest('.dual-left').length > 0) || ($(this).closest('.dual-right').length > 0)) {
		  var width = 300;
		  var height = 300;
		  $(this).attr('width', width);
		} else if (!override) {
		  var width = 450;
		  var height = 450;
		  $(this).closest('.image').css('width', '450');
		  $(this).attr('width', width);
		} else {
		  $(this).css('width', '100%');
		}
	      } else if (!override) {
		$(this).removeAttr('style');
		$(this).removeAttr('width');
		$(this).removeAttr('height');
		var width = $(this).get(0).naturalWidth;
		var height = $(this).get(0).naturalHeight;


		if (width > height) {
		if (width > 600) {
		  $(this).css('width', '100%');
		  $(this).css('height', 'auto');
		} else {
		  $(this).css('max-width', '100%');
		  $(this).css('height', 'auto');
		}
		} else {
		  if (height > 560) {
		    if (($(this).closest('.dual-left').length > 0) || ($(this).closest('.dual-right').length > 0)) {
		      $(this).css('width', '100%');
		      $(this).css('height', 'auto');
		    }
		    else {
		      if((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px') || (image_width == '600px')){
			$(this).css('height', '560px');
			$(this).css('width', 'auto');
		      } else {
			$(this).css('height', 'auto');
			$(this).css('max-width', '100%');
		      }
		    }
		  } else {
		    if((typeof $(this).closest('.image').css('width') === typeof undefined)|| ($(this).closest('.image').css('width') === false) || ($(this).closest('.image').css('width') === '0px')) {
		      $(this).css('max-width', '100%');
		      $(this).css('height', 'auto');
		    } else {
		      $(this).css('max-width', '100%');
		      $(this).css('height', 'auto');
		    }
		  }

		}
	      } else {
		$(this).css('width', '100%');
	      }
	    } else {
//	      $(this).attr('src', $(this).attr('data-src'));
	    }
	});

      });

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

MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('title')]);

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

$('.slide').click(function(){
    showCurrentDiv($(this).attr('slide'));
});
</script>
<?php
if (isset($_GET['uncollapse'])) {
?>
<script>
$('#s' + slideIndex +' .collapsea').click();
$('#s' + slideIndex).removeClass('collapsed');
$('#uncollapse_button').text('Collapse');
</script>
<?php
}
?>
