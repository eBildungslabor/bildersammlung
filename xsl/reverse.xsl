<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:xh="http://www.w3.org/1999/xhtml"
exclude-result-prefixes="xh"
    >
<!-- <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
        xmlns:xml="http://www.w3.org/XML/1998/namespace"
        xmlns:exsl="http://exslt.org/common"
        xmlns:date="http://exslt.org/dates-and-times"
        xmlns:str="http://exslt.org/strings"
        extension-element-prefixes="exsl date str"
        > -->

    <xsl:output method="text" />
    <!-- <xsl:output method="html" indent="yes" encoding="UTF-8" doctype-system="about:legacy-compat" /> -->
    <xsl:output method="text" />
    <xsl:template match="/">
        <xsl:for-each select="/xh:html/xh:body/xh:div[@wbtag='@sep']">
            <xsl:text>&#xa;</xsl:text>
            <xsl:value-of select="@wbtag" />
            <xsl:apply-templates select="*"/>
        </xsl:for-each>
    </xsl:template>


    <xsl:template match="xh:div[@class='markdown']" >
        <xsl:apply-templates select="text()|xh:*[@wbtag!='ignore']|xh:br|xh:b|xh:hr|xh:h1|xh:h2|xh:h3|xh:h4|xh:h5|xh:p"/>
        <!-- <xsl:apply-templates select="text()|xh:div[@wbtag='@col' or @wbtag='@newcol']"/> -->
    </xsl:template>

    <xsl:template match="xh:div[@wbname='statement']">
        <xsl:value-of select="@wbtag" />
        <xsl:text>&#xa;</xsl:text>
        <xsl:apply-templates select="xh:blockquote"/>
    </xsl:template>

    <xsl:template match="xh:blockquote">
        <xsl:apply-templates select="xh:*" />
    </xsl:template>

    <xsl:template match="xh:div[@wbtag='@newcol']">
        <xsl:text>&#xa;</xsl:text>
        <xsl:value-of select="@wbtag" />
        <xsl:text>&#xa;</xsl:text>
        <xsl:apply-templates select="xh:*"/>
        <xsl:text>&#xa;@endcol&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="xh:*[@wbtag!='ignore']">
        <xsl:text>&#xa;</xsl:text>
        <xsl:value-of select="@wbtag" />
        <!-- <xsl:text>&#xa;</xsl:text> -->
        <xsl:apply-templates select="xh:*"/>
    </xsl:template>


    <xsl:template match="xh:*[@wbtag='ignore']" />
    <xsl:template match="xh:*[@wbtag='separator']" />


    <xsl:template match="xh:br|xh:hr">
        <xsl:text>&lt;</xsl:text>
        <xsl:value-of select="name()" />
        <xsl:text>/&gt;</xsl:text>
    </xsl:template>

    <xsl:template match="xh:b|xh:h1|xh:h2|xh:h3|xh:h4|xh:h5|xh:p|xh:strong|xh:em">
        <xsl:text>&lt;</xsl:text>
        <xsl:value-of select="name()" />
        <xsl:text>&gt;</xsl:text>
        <xsl:value-of select="." />
        <xsl:text>&lt;/</xsl:text>
        <xsl:value-of select="name()" />
        <xsl:text>&gt;</xsl:text>
    </xsl:template>


    <xsl:template match="text()" >
        <!-- <xsl:text>&#xa;</xsl:text> -->
        <xsl:value-of select="." />
    </xsl:template>


</xsl:stylesheet>
