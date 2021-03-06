<?php
include 'Inflect.php';
include 'words.php';
include 'preparse.php';

class ElephasXMLElement extends SimpleXMLElement {

    public function parentNode() {
        $parent = current($this->xpath('parent::*'));
        if ($parent) {
            return $parent;
        } else {
            return $this;
        }
    }

    public function closeTo($regex) {
        $aux = $this;

        //while(($aux->getName() != $name) && ($aux->getName() != "slides")) {
        while(!preg_match($regex, $aux->getName()) && ($aux->getName() != "slides")) {
            $aux = $aux->parentNode();
        }
        return $aux;
    }

}

class slides {

    public static $expchar = "&#x25ba;";
    public static $colchar = "&#x25bd;";

	var $html;
    var $chapter_type;

	var $chapter;
	var $chapterdot;
	var $chap_attr;
	var $course;
	var $root_url;
	var $chapter_name;
	var $canon_url;
	var $content;
	var $wb;
    var $separator;
    var $showall = false;
    var $item = 1;
    var $slide_id = -1;
    var $knowl_item;
    var $xml;

    var $num_slides;

	var $summaries = [];
	var $summary = "";
    var $wordpools = [];
    var $wordpool = "";

	var $source;
	var $get;
	var $block_start = "<blockquote>";
	var $block_end = "</blockquote>";
	var $first_sep = true;
	var $label_db = array();
    var $main_stack;


    var $data;
    var $steps;
    var $steps_id;
    var $ENV = [
        "@ex"=>"Exercise",
        "@eg"=>"Example",
        "@fact"=>"Fact",
        "@remark"=>"Remark",
        "@def"=>"Definition",
        "@thm"=>"Theorem",
        "@prop"=>"Proposition",
        "@cor"=>"Corollary",
        "@lemma"=>"Lemma",
        "@claim"=>"Claim",
        "@proof"=>"Proof",
        "@sol"=>"Solution",
        "@ans"=>"Answer",
        "@notation"=>"Notation"
    ];
    var $ITEMIZED_ENV = [
        "@ex"=>"Exercise",
        "@eg"=>"Example",
        "@fact"=>"Fact",
        "@remark"=>"Remark",
        "@def"=>"Definition",
        "@thm"=>"Theorem",
        "@prop"=>"Proposition",
        "@cor"=>"Corollary",
        "@lemma"=>"Lemma",
        "@claim"=>"Claim"
    ];

	function __construct($source)  {

		$this->source = $source;
		$this->get = null;

		$this->root_url = '';
		$this->canon_url = '';
		$this->content = '';
		$this->wb = '';


        $url = $_SERVER['HTTP_HOST'];
        preg_match('/(?P<userdir>.*?)\/(?P<wb>\w+.php|\w+|)\?(.*?)/', $_SERVER['REQUEST_URI'], $matches);

        $this->root_url = "http://".$url.$matches['userdir'];
        if (isset($_GET['wb'])) {
            $this->content = $_GET['wb'];
        } elseif (isset($_GET['xml'])) {
            $this->content = $_GET['xml'];
        }

		$showall = false;

		$separator = "<hr>";


		if (isset($get['print'])) {
			$showall = $get['print'] == 1 ? true : false;
			if($showall) {
				$separator = "<center style=\"color:#888;padding-bottom:1em\">. . .<center>";
				$this->block_start = "";
				$this->block_end = "<hr>";
			}
		}

		$this->separator = $separator;
		$this->showall = $showall;

        $chapter_type = "";
		$chapter = "";
		$chapterdot = "";
		$course = "";
        $topic = "";

		if (isset($get['course']) ) {
			$course = $get['course'];
		}
		if (isset($get['week']) ) {
			$chapter = $get['week'];
			// $is_week = true;
            $chapter_type = "Week";
			$chapterdot = $chapter.".";
		}
		if (isset($get['lec']) ) {
			$chapter = $get['lec'];
			// $is_lec = true;
            $chapter_type = "Lecture";
			$chapterdot = $chapter.".";
		}
		if (isset($get['topic']) ) {
			$topic = $get['topic'];
		}
		if (isset($get['slide'])) {
			$this->slide = $get['slide'];
		}

		$this->course = $course;
        $this->chapter_type = $chapter_type;
		// $this->is_week = $is_week;
		// $this->is_lec = $is_lec;
		$this->topic = $topic;
		$this->chapter = $chapter;

        $this->chapter_name = $this->chapter_type." ".$this->chapter;

		$this->chapterdor = $chapterdot;

        $this->steps = 0;
        $this->steps_id = 0;

        if (isset($this->get['knowl'])) {
            //echo "KNOWL ".$this->get['knowl'];
            if(preg_match('/((?P<chapter>\d+)\.)*(?P<item>\d+)/', $this->get['knowl'], $match)) {
                //echo "<br>MATCH KNOWL ".$match['item'];
                $this->knowl_item = $match['item'];
                if (isset($match['chapter'])) {
                    $this->knowl_chapter = $match['chapter'];
                }
            }
        } else {
            $this->known_item = "";
            $this->known_chapter = "";
        }

        //$main_stack = new stack(null);
        $xmlstr = "<slides></slides>";

        //$dom = new DOMDocument( "1.0", "UTF-8" );
        // $xslt = $dom->createProcessingInstruction('xml-stylesheet', 'type="text/xsl" href="wb.xsl"');
        // $top = $dom->appendChild($xslt);

        $this->main_stack = new ElephasXMLElement($xmlstr);
        //$root = simplexml_import_dom($dom);
        //$this->main_stack = $root->addChild("slides");

        // $corpus = "\n<!-- start of text -->\n";
        $corpus = "";
		$corpus .= $this->parser($source);


		$this->html = $corpus;
		$this->num_slides = $this->slide_id;

	}

