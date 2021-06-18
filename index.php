<?php session_start(); ?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Outlook Express</title>
  <!-- Responsive Web Site for smartphone -->
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <!-- Icônes -->
  <link rel="icon" type="image/ico" href="favicon-180.ico" sizes="180x180">
  <link rel="apple-touch-icon" type="image/png" href="favicon-180.png" sizes="180x180">
  <!-- Feuilles de style -->
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Ubuntu">
  <link href='style.css' rel='stylesheet'>
  <!-- Scripts -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="fold.js"></script>
  <script src="outlook-requests.js"></script>
  <script>
  // Plus économe en énergie qu'un appel AJAX
  // Informations pour la demande de code d'autorisation côté client
  const config = {
    <?php
      require("config.php");
      echo "client_id: '".$config["client_id"]."',";
      echo "redirect_uri: '".$config["redirect_uri"]."',";
      echo "scope: '".$config["scope"]."',";
    ?>
  };
  // Token Microsoft Graph
  token_mg = 
    <?php
      if (!isset($_SESSION["token"])) {echo '""';}
      else {echo '"'.$_SESSION["token"].'"';}
    ?>;
  </script>
  <script src="connection.js"></script>
</head>
<body onload="stats();<?php if (isset($_SESSION["token"])) {echo "start_without_token()";} ?>">
  <header>
    <h1>Outlook Express Web App</h1>
    <a href='index.php'>Revenir à l'Accueil</a>
  </header>
  <main>
    <h1>Connexion à Microsoft Graph</h1>
    <p>
      Pour utiliser le service Outlook Express, cliquez tout d'abord sur
      <strong>Se&nbsp;Connecter</strong>, puis saisissez les identifiants de votre 
      compte Microsoft. Enfin, <strong>acceptez</strong> simplement les 
      autorisations demandées permettant de <strong>lire et écrire</strong> 
      dans vos calendriers.  
    </p>
    <div id="connection_without_token">
      <h2>Connexion Compte Microsoft</h2>
      <input type="submit" 
      value="<?php if (!isset($_SESSION["token"])) {echo "Se Connecter";} else {echo "Commencer";} // else useless body.onload ?>"
      onClick="<?php if (!isset($_SESSION["token"])) {echo "get_authorization()";} else {echo "start_without_token()";} // else useless body.onload ?>">
    </div>
    <p>
      Vous pouvez également recourir à l'ancienne méthode de connexion en cas de besoin.
      Pour vous connecter au service Outlook Express, rendez-vous d'abord sur
      <a href="https://developer.microsoft.com/fr-fr/graph/graph-explorer" target="_blank">Microsoft Graph</a>.
      <ol>
        <li>Connectez-vous à l'aide de votre <strong>compte Microsoft</strong>.</li>
        <li>Allez dans l'onglet <strong>Autres actions</strong> (représenté par&nbsp;...), puis <strong>Sélectionner des autorisations</strong> et consentez à <strong>Calendars.ReadWrite</strong>.</li>
        <li>Allez dans l'onglet <strong>Jeton d'accès</strong> et copiez le token (icône de feuilles).</li>
        <li>Revenez sur Outlook Express et collez le token ci-dessous puis appuyez sur <strong>Commencer</strong>.</li>
      </ol>
      <strong>Attention&nbsp;</strong>: Le token a une durée de validité de 1&nbsp;heure. 
      Ne le divulguez pas et ne donnez pas plus de permissions à l'application.
    </p>
    <div id="connection_with_token" <?php if (isset($_SESSION["token"])) {echo "hidden";} // useless body.onload ?>>
      <h2>Token Microsoft Graph</h2>
      <input type="password">
      <input type="submit" value="Commencer" onClick="start_with_token()">
    </div>
  </main>
  <section>
    <h1>Notice d'utilisation</h1>
    Vous en avez marre de passer du temps à envoyer à la main des pièces jointes
    pour des évènements de votre calendrier Outlook&nbsp;?
    Outlook Express est la solution à tous vos problèmes&nbsp;!
    Commencez par sélectionner votre calendrier favori.
    Puis continuez en sélectionnant l'évènement à modifier. Puis choisissez le fichier
    à uploader depuis votre disque (maximum 3&nbsp;Mo). Enfin, envoyez et le tour
    est joué, votre calendrier est automatiquement mis à jour&nbsp;!
  </section>
  <footer>
    <p id="views"></p>
    Application créée par Maxime Vincent | <a href="https://github.com/orthose/outlook-express" target="_blank">Code Source</a><br>
    Commande de Yann Vincent | © 2021 <a href="https://www.stores-fermetures-91.fr/" target="_blank">S.F.R</a> (Stores Fermetures Réparations)
  </footer>
</body>
</html>
<?php
  // Fin de la session
  if (isset($_SESSION["token"])) {
    unset($_SESSION["token"]);
    session_destroy();
  }
?>