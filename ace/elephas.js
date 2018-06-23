var dictionary = {
    "@thm": "Theorem",
    "@lemma": "Lemma",
    "@cor": "Corollary",
    "@defn": "Definition",
    "@claim": "Claim",
    "@fact": "Fact",
    "@remark": "Remark",
    "@eg" : "Example",
    "@ex" : "Exercise",
    "@proof": "Proof",
    "@ans": "Answer",
    "@sol": "Solution",
    "@paragraphs": "Paragraphs",
    "@col": "col",
    "@newcol": "newcol"
};

var environs = ["statement", "substatement", "slides", "slide", "col_ul", "col_ol", "col_li", "newcol"];

var docNode = document.implementation.createDocument("", "", null);

var week='';
var lecture='';
var chapter='';
var chapterType="Chapter";
var course='';
var topic='';

function Stack(name) {

    this.node = docNode.createElement(name);
    this.parent = null;
    this.node.setAttribute("environment", "");
    this.node.textContent = "";

    this.addChild = function(name) {
        console.log('addChild: ' + name + ' to ' + this.node.nodeName);
        var child = new Stack(name);
        child.parent = this;
        if (environs.includes(name)) {
            child.node.setAttribute("environment", name);
        } else {
            child.node.setAttribute("environment", this.getEnvironment());
        }
        return child;
    }


    this.close = function() {
        if (this.parent != null) {
            this.parent.node.appendChild(this.node);
            if (environs.includes(this.parent.node.nodeName)) {
                environment = this.parent.node.getAttribute('environment');
            }
            return this.parent;
        } else {
            return null;
        }
    }

    this.getParent = function(regex) {
        var failsafe = 0;
        var aux = this;
        while((aux.node.nodeName != 'slide') && (failsafe < 50)) {
            if (!aux.node.nodeName.match(regex)) {
                aux = aux.parent;
            }
            failsafe++;
        }
        return aux;
    }

    this.closeTo = function(regex) {
        var failsafe = 0;
        var aux = this;
        while((aux.node.nodeName != 'slides') && (failsafe < 50)) {
            if (!aux.node.nodeName.match(regex)) {
                aux = aux.close();
                console.log('CLOSE TO: ' + aux.node.nodeName);
            }
            failsafe++;
        }
        return aux;
    }

    this.setAttribute = function(attr, value) {
        this.node.setAttribute(attr, value);
        return this;
    }

    this.getEnvironment = function() {
        return this.node.getAttribute("environment");
    }

    this.getNode = function() {
        return this.node;
    }

    // this.setKeywords = function() {
    //     var child = this.addChild("keywords");
    //
    //     var oDom = this.node;
    //     var queries = document.evaluate("//b", oDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //
    //     for ( var i = 0 ; i < queries.snapshotLength; i++ ) {
    //         child = child.addChild("keyword");
    //         // child.appendChild(queries.snapshotItem(i));
    //         child.node.textContent = queries.snapshotItem(i).textContent;
    //         child = child.closeTo(/keywords/);
    //     }
    //     child.closeTo(/keywords/).close();
    // }
}

