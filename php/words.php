<?php

$stopwords = explode(PHP_EOL, file_get_contents('stopwords.txt'));

function single($word) {
   $single = new Inflect();
   return $single->singularize($word);
}

function extractKeyWords($string, $limit, $stopwords, $threshold) {

  mb_internal_encoding('UTF-8');

  $string = preg_replace('/[\pP]/u', '', trim(preg_replace('/\s\s+/iu', ' ', mb_strtolower($string))));

  $total = str_word_count($string);

  $matchWords = array_filter(explode(' ',$string) , function ($item) use ($stopwords) { return !($item == '' || in_array($item, $stopwords) || mb_strlen($item) <= 2 || is_numeric($item));});
  $wordCountArr = array_count_values($matchWords);

  $filtered = array_filter($wordCountArr, function($value) use($threshold, $total) {return (($value/$total >= $threshold) && ($value > 2));});
  if (count($filtered) < $limit)
    $limit = count($filtered);

  $sliced_array = array_slice($filtered, 0, $limit);
  $max = max($sliced_array);
  $html_array = array_map( function($key, $n) use($max){return "<span style=\"color:hsla(0,0%,0%,".(round(10*$n/$max)/10).");font-size:".min(round(20*($n/$max))/10, 1.2)."em\"><i>".$key."</i></span>&nbsp;";}, array_keys($sliced_array), $sliced_array);

  return $html_array;

}

function wordpool($source_string) {

  global $stopwords;

//  $stopwords = array('i','a','about','an','and','are','as','at','be','by','com','de','en','for','from','how','in','is','it','la','of','on','or','that','the','this','to','was','what','when','where','who','will','with','und','the','www', 'student', 'students', 'some', 'certain', 'various', 'which', 'has', 'have', 'mathematics', 'all', 'such', 'operation', 'respect', 'not', 'let', 'it', 'its', 'since', 'itself', 'every', 'set', 'clear', 'definition', 'claim', 'each', 'note', 'either', 'there', 'hence', 'say', 'following', 'under', 'unique', 'exists', 'exist', 'consider', 'then', 'notation', 'can', 'any', 'resp', 'show', 'both', 'prove', 'rule', 'applying', 'between', 'correspond', 'theorem', 'thi', 'write', 'follows', 'time', 'but', 'suppose', 'other', 'words', 'over', 'because', 'may', 'part', 'define', 'equal', 'denote', 'imply', 'implies', 'defined', 'exercise', 'satisfy', 'only', 'two', 'called', 'than', 'particular', 'proof', 'previous', 'must', 'above', 'usual', 'take', 'result', 'hold', 'holds', 'also', 'clas', 'given', 'let', 'follows', 'same', 'first', 'now', 'seen', 'case', 'existence', 'follow', 'lemma', 'written', 'distinct', 'contradiction', 'step', 'side', 'one', 'assume', 'conclude', 'establish', 'want', 'hypothesis', 'solution', 'word', 'find', 'necessarily', 'equipped', 'here', 'clearly', 'need', 'more', 'contain', 'observe', 'most', 'example');

  mb_internal_encoding('UTF-8');

  // $text = strip_tags(implode(' ', $source));
  $text = strip_tags($source_string);
  $text = preg_replace('/(\\\\\[(.*?)\\\\\])|(\\\\begin{.*?}(.*?)\\\\end{.*?})|(\$.*?\$)|((\\\\|@)\w+({.*?})*)|(#\w+)|(\\\\\w+)|([\.,])/si', '', $text);

  $string = implode(' ', array_map("single", explode(' ', $text)));

  $string = preg_replace('/[\pP]/u', '', trim(preg_replace('/\s\s+/iu', ' ', mb_strtolower($string))));
  $string = trim(preg_replace('/\s\s+/iu', ' ', mb_strtolower($string)));

  $matchWords = array_filter(explode(' ',$string) , function ($item) use ($stopwords) { return !($item == '' || in_array($item, $stopwords) || mb_strlen($item) <= 2 || is_numeric($item));});
  return implode(' ', $matchWords);
  }

function word_count($source) {

  $threshold = 0.007;

  $text = strip_tags(implode(' ', $source));
  $text = preg_replace('/(\\\\\[(.*?)\\\\\])|(\\\\begin{.*?}(.*?)\\\\end{.*?})|(\$.*?\$)|(@\w+)|(#\w+)|(\\\\\w+)|((\\\\|#)(label|ref){.*?})/si', ' ', $text);

  $text = implode(' ', array_map("single", explode(' ', $text)));

  $word_array = extractKeyWords($text, 20, $stopwords, $threshold);

  $text = implode(' ', $source);
  $text = preg_replace('/<!--.*?-->/s', '', $text);

  preg_match_all('/<(b|(h[5]))>\s*(?P<word>(?!(Exercise|Terminology|Notation|Definition|Example\s*|Solution|Answer|Proof|Remark|Sketch|Note|\$|Optional|DOES)).*?)\.*\s*<\/(b|(h[5]))>/', $text, $matches, PREG_PATTERN_ORDER);
  //    print_r($matches['word']);

  $lc_words = array_map(function($w) {return ucwords($w);}, $matches['word']);


  $bold_array = array_map( function($word) {return "<button class=\"btn btn-outline-info btn-sm\" style=\"margin-top:5px\">$word</button>";}, array_unique($lc_words));

  return "<b style=\"padding-right:1em;font-size:0.8em;\">Keywords:</b> ".implode(' ', $bold_array)."<hr><b style=\"padding-right:1em;font-size:0.8em;\">Frequently Occurring: </b>".implode(' ', $word_array);
}


?>
