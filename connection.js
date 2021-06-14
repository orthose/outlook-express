let token_mg = "" // Token Microsoft Graph

function connection() {
  token_mg = $("input[type='password']").val()
  if (token_mg !== "") {
    get_calendars();
    // Revenir en haut de la page
    window.scrollTo(0,0);
  }
}