<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <title>Captive Portal demo</title>
  <meta name="description" content="Captive Portal demo">
  <meta name="author" content="Stefan Midjich">

  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="stylesheet" href="/static/css/normalize.css">
  <link rel="stylesheet" href="/static/css/skeleton.css">
  <link rel="stylesheet" href="/static/css/captiveportal.css">

</head>
<body>

  <div class="container">
    <noscript>
      <div class="row">
        <div class="six columns msgbox msgbox-error" style="margin-top: 2%;">
          <p>Denna sidan kräver Javascript, du måste aktivera Javascript i din webbläsare för att fortsätta.</p>
        </div>
      </div>
    </noscript>

    <div class="row">
      <div class="six columns" style="margin-top: 10%">
        <h4>End User Agreement</h4>

        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was popularised
          in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.</p>

        <p>It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of using
          Lorem Ipsum is that it has a more-or-less normal distribution of letters,
          as opposed to using 'Content here, content here', making it look like
          readable English. Many desktop publishing packages and web page editors
          now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have
          evolved over the years, sometimes by accident, sometimes on purpose
          (injected humour and the like).</p>
      </div>
    </div>

    <form id="approveForm" method="post">
      <div class="row">
        <div id="error-box" class="five columns msgbox msgbox-error">
        </div>
				<div id="statusDiv">
				</div>
      </div>

      <div id="form-row" class="row">
        <div class="four columns">
          <label>
            <input type="checkbox" id="approveCheckbox" required> I approve this user agreement
          </label>
        </div>
        <div id="approveButtonDiv" class="one column u-pull-left">
          <label>
						<button class="button-primary" id="approveButton" type="submit">Approve</button>
            <!--<input id="approveButton" class="button-primary" value="Approve" type="submit">-->
          </label>
        </div>
      </div>
    </form>

  </div>

  <script>
    var plugin_timeout = {{plugin_timeout}};
  </script>
  <script src="/static/js/jquery-1.12.2.min.js"></script>
  <script src="/static/js/captiveportal.js"></script>

</body>
</html>
