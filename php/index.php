<?php

session_start();

include 'elephas.php';

$content = '';

if (isset($_POST['content'])) {
    $_SESSION['content'] = $_POST['content'];
    $_SESSION['destination'] = 'preview';
}

if (!isset($_GET['xml'])) {
    if (isset($_GET['content'])) {
        $_SESSION['content'] = $_GET['content'];
        $content = $_SESSION['content'];
        $source_orig =  file_get_contents($content);
    } else if (isset($_SESSION['content'])) {
        $source_orig = $_SESSION['content'];
        if (!empty($_POST['action'])) {
            if ($_POST['action'] == 'Save') {
                $_SESSION['filename'] = $_POST['filename'];
                $_SESSION['content'] = $_POST['content'];
                $_SESSION['action'] = $_POST['action'];
                header('Location: save.php');
                return 0;
            }
        }
    } else {
        $content = $_SESSION['content'];
        $source_orig =  file_get_contents($content);
    }
    $source = preparse($source_orig);

    $slides = new slides($source);
    $xml =  $slides->get_xml();
} else {
    $xml = file_get_contents($_GET['xml']);
}

if (isset($_GET['xmlonly'])) {
    echo "<xmp>".$slides->get_xml()."</xmp>";
    return 1;
} else {

    if(isset($_GET['query'])) {

        $dom = new DOMDocument();
        $dom->loadXML($xml);
        $xpath = new DOMXpath($dom);

        $query_dom = new DOMDocument('1.0');
        $slides = $query_dom->createElement("slides");
        $query_dom->appendChild($slides);
        $slide = $query_dom->createElement("slide");
        $slide->setAttribute("id", "s0");
        $slide->setAttribute("slide", "0");
        $slides->appendChild($slide);
        $entries = $xpath->query($_GET['query']);
        foreach ($entries as $entry) {
            $slide->appendChild($slide->ownerDocument->importNode($entry, true));
        }

        $xml = $query_dom->saveXML();
    }

    $xsl_doc = new DOMDocument('2.0');
    $xsl_doc->load("wb.xsl");

    $dom = new DOMDocument('2.0');
    $dom->loadXML($xml);

    $xml = $dom->saveXML();

    $dom->loadXML($xml);

    // Proc
    $proc = new XSLTProcessor();
    $proc->importStylesheet($xsl_doc);
    $newdom = $proc->transformToDoc($dom);

}

?>

<html>
<head>


    <meta property="fb:admins" content="100019319597454"/>
    <meta property="og:type" content="website" />
    <meta property="og:image" content="http://www.math.cuhk.edu.hk/sites/all/themes/math/img/theme/math-logo.png" />

    <script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.min.js" integrity="sha384-Plbmg8JY28KFelvJVai01l8WyZzrYWG825m+cZ0eDDS1f7d/js6ikvy1+X+guPIB" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.js" integrity="sha256-WZhItMKyEJQarLzuYWKmNplzBgqEKvlAedjRsChG3JA=" crossorigin="anonymous"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.19/marked.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML"></script>

    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        skipStartupTypeset: true,
        tex2jax: {
            inlineMath: [['$','$'], ['\\(','\\)']],
            processEnvironments: true,
            processEscapes: true,
            ignoreClass: "tex2jax_ignore"
        },
        TeX: {equationNumbers: {autoNumber: "ams"}}
    });
</script>

<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.js" integrity="sha256-WZhItMKyEJQarLzuYWKmNplzBgqEKvlAedjRsChG3JA=" crossorigin="anonymous"></script>
<script type="text/javascript" src="showdown-table.js"></script> -->

<link rel="stylesheet" href="styles.css" media="all">
<link rel="stylesheet" href="slider.css" media="all">



<link href="js/knowlstyle.css" rel="stylesheet" type="text/css" />
<script src="js/Base64.js" type="text/javascript"></script>
<script src="js/knowl.js" type="text/javascript" ></script>

</head>

