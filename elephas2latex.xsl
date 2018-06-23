<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="text" encoding="UTF-8"/>
    <xsl:template match="/">
        <xsl:text>\documentclass[a4paper,12pt]{report}</xsl:text>
        <xsl:call-template name="latex-preamble" />
        <xsl:text>\begin{document}&#xa;</xsl:text>
        <xsl:apply-templates select="*"/>
       <xsl:text>\end{document}&#xa;</xsl:text>
    </xsl:template>

    <xsl:template name="latex-preamble">
        <xsl:text>\usepackage[T1]{fontenc}</xsl:text>
        <xsl:text>\usepackage{times}</xsl:text>
        <xsl:text>\usepackage{amsthm}</xsl:text>
        <xsl:text>\usepackage{amscd,amssymb,stmaryrd}</xsl:text>
        <xsl:text>\usepackage{amsmath}</xsl:text>
        <xsl:text>\usepackage{graphicx}</xsl:text>
        <xsl:text>\usepackage{fancybox}</xsl:text>
        <xsl:text>\usepackage{amstext}</xsl:text>
        <xsl:text>\usepackage{color}</xsl:text>
        <xsl:text>\usepackage{mathtools}</xsl:text><xsl:text>
        \usepackage{pdflscape}</xsl:text><xsl:text>
        \usepackage{listings}</xsl:text><xsl:text>
        \usepackage{epic,eepic}</xsl:text><xsl:text>
        \usepackage{fancyhdr}</xsl:text><xsl:text>
        \newcommand{\abs}[1]{\left|#1\right|}</xsl:text><xsl:text>
        \newcommand{\ds}{\displaystyle}</xsl:text><xsl:text>
        \newcommand{\ol}[1]{\overline{#1}}</xsl:text><xsl:text>
        \newcommand{\oll}[1]{\overline{\overline{#1}}}</xsl:text><xsl:text>
        \newcommand{\bs}{\backslash}</xsl:text><xsl:text>
        \newcommand{\Frac}{\mathrm{Frac}}</xsl:text><xsl:text>
        \newcommand{\im}{\mathrm{im}\,}</xsl:text><xsl:text>
        \newcommand{\ZZ}{\mathbb{Z}}</xsl:text><xsl:text>
        \newcommand{\ra}{\longrightarrow}</xsl:text><xsl:text>
        \newcommand{\ord}{\mathrm{ord}\,}</xsl:text><xsl:text>
        \newcommand{\GL}{{\rm GL}}</xsl:text><xsl:text>
        \newcommand{\SL}{{\rm SL}}</xsl:text><xsl:text>
        \newcommand{\SO}{{\rm SO}}</xsl:text><xsl:text>
        \newcommand{\colvec}[1]{\begin{pmatrix}#1\end{pmatrix}}</xsl:text><xsl:text>
        \newcommand{\Span}{{\rm Span}\,}</xsl:text><xsl:text>
        \newcommand{\Rank}{{\rm Rank}\,}</xsl:text><xsl:text>
        \newcommand{\nullity}{{\rm nullity}\,}</xsl:text><xsl:text>
        \newcommand{\adj}{{\rm adj}\,}</xsl:text><xsl:text>
        \newcommand{\Proj}{{\rm Proj}}</xsl:text><xsl:text>
        \newcommand{\ora}{\overrightarrow}</xsl:text><xsl:text>
        \newcommand{\ve}{\varepsilon}</xsl:text><xsl:text>
        \newcommand{\phib}{\ol{\phi}}</xsl:text>
        \newtheorem{thm}[equation]{Theorem}
        % \newtheorem{defn}[equation]{Definition}
        \newtheorem{lemma}[equation]{Lemma}
        \newtheorem{claim}[equation]{Claim}
        \newtheorem{cor}[equation]{Corollary}

        \theoremstyle{remark}
        \newtheorem{example}[equation]{\bf Example}
        \newtheorem{eg}[equation]{\bf Example}
        \newtheorem{ex}[equation]{\bf Exercise}
        \newtheorem*{notation}{\bf Notation}
        \newtheorem*{remark}{\bf Remark}
        \newtheorem*{defn}{\bf Definition}

        \numberwithin{equation}{section}

    </xsl:template>


    <xsl:template match="/slides/slide">
        <xsl:text>&#xa;\quad\\\hrule&#xa;\quad\\&#xa;</xsl:text>
        <xsl:apply-templates select="*" />
    </xsl:template>


    <xsl:template match="paragraphs" >
        <xsl:text>&#xa;</xsl:text>
        <xsl:apply-templates select="*|text()" />
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
        <xsl:text>&#xa;\quad\\</xsl:text>
        <xsl:text>\begin{itemize}</xsl:text>
        <xsl:apply-templates select="*" />
        <xsl:text>\end{itemize}</xsl:text>
    </xsl:template>

    <xsl:template match="ol|col_ol">
        <xsl:text>&#xa;\quad\\</xsl:text>
        <xsl:text>\begin{enumerate}</xsl:text>
        <xsl:apply-templates select="*" />
        <xsl:text>\end{enumerate}</xsl:text>
    </xsl:template>

    <xsl:template match="li|col_li">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\item</xsl:text>
        <xsl:apply-templates select="*" />
    </xsl:template>

    <xsl:template match="h1">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\chapter{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template match="h2">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\section{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template match="h3">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\subsection{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template match="h4">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\subsubsection{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}</xsl:text>
    </xsl:template>
    <xsl:template match="h5">
        <xsl:text>&#xa;</xsl:text>
        <xsl:text>\textbf{</xsl:text>
        <xsl:apply-templates select="text()" />
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- <xsl:template match="h1|h2|h3|h4|h5">
        <xsl:apply-templates select="text()" />
    </xsl:template> -->

    <xsl:template match="b|strong|em">
        <!-- <xsl:text> </xsl:text> -->
        <xsl:text> {\bf </xsl:text>
            <xsl:apply-templates select="*|text()" />
        <xsl:text>} </xsl:text>
    </xsl:template>

    <xsl:template match="course|week|lecture|topic">
        <xsl:text>&#xa;</xsl:text>
        <xsl:value-of select="concat('@', name(), '{', @content , '}')"/>
    </xsl:template>

    <xsl:template match="ref">
        <xsl:value-of select="concat(' @ref{', @label, '}')"/>
    </xsl:template>

    <xsl:template match="linebreak">
        <xsl:text>&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="text()" >
        <xsl:value-of select="normalize-space(.)" />
    </xsl:template>


</xsl:stylesheet>
