#!/opt/local/bin/php
<?php
include 'elephas.php';

$content = $argv[1];

$source_orig =  file_get_contents($content);
$source = preparse($source_orig);

$slides = new slides($source);
echo $slides->get_html()."\n";

?>
