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
    console.log(res);
    const events = $("<table>")
    events.append($("<tr><th>Évènement</th><th>Localisation</th><th>Début</th><th>Fin</th></tr>"))
    res["value"].forEach(function(line_json) {
      const line = $("<tr id='"+line_json["id"]+"' onClick='select_file(this)'>"
        +"<td>"+line_json["subject"]+"</td>"
        +"<td>"+line_json["location"]["displayName"]+"</td>"
        +"<td>"+simple_date(line_json["start"]["dateTime"])+"</td>"
        +"<td>"+simple_date(line_json["end"]["dateTime"])+"</td>"
        +"<td class='select_file'></td>"
        +"</tr>")
      events.append(line);
    });
    $("main").html(events);
  }).fail(function(e) {
    console.log(e);
    $("main").html($("<p class='error'>Oups, quelque chose s'est mal passé...</p>"));
    $("main").append($("<input type='submit' value='Réessayer' onClick='get_events()'>"));
    $("main").append($("<a href='index.html'>Se Reconnecter</a>"));
  })
};

// Envoi d'un fichier pièce-jointe à un évènement
function put_file(tag, id_event) {
  const file_image = $(tag).children("input[type='file']")[0].files[0];
  const reader = new FileReader();
  let b64_img = "";
  reader.onloadend = function() {
    b64_img = reader.result.replace(/^data:.+;base64,/, '');
    console.log(b64_img);
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
    console.log(res);
    $(tag).css("color", "green");
  }).fail(function(e) {
    console.log(e);
    $(tag).css("color", "red");
  })
};