    function parser($input) {


        $is_comment = 0;
        $current_environment = "";

        $sloppy = false;

        $html = "";

        $source_pos = 0;


        //$main_stack->set_meta_data($meta_data);
        //$this->main_stack = $main_stack;

        if (isset($this->knowl_chapter)) {
            //$main_stack->update_info("@lecture", "@lecture{".$this->knowl_chapter."}");
        }

        $top = $this->main_stack;

        $this->item = 0;
        $this->wordpool = "";
        while ($source_pos < count($input)) { // main parser loop
            $tagname = "";
            $html = "";
            $word = $input[$source_pos];
            //echo "$word\n";
            if (strpos($word,'<!--') !== false) {
                $is_comment = 1;
            }

            if ((strpos($word, '-->') !== false) && ($is_comment == 1)) {
                $is_comment = 0;
            }

            if (str_word_count($this->summary) < 50) {
                $word1 = preg_replace('/<(br|p|\/h\d)>/', ' . ', $word);
                $word1 = preg_replace('/<\/.*?>/', '', $word1);
                $word1 = preg_replace('/\\\\\[|\\\\\]/', '$', $word1);
                if (!preg_match('/(@(label|ref|steps|nstep|keyword)({.*})*)|(\#(course|week|topic))/', $word1))
                $this->summary .= $word1." ";
            }

            if ((preg_match('/(?P<name>(@((?!item)\w+))|(#\w+{.*?}))/', $word, $tag)) && ($is_comment != 1)) { // @#-tagged word

                if (preg_match('/(?P<name>#\w+){.*?}/', $word, $hash_tag)){
                    $tag['name'] = $hash_tag['name'];
                }
                $tagname = $tag['name'];
                if (array_key_exists($tagname, $this->ITEMIZED_ENV)) {
                    $this->item++;
                }
                if (in_array($tagname, array("@lecture", "@week"))) {
                    $this->wordpool = "";
                }

                if (($this->knowl_item == "") || ($this->knowl_item == $this->item)) {
                    $top = $this->stack_writer($tagname, $word, $top);
                    if (($this->knowl_item == $this->item) && ($tagname == "@end")) {
                        break;
                    }
                }
            } elseif (($this->knowl_item == "") || ($this->knowl_item == $this->item)) { // untagged word
                $this->wordpool .= " ".$word;
                //$aux = preg_match("/(\n|\\)|:)/", $word[0]) ? $word : " ".$word;

                if ($word != "\n") {
                    if ($top->getName() != "paragraphs") {
                        $top = $top->addChild("paragraphs");
                    }
                    $top[0] .= $word;
                }
            }

            $source_pos++;
        }

        // $this->set_summary();

        // $this->wordpools[$top->get_meta_data()['chap_attr']] = wordpool($this->wordpool);
        // $top = $top->end_lineage();

        // foreach ($this->wordpools as $chap_attr => $wordpool)
        // $top->append_html("\n<div class=\"wordpool chapter$chap_attr\">$wordpool</div>");

        if(isset($_GET['knowl'])) {
            preg_match('/(?P<chapter>\d+)\.(?P<num>\d+)/', $_GET['knowl'], $matches);
            $chapter = $matches['chapter'];
            $num = $matches['num'];
            $simpleXML = $this->main_stack->xpath("(//statement[@chapter='".$chapter."' and  @num='".$num."'])")[0];
            // $dom = new DOMDocument();
            // $dom->loadXML($simpleXML->asXML());
        } else {
            $simpleXML = $this->main_stack;
            // $dom = dom_import_simplexml($simpleXML)->ownerDocument;
        }


        //print_r($dom);
        // $dom->preserveWhiteSpace = false;
        // $dom->formatOutput = true;
        //
        //
        // $this->xml = $dom->saveXML();
        $this->xml = $simpleXML->asXML();

        $this->xml = preg_replace('/@ref{(.*?)}/', '<ref label="${1}"></ref>', $this->xml); // UGLY complex xml node workaround ...
        $this->xml = preg_replace('/@linebreak/', "<linebreak>linebreak</linebreak>", $this->xml); // UGLY complex xml node workaround ...

        return $this->xml;

        // $xsl_doc = new DOMDocument();
        // $xsl_doc->load("wb.xsl");
        //
        // // Proc
        // $proc = new XSLTProcessor();
        // $proc->importStylesheet($xsl_doc);
        // $newdom = $proc->transformToDoc($dom);
        //
        // return $newdom->saveXML();


        // return $this->main_stack->saveXML();

    } // end of parser function

