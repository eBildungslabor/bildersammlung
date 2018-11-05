<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xh="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="xh"
    >
    <xsl:output method="xml" />
    <xsl:output indent="yes"/>
    <!-- <xsl:strip-space elements="*"/> -->

    <xsl:template match="/">
        <xsl:element name="slides">
            <xsl:text>&#xa;</xsl:text>
            <xsl:for-each select="xh:html/xh:body/xh:div[@wbtag='sep']">
                <xsl:element name="slide">
                    <xsl:copy-of select="@course"/>
                    <xsl:copy-of select="@week"/>
                    <xsl:copy-of select="@lecture"/>
                    <xsl:copy-of select="@chapter"/>
                    <xsl:copy-of select="@wbtag"/>
                    <xsl:copy-of select="@slide"/>
                    <xsl:copy-of select="@id"/>
                    <xsl:text>&#xa;</xsl:text>
                    <xsl:apply-templates select="xh:div[@class='slide_container']/xh:div[@class='slide_content']/xh:*[@wbtag]"/>
                    <xsl:text>&#xa;</xsl:text>
                </xsl:element>
                <xsl:text>&#xa;</xsl:text>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>

    <xsl:template match="xh:*[@wbtag='ignore']" />
    <xsl:template match="xh:*[@class='knowl-output']" />

    <xsl:template match="xh:*[@wbtag='skip']">
        <xsl:apply-templates select="xh:*|*" />
    </xsl:template>

    <xsl:template match="xh:*[@wbtag and @wbtag!='ignore' and @wbtag!='webwork' and @wbtag!='wb_image' and @wbtag!='paragraphs' and @wbtag!='skip' and not(@metadata) and @wbtag!='qed']">
        <xsl:if test="@wbtag!='ref'">
            <xsl:text>&#xa;</xsl:text>
        </xsl:if>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@wbtag"/>
            <xsl:copy-of select="@label"/>
            <xsl:copy-of select="@id"/>
            <xsl:copy-of select="@href"/>
            <!-- <xsl:text>&#xa;</xsl:text> -->
            <xsl:apply-templates select="xh:*|text()" />
            <!-- <xsl:text>&#xa;</xsl:text> -->
        </xsl:element>
        <xsl:if test="@wbtag!='ref'">
            <xsl:text>&#xa;</xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="xh:div[@wbtag='paragraphs']" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:attribute name="wbtag">
                <xsl:text>paragraphs</xsl:text>
            </xsl:attribute>
            <xsl:text>&#xa;</xsl:text>
            <xsl:apply-templates select="text()|comment()|xh:*"/>
            <xsl:text>&#xa;</xsl:text>
        </xsl:element>
    </xsl:template>

    <xsl:template match="xh:div[@wbname='statement' or @wbname='substatement']">
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbname}">
            <xsl:copy-of select="@course"/>
            <xsl:copy-of select="@week"/>
            <xsl:copy-of select="@lecture"/>
            <xsl:copy-of select="@chapter"/>
            <xsl:copy-of select="@num"/>
            <xsl:copy-of select="@type"/>
            <xsl:copy-of select="@title"/>
            <xsl:copy-of select="@label"/>
            <xsl:copy-of select="@wbtag"/>
            <xsl:apply-templates select="text()|xh:*"/>
            <xsl:text>&#xa;</xsl:text>
        </xsl:element>
    </xsl:template>

    <xsl:template match="xh:div[@wbtag='webwork']" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@ww_id"/>
            <xsl:copy-of select="@pg_file"/>
        </xsl:element>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="xh:div[@wbtag='wb_image']" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@data-src"/>
        </xsl:element>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="xh:div[@wbtag='qed']" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="qed"/>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="xh:*[@wbtag='course' or @wbtag='topic']">
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@wbtag"/>
            <xsl:apply-templates select="xh:br|text()" />
            <!-- <xsl:value-of select="."/> -->
        </xsl:element>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="xh:*[@wbtag='week' or @wbtag='lecture']">
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@wbtag"/>
            <xsl:value-of select="@chapter"/>
        </xsl:element>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <!-- <xsl:template match="xh:*[@metadata]">
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{@wbtag}">
            <xsl:copy-of select="@wbtag"/>
            <xsl:copy-of select="@content"/>
            <xsl:copy-of select="@chapter_type"/>
            <xsl:value-of select="."/>
        </xsl:element>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template> -->

    <xsl:template match="xh:span|xh:code|xh:pre|xh:b[not(@wbtag)]|xh:h1|xh:h2[not(@metadata)]|xh:h3|xh:h4|xh:h5|xh:p|xh:strong|xh:em|xh:u|xh:table|xh:tbody|xh:th|xh:tr|xh:td|xh:div|xh:a|xh:i|xh:img|xh:ul|xh:ol|xh:li|xh:center|xh:blockquote|xh:iframe|xh:br|xh:hr">
      <xsl:element name="{name()}">
          <xsl:copy-of select="@*"/>
          <xsl:apply-templates select="xh:*|text()|comment()" />
      </xsl:element>
    </xsl:template>

    <xsl:template match="xh:*[@wbtag='separator']" />

    <xsl:template match="text()" >
        <xsl:value-of select="." disable-output-escaping="no"/>
    </xsl:template>
    <xsl:template match="comment()" >
        <xsl:comment>
            <xsl:value-of select="." disable-output-escaping="no"/>
        </xsl:comment>
    </xsl:template>


</xsl:stylesheet>