<body>
    <?php
    if(isset($_GET['offline'])) {
        if ($_GET['offline'] == 0) {
            echo "
            <div id=\"fb-root\"></div>
            <script>(function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = \"//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9\";
                fjs.parentNode.insertBefore(js, fjs);
            } (document, 'script', 'facebook-jssdk'));</script>";
        }
    }

    ?>
    <!-- title --><div id='title'></div>

    <div id="preamble" >
        <?php echo file_get_contents("preamble.html"); ?>
        <script>MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('preamble')]);</script>
    </div>
    <div id='page' class='page'>
        <div id='text' class='text'>


            <?php
            // echo $slides->get_html();

            echo $newdom->saveXML();
            ?>
        </div>

    </div>

    <div id="xml" style="display:none">
        <?php
        echo $xml;
        ?>
    </div>
    <script type="text/javascript">
    console.log($('#xml').html());
    </script>

    <div id="cover_half" onclick="unhide();$('#hide').button('toggle')">
    </div>
    <div id='controls'>
        <a id='left_button' href='javascript:void(0)' style='font-size:2em;position:fixed;top:45%;left:5%;color:SteelBlue' onclick='plusDivs(-1)'>&#x276e;</a>
        <a id='right_button' href='javascript:void(0)' style='font-size:2em;position:fixed;top:45%;right:5%;color:SteelBlue' onclick='plusDivs(1)'>&#x276f;</a>

        <a href='javascript:void(0)' id='unhide' style='position:fixed;top:5em;right:2%;color:#428bc1;display:none' onclick='unhide()'>Full Screen</a>
    </div>

    <script type="text/javascript">
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });
    </script>

    <div id="index_bar" >
        <div id="slider_container" >
            <input id="index_slider"  type="range" min="0" max="
            <?php
            // echo ($slides->get_num_slides() - 1);
            ?>
            "
            value="0" step="0.25" oninput="document.getElementById('page').scrollTo(((this.value)/($('.slide').length - 1))*($('#text').width()), 0);"/>
            <script>$('#index_slider').attr('max', $('.slide').length - 1);</script>
        </div>
    </div>
    <div id="menu_container" class="dropdown" >
        <button id="test_button" class="btn btn-outline-info btn-xs dropdown-toggle"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">&#9776;</button>
        <div id="main_menu" class="dropdown-menu" aria-labelledby="test_button" >
            <button id='hide' class="btn btn-outline-info btn-sm menu_button" data-toggle="button" aria-pressed="true" onclick="hide(!$(this).hasClass('active'));">Half</button>
            <a class="dropdown-item" onclick="resizeFont(1);"><button class="btn btn-outline-info btn-sm menu_button" >Font &#xff0b;</button></a>
            <a class="dropdown-item"  onclick="resizeFont(-1);"><button class="btn btn-outline-info btn-sm menu_button">Font &#xff0d;</button></a>
            <a class="dropdown">
                <button type="button" id="toc" onclick="$('#toc_modal').modal('toggle');$('.modal-backdrop').removeClass('modal-backdrop');" class="btn btn-outline-info btn-xs menu_button">TOC</button>
            </a>

            <button id="uncollapse_button" class="btn btn-outline-info btn-sm menu_button" onclick="collapseToggle();">Uncollapse</button>
            <button class="btn btn-outline-info btn-sm menu_button active"
            <?php
            if (!isset($_GET['offline']))
            echo "style=\"display:none\"";
            ?>
            " data-toggle="button" aria-pressed="true" onclick="$('.fb-like').toggle();$('.comments_button').toggle();">Social</button>
            <a class="dropdown-item">
                <input id="edit_box" type="checkbox" style="display:none" onchange="" />
                <button type="button" id="edit_button" style="width:100%" class="btn btn-outline-info btn-sm menu_button"  onclick="var box = document.getElementById('edit_box'); box.checked = !box.checked;showTypeset(box.checked);">Edit</button>
                <input id="source_box" type="checkbox" style="display:none;" onchange="" />
                <button id="source_button" style="display:none" type="button"  class="btn btn-outline-danger btn-sm menu_button" disabled="true" data-toggle="modal" data-target="wb_modal" onclick="$('#wb_modal').modal('toggle');editText();">Source
                </button>
            </a>
            <a class="dropdown-item">
                <button id="showall_button" type="button" class="btn btn-outline-info btn-sm menu_button" aria-pressed="true" onclick="showAll(true);$('#index_bar').show();$('#render_button').css('display', 'block');">All</button>
                <button id="render_button" style="display:none;" type="button"  class="btn btn-outline-danger btn-sm menu_button"  onclick="MathJax.Hub.Queue(['Typeset',MathJax.Hub]);$('img').each(function(){if ($(this).attr('src') != $(this).attr('data-src')) {$(this).attr('src', $(this).attr('data-src'));}});">Render
                </button>
            </a>
            <a class="dropdown-item" href="<?php echo $url_text;?>&print=1" target="_blank"><button class="btn btn-outline-info btn-sm menu_button" >Print</button></a>
            <?php if ($_SESSION['authenticated']) { ?>
                <a class="dropdown-item" href="logout.php"><button class="btn btn-outline-secondary btn-sm menu_button">Logout<br><?php echo $_SESSION['username'] ?></button></a>
            <?php } ?>
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
                    <textarea id="share_hyperlink" class="share_text"  onclick="this.select()" readonly="readonly"><a href="$root_url$wb?content=$content&uncollapse=1&slide=$slide_id$args#item$item" target="_blank" title="Course: $this->course">$item_type ".$chapterdot.$item."</a></textarea>
                    <p><br></p>
                    <b class=notkw>$\LaTeX$ Hyperref</b><br>
                    <textarea id="share_hyperref" class="share_text"  onclick="this.select()" readonly="readonly">\\href{".$root_url.$wb."?content=$content&uncollapse=1&slide=$slide_id$args\\#item$item}{".$item_type." ".$chapterdot.$item."}</textarea>

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
    <form action="index.php?course=Preview" target="_blank" method="post" enctype="multipart/form-data" class="form-inline" id="preview_form" >
        <div id="wb_modal" class="modal" tabindex="-1" role="dialog" aria-labelledby="wb_source" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="dialog" >
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title notkw" id="wb_source">Wb Source</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body"  >
                        <textarea id="source_text"  name="content" ></textarea>
                    </div>
                    <div class="modal-footer">
                        <?php if ($_SESSION['authenticated']) { ?>
                            <input value="<?php echo $content; ?>" name="filename" type="hidden">
                            <input id="save_button" value="Save" name="action" type="submit" class="btn btn-outline-danger btn-sm" style="display:none">
                        <?php } ?>
                        <input id="preview_button" value="Preview" name="action" type="submit" class="btn btn-outline-info btn-sm">
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div id="toc_modal" class="modal toc_modal tex2jax_ignore" tabindex="-1" role="dialog" aria-labelledby="toc_title" aria-hidden="true" >
        <div class="modal-dialog" role="dialog" >
            <div class="modal-content" >
                <div class="modal-header" >
                    <h5 class="modal-title notkw" id="toc_title" >TOC</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" >
                    <table class="table table-hover table-striped" >
                        <?php
                        // echo $slides->get_summaries();
                        ?>
                    </table>
                </div>
            </div>
        </div>
    </div>

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

                    <iframe id="ww_iframe" FRAMEBORDER=0  style="width:100%;height:100%;padding:0em;overflow:auto;display:none" src=''></iframe>
                </div>
                <div id="ww_footer" class="modal-footer">
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="slideshow.js" />
    <script type="text/javascript">showDivs(1);</script>


</body>
<?php
if (isset($_GET['slide']) ) {
    $slide = $_GET['slide'];
    echo  "<script>slideIndex = $slide;showDivs(slideIndex);</script>";
} else {
    if (!isset($_GET['print'])) {
        echo "<script>showDivs(1);</script>";
    } else {
        if ($_GET['print'] == 1)
        echo "<script>var hover = false; print(hover);</script>";
    }
}
include('postprocess.php');
?>

</html>
