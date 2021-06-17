<?php

require("config.php");

// param $code: Code d'autorisation renvoyé par Azure
// return: Token Microsoft Graph (validité 1 heure)
function get_token($code) {
  GLOBAL $config;
  // Comment faire une requête HTTP synchrone en PHP ?
  // https://waytolearnx.com/2019/07/creer-et-utiliser-une-api-rest-en-php.html

  $url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    
  $data = "grant_type=authorization_code"
  ."&code=".$code//urlencode($code)
  ."&redirect_uri=".urlencode($config["redirect_uri"])
  ."&client_id=".$config["client_id"]
  ."&client_secret=".$config["client_secret"];
  
  $options = array(
    'http' => array(
      'header' => "Content-type: application/x-www-form-urlencoded\r\n",
      'method' => 'POST',
      'content' => $data,
    )
  );
  
  // Lancement de la requête
  $context  = stream_context_create($options);
  $res_string = file_get_contents($url, false, $context);
  
  // Récupération du token
  $res_array = json_decode($res_string, true);
  return $res_array["access_token"]; 
}

?>