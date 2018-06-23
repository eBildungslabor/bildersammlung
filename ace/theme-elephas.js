ace.define("ace/theme/elephas",[], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-elephas";
exports.cssText = ".ace-elephas .ace_gutter,\
.ace-elephas .ace_gutter {\
background: #55626c;\
color: #bbb\
}\
.ace-elephas .ace_print-margin {\
width: 1px;\
background: #e8e8e8\
}\
.ace-elephas {\
    background: #55626c;\
    color: #ddd;\
    font-family: Menlo;\
    line-height: 1.5;\
}\
.ace-elephas .ace_cursor {\
    color:#fff;\
border-left: 5px solid #fff\
}\
.ace-elephas .ace_overwrite-cursors .ace_cursor {\
    color:#fff;\
border-left: 0px;\
border-bottom: 5px solid #fff\
}\
.ace-elephas .ace_marker-layer .ace_selection {\
background: hsla(0,0%,100%,0.25)\
}\
.ace-elephas.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #f3f2f3;\
}\
.ace-elephas .ace_marker-layer .ace_step {\
background: rgb(198, 219, 174)\
}\
.ace-elephas .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgba(0, 0, 0, 0.33);\
}\
.ace-elephas .ace_marker-layer .ace_active-line {\
background: rgba(232, 242, 254, 0.15)\
}\
.ace-elephas .ace_gutter-active-line {\
background-color: rgba(232, 242, 254, 0.15)\
}\
.ace-elephas .ace_marker-layer .ace_selected-word {\
border: 1px solid rgba(100, 50, 208, 0.27)\
}\
.ace-elephas .ace_invisible {\
color: #BFBFBF\
}\
.ace-elephas .ace_fold {\
background-color: rgba(2, 95, 73, 0.97);\
border-color: rgba(15, 0, 9, 1.0)\
}\
.ace-elephas .ace_wbtag {\
color: #ddd;\
\/*font-family: \"Helvetica Neue\", helvetica, arial, sans-serif;*\/\
font-weight: 100;\
border: 1px solid #ddd;\
padding:2px;\
border-radius: 4px\
}\
.ace-elephas .ace_sep {\
color: #000;\
background-color: #fbb;\
}\
.ace-elephas .ace_sep::before {\
    content: '';\
    position:absolute;\
    clear:left;\
    width: 100%;\
    display:inline-block;\
    border-bottom: 2.5px dotted #fbb\
}\
.ace-elephas .ace_col {\
color: #0ef;\
}\
.ace-elephas .ace_col::before {\
    \/*content: '▽ '*\/\
}\
.ace-elephas .ace_keyword {\
color: #baf;\
rbackground-color: rgba(163, 170, 216, 0.055)\
}\
.ace-elephas .ace_constant.ace_language {\
color: #baf;\
rbackground-color: rgba(189, 190, 130, 0.059)\
}\
.ace-elephas .ace_constant.ace_numeric {\
color: #baf;\
rbackground-color: rgba(119, 194, 187, 0.059)\
}\
.ace-elephas .ace_constant.ace_character,\
.ace-elephas .ace_constant.ace_other {\
color: #baf;\
rbackground-color: rgba(127, 34, 153, 0.063)\
}\
.ace-elephas .ace_support.ace_function {\
color: #baf;\
rbackground-color: rgba(189, 190, 130, 0.039)\
}\
.ace-elephas .ace_support.ace_class {\
color: #baf;\
rbackground-color: rgba(239, 106, 167, 0.063)\
}\
.ace-elephas .ace_storage {\
color: #baf;\
rbackground-color: rgba(139, 93, 223, 0.051)\
}\
.ace-elephas .ace_invalid {\
color: #DFDFD5;\
rbackground-color: #CC1B27\
}\
.ace-elephas .ace_string {\
    font-family: Courier;\
color: #ebb;\
border:1px solid red;\
rbackground-color: rgba(170, 175, 219, 0.035)\
}\
.ace-elephas .ace_comment {\
font-family: Courier;\
color: #ebb;\
text-decoration: line-through;\
rbackground-color: rgba(95, 15, 255, 0.0078)\
}\
.ace-elephas .ace_entity.ace_name.ace_function,\
.ace-elephas .ace_variable {\
color: #bbb;\
rbackground-color: rgba(34, 255, 73, 0.12)\
}\
.ace-elephas .ace_variable.ace_language {\
color: #316fcf;\
rbackground-color: rgba(58, 175, 255, 0.039)\
}\
.ace-elephas .ace_variable.ace_parameter {\
font-style: italic;\
color: #0ff;\
rbackground-color: rgba(5, 214, 249, 0.043)\
}\
.ace-elephas .ace_entity.ace_other.ace_attribute-name {\
color: rgba(73, 70, 194, 0.93);\
rbackground-color: rgba(73, 134, 194, 0.035)\
}\
.ace-elephas .ace_entity.ace_name.ace_tag {\
color: #3976a2;\
rbackground-color: rgba(73, 166, 210, 0.039)\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/elephas"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();