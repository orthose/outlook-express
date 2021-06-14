// Message d'erreur en cas de problème non-géré
function error() {
  $("main").html($("<p class='error'>Oups, quelque chose s'est mal passé..."
  + " Le jeton est sans doute erroné ou périmé.</p>"));
  $("main").append($("<a href='index.html'>Se Reconnecter</a>"));
}

// Récupération de tous les évènements
function get_events() {
  $.ajax({
    url: "https://graph.microsoft.com/v1.0/me/events/?$select=subject,start,end,location",
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      "Authorization": "Bearer " + " " + token_mg
    }
  }).done(function(res) {
    const simple_date = function(date) {
      return date.replace(/([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+).*/, "$3/$2/$1 $4:$5")
    }
    //console.log(res);
    const events = $("<table>")
    res["value"].forEach(function(line_json) {
      const line = $("<tr id='"+line_json["id"]+"'><td>"
        +"<div class='subject'>"+line_json["subject"]+"</div>"
        +"<div class='location' hidden>"+line_json["location"]["displayName"]+"</div>"
        +"<div class='date' hidden>"+simple_date(line_json["start"]["dateTime"])+"</div>"
        +"<div class='date' hidden>"+simple_date(line_json["end"]["dateTime"])+"</div>"
        +"<div class='select_file' hidden><label>Parcourir...<input type=file name='image'></label>"
        +"<input type='submit' value='Envoyer'><p>Aucun fichier sélectionné</p></div>"
        +"</td></tr>");
      line.find(".select_file input[type=file]").on("change", function() {
        line.find(".select_file p")
          .css("color", "black")
          .html($(this)[0].files[0].name + " sélectionné");
      });
      line.find(".select_file input[type=submit]").on("click", function() {
        put_file(line.find(".select_file input[type=file]"), line_json["id"]);
      });
      line.find(".subject").on("click", function() {show_event(line_json["id"])});
      events.append(line);
    });
    $("main").html(events);
  }).fail(function(e) {
    //console.log(e);
    error();
  })
};

// Envoi d'un fichier pièce-jointe à un évènement
function put_file(tag, id_event) {
  if ($(tag)[0].files["length"] > 0) {
    const file_image = $(tag)[0].files[0];
    const reader = new FileReader();
    let b64_img = "";
    reader.onloadend = function() {
      b64_img = reader.result.replace(/^data:.+;base64,/, '');
      //console.log(b64_img);
    };
    reader.readAsDataURL(file_image);
    $.ajax({
      url: "https://graph.microsoft.com/v1.0/me/events/"+id_event+"/attachments",
      type: 'POST',
      data: JSON.stringify({ 
        "@odata.type": "#microsoft.graph.fileAttachment",
        "name": file_image["name"],
        "contentBytes": b64_img
      }),
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        "Authorization": "Bearer " + " " + token_mg
      }
    }).done(function(res) {
      //console.log(res);
      $("#"+escape_id(id_event)+" .select_file p")
        .css("color", "green")
        .html(file_image["name"] + " a bien été envoyé");
    }).fail(function(e) {
      //console.log(e);
      error();
    })
  }
};