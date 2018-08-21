<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <xsl:apply-templates select="*" />
    </xsl:template>

    <xsl:template match="slides/slide">
        <!-- <xsl:variable name="slide_number">
            <xsl:number format="1" level="any" count="slide"/>
        </xsl:variable> -->
        <div class="slide collapsed">
            <xsl:copy-of select="@*"/>
            <div class="slide_container" wbtag="ignore">
                <div class="slide_number">
                    <button class="plain_button slide_button">
                        <xsl:copy-of select="@*[name()!='wbtag']"/>
                        <!-- <xsl:value-of select="concat('Slide ', @slide)"/> -->
                        <xsl:text>Slide </xsl:text>
                        <!-- <xsl:copy-of select="$slide_number" /> -->
                        <xsl:value-of select="@slide"/>
                    </button>
                </div>
                <div class="slide_content">
                    <xsl:apply-templates select="*" />
                </div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="statement">
        <p wbtag="ignore"/>
        <div>
            <xsl:attribute name="class">
                <xsl:text>statement</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute>
            <xsl:attribute name="wbname">
                <xsl:value-of select="name()"/>
            </xsl:attribute>
            <xsl:attribute name="id">
                <xsl:value-of select="concat('statement', @chapter, '-', @num)"/>
            </xsl:attribute>
            <xsl:attribute name="type">
                <xsl:value-of select="@type"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <button class="plain_button item_button" onmouseover="this.style.backgroundColor=''" onmouseout="this.style.backgroundColor=''">
                <xsl:copy-of select="@*"/>
                <xsl:attribute name="wbtag">
                    <xsl:text>ignore</xsl:text>
                </xsl:attribute>
                <h5 wbtag="ignore">
                    <xsl:value-of select="@type"/>
                    <span style="margin-left:0.5em" wbtag="ignore">
                        <!-- <xsl:value-of select="concat(@chapter, '.', @num)"/> -->
                        <xsl:value-of select="@chapter"/>
                        <xsl:text>.</xsl:text>
                        <xsl:value-of select="@num"/>
                        <!-- <xsl:number format="1" level="any" count="statement"/> -->
                    </span>
                </h5>
            </button>
            <xsl:apply-templates select="@title"/>
            <blockquote wbtag="skip">
                <xsl:apply-templates select="*"/>
            </blockquote>
        </div>
    </xsl:template>

    <xsl:template match="@title">
        <div style="display:inline-block" wbtag='ignore'>
            <xsl:copy-of select="@*"/>
            <strong style="padding-left:0.5em;padding-right:0.5em">-</strong>
            <h5>
                <xsl:value-of select="."/>
            </h5>
        </div>
    </xsl:template>

    <xsl:template match="substatement">
        <div>
            <xsl:attribute name="class">
                <xsl:text>substatement</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute>
            <xsl:attribute name="wbname">
                <xsl:value-of select="name()"/>
            </xsl:attribute>
            <xsl:attribute name="type">
                <xsl:value-of select="@type"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <blockquote wbtag="skip">
                <h5 wbtag="ignore">
                    <xsl:value-of select="@type"/>
                    <span style="margin-left:0.5em">
                        <xsl:value-of select="@title"/>
                    </span>
                </h5>
                <xsl:apply-templates select="title"/>
                <xsl:apply-templates select="*[not(self::title)]"/>
            </blockquote>
        </div>
    </xsl:template>



    <xsl:template match="course|topic">
        <h2>
            <xsl:attribute name="metadata"/>
            <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute>
            <xsl:attribute name="chapter">
                <xsl:value-of select="@chapter"/>
            </xsl:attribute>
            <xsl:apply-templates select="text()|br"/>
        </h2>
    </xsl:template>

    <xsl:template match="week|lecture">
        <h2>
            <xsl:attribute name="metadata"/>
            <!-- <xsl:attribute name="content">
                <xsl:value-of select="@content"/>
            </xsl:attribute> -->
            <xsl:choose>
                <xsl:when test="(@chapter_type)!=''">
                    <xsl:attribute name="chapter_type">
                        <xsl:value-of select="@chapter_type"/>
                    </xsl:attribute>
                </xsl:when>
            </xsl:choose>
            <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute>
            <xsl:attribute name="chapter">
                <xsl:value-of select="@chapter"/>
            </xsl:attribute>
            <xsl:value-of select="(@chapter_type)"/>
            <xsl:text> </xsl:text>
            <!-- <xsl:value-of select="@content"/> -->
            <xsl:apply-templates select="text()|br"/>
        </h2>
    </xsl:template>

    <xsl:template match="ref">
        <xsl:choose>
            <xsl:when test="//statement[@label=current()]">
                <xsl:element name="a">
                    <xsl:copy-of select="@*"/>
                    <xsl:attribute name="chapter">
                        <xsl:value-of select="//statement[@label=current()]/@chapter"/>
                    </xsl:attribute>
                    <xsl:attribute name="num">
                        <xsl:value-of select="//statement[@label=current()]/@num"/>
                    </xsl:attribute>
                    <xsl:attribute name="class">
                        <xsl:text>knowl</xsl:text>
                    </xsl:attribute>
                    <!-- <xsl:attribute name="knowl-src">
                        <xsl:value-of select="//statement[@label=current()]/@num"/>
                    </xsl:attribute> -->
                    <!-- <xsl:attribute name="class">
                        <xsl:text>knowl id-ref</xsl:text>
                    </xsl:attribute> -->
                    <!-- <xsl:attribute name="refid">
                        <xsl:value-of select="concat('statement', //statement[@label=current()]/@chapter, '-', //statement[@label=current()]/@num)"/>
                    </xsl:attribute> -->
                    <!-- <xsl:attribute name="target">_blank</xsl:attribute> -->
                    <xsl:value-of select="concat(//statement[@label=current()]/@type, ' ', //statement[@label=current()]/@chapter, '.', //statement[@label=current()]/@num)"/>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>UNDEFINED</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- <xsl:template match="&THEOREM-LIKE">
        <p>
            <h5>
                <xsl:value-of select="@type"/>
            </h5>
            <blockquote>
                <xsl:apply-templates select="*"/>
            </blockquote>
        </p>
    </xsl:template> -->

    <xsl:template match="keywords">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:value-of select="name()"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <xsl:comment/>
            <xsl:apply-templates select="keyword"/>
        </xsl:element>
    </xsl:template>


    <xsl:template match="wiki">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:value-of select="name()"/>
            </xsl:attribute>
            <xsl:value-of select="."/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="keyword">
        <span class="keyword">
            <xsl:copy-of select="@*"/>
            <xsl:value-of select="."/>
        </span>
    </xsl:template>

    <xsl:template match="newcol|collapse">
        <a class="collapsea collapsed" contenteditable="false" data-toggle="collapse" aria-expanded="false" wbtag="ignore">
            <xsl:attribute name="aria-controls">
                <xsl:value-of select="@id" />
            </xsl:attribute>
            <xsl:attribute name="href">
                <xsl:value-of select="@href" />
            </xsl:attribute>►
        </a>
        <div class="collapse">
            <xsl:attribute name="id">
                <xsl:value-of select="@id"/>
            </xsl:attribute>
            <xsl:attribute name="href">
                <xsl:value-of select="@href" />
            </xsl:attribute>
            <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute>
            <xsl:apply-templates select="*" />
        </div>
    </xsl:template>

    <xsl:template match="paragraphs">
        <div class="markdown">
            <xsl:attribute name="wbtag">
                <xsl:text>paragraphs</xsl:text>
            </xsl:attribute>
            <!-- <xsl:value-of select="." disable-output-escaping="yes" /> -->
            <!-- <xsl:apply-templates select="*[not(self::paragraphs)]"/> -->
            <!-- <xsl:apply-templates select="text()|comment()|ref|paragraphs|col|newcol|linebreak|hr|br|ul|ol|li|b|qed|wiki|a|u|h1|h2|h3|h4|h5|table|tbody|th|thead|tr|td|steps|p|div|img|script|iframe|blockquote"/> -->
            <xsl:apply-templates select="text()|comment()|*"/>
        </div>
    </xsl:template>

    <xsl:template match="ul|ol|li|b|strong|i|em|a|u|h1|h2|h3|h4|h5|table|tbody|th|thead|tr|td|p|div|img|script|iframe|blockquote|sup|code|pre|center|span">
        <!-- <xsl copy-of select="current()"/> -->
        <xsl:element name="{name()}">
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates select="text()|comment()|*"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="framebox">
        <div style="width:100%;text-align:center">
            <div style="display:inline-block;border: 5px solid #428bc1;padding:10px">
                <xsl:apply-templates select="text()|comment()|*"/>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="qed">
        <div style='width:100%;text-align:right;color:#428bc1' wbtag="qed">&#x25fc;&#xFE0E;</div>
    </xsl:template>

    <xsl:template match="hr|br">
        <xsl:element name="{name()}" />
    </xsl:template>

    <xsl:template match="col_ul">
        <ul wbtag="col_ul">
            <!-- <xsl:copy-of select="@*"/> -->
            <xsl:apply-templates select="col_li|col_ul|col_ol"/>
        </ul>
    </xsl:template>

    <xsl:template match="col_ol">
        <ol wbtag="col_ol">
            <!-- <xsl:copy-of select="@*"/> -->
            <xsl:apply-templates select="col_li|col_ul|col_ol"/>
        </ol>
    </xsl:template>
    <xsl:template match="col_li">
        <li wbtag="skip">
            <!-- <xsl:attribute name="wbtag">
                <xsl:value-of select="@wbtag"/>
            </xsl:attribute> -->
            <a class="collapsea collapsed" contenteditable="false" data-toggle="collapse" aria-expanded="false" wbtag="ignore">
                <xsl:attribute name="aria-controls">
                    <xsl:value-of select="@id" />
                </xsl:attribute>
                <xsl:attribute name="href">
                    <xsl:value-of select="@href" />
                </xsl:attribute>
                ►
            </a>
            <div class="collapse">
                <xsl:attribute name="id">
                    <xsl:value-of select="@id"/>
                </xsl:attribute>
                <xsl:attribute name="wbtag">
                    <xsl:value-of select="@wbtag"/>
                </xsl:attribute>
                <xsl:apply-templates select="*" />
            </div>
        </li>
    </xsl:template>

    <xsl:template match="steps">
        <div wbtag="steps">
            <xsl:apply-templates select="*" />
            <div style="text-align:right" wbtag="ignore">
                <button class="btn btn-outline-info btn-sm">
                    <xsl:attribute name="onclick">
                        <xsl:value-of select="concat('showStep(&quot;', @stepsid, '&quot;)')" />
                    </xsl:attribute>
                    <xsl:attribute name="id">
                        <xsl:value-of select="concat('next', @stepsid)" />
                    </xsl:attribute>
                    next
                </button>
                <button class="btn btn-outline-info btn-sm" style="margin-left:5px" disabled="true">
                    <xsl:attribute name="onclick">
                        <xsl:value-of select="concat('resetSteps(&quot;', @stepsid, '&quot;)')" />
                    </xsl:attribute>
                    <xsl:attribute name="id">
                        <xsl:value-of select="concat('reset', @stepsid)" />
                    </xsl:attribute>
                    reset
                </button>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="linebreak">
        <span wbtag="linebreak"/>
    </xsl:template>

    <xsl:template match="webwork">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:text>webwork</xsl:text>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <strong class="print">WeBWork </strong>
            <!-- <xsl:value-of select="(@pg_file)"/> -->
        </xsl:element>
    </xsl:template>


    <xsl:template match="wb_image">
        <xsl:element name="div">
            <xsl:attribute name="class">
                <xsl:text>image</xsl:text>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <xsl:element name="img">
                <xsl:attribute name="wbtag">ignore</xsl:attribute>
                <xsl:attribute name="src">
                    <xsl:value-of select="@data-src"/>
                </xsl:attribute>
            </xsl:element>
        </xsl:element>
    </xsl:template>


    <xsl:template match="text()">
        <xsl:value-of select="." disable-output-escaping="yes" />
    </xsl:template>
    <xsl:template match="comment()">
      <xsl:copy-of select="current()"/>
        <!-- <xsl:value-of select="." disable-output-escaping="yes" /> -->
    </xsl:template>
</xsl:stylesheet>