    function stack_writer($tagname, $word, $top) {
        if (($tagname != "") && ($tagname != "@nstep") && ($tagname != "#nstep")) {
            $html = "\n<!--$tagname-->";
        } else {
            $html = "";
        }

        switch($tagname) {
            case "@sep":
            $this->slide_id++;
            $slide_id = $this->slide_id;
            $prev_slide = $this->slide_id - 1;
            //$meta_data = $top->get_meta_data();
            //$top = $top->add_slide($slide_id);
            // if ($top->getName() != 'slides') {
            //     $top = current($top->xpath("parent::*"));
            // }

            $top = $this->main_stack;
            $top = $top->addChild('slide');
            $top['id'] = "s".$slide_id;
            $top['slide'] = $slide_id;
            // $top->set_meta_data($meta_data);
            if ($this->slide_id > 0) {
                $this->set_summary();
            }
            break;
            case "@newcol":
            case "@col":
            case "@collapse":
            $id = "c".uniqid();
            $parent = $top->parentNode();

            if (($tagname == '@newcol') || (($parent->getName() != 'col') && ($parent->getName() != 'newcol'))) {
                $name = 'newcol';
            }  else {
                $name = 'col';
            }
            // if ($top->getName() == "paragraphs") {
            //     $top = $top->parentNode();
            // }
            $top = $top->addChild($name);
            $top["id"] =  $id;
            $top["href"] =  "#".$id;
            break;
            case "@endcol":
            $top = $top->closeTo("/newcol/");
            $top = $top->parentNode();
            if ($top->getName() == "paragraphs") {
                $top = $top->parentNode();
            }
            break;
            case "@ul":
            case "@ol":
            if ($top->getName() == "paragraphs") {
                $top = $top->parentNode();
            }
            $top = $top->addChild(substr($tagname, 1));
            $top['type'] = substr($tagname, 1);
            break;
            case "@li":
            $id = "l".uniqid();
            $top = $top->closeTo("/ul|ol/");
            $top = $top->addChild("li");
            $top['id'] = $id;
            $top["href"] =  "#".$id;
            break;
            case "@endul":
            case "@endol":
            $top = $top->closeTo("/ul|ol/");
            $top = $top->parentNode();
            break;
            case "@ex":
            case "@eg":
            case "@fact":
            case "@remark":
            case "@def":
            case "@thm":
            case "@prop":
            case "@cor":
            case "@lemma":
            case "@claim":
            if ($top->getName() == "paragraphs") {
                $top = $top->parentNode();
            }
            $top = $top->addChild("statement");
            $top['type'] = $this->ENV[$tagname];
            $top['num'] = $this->item;
            $top['url'] = "$this->root_url/wb_bare.php?content=$this->content&knowl=$this->chapter.$this->item";
            $top['chapter'] = $this->chapter;
            $top['chapter_type'] = $this->chapter_type;
            break;
            case "@proof":
            if ($top->getName() == "paragraphs") {
                $top = $top->parentNode();
            }
            $top = $top->addChild("proof");
            $top['type'] = $this->ENV[$tagname];
            $top['num'] = "";
            break;
            case "@sol":
            case "@ans":
            case "@notation":
            if ($top->getName() == "paragraphs") {
                $top = $top->parentNode();
            }
            $top = $top->addChild("substatement");
            $top['type'] = $this->ENV[$tagname];
            $top['num'] = "";
            break;
            case "@title":
            preg_match('/@title{(?P<title>.*?)}/', $word, $matches);
            $top = $top->closeTo("/statement/");
            $top['title'] = $matches['title'];
            break;
            case "@end":
            $top = $top->closeTo("/statement|substatement/");
            $top = $top->parentNode();
            break;
            // case "#wordpool":
            // // if (preg_match('/#wordpool{(?P<pool>.*?)}/', $word, $matches)) {
            // //     $top->append_html("\n<div class=\"wordpool chapter".$top->get_meta_data()['chap_attr']."\">".$matches['pool']."</div>");
            // // }
            // break;
            // case "@wordpool":
            // $top->append_html($top->gen_wordpool(""));
            // case "#week":
            case "@week":
            // case "#lecture":
            case "@lecture":
            // $this->wordpools[$top->get_meta_data()['chap_attr']] = wordpool($this->wordpool);
            // $this->wordpool = "";
            // case "#course":
            // $this->item = 0;
            // case "#topic":
            case "@course":
            case "@topic":
            $top = $top->closeTo("/slide/");
            // $html = $top->update_info($tagname, $word);
            $top = $top->addChild(substr($tagname, 1));
            preg_match('/'.$tagname.'{(?P<value>.*?)}/', $word, $twa);
            $top[0] .= $twa['value'];
            if (in_array($tagname, array("@week", "@lecture"))) {
                $top['chapter_type'] = ucfirst(substr($tagname, 1))." ";
                $this->chapter = $twa['value'];
                $this->chapter_type = ucfirst(substr($tagname, 1));
            }
            $top = $top->parentNode();
            break;
            case "@steps":
            $this->steps_id = uniqid();
            $this->steps = 0;
            break;
            case "@nstep":
            $html = "";
            $word = str_replace("\n", " ", $word);
            $step_id = $this->steps_id.'.'.$this->steps;
            if (!isset($_GET['print'])) {
                $insert = "\cssId{steps".$step_id."}{\style{visibility:hidden}";
                $html .= preg_replace("/@nstep{(.*)}/", $insert.' {${1}}} ',$word);
            } else {
                $html .= preg_replace("/@nstep{(.*)}/",'${1}',$word);
            }
            $html .= "%%nstep\n";
            $this->steps++;
            $top[0] .= $html;
            break;
            case "@endsteps":
            $top = $top->closeTo("/paragraphs/")->parentNode();
            $top = $top->addChild("endsteps");
            $top['stepsid'] = $this->steps_id;
            $top = $top->parentNode();
            break;
            case "@webwork":
            $ww_id = uniqid();
            $top = $top->addChild("webwork");
            preg_match("/@webwork{(?P<pg>.*?)}/", $word, $pg_match);
            $pg_file = $pg_match['pg'];
            $top['wwId'] = $ww_id;
            $top['pgfile'] = $pg_file;
            $top = $top->parentNode();
            break;
            case "@label":
            preg_match('/@label{(?P<label>.*?)}/', $word, $matches);
            $parent = $top->closeTo("/statement/");
            $parent['label'] = $matches['label'];
            break;
            case "@ref":
            $top[0]  .= $word;
            // preg_match('/(?P<before>.*?)@ref{(?P<name>.*?)}(?P<after>.*)/', $word, $matches);
            // //$top[0] .= $matches['before']."<ref label='".$matches['name']."'/>".$matches['after'];
            // if ($top->getName() == "paragraphs") {
            //     $top[0] .= "&nbsp;".$matches['before'];
            //     $top = $top->parentNode();
            // }
            // $child = $top->addChild("ref");
            // $child['label'] = $matches['name'];
            // if ($matches['after'] != null) {
            //     $top = $top->addChild("paragraphs");
            //     $top->{0} = $matches['after'];
            // }
            break;
            case "@endproof":
            case "@qed":
            $top->addChild("qed");
            break;
            case "@linebreak":
            $top[0] .= "@linebreak";
            // if ($top->getName() == "paragraphs") {
            //     $top = $top->parentNode();
            //     $top->addChild("linebreak");
            //     $top = $top->addChild("paragraphs");
            // }
            // break;
            default:
            break;
        }
        return $top;
    }

