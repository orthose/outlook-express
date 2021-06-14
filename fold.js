// Nécessaire pour échapper les caractères spéciaux CSS
function escape_id(id_event) {
  return id_event.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
}

// Dépliage de l'évènement
function show_event(id_event) {
  const id = escape_id(id_event);
  $("#"+id+" div").show();
  $("#"+id+" .subject").off("click");
  $("#"+id+" .subject").on("click", function() {
    hide_event(id_event);
  });
}

// Pliage de l'évènement
function hide_event(id_event) {
  const id = escape_id(id_event);
  $("#"+id+" div.location").hide();
  $("#"+id+" div.date").hide();
  $("#"+id+" div.select_file").hide();
  $("#"+id+" .subject").off("click");
  $("#"+id+" .subject").on("click", function() {
    show_event(id_event);
  });
}