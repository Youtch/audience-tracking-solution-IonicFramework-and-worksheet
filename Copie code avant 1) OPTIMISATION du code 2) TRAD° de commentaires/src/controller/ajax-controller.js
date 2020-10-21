var firebaseService = require('../services/firebase-service');
var datesServices = require('../services/date-operations-service');

// qualité SOLID TODO #1 :
// décomposition en plusieurs fichiers/ modules dédiés aux fonctions appelé depuis chaque page 
// Inconvénient mineur : Chargement de tous les modules : dès la déclaration du controlleur
var ajaxCommun = require('../views/scripts/ajax-commun.js');
var ajaxConfigurer = require('../views/scripts/ajax-configurer.js');
var ajaxImporter = require('../views/scripts/ajax-importer.js');
var ajaxTelecharger = require('../views/scripts/ajax-telecharger.js');

module.exports = {
	//init:init,
  
  // qualité SOLID TODO #2 :
  // Faire le mapping des méthodes (entre ici et ajax-NOMPAGE.js ) qui sont appelées via le ROUTAGE de app.js, depuis le script de page
  // ... aucune méthode ici dans ce fichier
  // NB : les inconvénients d'archi sont ...
  // - de déclarer chaque amélioration du code : ici, dans ajax-controller>module.exports
  // - de charger en mémoire du serveur toutes les méthodes de toutes les pages dès ouverture de ce controller
  // ex :

  getServeurFireBDisponibilite:ajaxCommun.getServeurFireBDisponibilite,
  setServeurFireBDisponibilite:ajaxCommun.setServeurFireBDisponibilite,
  getSessionCSVFileExists:ajaxCommun.getSessionCSVFileExists,

  setConfiguration:ajaxConfigurer.setConfiguration,
  getConfiguration:ajaxConfigurer.getConfiguration,

  importerJeuDonnees:ajaxImporter.importerJeuDonnees,
  mockData_importerDonnees:ajaxImporter.mockData_importerDonnees,
  genererFichierCSV:ajaxImporter.genererFichierCSV,
  // getFichiersInfos: ajaxTelecharger.getFichiersInfos,
  /* ajaxTelecharger:ajaxTelecharger.??? 
  */
}


// SOLID : répartir les méthodes entre plusieurs sous-CLASSES : ajax-commun, ajax-configurer,  ajax-importer , ajax-generer, ajax-telecharger
/* Si besoin, simili constructeur : 
function init(req){
  importer = new AjaxImporter();// Ainsi cette instanciation restera ouverte depuis le PREMIER appel, et UTILISABLE jusqu'à sa destruction
}

/*Storage specs à faire : 
  getData(nomData)
  setData(nomData,valeur, <dureeMax>)
  removeData(nomData)

  getSessionData(nomData)
  setSessionData(nomData,valeur)
  removeSessionData(nomData)
*/