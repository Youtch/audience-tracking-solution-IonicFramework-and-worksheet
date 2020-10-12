### English <img align="center" width="20px" src="https://lipis.github.io/flag-icon-css/flags/1x1/gb.svg"></img>

# I.	Disclaimer
The collected data of user behaviors inside your application/applications should be anonymized to preserve the privacy of your users. In the way to improve the relationship of trust with your users, we advice you to display an information message (e.g. in section “credits”) about this collecting in your application/applications.

# II. Purpose of this project
## A. Goal
**The project was born from this main concept** : In webmarketing language, the primary purpose of data tracking is to collect data about the 
**users behaviors data** (so-called non-declarative or inferred data) from a First Party source (source constituting data collected by yourself).

## B. The structure of the app is based on this pattern
1.	FIREBASE DATABASE ACCOUNT TO COLLECT DATA : All user behavior data are stored on an unique remote Firebase database. Additionally: With some effort to coding you’ll can adapt your own data fields.
2.	CODE SNIPPET INSERTED IN YOUR APP MOBILE’S CODE TO TRACK THE USER’S BEHAVIORS: One mobile app sends the collected data to the remote database.
3.	GENERATE, DOWNLOAD & STORE HISTORY OF THE CSV-FORMATED-TEXT FILE : Through the app of NodeJs server, you’ll generate for the wanted duration (day relative) a CSV-formated text to import in your favorite spreadsheet on the provided worksheet of the solution. Then you’ll  define your tables & diagrams adapting the providerd example according to your data quantity (how many months ?). 
Finally you’ll visualize and analyze the dashboards to discover everything you wanted to know about your users’ behavior !

<p align="center"><img align="center" src="1.0-diagram_package_EN.png"></img></p>

**Benefits:** this architecture doesn’t need to access any Cloud server to store data, nor to have internet access to visualize and analyze your dashboards..
**Downsides:** Administrator will use two different softwares to use the application, a web browser and a spreadsheet.

# III. Client-server architecture
The design pattern is near of [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (Modele View Controler). The library used with ExpressJs to show the View is [EJS](https://ejs.co/). The client-side interface technology to request the server is Ajax.
The request are explained below: 
- To write or read the settings data (using [https://www.npmjs.com/package/node-localstorage](node-localstorage) library to read & write simply the data which are file based) : to edit the connection parameters to Firebase Database.
- To import data by requesting a Firebase Database, according to a custom range of dates defined by the user.
- To generate some CSV-formatted-text files (from the freshly imported data)
- To download some CSV-formatted-text files (ALL of the files are remained stored in the server)

# IV.Installation
1. You must firstly set these two constants categories:
- Set the constants concerning the server filesystem (Unix or Windows) : set in "/.env" (all constants)
- Set the administrator preferences : set in "/src/config/config-constants.js" (sections LINGUISTIC CHOICES et CSV-TEXT FILE CHOICES)
2. Complete your Firebase DB account ids on the <em>settings page</em>, excepting if you want to try app with a unique mock dataset.

# V. Appendix
1) **Documentation:**
TODO : Open a wiki to describe how is working the code. For example: detail of the server routes to EJS views pages, detail of the input and output concerning AJAX requests specifications…
2) **Further upgrade :**
The app might integrate some graphical data representations, a dashboard page including some tables and diagrams composed with local data, pulled from your Firebase Database account : “all-in-one” app.

<HR>

### Français <img align="center" width="20px" src="https://lipis.github.io/flag-icon-css/flags/1x1/fr.svg"></img>

# I. Avertissement
La collecte de données des comportements d’utilisateurs à l’intérieur de votre application/vos applications devrait être anonymisée afin de respecter la vie privée de vos utilisateurs. Pour accroitre votre relation de confiance avec les utilisateurs nous vous conseillons d'afficher une note d’information relative à cette collecte dans votre application/vos applications (par exemple dans la page « à propos »). 

# II. La raison d’être du projet 
##A. L’objectif
L’idée de base pour proposer ce projet : En langage webmarketing, l’objectif en premier lieu du traçage de données est de récolter des données relatives aux comportements de l’utilisateur (données dites non déclaratives ou inférées), dans une source First Party (source constituant des données récoltées par vous-même).

## B. Les « systèmes en présence, l’infrastructure : soit 
1.	COMPTE DE FIREBASE DATABASE POUR COLLECTER LES DONNEES : toutes les données comportementales sont stockées dans une base distante unique Firebase Database.
2.	SNIPPET DE CODE INSERE DANS LE CODE DE VOTRE APPLI MOBILE POUR SUIVRE LES COMPORTEMENTS DES UTILISATEURS : Le code de votre appli mobile envoie les données collectées vers la base de données.
3. GENERER, TELECHARGER & CONSERVER L’HISTORIQUE DES FICHIERS TEXTE AU FORMAT CSV : grâce à l’appli du serveur NodeJs vous générez selon une durée souhaitée (au jour près) un fichier texte CSV à importer dans votre tableur préféré sur la feuille de calcul fournie de la solution. Puis vous définissez vos tableaux & graphes en adaptant l’exemple fourni selon votre quantité de données (combien de mois ?). 
Enfin vous pouvez visionner et analyser les dashboards pour découvrir ce que vous vouliez savoir des comportements de vos utilisateurs !

<p align="center"><img align="center" src="1.0-diagram_package_FR.png"></img></p>

**Avantage :** cette architecture logicielle ne vous oblige pas à utiliser de serveur Cloud pour stocker les données, ni disposer d’une connexion internet pour visualiser et analyser vos dashboards.
**Inconvénient :** L’administrateur utilisera deux applications différentes : un navigateur web et un tableur.

# III. Architecture client-serveur
Le design pattern exploité est proche du [MVC](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-contr%C3%B4leur) (Modèle Vue Contrôleur). La bibliothèque utilisée avec ExpressJs pour afficher la vue est [EJS](https://ejs.co/). La technologie d’interface côté client pour requêter le serveur est Ajax. 
Les requêtes sont les suivantes :
- Ecrire ou lire les données de configuration (utilisation de la bibliothèque [https://www.npmjs.com/package/node-localstorage](node-localstorage) pour lire & modifier facilement les données basées sur des fichiers) : éditer les paramètres de connexion à Firebase Database
- Importer des données via une requête à Firebase Database selon une période personnalisé côté client
- Générer des fichiers texte au format CSV (à partir des données venant d’être importées).
- Télécharger des fichiers texte au format CSV (TOUS les fichiers restent stockés sur le serveur)

# IV.Installation
1. Pour commencer configurez les constantes selon deux catégories :
- Renseignez la configuration relative au système de fichier (Unix ou Windows) : dans "/.env" (toutes constantes)
- Renseignez les préférences de l'administrateur : dans "/src/config/config-constants.js" (sections LINGUISTIC CHOICES et CSV-TEXT FILE CHOICES)
2. Saisir les identifiants du compte Firebase DB <em>dans la page de configuration</em>, sauf si vous voulez tester l'appli avec un jeu de donnée de simulation unique.

# V.Annexes
1) **Documentation :**
A faire : Créer un Wiki pour décrire le fonctionnement du code. Par exemple : détail des routes du serveur pour les pages de vues EJS, détail des spécifications des requêtes AJAX concernant les entrées et sorties…
2) **Evolution future :**
L’appli pourrait intégrer une page de représentations graphiques des données, un dashboard incluant tables et graphes composée avec des données stockées localement, extraites de votre compte Firebase Database : appli « all-in-one ».
