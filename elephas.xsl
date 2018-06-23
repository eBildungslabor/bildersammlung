<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" />
    <xsl:template match="/">
        <!-- <xsl:for-each select="//b[(@class != 'notkw') or not(@class)]"> -->
        <slides>
            <xsl:apply-templates select="slides|bare" />
        </slides>
    </xsl:template>

    <xsl:template match="bare">
        <xsl:copy-of select="."/>
    </xsl:template>

    <xsl:template match="slides">
        <keywords>
            <xsl:attribute name="slide">
                <xsl:text>all</xsl:text>
            </xsl:attribute>
            <xsl:for-each select="//b">
                <xsl:if test="not(contains(., 'Exercise'))">
                    <xsl:element name="keyword">
                        <xsl:attribute name="slide">
                            <xsl:text>all</xsl:text>
                        </xsl:attribute>
                        <xsl:value-of select="."/>
                    </xsl:element>
                </xsl:if>
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
    </xsl:template>

    <xsl:template match="slide">
        <slide>
            <xsl:attribute name="id">
                <!-- <xsl:value-of select="@id"/> -->
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
                <xsl:for-each select="*//b">
                    <xsl:if test="not(contains(., 'Exercise'))">
                        <xsl:element name="keyword">
                            <xsl:attribute name="slide">
                                <!-- <xsl:value-of select="@slide"/> -->
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
            <xsl:apply-templates select="*|text()"/>
        </slide>
    </xsl:template>

    <xsl:template match="*|text()">
        <xsl:copy-of select="."/>
    </xsl:template>

</xsl:stylesheet>
