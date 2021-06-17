<?php

// Configuration pour la connexion à Microsoft Graph
$config = array(
  "client_id" => "",
  // client_secret ne doit pas être envoyé au client
  "client_secret" => "",
  "redirect_uri" => "/redirect.php",
  "scope" => "Calendars.ReadWrite",
);

?>