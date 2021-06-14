let token_mg = "" // Token Microsoft Graph

function connection() {
  token_mg = $("input[type='password']").val()
  if (token_mg !== "") {
    get_calendars();
    // Revenir en haut de la page
    window.scrollTo(0,0);
    // Revenir en arrière pour revenir à l'accueil
    window.onpopstate = function(event) {
      window.location.href="index.html";
    };
    history.pushState({page: 1}, "Accueil");
  }
}