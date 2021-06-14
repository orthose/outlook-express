function escape_id(id_event) {
  return id_event.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
}

function show_event(id_event) {
  const id = escape_id(id_event);
  $("#"+id+" div").show();
  $("#"+id+" .subject").off("click");
  $("#"+id+" .subject").on("click", function() {
    hide_event(id_event);
  });
}

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

/*function select_file(id_event) {
  show_event(id_event);
  /*$(tag).removeAttr("onClick");
  $(tag).children(".select_file").html($("<input type=file name='image'><input type='submit' value='Envoyer' onClick='put_file($(this).parent(),\""+ $(tag).attr("id")+"\")'>"))*/
//}