<?php
$root_url = '';
$canon_url = '';
$content = '';
$wb = '';


$url = $_SERVER['HTTP_HOST'];
preg_match('/(?P<userdir>.*?)\/(?P<wb>\w+.php|\w+|)\?(.*?)/', $_SERVER['REQUEST_URI'], $matches);

if(isset($matches['userdir'])) {
    $root_url = "http://".$url.$matches['userdir']."/";
} else {
    $root_url = "";
}
?>

<html xml:lang="en" lang="en" xmlns="http:/www.w3.org/1999/xhtml">
<base root="<?php echo $root_url;?>" url="<?php echo $_SERVER['REQUEST_URI'];?>" xml-src="<?php if(isset($_GET['xml'])) {echo $_GET['xml'];} ?>" wb-src="<?php if(isset($_GET['wb'])) {echo $_GET['wb'];} ?>" slide="<?php if(isset($_GET['slide'])) {echo $_GET['slide'];} else {echo "1";} ?>" present="<?php if(isset($_GET['present'])) {echo '1';} else {echo '0';} ?>">
<!-- <base href="http://localhost/~pschan-math/elephas/client/"> -->
<head>
    <meta charset="UTF-8">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.4/css/bootstrap.min.css" integrity="2hfp1SzUoho7/TsGGGDaFdsuuDL0LX2hnUp6VkX3CUQ2K4K+xjboZdsXyp4oUHZj" crossorigin="anonymous"> -->
    <link rel="stylesheet" href="js/bootstrap.min.css" >

    <script src="js/jquery.min.js" ></script>
    <script src="js/tether.min.js" ></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/formatxml.js"></script>
    <script src="js/jquery.scrollTo.min.js"></script>
    <link href="js/knowlstyle.css" rel="stylesheet" type="text/css" />
    <script src="js/Base64.js" type="text/javascript"></script>
    <script src="js/knowl.js" type="text/javascript" ></script>
    <!-- <script src="js/ace-builds-master/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script> -->
    <script src="js/ace-builds-master/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>

    <!-- <script src="/webwork2_files/js/apps/AddOnLoad/addOnLoadEvent.js" type="text/javascript"></script>
    <script src="/webwork2_files/js/apps/Base64/Base64.js" type="text/javascript"></script>
    <script type="text/javascript" src="/webwork2_files/js/legacy/vendor/knowl.js"></script> -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/xregexp/3.2.0/xregexp-all.min.js"></script> -->
    <script type="text/javascript" src="slideshow_client.js"></script>
    <script type="text/javascript" src="postprocess.js" ></script>
    <script type="text/javascript" src="elephas.js"></script>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.js" integrity="sha256-WZhItMKyEJQarLzuYWKmNplzBgqEKvlAedjRsChG3JA=" crossorigin="anonymous"></script>
    <script type="text/javascript" src="../showdown-table.js"></script> -->

    <link rel="stylesheet" href="styles_split.css" media="all">

    <script type="text/javascript" src="../../js/MathJax-2.7.4/MathJax.js?config=TeX-AMS_CHTML"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
          skipStartupTypeset: false,
          tex2jax: {
            inlineMath: [['$','$'], ['\\(','\\)']],
    	processEnvironments: true,
    	processEscapes: true,
    	ignoreClass: "tex2jax_ignore"
          },
          TeX: {equationNumbers: {autoNumber: "ams"}}
        });
    </script>

<script>
var rootURL = $('base').attr('root');
var xmlSrc = $('base').attr('xml-src');
var wbSrc = $('base').attr('wb-src');
var showall = false;
var editMode = false;
var slideIndex = $('base').attr('slide');
var slideCount = 0;
var slideLine = [];
var lines;
var url='';
var mode = 'dual';
var showall = false;

var Range = ace.require('ace/range').Range; // get reference to ace/range
</script>

<script id='wb' type='text'><?php if(isset($_GET['wb'])) {
    echo file_get_contents($_GET['wb']);
} else {
    echo "";
}
?>
</script>

<style type="text/css">
.ace_highlight-marker {
   position: absolute; /* without this positions will be erong */
   background: #ddf; /* color */
   z-index: 1000; /* in front of all other markers */
}
.ace_slide-marker {
   position: absolute; /* without this positions will be erong */
   background: #ffc; /* color */
   z-index: 1000; /* in front of all other markers */
}

