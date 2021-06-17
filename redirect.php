<?php

require("connection.php");

// https://stackoverflow.com/questions/5576619/php-redirect-with-post-data
session_start();
// Obtention du token Microsoft Graph
$_SESSION["token"] = get_token($_GET["code"]);
// Redirection sans arguments dans l'url
header("Location: index.php");

?>