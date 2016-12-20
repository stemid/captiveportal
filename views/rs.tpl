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
    <meta content='Gästportal' name='description' />
    <meta content='Cygate AB' name='author' />
    <meta content='width=device-width, initial-scale=1.0' name='viewport' />
    <meta content="no-index,no-follow" name="robots">
    <link rel="icon" type="image/ico" href="/static/rs/images/favicon.ico">

    <link href="/static/rs/css/style.css" media="screen, projection" rel="stylesheet" type="text/css" />

    <!--[if lt IE 9]>
        <link href="/static/rs/css/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
    <![endif]-->

</head>

<body ng-app="rsPortalApp">
    <noscript>
        <div class="container">
            <p>Javascript verkar inte vara påslaget? -
              Vissa delar av Region Skånes webbplats fungerar inte optimalt utan
              javascript, kontrollera din webbläsares inställningar.</p>
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
                    <li><a title="Hem" href="/#/">Hem</a></li>
                    <li><a href="/#/FAQ-Swedish">Vanliga Frågor</a></li>
                    <li><a href="/#/English">English</a></li>
                </ul>

                <ul id="main-nav-list">
                    <li><a href="/#/">Hem</a></li>
                    <li><a href="/#/FAQ-Swedish">Vanliga Frågor</a></li>
                    <li><a href="/#/English">English</a></li>
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
      </nav>
      <h1 role="heading" class="title">Villkor för tjänsten</h1>
      <div class="body">
        <p>Region Skåne saknar ansvar för funktionalitet, innehåll och service
          på Internetsidor vilka användaren kan nå via tjänsten</p>
        <p>Region Skåne kan ej hållas ansvarig för fel eller skador på
          användarens utrustning förutom i det fall det uteslutande kan anses
          bero på Region Skåne</p>
        <p>Region Skåne kan ej lämna garanti för att tjänsten alltid kommer att
          fungera säkert utan fördröjning eller avbrott</p>
        <p>Användaren är ansvarig för att användningen följer lagar och
          författningar och att den sker på ett etiskt och korrekt sätt</p>
        <p>Användaren är ansvarig för att användningen sker på ett sätt som
          inte verkar störande för omgivningen</p>
        <p>Region Skåne äger rätt att, om ovanstående regler inte respekteras,
          stänga av eller begränsa användarens åtkomst till Internet</p>
        <p>Region Skånes Publika Gästnät använder sig av cookies för att ge
          åtkomst till Internet. För att komma ut på Internet måste du därför
        tillåta cookies i din webläsare. För mer information se
        <a href="http://www.skane.se/supportsidor/om-cookies/">Region Skånes information om cookies</a>.<p>
        <p>När du använder dig av Region Skånes internet är det viktigt att
          följa regler ex. förbudskyltar som gäller användning av enheter i
          närheten Medicinteknisk utrustning, då denna kan störas.</p>

        <form ng-submit="submit()" id="approveForm" method="post">
          <div class="static-form-block">
            <div id="error-box" class="msg-container ng-hide" ng-show="apiErrors.length > 0">
							<p ng-repeat="error in apiErrors">[%error%]</p>
            </div>

            <div class="input-container">
              <label>
                <input ng-model="approved.answer" type="checkbox" id="approveCheckbox" required> Jag godkänner avtalet
              </label>
              <button ng-disabled="apiProcessing" type="submit" class="button" id="approveButton">
								Godkänn
							</button>
							<img ng-show="apiProcessing" height="35" width="35" src="/static/rs/images/loading.gif">
            </div>
          </div>
        </form>

				<div><a href="http://www.skane.se/" title="Startsidan">Klicka här för att komma till startsidan.</a></div>
				<div><a href="http://www.skane.se/sok" title="Söksidan">Klicka här för att komma till söksidan.</a></div>
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
              <li><a title="Swedish" href="/#/Swedish">Swedish</a></li>
          </ul>
      </nav>
      <h1 role="heading" class="title">End user agreement</h1>
      <div class="body">
        <p>More here later. Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and more
          recently with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.</p>

        <form id="approveForm" method="post">
          <div class="static-form-block">
            <div id="error-box" class="msg-container" ng-show="apiErrors.length > 0">
							<p ng-repeat="error in apiErrors">[%error%]</p>
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

