# Introduction
Application écrite en Javascript et PHP pour effectuer 2 principales opérations
en interaction avec Outlook Calendar, via l'API Microsoft Graph.
1. Récupérer la liste des évènements de l'utilisateur.
2. Envoyer un fichier en pièce jointe à l'un de ces évènements.

# Commanditaire
Application créée par Maxime Vincent d'après une commande de Yann Vincent 
pour sa société S.F.R (Stores Fermetures Réparations).

# Mise en production
1. Rendez-vous sur le centre d'administration de [Azure](https://aad.portal.azure.com).
2. Naviguez dans les menus **Azure Active Directory**/**Inscriptions d'applications**
et créez une nouvelle application avec par exemple comme nom **Outlook Express Web App**.
3. Choisissez comme utilisateurs **Tous les utilisateurs de compte Microsoft**.
Si cette option n'est pas disponible vous pouvez par la suite modifier la valeur
**signInAudience** du manifeste à **AzureADandPersonalMicrosoftAccount**.
4. Naviguez jusqu'à **Certificats & secrets** et créez un nouveau **Secret client** qui
de préférence n'expire jamais.
5. Naviguez jusqu'à **Authentification** et définissez l'URL de redirection en 
choisissant **Ajouter une plateforme** de type **Web**. L'adresse sera de la forme
**http://votre-domaine/redirect.php**.
6. Rendez-vous dans le fichier config.php et remplissez les champs 
* **client_id** avec l'ID d'application (client) visible dans **Vue d'ensemble**.
* **client_secret** avec la Valeur de votre Secret client visible dans **Certificats & secrets**. 
* **redirect_uri** avec l'URL de redirection visible dans **Authentification**.

**Note :** L'application n'utilise PHP que pour la connexion simplifiée car le champ
**client_secret** ne doit pas être envoyé au client, et doit donc rester uniquement
sur le serveur. 

# Connexion à Microsoft Graph
Il y a deux méthodes pour se connecter.
1. La plus simple pour l'utilisateur (mais la plus difficile à implémenter)
est centralisée et fait appel à [l'interface de connexion de Microsoft](https://docs.microsoft.com/fr-fr/outlook/rest/get-started).
Elle permet de générer automatiquement un token d'une durée de validité de 1 heure.
Au-delà de ce temps, il suffit de se reconnecter. Si le navigateur a enregistré
le compte Microsoft, cette reconnexion est très rapide car il les champs login et
mot de passe sont pré-remplis !
2. Au départ la connexion était déléguée au [site de démonstration](https://developer.microsoft.com/fr-fr/graph/graph-explorer)
de Microsot Graph. J'ai laissé cette fonctionnalité au cas où la première
méthode poserait problème. L'utilisateur doit se connecter au site précédent 
et récupérer un jeton d'accès.
Toutes les heures le jeton périme, il faut alors rafraîchir le site
et récupérer un nouveau jeton d'accès valide et se reconnecter sur Outlook Express.
Sans cela, les requêtes renvoient l'erreur Unauthorized.

# Scénario principal d'utilisation
1. Se connecter avec le token (voir ci-dessus).
2. Choisir un calendrier et attendre (le temps de chargement peut être long).
3. Choisir un évènement parmi ceux proposés dans l'intervalle 
\[Aujourd'hui, Aujourd'hui - 31 jours\].
4. Choisir un fichier et l'envoyer. Un message de validation s'affiche en vert.

# Vérifier le résultat
Pour s'assurer que le fichier a bien été envoyé sur un évènement du calendrier,
connectez-vous à [Outlook Calendar](https://outlook.live.com/calendar).
Sélectionnez l'évènement et vérifiez que la pièce jointe a été ajoutée.

# Documentation
* [Comment envoyer un fichier ?](https://docs.microsoft.com/en-us/graph/api/event-post-attachments?view=graph-rest-1.0&tabs=http)
* [File Attachment](https://docs.microsoft.com/en-us/graph/api/resources/fileattachment?view=graph-rest-1.0)