</style>

</head>

<body style="height:100%;width:100%;margin:auto auto;background-color:#eee;overflow:hidden;padding-top:0%">
    <div id="container" style="width:100%;height:100%;margin:auto auto;overflow:hidden">
        <div id="left_half" class="left info_half">
            <div id="info_half">
                <div id="info_title" class="title_box"></div>
                <p/>
                <div id="info_keywords"></div>
                <div id="info_statements"></div>
                <p/>
                <hr>
                <div id="slide_info" style="display:none">
                    <h5 class="current_slide"></h5>
                    <br/>
                        <div id="slide_keywords"></div>
                    <br/><br/>
                    <b onclick='$(".slide_info.share").show();'>Share</b>
                    <a  class="collapsea collapsed" contenteditable="false" data-toggle="collapse" aria-expanded="false" aria-controls="slide_info_share" href="#slide_info_share">►
                    </a>
                    <div class="slide_info share collapse" id="slide_info_share" style="background-color:#f5f5f5;border:1px solid #f5f5f5;padding:10px;border-radius:5px">
                        <span style="color:#888">URL</span>
                        <br><textarea class="url share_text"  onclick="this.select()" readonly="readonly"></textarea>
                        <p><br></p>
                        <span style="color:#888">HTML Hyperlink</span><br/>
                        <textarea class="hyperlink share_text"  onclick="this.select()" readonly="readonly"><a href="" target="_blank" title=""></a></textarea>
                        <p><br></p>
                        <span style="color:#888">$\LaTeX$ Hyperref</span><br>
                        <textarea class="hyperref share_text"  onclick="this.select()" readonly="readonly"></textarea>
                        <span id='modal_keywords'>
                        </span>
                    </div>

                </div>
                <div id="info_menu_container">
                    <button id="compose_icon" onclick="$('#compose_button').click();"></button>
                </div>
            </div>
            <div id="input_container" style="width:100%;height:100%;border:0;display:none">
                <div id="input" style="margin-right:50px;height:100%;font-size:1.2em;">
                </div>
                <div id="edit_menu_container">
                    <button id="maximize_icon" class="plain_button icon" onclick="$('#left_half').css('width', '100%');editor.resize();$('#normalize_icon').show();$(this).hide();"></button>
                    <button id="normalize_icon"  class="plain_button icon" onclick="$('#left_half').css('width', '');editor.resize();$('#maximize_icon').show();$(this).hide();"></button>
                    <br/>
                    <button id="close_icon" class="plain_button icon" style="font-size:2em;" onclick="$('#normalize_icon').click();$('#dual_button').click();">&times;</button>
                    <br/>
                    <label for="fileInput">
                        <img id="open_icon" class="exempt icon" src="icons/File_Open.svg"/>
                        <!-- <button id="open_icon" class="plain_button icon"/> -->
                        <input id="fileInput" type="file" onchange="openWb(this);" style="display:none">
                    </label>
                    <br/>
                    <!-- <button id="render_icon" class="plain_button icon" style="font-weight:bold;font-size:1em;text-align:center;padding-right:2px" onclick="$('#render_button').click();">❮&nbsp;/&nbsp;❯</button> -->
                    <button id="render_icon" class="plain_button icon" style="font-weight:bold;font-size:1.5em;text-align:center;padding-right:2px" onclick="$('#render_button').click();">↻</button>
                    <br/>
                    <!-- <button id="save_icon" class="plain_button icon" onclick="saveWb();"></button> -->
                    <button id="save_icon" class="plain_button icon" onclick="saveWb();"></button>
                    <br/>
                    <!-- <button id="xml_icon" class="plain_button icon" onclick="saveXML();" style="font-weight:bold;font-size:1em;text-align:center">❮<span style="font-size:x-small">XML</span>❯</button> -->
                    <button id="xml_icon" class="plain_button icon" style="position:absolute;left:0;bottom:2em" onclick="saveXML();" style="font-weight:bold;font-size:1em;text-align:center">⬇︎<span style="font-size:x-small">XML</span></button>
                </div>
            </div>
            <script>
            var editor = ace.edit("input");
            editor.setTheme("ace/theme/elephas");
            editor.session.setMode("ace/mode/elephas");
            editor.getSession().setUseWrapMode(true);
            editor.setValue($('#wb').html(), 1);
            editor.setShowPrintMargin(false);
            editor.commands.addCommand({
                name: 'saveFile',
                bindKey: {
                    win: 'Ctrl-S',
                    mac: 'Command-S',
                    sender: 'editor|cli'
                },
                exec: function(env, args, request) {
                    var dummyLink = document.createElement('a');
                    uriContent = "data:application/octet-stream," + encodeURIComponent(editor.session.getValue());
                    dummyLink.setAttribute('href', uriContent);
                    console.log($("base").attr('wb-src'));
                    dummyLink.setAttribute('download', $("base").attr('wb-src').match(/(((?!\/).)*?\.wb)$/)[0]);
                    dummyLink.click();
                    // newWindow = window.open(uriContent, 'Save');
                }
            });
            </script>
        </div>
        <div id="right_half" class='right dual_half'>
            <div id="preamble" style="display:none">
                \(\newcommand{\abs}[1]{\left|#1\right|}
                \newcommand{\ds}{\displaystyle}
                \newcommand{\ol}[1]{\overline{#1}}
                \newcommand{\oll}[1]{\overline{\overline{#1}}}
                \newcommand{\bs}{\backslash}
                \newcommand{\Frac}{\mathrm{Frac}}
                \newcommand{\im}{\mathrm{im}\,}
                \newcommand{\ZZ}{\mathbb{Z}}
                \newcommand{\ra}{\longrightarrow}
                \newcommand{\ord}{\mathrm{ord}\,}
                \newcommand{\GL}{{\rm GL}}
                \newcommand{\SL}{{\rm SL}}
                \newcommand{\SO}{{\rm SO}}
                \newcommand{\colvec}[1]{\begin{pmatrix}#1\end{pmatrix}}
                \newcommand{\Span}{{\rm Span}\,}
                \newcommand{\Rank}{{\rm Rank}\,}
                \newcommand{\nullity}{{\rm nullity}\,}
                \newcommand{\adj}{{\rm adj}\,}
                \newcommand{\Proj}{{\rm Proj}}
                \newcommand{\ora}{\overrightarrow}
                \newcommand{\ve}{\varepsilon}
                \newcommand{\phib}{\ol{\phi}}

                \require{extpfeil}
                \)
                <script>MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('preamble')]);</script>
            </div>
            <div id='output' class="output_dual"></div>
            <div class="present title_box" style="display:none"></div>
            <div id="output_icon_container">
                <button id="full_screen_icon" onclick="$('#dual_icon').show();$('#present_button').click()"></button>
                <button id="dual_icon" class="plain_button" onclick="$('#dual_button').click();$('#full_screen_icon').show();$(this).hide();"></button>
            </div>
            <div id="menu_container" class="dropdown" >
                <button id="test_button" class="btn btn-outline-info btn-xs dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">&#9776;</button>
                <div id="main_menu" class="dropdown-menu" aria-labelledby="test_button" >
                    <button id="present_button" class="btn btn-outline-info btn-sm menu_button" type="present" onclick="$('#left_half').animate({marginLeft:'-25%'}, 200, 'linear', function() {$('#right_half').removeClass('compose_half').removeClass('dual_half');$('#right_half').addClass('page');$('#left_half').hide();$(this).css('margin-left','0');});$('.slide').hide();$('#controls').show();$('#output').removeClass('output_dual');$('#full_screen_icon').hide();$('#output').addClass('text');showDivs(slideIndex);$('.separator').hide();$(this).hide();$('#dual_button').show();$('.slide').css('height', '100%');$('#render_button').hide();$('.menu_button[type!=\'render\']').show();$(this).hide();$('.present').css('display','');mode='present'">Full Screen</button>

                    <button id="dual_button" type="button" style="width:100%;display:none" class="btn btn-outline-info btn-sm menu_button" type="dual" onclick="$('#left_half').show();$('#info_half').show();$('#left_half').removeClass('compose_half');$('#left_half').addClass('info_half');$('#input_container').hide();$('#right_half').removeClass('page');$('#right_half').removeClass('compose_half');$('#right_half').addClass('dual_half');$('#right_half').show();$('.slide').show();$('.slide').removeAttr('style');$('#controls').hide();$('#output').removeClass('text');$('#output').addClass('output_dual');$('.separator').show();$('#output_icon_container').show();$('#present_button').show();console.log('SLIDEINDEX: ' + slideIndex);$('#output').scrollTo($('#s' + slideIndex));$('#s' + slideIndex).click();$('.slide').css('height', 'auto');$('.slide_number').hide();$('#render_button').show();$('#render_button').hide();$('.menu_button').show();$(this).hide();$('.present').hide();mode='dual'">Dual</button>

                    <button id="compose_button" type="button" style="width:100%;" class="btn btn-outline-info btn-sm menu_button"  type="compose" onclick="$('#left_half').removeClass('info_half').addClass('compose_half');$('#info_half').hide();$('#left_half').show();$('#input_container').show();$('#right_half').removeClass('page');$('#right_half').removeClass('dual_half');$('#right_half').addClass('right').addClass('compose_half');$('.slide').show();$('.slide').removeAttr('style');$('#controls').hide();$('#output').removeClass('text');$('.separator').show();$('#output_icon_container').show();$('#present_button').show();$('#output').scrollTo($('#s' + slideIndex));$('.slide').css('height', 'auto');$('.slide_number').hide();$('#render_button').show();$('.menu_button[type!=\'compose\']').show();$(this).hide();$('.present').hide();mode='compose'">Compose</button>

                    <button id="render_button" class="btn btn-outline-info btn-sm submenu_button" type="render" onclick="displayResult(generateXML());"  style="display:none">Render</button>


                    <button id='hide' class="btn btn-outline-info btn-sm menu_button" data-toggle="button" aria-pressed="true" onclick="hide(!$(this).hasClass('active'));">Half</button>

                    <a class="dropdown-item" onclick="resizeFont(1);">
                        <button class="btn btn-outline-info btn-sm menu_button" >Font &#xff0b;</button>
                    </a>

                    <a class="dropdown-item"  onclick="resizeFont(-1);">
                        <button class="btn btn-outline-info btn-sm menu_button" >Font &#xff0d;</button>
                    </a>

                    <button id="uncollapse_button" class="btn btn-outline-info btn-sm menu_button" onclick="collapseToggle();">Uncollapse</button>

                    <a class="dropdown-item">
                        <input id="edit_box" type="checkbox" style="display:none" onchange="" />
                        <button type="button" id="edit_button" style="width:100%" class="btn btn-outline-info btn-sm submenu_button"  onclick="var box = document.getElementById('edit_box'); box.checked = !box.checked;showTypeset(box.checked);">Edit</button>
                        <input id="source_box" type="checkbox" style="display:none;" onchange="" />
                        <button id="source_button" style="display:none" type="button"  class="btn btn-outline-danger btn-sm submenu_button" disabled="true" data-toggle="modal" data-target="wb_modal" onclick="$('#wb_modal').modal('toggle');showXML();">Source
                        </button>
                        <button id="wb_button" style="display:none;" class="btn btn-outline-info btn-sm submenu_button" onclick="commitWb();">Commit Wb</button>
                    </a>
                </div>
                <br/>
            </div>
            <div id="cover_half" onclick="unhide();$('#hide').button('toggle')"></div>
            <!-- <div id="cover_half" onclick="$('#hide').click()"></div> -->
            <div id='controls' style="display:none">
                <a id='left_button' href='javascript:void(0)' style='font-size:2em;position:fixed;top:45%;left:5%;color:SteelBlue' onclick='plusDivs(-1)'>&#x276e;</a>
                <a id='right_button' href='javascript:void(0)' style='font-size:2em;position:fixed;top:45%;right:5%;color:SteelBlue' onclick='plusDivs(1)'>&#x276f;</a>

                <a href='javascript:void(0)' id='unhide' style='position:fixed;top:5em;right:2%;color:#428bc1;display:none' onclick='unhide()'>Full Screen</a>
            </div>
            </div>
        </div>
    </div>

    <!-- Wb item modal -->
    <div id="item_modal" class="modal"  tabindex="-1" role="dialog" aria-labelledby="share_item" aria-hidden="true">
        <div class="modal-dialog" role="document" >
            <div class="modal-content">
                <div class="modal-header" >
                    <a id="item_modal_link" href="" target="_blank">
                        <h5 class="modal-title notkw"  id="share_item">
                            <span id='modal_title'></span>
                        </h5>
                    </a>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" >&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <b>URL</b>
                    <br><textarea id="share_url" class="share_text"  onclick="this.select()" readonly="readonly"></textarea>
                    <p><br></p>
                    <b class=notkw>HTML Hyperlink</b><br>
                    <textarea id="share_hyperlink" class="share_text"  onclick="this.select()" readonly="readonly"><a href="" target="_blank" title=""></a></textarea>
                    <p><br></p>
                    <b class=notkw>$\LaTeX$ Hyperref</b><br>
                    <textarea id="share_hyperref" class="share_text"  onclick="this.select()" readonly="readonly"></textarea>

                    <span id='modal_keywords'>
                    </span>
                </div>
                <div class="modal-footer">
                    <div id="logo-box" class="pull-left">
                        <a class="pull-left" href="http://www.math.cuhk.edu.hk" title="Home" target="_blank">
                            <img class="img-responsive exempt" style="height:5em;width:auto" src="http://www.math.cuhk.edu.hk/sites/all/themes/math/img/theme/math-logo.png">
                        </a>
                        <a class="pull-left hidden-xs" href="http://www.cuhk.edu.hk" title="The Chinese University of Hong Kong" target="_blank">
                            <img class="exempt" style="height:5em;width:auto" src="http://www.math.cuhk.edu.hk/sites/all/themes/math/img/theme/cuhk-logo.png">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Wb code window -->
    <div id="wb_modal" class="modal" tabindex="-1" role="dialog" aria-labelledby="wb_source" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="dialog" >
        <div class="modal-content">
    	<div class="modal-header">
    	  <h5 class="modal-title notkw" id="wb_source">Elephas XML</h5>
    	  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    	    <span aria-hidden="true">&times;</span>
    	  </button>
    	</div>
    	<div class="modal-body"  >
    	  <textarea id="source_text"  name="content" ></textarea>
    	</div>
    	<div class="modal-footer">
            <button class="btn btn-outline-info btn-sm" onclick="showWb();">Wb Code</button>
    	</div>
        </div>
      </div>
    </div>

    <script id="xml" type="text">
    <?php
    if(isset($_GET['xml'])) {
        $xml_str =  file_get_contents($_GET['xml']);
        // $xml_str = preg_replace('/<(\w+(\s+.*?)*)>/', 'BEGINTAG$1ENDTAG', $xml_str);
        // $xml_str = preg_replace('/<(\/\w+)>/', 'BEGINTAG$1ENDTAG', $xml_str);
        // $xml_str = str_replace("<", "&lt;", $xml_str);
        // $xml_str = str_replace(">", "&gt;", $xml_str);
        // $xml_str = preg_replace('/TAG(\w+)ENDTAG/', '<{$1}>', $xml_str);
        echo $xml_str;
    }
    ?>
    </script>
    <?php if(isset($_GET['wb'])) { ?>
        <script type="text/javascript">
        generateXML();
        // $('#render_button').click();
        </script>
    <?php } ?>
    <?php //if(isset($_GET['xml'])) { ?>
        <script type="text/javascript">
        xml_str = $('#xml').html();
        xml_str = xml_str.replace(/BEGINTAG/g,'<').replace(/ENDTAG/g, '>');
        console.log('XML_STR FROM DIV');
        console.log(xml_str);
        var oParser = new DOMParser();
        var oDom = oParser.parseFromString(xml_str, "application/xml");

        <?php if(isset($_GET['query'])) { ?>
            var queries = oDom.evaluate("<?php echo $_GET['query'];?>", oDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            var queryDom = document.implementation.createDocument("", "", null);
            var bare = queryDom.createElement("bare");

            for ( var i = 0 ; i < queries.snapshotLength; i++ ) {
                console.log('QUERY RESULT: ' + queries.snapshotItem(i).textContent);
                var linebreak = queryDom.createElement("linebreak");
                bare.appendChild(linebreak);
                bare.appendChild(queries.snapshotItem(i));
            }
            // slides.appendChild(slide);
            // queryDom.appendChild(slides);
            queryDom.appendChild(bare);
            displayResult(queryDom);
            <?php } else { ?>
                displayResult(oDom);
                <?php } ?>
        </script>
    <?php //} ?>
    <script type="text/javascript">
    $('#menu_container .dropdown-item').on({
        "click":function(e){
    	e.stopPropagation();
        }
    });
    </script>

</body>
</html>
