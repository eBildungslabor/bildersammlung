ace.define("ace/mode/elephas_highlight_rules",[], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ElephasHighlightRules = function() {

    this.$rules = {
        "start" : [{
            // Wb Tag
            token : ["wbtag"],
            regex : "@((?!sep|col|endcol|newcol)\\w+)({.*?})*"
        }, {
            // Wb Tag
            token : ["sep"],
            regex : "@sep"
        }, {
            // Wb Tag
            token : ["col"],
            regex : "@(?:col(lapse)?|endcol|newcol)"
        },{
            token : "comment",
            regex : "%.*$"
        }, {
            token : ["keyword", "lparen", "variable.parameter", "rparen", "lparen", "storage.type", "rparen"],
            regex : "(\\\\(?:documentclass|usepackage|input))(?:(\\[)([^\\]]*)(\\]))?({)([^}]*)(})"
        }, {
            token : ["keyword","lparen", "variable.parameter", "rparen"],
            regex : "(\\\\(?:label|v?ref|cite(?:[^{]*)))(?:({)([^}]*)(}))?"
        }, {
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\begin)({)(verbatim)(})",
            next : "verbatim"
        },  {
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\begin)({)(lstlisting)(})",
            next : "lstlisting"
        },
        // {
        //     token : ["storage.type", "lparen", "variable.parameter", "rparen"],
        //     regex : "(\\\\(?:begin|end))({)([\\w*]*)(})",
        //     next : "equation"
        // },
        {
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\(?:begin))({)([\\w*]*)(})",
            next : "equation"
        },{
           token : ["storage.type", "lparen", "variable.parameter", "rparen"],
           regex : "(\\\\(?:end))({)([\\w*]*)(})",
           next : "start"
       },
        // {
        //     token : "storage.type",
        //     regex : /\\verb\b\*?/,
        //     next : [{
        //         token : ["keyword.operator", "string", "keyword.operator"],
        //         regex : "(.)(.*?)(\\1|$)|",
        //         next : "start"
        //     }]
        // },
        // {
        //     token : "storage.type",
        //     regex : "\\\\[a-zA-Z]+"
        // }, {
        //     token : "lparen",
        //     regex : "[[({]"
        // }, {
        //     token : "rparen",
        //     regex : "[\\])}]"
        // }, {
        //     token : "constant.character.escape",
        //     regex : "\\\\[^a-zA-Z]?"
        // },
        {
            token : "string",
            regex : "((?:\\${1,2})|(?:\\\\\\[))",
            next  : "equation"
        }],
        "equation" : [{
            token : "comment",
            regex : "%.*$"
        }, {
            token : "string",
            regex : "((?:\\${1,2})|(?:\\\\\\]))",
            next  : "start"
        },
        {
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\(?:begin))({)([\\w*]*)(})",
            next : "equation"
        },{
           token : ["storage.type", "lparen", "variable.parameter", "rparen"],
           regex : "(\\\\(?:end))({)((?!matrix|split)[\\w*]*)(})",
           next : "start"
       },{
          token : ["storage.type", "lparen", "variable.parameter", "rparen"],
          regex : "(\\\\(?:end))({)(matrix|split)(})",
          next : "equation"
      },
        // {
        //     token : "constant.character.escape",
        //     regex : "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)"
        // },
        {
            token : "error",
            regex : "^\\s*$",
            next : "start"
        }, {
            defaultToken : "string"
        }],
        "verbatim": [{
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\end)({)(verbatim)(})",
            next : "start"
        }, {
            defaultToken : "text"
        }],
        "lstlisting": [{
            token : ["storage.type", "lparen", "variable.parameter", "rparen"],
            regex : "(\\\\end)({)(lstlisting)(})",
            next : "start"
        }, {
            defaultToken : "text"
        }]
    };

    this.normalizeRules();

};
oop.inherits(ElephasHighlightRules, TextHighlightRules);

exports.ElephasHighlightRules = ElephasHighlightRules;

});

ace.define("ace/mode/elephas",[], function(require, exports, module) {
    "use strict";

    var TextMode = require("./text").Mode;
    var ElephasHighlightRules = require("./elephas_highlight_rules").ElephasHighlightRules;
    var oop = require("../lib/oop");

    var Mode = function() {
        this.HighlightRules = ElephasHighlightRules;
    };

    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/elephas";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
                (function() {
                    ace.require(["ace/mode/elephas"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
