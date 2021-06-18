<#assign wp=JspTaglibs["/aps-core"]>
<#assign c=JspTaglibs["http://java.sun.com/jsp/jstl/core"]>
<html>
<head>
    <meta charset="utf-8"/>
    <title>
        <@wp.currentPage param="title" /> - <@wp.i18n key="PORTAL_TITLE" />
    </title>
    <meta name="viewport" content="width=device-width,  user-scalable=no"/>
    <meta name="description" content=""/>
    <meta name="author" content="DM"/>
    <link rel="icon" href="<@wp.imgURL />favicon.png" type="image/png"/>
    <@wp.fragment code="header_inclusions" escapeXml=false />
</head>
<#assign owner><@wp.currentPage param="owner"/></#assign>
<#assign resourceURL><@wp.resourceURL /></#assign>
<script nonce="<@wp.cspNonce />">window.RESOURCE_NAME = "${resourceURL}"</script>
<body class="internal">
<@wp.fragment code="cp_keycloak_auth_with_redirect" escapeXml=false />

<div class="entando-navbar-fixed md-and-up">
    <div class="entando-navbar-up">
        <div class="container entando-container">
            <#if owner == 'partners'>
                <div class="float-left">
                            <span class="entando-central">
                            <a href="<@wp.url page="homepage" />" target="_blank"><@wp.i18n key="GOTO_HOME" /></a>
                            </span>
                </div>
            </#if>
            <div class="float-right">
                <@wp.show frame=0/>
                <@wp.show frame=1 />
                <@wp.show frame=2 />
            </div>
        </div>
    </div>
</div>
<nav class="navbar navbar-expand-xl sticky-top entando-navbar ">
    <div class="container entando-container">
        <@wp.show frame=3 />
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <div id="entando-toogle-button">
                <input type="checkbox"/>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <@wp.show frame=4 />
            <@wp.show frame=5 />
            <div class="entando-navbar-cta md-and-up page-model ">
                <@wp.show frame=6 />
                <a href="<@wp.url page="quote" />" class="btn btn-entando-quote my-2 my-sm-0">get a quote</a>
            </div>
        </div>
    </div>
</nav>

<@wp.show frame=7 />
<@wp.show frame=8 />
<@wp.show frame=9 />
<@wp.show frame=10 />
<@wp.show frame=11 />
<@wp.show frame=12 />
<@wp.show frame=13 />
<@wp.show frame=14 />
<@wp.show frame=15 />
<@wp.show frame=16 />
<@wp.show frame=17 />

<div class="entando-footer">
    <div class="container entando-container">
        <@wp.show frame=18 />
        <@wp.show frame=19 />
        <@wp.show frame=20 />
        <@wp.show frame=21 />
        <@wp.show frame=22 />
        <@wp.show frame=23 />
    </div>
</div>

<div class="entando-social-sharing md-and-up">
    <div class="container entando-container">
        <@wp.show frame=24 />
    </div>
</div>

<div class="entando-social-sharing md-and-down mb-2">
    <div class="container entando-container">
        <@wp.show frame=24 />
    </div>
</div>
<@wp.fragment code="fragment_entando_copyright_vatcode" escapeXml=false />

<script nonce="<@wp.cspNonce />" type="text/javascript"
        src="<@wp.resourceURL />static/js/dropdownAnimation.js"/></script>
<script nonce="<@wp.cspNonce />" type="text/javascript" src="<@wp.resourceURL />static/js/aos.js"></script>

<script nonce="<@wp.cspNonce />">
    AOS.init({

        duration: 1500,
        easing: 'ease',
        once: true
    });
</script>

</body>
</html>
