<?php
include 'elephas.php';
if (isset($_GET['xml'])) {
    $xml =  file_get_contents($_GET['xml']);
} elseif (isset($_GET['wb'])) {
    $source_orig = file_get_contents($_GET['wb']);
    $source = preparse($source_orig);
    $slides = new slides($source);
    $xml =  $slides->get_xml();
}
$dom = new DOMDocument();
$dom->loadXML($xml);

$xpath = new DOMXpath($dom);
$query_dom = new DOMDocument('1.0');
$bare = $query_dom->createElement("bare");
$query_dom->appendChild($bare);
// $slide = $query_dom->createElement("slide");
// $slide->setAttribute("id", "s0");
// $slide->setAttribute("slide", "0");
// $slides->appendChild($slide);
$entries = $xpath->query($_GET['query']);
foreach ($entries as $entry) {
    $linebreak = $query_dom->createElement("linebreak");
    $bare->appendChild($bare->ownerDocument->importNode($linebreak, true));
    $bare->appendChild($bare->ownerDocument->importNode($entry, true));
}

$xsl_doc = new DOMDocument();
$xsl_doc->load("wb.xsl");

// Proc
$proc = new XSLTProcessor();
$proc->importStylesheet($xsl_doc);
$newdom = $proc->transformToDoc($query_dom);

//$xsl_doc = new DOMDocument();
//$xsl_doc->load("wb.xsl");
//$proc = new XSLTProcessor();
//$proc->importStylesheet($xsl_doc);
//$newdom = $proc->transformToDoc($newdom);

$output = $newdom->saveXML();
$output = preg_replace('/\\\\label\{.*?\}/', '', $output);
echo $output;

?>

<script type="text/javascript">
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
$('.knowl-content').find('blockquote').css('border', 'none');

</script>
