<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="text" encoding="UTF-8"/>
    <xsl:template match="/">
        <xsl:text>\documentclass[a4paper,12pt]{report}</xsl:text>
        <xsl:call-template name="latex-preamble" />
        <xsl:text>\begin{document}&#xa;</xsl:text>
        <xsl:apply-templates select="*"/>
       <xsl:text>&#xa;\end{document}&#xa;</xsl:text>
   </xsl:template>

<xsl:template name="latex-preamble">
\usepackage[T1]{fontenc}
\usepackage{times}
\usepackage{amsthm}
\usepackage{amscd,amssymb,stmaryrd}
\usepackage{amsmath}
\usepackage{graphicx}
\usepackage{fancybox}
\usepackage{amstext}
\usepackage{color}
\usepackage{mathtools}
\usepackage{pdflscape}
\usepackage{listings}
\usepackage{epic,eepic}
\usepackage{fancyhdr}
\usepackage{hyperref}
\usepackage[capitalise]{cleveref}
<!-- \usepackage{booktabs} -->

\newcommand{\abs}[1]{\left|#1\right|}
\newcommand{\ds}{\displaystyle}
\newcommand{\ol}[1]{\overline{#1}}
\newcommand{\oll}[1]{\overline{\overline{#1}}}
\newcommand{\bs}{\backslash}
\newcommand{\Frac}{\mathrm{Frac}}
\newcommand{\im}{\mathrm{im}\,}
\newcommand{\ZZ}{\mathbb{Z}}
\newcommand{\ra}{\longrightarrow}
\newcommand{\ord}{\mathrm{ord}\,}
\newcommand{\GL}{{\rm GL}}
\newcommand{\SL}{{\rm SL}}
\newcommand{\SO}{{\rm SO}}
\newcommand{\colvec}[1]{\begin{pmatrix}#1\end{pmatrix}}
\newcommand{\Span}{{\rm Span}\,}
\newcommand{\Rank}{{\rm Rank}\,}
\newcommand{\nullity}{{\rm nullity}\,}
\newcommand{\adj}{{\rm adj}\,}
\newcommand{\Proj}{{\rm Proj}}
\newcommand{\ora}{\overrightarrow}
\newcommand{\ve}{\varepsilon}
\newcommand{\phib}{\ol{\phi}}
\renewcommand{\ord}{\mathrm{ord}\,}
\newtheorem{thm}[equation]{Theorem}
\newtheorem{prop}[equation]{Proposition}
\newtheorem{defn}[equation]{Definition}
\newtheorem{lemma}[equation]{Lemma}
\newtheorem{claim}[equation]{Claim}
\newtheorem{cor}[equation]{Corollary}
\newtheorem{fact}[equation]{Fact}
\theoremstyle{remark}
\newtheorem{example}[equation]{\bf Example}
\newtheorem{eg}[equation]{\bf Example}
\newtheorem{ex}[equation]{\bf Exercise}
\newtheorem*{notation}{\bf Notation}
\newtheorem*{sol}{\bf Solution}
\newtheorem*{remark}{\bf Remark}
\numberwithin{equation}{chapter}
<!-- \renewcommand{\thesubsection}{\thechapter.\arabic{subsection}} -->
\renewcommand{\thesubsection}{}
<!-- \renewcommand{\thesection}{\arabic{section}} -->
\renewcommand{\thesection}{}
</xsl:template>

    <xsl:template match="/slides/slide">
        <!-- <xsl:text>&#xa;\quad\\\hrule&#xa;\quad\\&#xa;</xsl:text> -->
        <xsl:apply-templates select="*" />
    </xsl:template>

    <xsl:template match="keywords|keyword|hc_keyword"/>

    <xsl:template match="course">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\title{</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>}</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="week|lecture">
        <xsl:text>&#xa;</xsl:text>
        <xsl:value-of select="concat('\setcounter{chapter}{', current(), '}')"/>
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\chapter*{</xsl:text>
        <xsl:value-of select="//course"/><xsl:text> </xsl:text>
        <xsl:value-of select="@chapter_type"/><xsl:text> </xsl:text><xsl:value-of select="."/>
        <xsl:text>}</xsl:text>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="topic">
        <xsl:text>&#xa;{\bf </xsl:text>
        <xsl:apply-templates select="*|text()" />
        <xsl:text>}&#xa;</xsl:text>
        <xsl:text>&#xa;\quad\\\hrule&#xa;\quad\\&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="a">
        <xsl:value-of select="."/>
    </xsl:template>

    <xsl:template match="paragraphs" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:apply-templates select="*|text()|comment()" />
    </xsl:template>

    <xsl:template match="col|newcol" >
        <!-- <xsl:text>&#xa;</xsl:text> -->
        <xsl:apply-templates select="*" />
    </xsl:template>

    <xsl:template match="statement|substatement">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\begin{</xsl:text>
        <xsl:value-of select="@wbtag"/>
        <xsl:text>}</xsl:text>
        <xsl:choose>
            <xsl:when test="@title">
                <xsl:text>[</xsl:text>
                <xsl:value-of select="@title"/>
                <xsl:text>]&#xa;</xsl:text>
            </xsl:when>
        </xsl:choose>

        <xsl:choose>
            <xsl:when test="@label">
                <xsl:text>&#xa;\label{</xsl:text>
                <xsl:value-of select="@label"/>
                <xsl:text>}&#xa;</xsl:text>
            </xsl:when>
        </xsl:choose>
        <xsl:apply-templates select="*" />
        <xsl:text>&#xa;\end{</xsl:text>
        <xsl:value-of select="@wbtag"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- <xsl:template match="p|table|tbody|th|tr|td|div[@class='image']|a|img|li">
        <xsl:text>&#xa;</xsl:text>
        <xsl:element name="{name()}">
            <xsl:apply-templates select="*|text()" />
            <xsl:text>&#xa;</xsl:text>
        </xsl:element>
    </xsl:template> -->

    <xsl:template match="ul|col_ul">
        <xsl:text>&#xa;\quad\\&#xa;</xsl:text>
        <xsl:text>\begin{itemize}</xsl:text>
        <xsl:apply-templates select="*" />
        <xsl:text>\end{itemize}</xsl:text>
    </xsl:template>

    <xsl:template match="ol|col_ol">
        <xsl:text>&#xa;\quad\\&#xa;</xsl:text>
        <xsl:text>\begin{enumerate}</xsl:text>
        <xsl:apply-templates select="*" />
        <xsl:text>\end{enumerate}</xsl:text>
    </xsl:template>

    <xsl:template match="li|col_li">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\item </xsl:text>
        <xsl:apply-templates select="text()|*" />
    </xsl:template>

    <xsl:template match="webwork">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>{\bf WeBWork}</xsl:text>
    </xsl:template>

    <xsl:template match="h1">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\chapter{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="h2">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\section{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="h3">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\subsection{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="h4">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\subsubsection{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="h5">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\textbf{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>

    <!-- <xsl:template match="h1|h2|h3|h4|h5">
        <xsl:apply-templates select="text()" />
    </xsl:template> -->

    <xsl:template match="br">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="hr">
        <xsl:text>&#xa;\quad\\\hrule&#xa;\quad\\&#xa;</xsl:text>
    </xsl:template>


    <xsl:template match="u">
        <!-- <xsl:text> </xsl:text> -->
        <xsl:text> \underline{ </xsl:text>
            <xsl:apply-templates select="*|text()" />
        <xsl:text>} </xsl:text>
    </xsl:template>

    <xsl:template match="b|strong|em">
        <!-- <xsl:text> </xsl:text> -->
        <xsl:text> {\bf </xsl:text>
            <xsl:apply-templates select="*|text()" />
        <xsl:text>} </xsl:text>
    </xsl:template>

    <xsl:template match="ref">
        <xsl:value-of select="concat('\cref{', @label, '}')"/>
    </xsl:template>

    <xsl:template match="linebreak|br">
        <xsl:text>&#xa;&#xa;&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="text()" >
        <!-- <xsl:value-of select="normalize-space(.)" /> -->
        <xsl:value-of select="." />
    </xsl:template>
    <xsl:template match="comment()" >
    </xsl:template>

    <xsl:template match="div"/>

    <!-- https://stackoverflow.com/questions/19716449/converting-xhtml-table-to-latex-using-xslt -->
    <xsl:template match="table">
        <xsl:text>\begin{center}&#10;</xsl:text>
        <xsl:text>\begin{tabular}{|</xsl:text>

        <xsl:for-each select="thead/tr[1]/*|tr[1]/*">
            <xsl:choose>
                <xsl:when test="@colspan">
                    <xsl:for-each select="(//*)[position()&lt;=current()/@colspan]">|c|</xsl:for-each>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:choose>
                        <xsl:when test="position() = 1">c</xsl:when>
                        <xsl:otherwise>|c</xsl:otherwise>
                    </xsl:choose>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
        <xsl:text>|}&#10;</xsl:text>


        <xsl:for-each select="thead/tr">
            <xsl:text>\hline&#10;</xsl:text>
            <xsl:for-each select="td|th">
                <xsl:if test="self::th|self::td">\bfseries </xsl:if>
                <xsl:apply-templates />
                <xsl:if test="position() != last()">
                    <xsl:text>&amp;</xsl:text>
                </xsl:if>
            </xsl:for-each>
            <xsl:text>\\\hline&#10;</xsl:text>
        </xsl:for-each>

        <xsl:for-each select="tr|tbody/tr">
            <!-- <xsl:if test="position() != 1">
                <xsl:text>\hline&#10;</xsl:text>
            </xsl:if> -->

            <xsl:text>\hline&#10;</xsl:text>

            <!-- <xsl:if test="position() = 2">
                <xsl:text>\hline&#10;</xsl:text>
            </xsl:if> -->

            <xsl:for-each select="td|th">
                <xsl:if test="self::th">\bfseries </xsl:if>
                <xsl:apply-templates />
                <xsl:if test="position() != last()">
                    <xsl:text>&amp;</xsl:text>
                </xsl:if>
            </xsl:for-each>

            <xsl:if test="position()!=last()"> \\&#10;</xsl:if>
        </xsl:for-each>

        <xsl:text>\\\hline&#10;</xsl:text>
        <xsl:text>\end{tabular}&#10;</xsl:text>
        <xsl:text>\end{center}</xsl:text>

    </xsl:template>

</xsl:stylesheet>