function generateXML() {
    console.clear();
    docNode = document.implementation.createDocument("", "", null);

    var source = editor.getValue();

    source = source.replace(/@def/g, '@defn');
    source = source.replace(/#(nstep|ref|label)/g, '@$1');
    // source = source.replace(/#\w+{.*?}/g, '');
    // source = source.replace(/\<br\/*\>/g, ' @linebreak ');
    source = source.replace(/\n\n/g, ' @linebreak ').replace(/#nstep/g, "\n@nstep\n");
    source = source.replace(/\<ul\>/g, "@html_ul\n").replace(/\<ol\>/g, "@html_ol\n").replace(/\<\/ul\>/g, "@html_endul\n").replace(/\<\/ol\>/g, "@html_endol\n").replace(/\<li\>/g, "@html_li\n").replace(/\<\/li\>/g, "@html_endli\n");

    // var sourceArray = source.match(/(@nstep)|(@((?!nstep)\w+){.*?}(?:\.|,|;|))|(@\w+({.*?}))|(\s*\S+\s*)|(\n+)/sg);
    var sourceArray = source.match(/(@nstep)|\s*((@|#)((?!nstep)\w+){.*?}(?:\.|,|;|))|(\s*\S+\s*)|(\n+)/g);

    var colID = 0;
    var slideID = -1;
    var stepsID = 0;
    var item = 0;
    var html = '';

    // sample from https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/How_to_create_a_DOM_tree
    // var doc = document.implementation.createDocument("", "", null);
    // var peopleElem = doc.createElement("people");
    //
    // var personElem1 = doc.createElement("person");
    // personElem1.setAttribute("first-name", "eric");
    // personElem1.setAttribute("middle-initial", "h");
    // personElem1.setAttribute("last-name", "jung");
    //
    // var addressElem1 = doc.createElement("address");
    // addressElem1.setAttribute("street", "321 south st");
    // addressElem1.setAttribute("city", "denver");
    // addressElem1.setAttribute("state", "co");
    // addressElem1.setAttribute("country", "usa");
    // personElem1.appendChild(addressElem1);
    // doc.appendChild(peopleElem);

    var doc = new Stack('root');

    var slides = doc.addChild('slides');
    var child = slides;

    var in_anchor = false;
    var is_comment = false;
    for (var i = 0; i < sourceArray.length; i++) {

        var originalWord = sourceArray[i];
        var serial = '';
        var word = originalWord.trim();

        if (word.match(/^\<!--/g)) {
            is_comment = true;
        }

        if (is_comment) {
            if (child.node.nodeName != "paragraphs") {
                child = child.addChild("paragraphs");
                child.node.setAttribute("wbtag", "paragraphs");
            }
            child.node.textContent += originalWord;
            if (word.match(/--\>$/g)) {
                is_comment = false;
            }
            continue;
        }

        if (word.match(/^\<a/g)) {
            in_anchor = true;
            console.log('IN ANCHOR' + word);
        }

        var matches = word.match(/((@|#)\w+)(?:{(.*)})*/);
        if (matches && !(in_anchor)) {
            word = matches[1];
            tagname = word.substr(1);
            console.log('TAGS WITH ARGS' + originalWord + ' ' + word);
            var re = new RegExp(word + '{(.*?)}');
            var matches = originalWord.trim().match(re);
            if (matches) {
                var argument = matches[1];
            }
        }
        if (word.match(/\<\/a\>/g)) {
            in_anchor = false;
            console.log('CLOSE ANCHOR' + word);
        }

        console.log(child.node.nodeName + ' WORD: ' + word);

        switch(word) {
            case '@sep':
            var parent = child.closeTo(/slides/);
            slideID++;
            var child = parent.addChild('slide');
            // child.node.setAttribute("id", 's' + slideID);
            // child.node.setAttribute("slide", slideID);
            child.node.setAttribute("wbtag", tagname);
            child.node.setAttribute("course", course);
            child.node.setAttribute("week", week);
            child.node.setAttribute("topic", topic);
            child.node.setAttribute("lecture", lecture);
            child.node.setAttribute("chapter", chapter);
            child.node.setAttribute("chapter_type", chapterType);
            break;
            case '@newcol':
            case '@collapse':
            case '@col':
            colID++;
            if ((word == '@newcol') || (child.getEnvironment() != 'newcol')) {
                var tagname = 'newcol';
            }  else {
                var tagname = 'col';
            }

            var child = child.addChild(tagname);
            child.node.setAttribute("id", 'c' + colID);
            child.node.setAttribute("href", '#c' + colID);
            child.node.setAttribute("wbtag", tagname);
            break;
            case '@endcol':
            child = child.closeTo(/newcol/);
            child = child.close();
            while (child.node.nodeName == 'paragraphs') {
                child = child.close();
            }
            break;
            case "@html_ul":
            case "@html_ol":
            if (child.node.nodeName == "paragraphs") {
                var child = child.close();
            }
            var tagname = word.match(/@html_(\w+)/)[1];
            console.log('TAGNAME: '+ tagname);
            child = child.addChild(tagname);
            child.node.setAttribute("wbtag", tagname);
            break;
            case "@html_li":
            child = child.closeTo(/ul|ol/);
            child = child.addChild('li');
            child.node.setAttribute("wbtag", 'li');
            break;
            case "@html_endli":
            child = child.closeTo(/ul|ol/);
            break;
            case "@html_endul":
            case "@html_endol":
            child = child.closeTo(/ul|ol/).close();
            case "@ul":
            case "@ol":
            if (child.node.nodeName == "paragraphs") {
                var child = child.close();
            }
            child = child.addChild('col_' + tagname);
            child.node.setAttribute("wbtag", 'col_' + tagname);
            break;
            case "@li":
            colID++;
            child = child.closeTo(/col_ul|col_ol/);
            child = child.addChild('col_' + tagname);
            child.node.setAttribute("wbtag", 'col_' + tagname);
            child.node.setAttribute("id", 'c' + colID);
            child.node.setAttribute("href", '#c' + colID);
            break;
            case "@endul":
            case "@endol":
            child = child.closeTo(/col_ul|col_ol/).close();
            break;
            case "@ex":
            case "@eg":
            case "@fact":
            case "@remark":
            case "@defn":
            case "@thm":
            case "@prop":
            case "@cor":
            case "@lemma":
            case "@claim":
            item++;
            serial = ' ' + item;
            case "@proof":
            case "@sol":
            case "@ans":
            case "@notation":
            if (word.match(/@(proof|sol|ans|notation)/)) {
                var statement = 'substatement';
            } else {
                var statement = 'statement';
            }
            if (child.node.nodeName == "paragraphs") {
                var child = child.close();
            }
            var parent = child;
            var child = parent.addChild(statement);
            child.node.setAttribute('type', dictionary[word.trim()]);
            child.node.setAttribute("course", course);
            child.node.setAttribute("week", week);
            child.node.setAttribute("lecture", lecture);
            if (week != '') {
                child.node.setAttribute("chapter", week);
            }
            if (lecture != '') {
                child.node.setAttribute("chapter", lecture);
            }
            child.node.setAttribute('num', item);
            child.node.setAttribute("wbtag", tagname);
            break;
            case "@title":
            var match = originalWord.trim().match(/@title{(.*?)}/)[1];
            parent = child.closeTo(/statement/);
            parent.node.setAttribute("title", match);
            break;
            case "@end":
            var parent = child.closeTo(/statement|substatement/);
            if (parent.node.nodeName != "slides") {
                var child = parent.close();
            } else {
                var child = parent;
            }
            //console.log(child.node);
            break;
            case "@wiki":
            var child = child.addChild("wiki");
            child.node.setAttribute("wbtag", tagname);
            child.node.textContent += argument;
            child = child.close();
            break;
            case "#course":
            case "#week":
            case "#lecture":
            case "#topic":
            case "@course":
            case "@week":
            case "@lecture":
            case "@topic":
            var re = new RegExp(word + '{(.*?)}');
            console.log('WORD: ' + word + 'ORIGINAL' + originalWord.trim());
            var match = originalWord.trim().match(re)[1];
            var slide = child.getParent(/slide/);
            child = child.closeTo(/slide/);
            // child = child.addChild("paragraphs");
            // child.node.setAttribute("wbtag", "paragraphs");
            if (tagname == 'course') {
                course = match;
                slide.node.setAttribute(tagname, match);
                if(word[0] == '@') {
                    child = child.addChild("course");
                    // child.node.setAttribute('content', course);
                    child.node.textContent += course;
                    //child = child.close();
                }
            } else if (tagname == 'week') {
                week = match;
                chapter = week;
                chapterType = "Week";
                slide.node.setAttribute(tagname, week);
                slide.node.setAttribute('chapter', chapter);
                slide.node.setAttribute('chapter_type', chapterType);
                if(word[0] == '@') {
                    child = child.addChild("week");
                    // child.node.setAttribute('content', week);
                    child.node.setAttribute('chapter_type', 'Week');
                    child.node.setAttribute('chapter', chapter);
                    child.node.textContent += week;
                    // child = child.close();
                }
            } else if (tagname == 'lecture') {
                lecture = match;
                chapter = lecture;
                chapterType = "Lecture";
                slide.node.setAttribute(tagname, lecture);
                slide.node.setAttribute('chapter', chapter);
                slide.node.setAttribute('chapter_type', chapterType);
                if(word[0] == '@') {
                    child = child.addChild("lecture");
                    // child.node.setAttribute('content', lecture);
                    child.node.setAttribute('chapter_type', 'Lecture');
                    child.node.setAttribute('chapter', chapter);
                    child.node.textContent += lecture;
                    // child = child.close();
                }
            } else if (tagname == 'topic') {
                topic = match.replace(/\<br\/*\>/g,'&lt;br/&gt;');
                slide.node.setAttribute('topic', topic);
                if(word[0] == '@') {
                    child = child.addChild("topic");
                    // child.node.setAttribute('content', match);
                    child.node.textContent += match;
                    // child = child.close();
                }
            }
            if(word[0] == '@') {
                child.node.setAttribute("wbtag", tagname);
                child = child.close();
            }
            break;
            case "@keywords":
            // child = child.closeTo(/slide/);
            child = child.addChild('keywords');
            child.node.setAttribute("chapter", chapter);
            child = child.close();
            break;
            case "@steps":
            stepsID++;
            child = child.addChild("steps");
            child.node.setAttribute("stepsid", 'steps' + stepsID);
            var steps = 0;
            break;
            case "@nstep":
            var word = originalWord.trim();
            var insert = '\\class{steps' + stepsID + ' steps}';
            child.node.textContent += insert;
            steps++;
            break;
            case "@endsteps":
            child = child.closeTo(/steps/).close();
            break;
            case "@endproof":
            case "@qed":
            console.log('QED');
            child = child.addChild("qed");
            child = child.close();
            break;
            case "@linebreak":
            if (child.node.nodeName == "paragraphs") {
                var child = child.close();
            }
            child = child.addChild("linebreak");
            child.node.setAttribute("wbtag", tagname);
            child = child.close();
            break;
            case "@label":
            // var label = matches[2];
            var parent = child.closeTo(/statement/);
            parent.node.setAttribute('label', argument);
            break;
            case "@ref":
            // var child = child.addChild("ref");
            // child.node.setAttribute("wbtag", tagname);
            // child.node.textContent += argument;
            // child = child.close();
            if (child.node.nodeName != "paragraphs") {
                child = child.addChild("paragraphs");
                child.node.setAttribute("wbtag", "paragraphs");
            }
            child.node.textContent += originalWord;
            console.log('REF');
            console.log(originalWord);
            // child.node.textContent += '<ref label="' + matches[2] + '" wbtag="ref"></ref>';
            break;
            default:
            if (child.node.nodeName != "paragraphs") {
                child = child.addChild("paragraphs");
                child.node.setAttribute("wbtag", "paragraphs");
            }
            child.node.textContent += originalWord;
            break;
        }
    }

    child.closeTo(/slides/);

    // slides.setKeywords();

    console.log(slides.node);
    // var s = new XMLSerializer();
    //console.log(s.serializeToString(doc.node));
    //$('#output').html(formatXml(s.serializeToString(doc.node)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />'));
    var xml = slides.node;
    console.log('BEFORE REF');
    console.log(xml);
    var xmlString = new XMLSerializer().serializeToString(xml);
    xmlString = xmlString.replace(/@ref{(.*?)}/g, '<ref label="$1">$1</ref>');

    xmlString = xmlString.replace(/&lt;\s*b\s*&gt;(.*?)&lt;\s*\/b\s*&gt;/g, '<b>$1</b>');
    xmlString = xmlString.replace(/&lt;\s*h5\s*&gt;(.*?)&lt;\s*\/h5\s*&gt;/g, '<h5>$1</h5>');
    xmlString = xmlString.replace(/&lt;br&gt;/g, '<br/>');
    $('#xml').html(xmlString);
    return xml;
    // displayResult(slides.node);

}
