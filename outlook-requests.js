// Message d'erreur en cas de problème non-géré
function error() {
  $("main").html($("<p class='error'>Oups, quelque chose s'est mal passé..."
  + " Le jeton est sans doute erroné ou périmé.</p>"));
  $("main").append($("<a href='index.php'>Se Reconnecter</a>"));
}

// Fonction générale pour les requêtes GET
function get_requests(url_request, fdone) {
  $.ajax({
    url: url_request,
    type: 'GET',
    contentType: 'application/json',
    dataType: 'json',
    headers: {
      "Authorization": "Bearer" + " " + token_mg
    }
  }).done(function(res) {
    
    // Appel Ajax synchrone car liste chaînée de requêtes
    function get_events_nextLink(nextLink) {
      let res = {};
      $.ajax({
        async: false,
        url: nextLink,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
          "Authorization": "Bearer" + " " + token_mg
        }
      }).done(function(res_nextLink) {
          //console.log(res_nextLink);
          res = res_nextLink;
      }).fail(function(e) {
          //console.log(e);
          error();
      });
      return res;
    }
    
    let complete_res = res;
    let filtered_res = res["value"];
    let wait_nextLink = "@odata.nextLink" in res;
    // Chaînage éventuel des requêtes
    while (wait_nextLink) {
      complete_res = get_events_nextLink(complete_res["@odata.nextLink"]);
      wait_nextLink = "@odata.nextLink" in complete_res;
      filtered_res = filtered_res.concat(complete_res["value"]);
    };
    
    // Appel de la callback
    fdone(filtered_res);
  }).fail(function(e) {
    //console.log(e);
    error();
  });
}

// Récupération des calendriers
function get_calendars() {
  
  const url = "https://graph.microsoft.com/v1.0/me/calendars";
  
  function fdone(res) {
    const calendars = $("<table>");
    res.forEach(function(line_json) {
      const line = $("<tr id='"+line_json["id"]+"'><td>"
      +"<div class='subject'>"+line_json["name"]+"</div>"
      +"</td></tr>");
      // Couleur du calendrier sur le nom
      line.find("div").attr("style", "color:"+line_json["hexColor"]);
      line.find(".subject").on("click", function() {
        get_events(line_json["id"]);
        // Revenir en arrière affiche les calendriers
        window.onpopstate = function(event) {
          get_calendars();
          // Revenir à l'accueil
          window.onpopstate = function(event) {
            window.location.href="index.php";
          };
          history.pushState({page: 1}, "Accueil");
        };
        history.pushState({page: 2}, "Calendrier");
      });
      calendars.append(line);
    });
    $("main").html(calendars);
  }
  
  get_requests(url, fdone);
}

