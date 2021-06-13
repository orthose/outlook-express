let token_mg = "" // Token Microsoft Graph

function connection() {
  token_mg = $("input[type='password']").val()
  if (token_mg === "") {
    $("input[type='password']").css("color", "red");
  }
  else {
    get_events();
  }
}

/*function disconnection() {
  token_mg = ""
}*/