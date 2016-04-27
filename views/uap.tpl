<!DOCTYPE html>
<!--[if lt IE 7]> <html lang="en" class="no-js ie6 oldie"> <![endif]-->
<!--[if IE 7]>    <html lang="en" class="no-js lt-ie9 lt-ie8 oldie"> <![endif]-->
<!--[if IE 8]>    <html lang="en" class="no-js lt-ie9 oldie"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class='no-js' lang='sv'>
<!--<![endif]-->

<head>
    <meta charset='utf-8' />
    <title>Gästportal - Region Skåne</title>
    <meta content='' name='description' />
    <meta content='' name='author' />
    <meta content='width=device-width, initial-scale=1.0' name='viewport' />
    <meta content="no-index,no-follow" name="robots">
    <link rel="icon" type="image/ico" href="favicon.ico">

    <link href="/static/css/style.css" media="screen, projection" rel="stylesheet" type="text/css" />

    <!--[if lt IE 9]>
        <link href="/static/css/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <![endif]-->

</head>

<body ng-app="rsPortalApp"> 
    <noscript>
        <div class="container">
            <p>Javascript verkar inte vara påslaget? - Vissa delar av Region Skånes webbplats fungerar inte optimalt utan javascript, kontrollera din webbläsares inställningar.</p>
        </div>
    </noscript>
    <div id="tab-support-container">
        <nav id="tab-support-nav" class="container">
            <ul id="tab-support-list"></ul>
        </nav>
    </div>
    <header role="banner" id="header-container">
        <div class="container">
            <div id="site-header">
                <div class="column-inner">
                    <a accesskey="1" class="logo" href="/">
                        <img src="/static/images/RSKlogo.svg" alt="Region Skåne">
                        <span>Logotyp</span>
                    </a>
                    <h1 id="site-title">Region Skåne</h1>
                </div>
            </div>


            <nav role="navigation" id="main-nav">
                <ul id="mobile-controls">
                    <li class="access-menu-item has-back-btn"><a title="meny" class="expand-menu" href="#">Meny</a></li>
                </ul>

                <ul id="mobile-nav-list">
                    <li><a title="Hem" href="/">Hem</a></li>
                </ul>

                <ul id="main-nav-list">
                    <li><a href="/">Hem</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <div id="main" ng-controller="RSMainCtrl">


        <div class="layout-quarters layout-article">
            <div id="sub-nav" class="minor nav-area">
                <nav class="navigation-block column-inner tablet-medium-hide">
                </nav>
            </div>
            <div class="major layout-thirds">
                <div class="minor"></div>
                <div role="main" class="major primary-area">
                    <div class="article column-inner">
                      <ng-view></ng-view>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div role="contentinfo" id="footer-linkbar">
        <div class="container">
            <span class="copyright-text">© Region Skåne - Alla rättigheter förbehållna</span>
        </div>
    </div>

<script type="text/ng-template" id="swedish.html">
  <article role="article">
      <div class="article-img-container">
      </div>
      <nav class="header-nav">
          <ul class="help-menu">
              <li class="speech"><a class="activate-speech" title="Lyssna" href="#">Lyssna</a></li>
              <li class="print hide-on-handheld-land"><a class="print-page" title="Skriv ut" href="#">Skriv ut</a></li>
              <li><a title="English" href="/#/English">English</a></li>
          </ul>
      </nav>
      <h1 role="heading" class="title">Villkor för tjänsten</h1>
      <div class="body">
        <p>Region Skåne saknar ansvar för funktionalitet, innehåll och service på Internetsidor vilka användaren kan nå via tjänsten</p>
        <p>Region Skåne kan ej hållas ansvarig för fel eller skador på användarens utrustning förutom i det fall det uteslutande kan anses bero på Region Skåne</p>
        <p>Region Skåne kan ej lämna garanti för att tjänsten alltid kommer att fungera säkert utan fördröjning eller avbrott</p>
        <p>Användaren är ansvarig för att användningen följer lagar och författningar och att den sker på ett etiskt och korrekt sätt</p>
        <p>Användaren är ansvarig för att användningen sker på ett sätt som inte verkar störande för omgivningen</p>
        <p>Region Skåne äger rätt att, om ovanstående regler inte respekteras, stänga av eller begränsa användarens åtkomst till Internet</p>
        <p>Region Skånes Publika Gästnät använder sig av cookies för att ge åtkomst till Internet. För att komma ut på Internet måste du därför
        tillåta cookies i din webläsare. För mer information se
        <a href="http://www.skane.se/supportsidor/om-cookies/">Region Skånes information om cookies</a>.<p>
        <p>När du använder dig av Region Skånes internet är det viktigt att följa regler ex. förbudskyltar som gäller användning av enheter i närheten Medicinteknisk utrustning, då denna kan störas.</p>

        <form id="approveForm" method="post">
          <div class="static-form-block">
            <div id="error-box" class="msg-container success-msg hide">
            </div>

            <div class="input-container">
              <label>
                <input type="checkbox" id="approveCheckbox" required> Jag godkänner avtalet
              </label>
              <input type="submit" class="button" id="approveButton" value="Godkänn">
            </div>
          </div>
        </form>

      </div>

      <section class="articlepage-section block-section"></section>
  </article>
</script>

<script type="text/ng-template" id="english.html">
  <article role="article">
      <div class="article-img-container">
      </div>
      <nav class="header-nav">
          <ul class="help-menu">
              <li class="speech"><a class="activate-speech" title="Listen" href="#">Listen</a></li>
              <li class="print hide-on-handheld-land"><a class="print-page" title="Print page" href="#">Print page</a></li>
              <li><a title="Swedish" href="/#/Swedish">Swedish</a></li>
          </ul>
      </nav>
      <h1 role="heading" class="title">End user agreement</h1>
      <div class="body">
        <p>More here later. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

        <form id="approveForm" method="post">
          <div class="static-form-block">
            <div id="error-box" class="msg-container success-msg hide">
            </div>

            <div class="input-container">
              <label>
                <input type="checkbox" id="approveCheckbox" required> I approve the end user agreement
              </label>
              <input type="submit" class="button" id="approveButton" value="Approve">
            </div>
          </div>
        </form>

      </div>

      <section class="articlepage-section block-section"></section>
  </article>
</script>

<script>
    var plugin_ttl = {{plugin_ttl}};
</script>
<script src="http://www.talandewebb.se/ba.se.js"></script>
<script src="http://code.jquery.com/jquery-1.12.2.min.js"></script>
<script src="/static/js/angular.min.js"></script>
<script src="/static/js/rs-captiveportal.js"></script>
</body>
</html>
