<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" />
    <xsl:output indent="yes"/>
    <xsl:template match="/">
        <xsl:apply-templates select="slides|bare" />
    </xsl:template>

    <xsl:template match="bare">
        <slides>
            <slide slide="1" id="s1">
                <xsl:copy-of select="."/>
            </slide>
        </slides>
    </xsl:template>

    <xsl:template match="slides">
        <slides>
            <keywords>
                <xsl:attribute name="slide">
                    <xsl:text>all</xsl:text>
                </xsl:attribute>
                <xsl:for-each select="//b|//hc_keyword">
                    <xsl:choose>
                        <xsl:when test="not(contains(current(), 'Exercise'))">
                            <xsl:element name="keyword">
                                <xsl:attribute name="slide">
                                    <xsl:text>all</xsl:text>
                                </xsl:attribute>
                                <xsl:value-of select="current()"/>
                            </xsl:element>
                        </xsl:when>
                    </xsl:choose>
                </xsl:for-each>
                <xsl:for-each select="//statement[@title]">
                    <xsl:element name="keyword">
                        <xsl:attribute name="slide">
                            <xsl:text>all</xsl:text>
                        </xsl:attribute>
                        <xsl:value-of select="@title"/>
                    </xsl:element>
                </xsl:for-each>
            </keywords>
            <xsl:apply-templates select="slide" />
        </slides>
    </xsl:template>

    <xsl:template match="slide">
        <slide>
            <xsl:attribute name="id">
                <xsl:text>s</xsl:text>
                <xsl:number format="1" level="any" count="slide"/>
            </xsl:attribute>
            <xsl:attribute name="slide">
                <xsl:number format="1" level="any" count="slide"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <keywords>
                <xsl:attribute name="slide">
                    <xsl:number format="1" level="any" count="slide"/>
                </xsl:attribute>
                <xsl:for-each select="*//b|hc_keyword">
                    <xsl:if test="not(contains(., 'Exercise'))">
                        <xsl:element name="keyword">
                            <xsl:attribute name="slide">
                                <xsl:number format="1" level="any" count="slide"/>
                            </xsl:attribute>
                            <xsl:value-of select="."/>
                        </xsl:element>
                    </xsl:if>
                </xsl:for-each>
                <xsl:for-each select="statement[@title] | *//statement[@title]">
                    <xsl:element name="keyword">
                        <xsl:attribute name="slide">
                                <xsl:number format="1" level="any" count="slide"/>
                        </xsl:attribute>
                        <xsl:value-of select="@title"/>
                    </xsl:element>
                </xsl:for-each>
            </keywords>
            <xsl:apply-templates select="*|text()|comment()"/>
        </slide>
    </xsl:template>

    <xsl:template match="*">
        <!-- <xsl:copy-of select="current()" disable-output-escaping="yes"/> -->
        <!-- <xsl:copy-of select="current()"/> -->
        <xsl:element name="{name()}">
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates select="*|text()|comment()"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="text()|comment()">
        <!-- <xsl:value-of select="." disable-output-escaping="yes" /> -->
        <xsl:copy-of select="current()"/>
    </xsl:template>

</xsl:stylesheet>
