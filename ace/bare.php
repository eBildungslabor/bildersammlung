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
<base href="<?php echo $root_url;?>" xml-src="<?php if(isset($_GET['xml'])) {echo $_GET['xml'];} ?>" wb-src="<?php if(isset($_GET['wb'])) {echo $_GET['wb'];} ?>" slide="<?php if(isset($_GET['slide'])) {echo $_GET['slide'];} else {echo "1";} ?>" present="<?php if(isset($_GET['present'])) {echo '1';} else {echo '0';} ?>">
<!-- <base href="http://localhost/~pschan-math/elephas/client/"> -->
<head>
    <meta charset="UTF-8">

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

    <script type="text/javascript" src="slideshow_client.js"></script>
    <script type="text/javascript" src="postprocess.js" ></script>
    <script type="text/javascript" src="elephas.js"></script>

    <link rel="stylesheet" href="styles_split.css" media="all">

    <script type="text/javascript" src="../../js/MathJax-2.7.4/MathJax.js?config=TeX-AMS_CHTML"></script>
    <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        skipStartupTypeset: false,
        ignoreClass: "tex2jax_ignore",
        tex2jax: {
            inlineMath: [['$','$'], ['\\(','\\)']],
            processEscapes: true
        },
    });
</script>

<script>
var rootURL = $('base').attr('href');
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

<body style="height:100%;width:100%;margin:auto auto;background-color:#fff;overflow:hidden;padding-top:0%">
    <div id="container" style="width:100%;height:100%;margin:auto auto;overflow:hidden">
        <div id="input_container" style="width:100%;height:100%;border:0;display:none">
            <div id="input" style="width:95%;height:100%;font-size:1.2em;">
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
        <div id='output_bare'></div>
    </div>

    <script id="xml" type="text">
    <?php
    if(isset($_GET['xml'])) {
        $xml_str =  file_get_contents($_GET['xml']);
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
    <script type="text/javascript">
    xml_str = $('#xml').html();
    xml_str = xml_str.replace(/BEGINTAG/g,'<').replace(/ENDTAG/g, '>');
    console.log('QUERY XML_STR');
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
        getBare(queryDom, $('#output_bare'));
        <?php } else { ?>
            getBare(oDom, $('#output_bare'));
            <?php } ?>
            </script>
    <script type="text/javascript">
    $('#menu_container .dropdown-item').on({
        "click":function(e){
    	e.stopPropagation();
        }
    });
    </script>

</body>
</html>
