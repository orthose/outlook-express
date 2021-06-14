# Introduction
Application écrite en Javascript et HTML pour effectuer 2 principales opérations
en interaction avec Outlook Calendar, via l'API Microsoft Graph.
1. Récupérer la liste des évènements de l'utilisateur.
2. Envoyer un fichier en pièce jointe à l'un de ces évènements.

# Commanditaire
Application créée par Maxime Vincent d'après une commande de Yann Vincent 
pour sa société S.F.R (Stores Fermetures Réparations).

# Mise en production
L'application n'utilise pas de PHP et est intégralement écrite en Javascript.
L'utilisateur peut donc télécharger ce dépôt et utiliser directement 
l'application en local.
Il est également possible de la mettre à disposition sur un serveur,
afin que le code soit maintenu et que cela soit transparent pour l'utilisateur
(pas besoin de télécharger de nouveau).

# Connexion à Microsoft Graph
Le système de connexion décrit 
[ici](https://docs.microsoft.com/fr-fr/outlook/rest/get-started) 
est compliqué à mettre en place. C'est pourquoi j'ai préconisé l'utilisation
du [site de démonstration](https://developer.microsoft.com/fr-fr/graph/graph-explorer)
de Microsot Graph. L'utilisateur devra s'y connecter et récupérer un jeton d'accès.
Toutes les heures le jeton périme, il faut alors rafraîchir le site précédent
et récupérer un nouveau jeton d'accès valide et se reconnecter sur Outlook Express.
Sans cela, les requêtes renvoient l'erreur Unauthorized.

# Vérifier le résultat
Pour s'assurer que le fichier a bien été envoyé sur un évènement du calendrier,
connectez-vous à [Outlook Calendar](https://outlook.live.com/calendar).
Sélectionnez l'évènement et vérifiez que la pièce jointe a été ajoutée.

# Documentation
* [Comment envoyer un fichier ?](https://docs.microsoft.com/en-us/graph/api/event-post-attachments?view=graph-rest-1.0&tabs=http)
* [File Attachment](https://docs.microsoft.com/en-us/graph/api/resources/fileattachment?view=graph-rest-1.0)