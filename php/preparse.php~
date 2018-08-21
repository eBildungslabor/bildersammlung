<?php
function preparse($source_orig) {

  $info_str = "";

  $chap = "";

  if (preg_match('/@course{(?P<course>.*?)}/', $source_orig, $hits))
    $info_str .= "#course{".$hits['course']."}";
  if (preg_match('/@week{(?P<chapter>.*?)}/', $source_orig, $hits)) {
    $info_str .= "\n#week{".$hits['chapter']."}";
    $chap = $hits['chapter'];
  }
  if (preg_match('/@lecture{(?P<chapter>.*?)}/', $source_orig, $hits)) {
    $info_str .= "\n#lecture{".$hits['chapter']."}";
    $chap = $hits['chapter'];
  }
  if (preg_match('/@topic{(?P<topic>.*?)}/', $source_orig, $hits)) {
      $info_str .= "\n#topic{".$hits['topic']."}";
  }
  $source_str = $info_str."\n".$source_orig;

  // $source_str = preg_replace('/\<b\s*\>/', "<b class=\"chapter chapter$chap\">", $source_str);

  $source_str = preg_replace('/\<a href=\"(.*?\/wb)\/\?content=(.*?week(\d+).wb).*?item(\d+)\" target="_blank" (title=\".*?\")\>(.*?)\<\/a\>/', '<a knowl="wb_bare.php?content=$2&uncollapse=1&knowl=$3.$4" $5 href>$6</a>', $source_str);

  $source_str = preg_replace('/#((?!course|week|lecture|topic|wordpool)\w+){(.*?)}/s', '@$1{$2}', $source_str);
  // $source_str = preg_replace('/(\n\n|\r\r|\r\n\r\n|(<p>(\r)*\n))@col/', "\n@linebreak\n@col", $source_str);
  // $source_str = preg_replace('/(\n\n|\r\r|\r\n\r\n|(<p>(\r)*\n))@newcol/', "\n@linebreak\n@newcol", $source_str);

  //$source_str = preg_replace("/\n\s*\n/", "\n", $source_str);
  $source_str = preg_replace("/\n\s*\n/", "\n@linebreak\n", $source_str);
  //$source_str = preg_replace('/(\n\n|\r\r|\r\n\r\n)/', "\n@linebreak\n", $source_str);
  // echo $source_str;

  $source_str = preg_replace("/\<((?!script).(?!exempt)*?)\s+src=(.*?)\>/", '<$1 adjusted data-src=$2>', $source_str);
  //$source_str = preg_replace("/@ref{(.*?)}/", '<br><ref label="$1">', $source_str);
  // preg_match_all('/@nstep\{((?:[^{}]++|\{(?1)\})++)\}|(@((?!nstep)\w+){.*?}(?:\.|,|;|))|(#((?!nstep)\w+){.*?}(?:\.|,|;|))|(@(\w+){(?:.)*})|(\S+|\n)/s', $source_str, $matches);
  preg_match_all('/@nstep\{((?:[^{}]++|\{(?1)\})++)\}|((?:\s*\()@ref{.*?}(((?!\s).)*?))|(@((?!nstep)\w+){.*?}(?:\.|\)|,|;|))|(\s*\S+\s*|\n)/s', $source_str, $matches);

  $source = $matches[0];

  $source1 = [];

  foreach ($source as $word) {
    if (preg_match('/@include{(?P<wb>.*?)}/', $word, $hits)) {
      array_push($source1, "<!--include ".$hits['wb']."-->\n");
      $aux_array = preparse(file_get_contents($hits['wb']));
    //  array_push($aux_array, "\n"."#wordpool{".wordpool($aux_array)."}"); //TEMP
      $source1 = array_merge($source1, $aux_array);
    }  else
      array_push($source1, $word);
  }
  // array_unshift($source1, "\n"."#wordpool{".wordpool($source1)."}");
  // array_push($source1, "\n"."#wordpool{".wordpool($source1)."}"); //TEMP COMMENT
  return $source1;

}

?>
