// Demande de code d'autorisation à Microsoft Graph
function get_authorization() {
  const url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
  + "?client_id=" + config["client_id"]
  + "&redirect_uri=" + encodeURIComponent(config["redirect_uri"])
  + "&response_type=code"
  + "&scope=" + config["scope"];
  window.location.href = url;
}

// Chargement de la page des calendriers
function start() {
  get_calendars();
  // Revenir en haut de la page
  window.scrollTo(0,0);
  // Revenir en arrière pour revenir à l'accueil
  window.onpopstate = function(event) {
    window.location.href="index.php";
  };
  history.pushState({page: 1}, "Accueil");
}

// Démarrer l'application en chargeant les calendriers
// Si on a entré le token manuellement
function start_with_token() {
  const input_token = $("input[type='password']").val()
  if (input_token !== "") {
    token_mg = input_token;
    start();
  }
}

// Démarrer l'application en chargeant les calendriers
// Si on n'a pas entré de token mais que l'on s'est connecté à Microsoft
function start_without_token() {
  if (token_mg === "") {error();}
  else {start();}
}

// Récupère le nombre de connexions à l'application et
// l'incrémente de 1
function stats() {
  $.ajax({
    url: document.location.href.replace(/(http:\/\/[^\/]+\/).*/,"$1") + "outlook-express/stats.php",
    type: 'GET',
    dataType: 'json',
  }).done(function(n) {
    $("#views").html(n + " Visites");
  }).fail(function(e) {
    $("#views").html(0 + " Visites");
  });
}