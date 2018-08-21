<?php
$root_url = '';
$canon_url = '';
$content = '';
$wb = '';


$url = $_SERVER['HTTP_HOST'];
preg_match('/(?P<userdir>.*?)\/(?P<wb>\w+.php|\w+|)\?(.*?)/', $_SERVER['REQUEST_URI'], $matches);

if(isset($matches['userdir'])) {
    $root_url = "https://".$url.$matches['userdir']."/";
} else {
    $root_url = "";
}
?>

<html xml:lang="en" lang="en" xmlns="http:/www.w3.org/1999/xhtml">
<base root="<?php echo $root_url;?>" url="<?php echo $_SERVER['REQUEST_URI'];?>" xml-src="<?php if(isset($_GET['xml'])) {echo $_GET['xml'];} ?>" wb-src="<?php if(isset($_GET['wb'])) {echo $_GET['wb'];} ?>" slide="<?php if(isset($_GET['slide'])) {echo $_GET['slide'];} else {echo "1";} ?>" present="<?php if(isset($_GET['present'])) {echo '1';} else {echo '0';} ?>">
<!-- <base href="https://localhost/~pschan-math/elephas/client/"> -->
<title>
    Department of Mathematics, The Chinese University of Hong Kong
</title>
<head>
    <meta charset="UTF-8"/>
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.4/css/bootstrap.min.css" integrity="2hfp1SzUoho7/TsGGGDaFdsuuDL0LX2hnUp6VkX3CUQ2K4K+xjboZdsXyp4oUHZj" crossorigin="anonymous"> -->
    <link rel="stylesheet" href="js/bootstrap.min.css" />

    <script src="js/jquery.min.js" ></script>
    <script src="js/tether.min.js" ></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/formatxml.js"></script>
    <script src="js/jquery.scrollTo.min.js"></script>
    <link href="js/knowlstyle.css" rel="stylesheet" type="text/css" />
    <script src="js/Base64.js" type="text/javascript"></script>
    <script src="js/knowl.js" type="text/javascript" ></script>
    <script src="js/knowl.js" type="text/javascript" ></script>
    <script src="js/knowl.js" type="text/javascript" ></script>
    <!-- <script src="js/iframeResizer.contentWindow.js" type="text/javascript"></script>
    <script src="js/ie8.polyfils.min.js" type="text/javascript"></script>
    <script src="js/iframeResizer.min.js" type="text/javascript"></script> -->

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

    <!--    <script type="text/javascript" src="../js/MathJax-2.7.4/MathJax.js?config=TeX-AMS_CHTML"></script>
      -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_CHTML"></script>
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
} elseif (!isset($_GET['xml'])) {
    echo file_get_contents('default.wb');
    $_GET['wb'] = 'default.wb';
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

<body>
    <div id="print">
        <button id="back_icon" style="position:fixed;top:0;left:1%;font-size:2.5em" class="plain_button icon" onclick="$('#print').hide();$('#container').show();$('#print_content').html('');">&#8617;</button>
        <div id="print_content" style="width:auto">
        </div>
    </div>
    <div id="container">
        <div id="left_half" class="left info_half">
            <div id="info_half">
                <div id="info_title" class="title_box"></div>
                <p/>
                <div id="info_keywords"></div>
                <div id="info_statements"></div>
                <p/>
                <hr>
                <div id="slide_info" class=".slide_info" style="display:none">
                    <h5 class="current_slide"></h5>
                    <br/>
                        <div id="slide_keywords"></div>
                    <br/><br/>
                    <b onclick='$(".slide_info.share").show();'>Share</b>
                    <a  class="collapsea collapsed share" contenteditable="false" data-toggle="collapse" aria-expanded="false" aria-controls="slide_info_share" href="#slide_info_share">►
                    </a>
                    <div class="slide_info share collapse" id="slide_info_share" style="">
                        <span>URL</span>
                        <br><textarea class="url share_text"  onclick="this.select()" readonly="readonly"></textarea>
                        <p><br></p>
                        <span>HTML Hyperlink</span><br/>
                        <textarea class="hyperlink share_text"  onclick="this.select()" readonly="readonly"><a href="" target="_blank" title=""></a></textarea>
                        <p><br></p>
                        <span>$\LaTeX$ Hyperref</span><br>
                        <textarea class="hyperref share_text"  onclick="this.select()" readonly="readonly"></textarea>
                        <span id='modal_keywords'>
                        </span>
                    </div>
                </div>
                <div id="info_menu_container">
                    <!-- <button id="compose_icon" onclick="$('#compose_button').click();"></button> -->
                    <input type="image" src="icons/Edit_Notepad_Icon.svg" id="compose_icon" onclick="$('#compose_button').click();"></button>
                </div>
            </div>
            <div id="input_container" style="width:100%;height:100%;border:0;display:none">
                <div id="input" style="margin-right:50px;height:100%;font-size:1.2em;">
                </div>
                <div id="edit_menu_container">
                    <!-- <button id="maximize_icon" class="plain_button icon" onclick="$('#left_half').css('width', '100%');editor.resize();$('#normalize_icon').show();$(this).hide();"></button> -->
                    <input type="image" id="maximize_icon" src="icons/Maximize_Icon.svg" class="plain_button icon" onclick="$('#right_half').hide();$('#left_half').css('width', '100%');editor.resize();$('#normalize_icon').show();$(this).hide();"/>
                    <!-- <button id="normalize_icon"  class="plain_button icon" onclick="$('#left_half').css('width', '');editor.resize();$('#maximize_icon').show();$(this).hide();"></button> -->
                    <input type="image" id="normalize_icon"  src="icons/Normalize_Icon.svg" class="plain_button icon" onclick="$('#right_half').show();$('#left_half').css('width', '');editor.resize();$('#maximize_icon').show();$(this).hide();"/>
                    <br/>
                    <button id="close_icon" class="plain_button icon" onclick="$('#normalize_icon').click();$('#dual_button').click();$('#container').css('overflow-y', '');">&times;</button>
                    <br/>
                    <label for="fileInput">
                        <img id="open_icon" class="exempt icon" src="icons/File_Open.svg"/>
                        <!-- <button id="open_icon" class="plain_button icon"/> -->
                        <input id="fileInput" type="file" onchange="openWb(this);" style="display:none">
                    </label>
                    <!-- <br/>
                    <input type="image" src="icons/Save_Icon.svg" id="save_icon" class="plain_button icon" onclick="saveWb();"/> -->
                    <br/>
                    <button id="save_icon" class="plain_button icon" style="font-weight:normal;font-size:1.5em;text-align:center;" onclick="saveWb();">⬇︎</button>
                    <br/>
                    <button id="render_icon" class="plain_button icon" style="font-weight:normal;font-size:2.5em;text-align:center;" onclick="$('#render_button').click();">↻</button>
                    <br/>
                    <div style="position:absolute;left:0;bottom:2%;width:100%;text-align:center;">
                        <button id="latex_icon" class="plain_button icon" onclick="$('#wb_modal').modal('toggle');showLatex();" style="font-size:small;text-align:center;width:100%">LaTeX</button>
                        <br/>
                        <button id="xml_icon" class="plain_button icon" onclick="$('#wb_modal').modal('toggle');showXML();" style="text-align:center">xml</button>
                    </div>
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
            <div id="output_icon_container">
                <!-- <button id="full_screen_icon" onclick="$('#dual_icon').show();$('#present_button').click()"></button> -->
                <input type="image" src="icons/Maximize_Icon.svg" id="full_screen_icon" class="icon" onclick="$('#present_button').click();"/>
                <!-- <button id="dual_icon" class="plain_button" onclick="$('#dual_button').click();$('#full_screen_icon').show();$(this).hide();"></button> -->
                <input type="image" src="icons/Normalize_Icon.svg" id="dual_icon" class="plain_button icon" onclick="$('#dual_button').click();$('#full_screen_icon').show();$(this).hide();"/>
            </div>
            <div id="menu_container" class="dropdown" >
                <button id="test_button" class="btn btn-outline-info btn-xs dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">&#9776;</button>
                <div id="main_menu" class="dropdown-menu" aria-labelledby="test_button" >
                    <button id="present_button" class="btn btn-outline-info btn-sm menu_button" type="present" onclick="$('#left_half').animate({marginLeft:'-25%'}, 200, 'linear', function() {$('#right_half').removeClass('compose_half').removeClass('dual_half');$('#right_half').addClass('page');$('#left_half').hide();$(this).css('margin-left','0');});$('#controls').show();$('#output').removeClass('output_dual');$('#full_screen_icon').hide();$('#output').addClass('text');$('.separator').hide();$(this).hide();$('#dual_button').show();$('#render_button').hide();$('.menu_button[type!=\'render\']').show();$(this).hide();$('.present').css('display','');$('#dual_icon').show();$('.slide_number').show();mode='present';showDivs(slideIndex);$('#container').css('overflow-y', 'auto');$('.controls').show();">Full Screen</button>

                    <button id="dual_button" type="button" style="width:100%;display:none" class="btn btn-outline-info btn-sm menu_button" type="dual" onclick="$('#left_half').show();$('#info_half').show();$('#left_half').removeClass('compose_half');$('#left_half').addClass('info_half');$('#input_container').hide();$('#right_half').removeClass('page');$('#right_half').removeClass('compose_half');$('#right_half').addClass('dual_half');$('#right_half').show();$('.slide').show();$('.slide').removeAttr('style');$('#controls').hide();$('#output').removeClass('text');$('#output').addClass('output_dual');$('.separator').show();$('#output_icon_container').show();$('#present_button').show();console.log('SLIDEINDEX: ' + slideIndex);$('#output').scrollTo($('#s' + slideIndex));$('#s' + slideIndex).click();$('.slide').css('height', 'auto');$('.slide_number').hide();$('#render_button').show();$('#render_button').hide();$('.menu_button').show();$(this).hide();$('.present').hide();$('body').removeClass('present');$('.controls').hide();$('#container').css('overflow-y', 'hidden');mode='dual'">Dual</button>

                    <button id="compose_button" type="button" style="width:100%;" class="btn btn-outline-info btn-sm menu_button"  type="compose" onclick="$('#left_half').removeClass('info_half').addClass('compose_half');$('#info_half').hide();$('#left_half').show();$('#input_container').show();$('#right_half').removeClass('page');$('#right_half').removeClass('dual_half');$('#right_half').addClass('right').addClass('compose_half');$('.slide').show();$('.slide').removeAttr('style');$('#controls').hide();$('#output').removeClass('text');$('.separator').show();$('#output_icon_container').show();$('#present_button').show();$('#output').scrollTo($('#s' + slideIndex));$('.slide').css('height', 'auto');$('.slide_number').hide();$('#render_button').show();$('.menu_button[type!=\'compose\']').show();$(this).hide();$('.present').hide();mode='compose'">Compose</button>

                    <button id="render_button" class="btn btn-outline-info btn-sm submenu_button" type="render" onclick="displayResult(generateXML());"  style="display:none">Render</button>

                    <!-- <button id="print_button" class="btn btn-outline-info btn-sm submenu_button" type="print" onclick="$('#left_half').hide();$('#right_half').removeClass('dual_half');">Print</button> -->
                    <button id="print_button" class="btn btn-outline-info btn-sm submenu_button" type="print" onclick="print();">Print</button>

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
                        <!-- <button id="source_button" style="display:none" type="button"  class="btn btn-outline-danger btn-sm submenu_button" disabled="true" data-toggle="modal" data-target="wb_modal" onclick="$('#wb_modal').modal('toggle');showXML();">Source
                        </button> -->
                        <button id="wb_button" style="display:none;" class="btn btn-outline-info btn-sm submenu_button" onclick="commitWb();$('#compose_button').click();$('#edit_button').click();">Commit Wb</button>
                    </a>
                </div>
                <br/>
            </div>
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
        </div>
        <div class="present title_box" style="display:none"></div>
        <div class="controls" style='font-size:2em;left:5%;width:auto;color:SteelBlue'>
            <a id='left_button' href='javascript:void(0)' onclick='plusDivs(-1)'>&#x276e;</a>
        </div>
        <div class="controls" style='font-size:2em;right:5%;width:auto;color:SteelBlue'>
            <a id='right_button' href='javascript:void(0)' onclick='plusDivs(1)'>&#x276f;</a>
        </div>
        <a href='javascript:void(0)' id='unhide' style='position:fixed;top:5em;right:2%;color:#428bc1;display:none' onclick='unhide()'>Full Screen</a>
        <div id="cover_half" onclick="unhide();$('#hide').button('toggle')"></div>
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
                        <a class="pull-left" href="https://www.math.cuhk.edu.hk" title="Home" target="_blank">
                            <img class="img-responsive exempt" style="height:5em;width:auto" src="https://www.math.cuhk.edu.hk/sites/all/themes/math/img/theme/math-logo.png">
                        </a>
                        <a class="pull-left hidden-xs" href="https://www.cuhk.edu.hk" title="The Chinese University of Hong Kong" target="_blank">
                            <img class="exempt" style="height:5em;width:auto" src="https://www.math.cuhk.edu.hk/sites/all/themes/math/img/theme/cuhk-logo.png">
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
            <!-- <button class="btn btn-outline-info btn-sm" onclick="showWb();">Wb Code</button> -->
            <button class="btn btn-outline-info btn-sm save" ext="" onclick="saveText($('#source_text').val(),$(this).attr('ext'));">Save</button>
    	</div>
        </div>
      </div>
    </div>

    <!-- WW code window -->
    <div id="ww_modal" class="modal ww_modal" tabindex="-1" aria-labelledby="ww_dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document" >
        <div class="modal-content">
    	<div class="modal-header" >
    	  <h5 class="modal-title notkw" id="ww_dialog" >WeBWork</h5>
    	  <button type="button" class="close" data-dismiss="modal"  aria-label="Close">
    	    <span aria-hidden="true">&times;</span>
    	  </button>
    	</div>
    	<div class="modal-body" >
    	  <div id="ww_window" ></div>
    <!--
    <iframe id="ww_iframe" FRAMEBORDER=0  style="width:100%;height:100%;min-height:400px;max-height:400px;margin-top:1em;overflow:auto;" src=''></iframe>
    -->
    <iframe id="ww_iframe" FRAMEBORDER=0  style="width:100%;height:100%;padding:0em;overflow:auto;display:none" src=''></iframe>
    	</div>
    	<div id="ww_footer" class="modal-footer">
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
        $('#xml').html(generateXML());
        // $('#render_button').click();
        </script>
    <?php } ?>
    <script type="text/javascript">
    var xmlString = $('#xml').html();
    console.log('XMLSTRING FROM XML DIV');
    console.log(xmlString);

    <?php if(isset($_GET['query'])) { ?>
        // var xmlString = xmlString.replace(/xmlns=\"(.*?)\"/g, '');

        var oParser = new DOMParser();
        var oDom = oParser.parseFromString(xmlString, "application/xml");

        console.log('XML DOM');
        console.log(oDom);
        console.log('END XML DOM');

        var queries = oDom.evaluate("<?php echo $_GET['query'];?>", oDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        // var queries = oDom.evaluate("<?php echo $_GET['query'];?>", oDom, function() { return "http://www.w3.org/1999/xhtml";}, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        var queryDom = document.implementation.createDocument("", "", null);
        var bare = queryDom.createElement("bare");

        for ( var i = 0 ; i < queries.snapshotLength; i++ ) {
            console.log('QUERY RESULT: ' + queries.snapshotItem(i).textContent);
            var linebreak = queryDom.createElement("linebreak");
            bare.appendChild(linebreak);
            bare.appendChild(queries.snapshotItem(i));
        }
        queryDom.appendChild(bare);
        var queryResultString = new XMLSerializer().serializeToString(queryDom);
        console.log('QUERY DOM');
        console.log(queryDom);
        console.log('END QUERY DOM');

        displayResult(queryResultString);
        <?php } else { ?>
            displayResult(xmlString);
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
