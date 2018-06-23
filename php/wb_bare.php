<!--luther-->
<?php
include 'elephas.php';

$url = $_SERVER['HTTP_HOST'];
preg_match('/(?P<userdir>.*?)\/(?P<wb>\w+.php|\w+|)\?(.*?)/', $_SERVER['REQUEST_URI'], $matches);
$root_url = "http://".$url.$matches['userdir'];
$url_text = '';
$canon_url = '';

$wb = "/".$matches['wb'];
$args="";


$content = '';

if (isset($_POST['content'])) {
  $_SESSION['content'] = $_POST['content'];
  $_SESSION['destination'] = 'preview';
}

if (isset($_GET['content'])) {
  $_SESSION['content'] = $_GET['content'];
  $content = $_SESSION['content'];
  $url_text = "$root_url$wb?content=$content";
  $canon_url = $url_text;
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

if (isset($_GET['slide'])) {
  $slide = $_GET['slide'];
  $canon_url .= "&slide=$slide&offline=0";
}
else
  $slide = "";

$source = preparse($source_orig);

$slides = new slides($source);

$xml =  $slides->get_xml();

$dom = new DOMDocument();
$dom->loadXML($xml);

$xsl_doc = new DOMDocument();
$xsl_doc->load("wb.xsl");

// Proc
$proc = new XSLTProcessor();
$proc->importStylesheet($xsl_doc);
$newdom = $proc->transformToDoc($dom);

echo $newdom->saveXML();
// $html = $slides->get_html();
// echo $html;

?>

<script>
var colchar = "▽";
var expchar = "►";

$('.knowl-content .collapsea').click(function() {
    if ($(this).hasClass('collapsed')) {
        $(this).removeClass('collapsed')
    } else {
        $(this).addClass('collapsed');
    }
    this.text = $(this).hasClass('collapsed') ? expchar : colchar;
});

$('.knowl-content').find('.collapsea').each(function() {
    if ($(this).hasClass('collapsed')) {
        $(this).click();
    }
});
$('.knowl-content').find('.collapsed').removeClass('collapsed');
</script>

<!--/luther-->