// Récupération de tous les évènements
function get_events(id_calendar) {
  
  // http://zoocoder.com/javascript-addition-et-soustraction-sur-les-dates/
  const end_date = new Date();
  // Plage de 1 mois de parcours des évènements
  const start_date = new Date((new Date(end_date)).setDate(end_date.getDate() - 31));
  const url = "https://graph.microsoft.com/v1.0/me/calendars/"
  +id_calendar+"/calendarview/?"
  +"startdatetime="+start_date.toISOString()
  +"&enddatetime="+end_date.toISOString()
  +"&$select=subject,start,end,location";
  //+"&$orderby=value/start/dateTime" // Ne fonctionne pas (Bad Request)
  //console.log(url);
  
  // Affichage sous format français
  function simple_date(date) {
    return date.replace(/([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+).*/, "$3/$2/$1 $4:$5")
  }
  
  function fdone(res) {
    const events = $("<table>");
    // On trie pour avoir du plus récent au plus vieux
    const sorted_events = res.sort(function(a, b) {
      const date1 = new Date(a["start"]["dateTime"]);
      const date2 = new Date(b["start"]["dateTime"]);
      return date2 - date1;
    });
    sorted_events.forEach(function(line_json) {
      const line = $("<tr id='"+line_json["id"]+"'><td>"
        +"<div class='subject'>"+line_json["subject"]+"</div>"
        +"<div class='location' hidden>"+line_json["location"]["displayName"]+"</div>"
        +"<div class='date' hidden>"+simple_date(line_json["start"]["dateTime"])+"</div>"
        +"<div class='date' hidden>"+simple_date(line_json["end"]["dateTime"])+"</div>"
        +"<div class='select_file' hidden><label>Parcourir...<input type=file name='files' multiple></label>"
        +"<input type='submit' value='Envoyer'><ul>Aucun fichier sélectionné</ul></div>"
        +"</td></tr>");
      // Affichage du fichier sélectionné
      line.find(".select_file input[type=file]").on("change", function() {
        const list = line.find(".select_file ul");
        list.html(""); list.removeClass("sending sent");
        Array.from($(this)[0].files).forEach(function(file) {
          list.append($("<li>").append(file.name));
        });
      });
      // Envoi du fichier
      line.find(".select_file input[type=submit]").on("click", function() {
        put_file(line.find(".select_file input[type=file]"), id_calendar, line_json["id"]);
      });
      // Animation de déroulement de l'évènement
      line.find(".subject").on("click", function() {show_event(line_json["id"])});
      events.append(line);
    });
    $("main").html(events);
  }
  
  get_requests(url, fdone);
}

// Envoi d'un fichier pièce-jointe à un évènement
function put_file(input_file_tag, id_calendar, id_event) {
  
  // Prévoir la réactivation des input
  const input = $("#"+escape_id(id_event)+" .select_file input");
  const nb_files = $(input_file_tag)[0].files["length"];
  let count_requests = nb_files;
  
  // Un fichier au moins doit avoir été sélectionné
  if (nb_files > 0) {
    // Vérouillage des input
    input.prop("disabled", true);
    Array.from($(input_file_tag)[0].files).forEach(function(file, i) {
      const reader = new FileReader();
      // Conversion de la taille du fichier en MB
      const mb_size = file.size / (2 ** 20); // Bytes -> MB
      // Élement graphique contenant le nom du fichier courant
      const current_li = $($("#"+escape_id(id_event)+" .select_file ul li")[i]);
      
      // Taille de fichier inférieure strictement à 3MB
      if (mb_size < 3.) {
        // Fonctione exécutée à la fin du chargement du fichier
        reader.onloadend = function() {
          // Conversion du fichier en base64
          const b64_file = reader.result.replace(/^data:.+;base64,/, '');
          // Animation du chargement
          current_li.attr("class", "sending");
          // Envoi du fichier en un seul appel Ajax
          // Appel Ajax après le chargement du fichier pour que b64_file != ""
          $.ajax({
            url: "https://graph.microsoft.com/v1.0/me/calendars/"+id_calendar
            +"/events/"+id_event+"/attachments",
            type: 'POST',
            data: JSON.stringify({ 
              "@odata.type": "#microsoft.graph.fileAttachment",
              "name": file["name"],
              "contentBytes": b64_file
            }),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
              "Authorization": "Bearer" + " " + token_mg
            }
          }).done(function(res) {
            //console.log(res);
            // Arrêt de l'animation et changement de couleur
            current_li.attr("class", "sent");
            // Réactivation du bouton d'envoi
            count_requests--;
            if (count_requests === 0) {
              input.prop("disabled", false);
            }
          }).fail(function(e) {
            //console.log(e);
            current_li.attr("class", "error");
            // Réactivation du bouton d'envoi
            count_requests--;
            if (count_requests === 0) {
              input.prop("disabled", false);
            }
          });
        }
        // Chargement du fichier en format base64
        reader.readAsDataURL(file);
      }
      // Taille de fichier entre 3MB et 150MB
      else if (3. <= mb_size && mb_size < 150.) {
        // Fonctione exécutée à la fin du chargement du fichier
        reader.onloadend = function() {
          // Animation du chargement
          current_li.text(current_li.text().replace(/\([0-9]+\.[0-9]+MB\/[0-9]+\.[0-9]+MB\)/, ""));
          current_li.text(current_li.text() + " (0.00MB/"+(file.size / (2 ** 20)).toPrecision(3)+"MB)");
          current_li.attr("class", "sending");
          
          // Fonction récursive d'envoi des paquets d'octets
          // de manière ordonnée et asynchrone
          const packet_length =  3 * (2 ** 20); // 3MB
          function put_large_file(start_byte, rest_bytes, upload_url) {
            // Envoi des paquets de données de 3MB en asynchrone
            if (rest_bytes >= packet_length) {
              $.ajax({
                url: upload_url,
                type: 'PUT',
                // slice(begin, end) end exclu
                data: reader.result.slice(start_byte, start_byte + packet_length),
                contentType: 'application/octet-stream',
                headers: {
                  // Content-Length pas accepté par Ajax
                  // start-end/total end inclus
                  "Content-Range": "bytes "+start_byte+"-"+(start_byte + packet_length - 1)+"/"+file.size
                },
                // Pour empêcher sérialisation du binaire
                processData: false
              }).done(function() {
                // Progression de l'upload
                const uploaded_bytes = ((start_byte + packet_length - 1) / (2 ** 20)).toPrecision(3);
                current_li.text(current_li.text().replace(/\([0-9]+\.[0-9]+MB\/([0-9]+\.[0-9]+MB)\)/, "("+uploaded_bytes+"MB/$1)"));
                // On a envoyé packet_length bytes
                // Le prochain byte attendu est (start_byte + packet_length)
                start_byte += packet_length;
                rest_bytes -= packet_length;
                // Prochain appel Ajax
                put_large_file(start_byte, rest_bytes, upload_url);
              }).fail(function(e) {
                //console.log(e);
                current_li.attr("class", "error");
                // Réactivation du bouton d'envoi
                count_requests--;
                if (count_requests === 0) {
                  input.prop("disabled", false);
                }
              });
            }
            // Envoi éventuel du dernier paquet
            else if (rest_bytes > 0) {
              $.ajax({
                url: upload_url,
                type: 'PUT',
                // slice(begin, end) end exclu
                // rest_bytes inclus le premier byte donc pas de +1
                data: reader.result.slice(start_byte),
                contentType: 'application/octet-stream',
                headers: {
                  // start-end/total end inclus
                  "Content-Range": "bytes "+start_byte+"-"+(file.size - 1)+"/"+file.size
                },
                // Pour empêcher sérialisation du binaire
                processData: false,
              }).done(function() {
                // Progression de l'upload
                current_li.text(current_li.text().replace(/\([0-9]+\.[0-9]+MB\/([0-9]+\.[0-9]+MB)\)/, "($1/$1)"));
                // Arrêt de l'animation et changement de couleur
                current_li.attr("class", "sent");
                // Réactivation du bouton d'envoi
                count_requests--;
                if (count_requests === 0) {
                  input.prop("disabled", false);
                }
              }).fail(function(e) {
                //console.log(e);
                current_li.attr("class", "error");
                // Réactivation du bouton d'envoi
                count_requests--;
                if (count_requests === 0) {
                  input.prop("disabled", false);
                }
              });
            }
            // upload fini dans la boucle principale
            else {
              // Arrêt de l'animation et changement de couleur
              current_li.attr("class", "sent");
              // Réactivation du bouton d'envoi
              count_requests--;
              if (count_requests === 0) {
                input.prop("disabled", false);
              }
            }
          }
          
          // Ouverture de la session de transfert
          $.ajax({
            url: "https://graph.microsoft.com/v1.0/me/calendars/"+id_calendar
            +"/events/"+id_event+"/attachments/createUploadSession",
            type: 'POST',
            data: JSON.stringify({ 
              "AttachmentItem": {
                "attachmentType": "file",
                "name": file["name"],
                // Taille en octets
                "size": file.size
              }
            }),
            contentType: 'application/json',
            dataType: 'json',
            headers: {
              "Authorization": "Bearer" + " " + token_mg
            }
          }).done(function(res) {
            //console.log(res)
            let start_byte = 0; let rest_bytes = file.size;
            // Transfert des paquets de données
            put_large_file(start_byte, rest_bytes, res["uploadUrl"]);
          }).fail(function(e) {
            //console.log(e);
            current_li.attr("class", "error");
            // Réactivation du bouton d'envoi
            count_requests--;
            if (count_requests === 0) {
              input.prop("disabled", false);
            }
          });
        }
        // Chargement du fichier en format binaire
        reader.readAsArrayBuffer(file);
      } 
      // Taille de fichier supérieure à 150MB non-prise en charge
      else {
        current_li.attr("class", "error");
        current_li.text(current_li.text() + " (Erreur : Fichier trop volumineux)");
        // Réactivation du bouton d'envoi
        count_requests--;
        if (count_requests === 0) {
          input.prop("disabled", false);
        }
      }
    });
  }
}