    function get_html() {
			return $this->html;
	}

    function get_xml() {
			return $this->xml;
	}

    function get_markdown() {
        return str_replace('"', "'", $this->html);
    }

	function get_summaries() {
		$toc = "";

		$index = 0;

		foreach ($this->summaries as $summary) {
			if (preg_match('/.*?course.*?(week|chapter)/s', $summary))
			$bgstyle = "style=\"background-color:hsl(0, 20%, 90%)\"";
			else
			$bgstyle = "";
			$toc .= "\n<tr $bgstyle onclick=\"showDivs($index);\"><td>$index</td><td>$summary</td></tr>";
			$index++;
		}
		return $toc;
	}

	function get_title() {
		$title = "";
		if($this->chapter_type != "") {
            $title .= "<title>".str_replace('<br>', ' ', ucfirst($this->course))." $this->chapter_type $this->chapter</title>";
		// 	$title .= "<title>".str_replace('<br>', ' ', ucfirst($this->course))." Lecture ".$this->chapter."</title>";
		// } elseif ($this->is_week) {
		// 	$title .= "<title>".str_replace('<br>', ' ', ucfirst($this->course))." Week ".$this->chapter."</title>";
		}
		else {
			$title .= "<title>".$this->course."</title>";
		}
		return $title;

	}