<script type="text/ng-template" id="faq-swe.html">
  <article role="article">
      <div class="article-img-container">
      </div>
      <nav class="header-nav">
          <ul class="help-menu">
              <li><a title="English" href="/#/English">English</a></li>
          </ul>
      </nav>
      <h1 role="heading" class="title">Vanliga frågor</h1>
      <div class="body">

				<h2>Vad behöver jag för att komma åt Internet?</h2>
				<p>En bärbar dator, läsplatta, smartphone eller en annan enhet med antingen
          ett externt WiFi-kort (kort för trådlös uppkoppling) eller inbyggt
          WiFi-kort. Detta trådlösa nät stödjer både 802.11a,802.11b, 802.11g
          och 802.11n standard.</p>
				<h2>Hur kan jag koppla upp mig mot det trådlösa nätverket?</h2>
				<p>De flesta enheter har en auto-sök funktion som bör hitta det trådlösa
          nätverket inom några minuter efter du startat den. Om så inte sker kan
          Du söka efter   nätverket Region Skane publikt. </p>

				<p>Öppna sedan en Internetläsare (t.ex. Internet explorer eller Firefox)
          och gå till valfri sida. Du kommer då se en välkomstsida.</p>
				<h2>Hur säker är Internetuppkopplingen?</h2>
				<p>Eftersom detta är ett publikt nätverk så används inte någon kryptering.
          Du bör därför se till att använda samma försiktighetsåtgärder som
          rekommenderas av   din bredbandsleverantör. För bästa skydd, använd gärna
          anti-virusprogram och brandvägg på din Enhet.</p>
				<h2>Cookies</h2>
				<p>Region Skånes Publika Gästnät använder sig av cookies för att ge åtkomst
          till Internet. För att komma ut på Internet måste du därför
				tillåta cookies i din webläsare. För mer information se
				<a href="http://www.skane.se/supportsidor/om-cookies/">Region Skånes
          information om cookies</a>.<p>
				<h2>Kan jag använda VPN genom denna Internetuppkoppling</h2>
				<p>Även om vi har testat flertalet VPN-produkter så kan vi inte garantera
          att alla VPN-klienter kan användas genom denna Internetanslutning.
          Eftersom denna     anslutning är skyddad av en brandvägg så måste din
          VPN-klient klara av NAT/PAT för att kunna koppla upp sig mot din VPN-server.
          Om du har problem eller är osäker på hur  din VPN-klient fungerar, var
          vänlig kontakta ditt företags IT-avdelning för information och hjälp.</p>
				<h2>Jag kan inte skicka e-post från denna Internetanslutning. Finns det
          några inställningar jag kan ändra?</h2>
				<p>Eftersom denna Internetanslutning tillhandahålls av region Skåne så kan
          det hända att vissa Internetsidor som innehåller material som har bedömts
          olämpligt  är spärrade. Om du försöker nå en av dessa sidor så kommer du
          att bli vidareskickad till en sida som meddelar att denna sida inte är
          tillgänglig genom det gästnätet. Om  du tror att den sidan du försökte
          nå är felaktigt spärrad så kan du skicka in URL:en och en kommentar genom
          länken "Synpunkter" på förstasidan.</p>
				<h2>Jag behöver mer hjälp. Kan jag kontakta någon på plats eller på telefon?</h2>
				<p>Vi erbjuder våra användare support via betalnummer på telefon!</p>
				<p>Supportnummer: 0900-205 25 50<br />
				<small>Kostnad för support: 19,90 kr/minut (inkl. moms)<br />
				Öppet 08:00 - 17:00 helgfria vardagar</small></p>

      </div>

      <section class="articlepage-section block-section"></section>
  </article>
</script>

<script>
	// This is fetched server side through template value.
	var plugin_timeout = {{plugin_timeout}}
</script>

<script src="/static/rs/js/angular.min.js"></script>
<script src="/static/rs/js/rsapp.js"></script>

</body>
</html>
