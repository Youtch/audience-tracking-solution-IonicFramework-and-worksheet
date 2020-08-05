//const LocalStorage = require('node-localstorage').LocalStorage; 
// ... OK en dev MAIS TODO remplacer par :
const localStorageService = ('../services/local-storage-service');
const configConstants = require('../config/config-constants');
const dataModel = require('../model/data-model');// pattern MVC

/////////// Exporter les fonctions publiques
module.exports = {
  init:init,
  getFichiersInfos:getFichiersInfos,
  getTest:getTest,
};

// NOK : sinon exécuté dès le chargement du module, pas dès le routage vers la page
/*function constructor(){
  // console.log ( "getGlobals() = " + JSON.stringify(dataModel.getGlobalData()) );
}*/
  
function init()
{
  // TODO Gestion lobal data
}

function getTest(){
  return "truc";
}


// Actualiser les infos sur la page