	function get_meta() {
		$meta = "<meta property=\"og:url\" content=\"".$this->canon_url."\" />
		<meta property=\"og:title\" content=\"".str_replace('<br>', ' ', ucfirst($this->course))." Lecture Notes\" />
		<meta property=\"og:description\" content=\"".$this->chapter_name." Slide ".$this->slide_id."\"/>";
		return $meta;
	}

	function get_num_slides() {
		return $this->num_slides;
	}

	function get_topic() {
		return $this->topic;
	}
	function get_course() {
		return $this->course;
	}
	function get_chapter() {
		return $this->chapter;
	}
    function get_chapter_type() {
        return $this->chapter_type;
    }

	function get_chapter_name() {
		if($this->chapter_name != "") {
            return "$this->chapter_type $this->chapter";
		// 	return "Lecture ".$this->chapter;
		// } elseif ($this->is_week) {
		// 	return "Week ".$this->chapter;
		}
		else {
			return "";
		}
	}

    function set_summary() {
        $summary = strip_tags($this->summary);
        $summary = preg_replace('/@webwork{.*?}/', '[webwork]', $summary);
        $summary = preg_replace('/@(\w+){(.*?)}/', '$1 <strong>$2</strong>', $summary);
        $summary = preg_replace_callback('/@((?!(break|sep|ul|ol|li|preamble|col|collapse|(end.*?)))\w+)/', function($matches) {return '<strong>'.ucfirst($matches[1]).'</strong>:';}, $summary);
        $summary = preg_replace('/@\w+|@\w+{(.*?)}|\\\\displaystyle|\\\\ds|-->/', '', $summary);

        $summary = implode(' ', array_slice(explode(' ', $summary), 0, 20));

        if (substr_count($summary, "$") % 2 == 0) {
            array_push($this->summaries, $summary." ... ");
        } else {
            array_push($this->summaries, $summary."$  ... ");
        }
        $this->summary = "";
    }

	function get_wordpool () {
		return wordpool($this->source);
	}

}

?>
