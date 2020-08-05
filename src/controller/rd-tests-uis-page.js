const LocalStorage = require('node-localstorage').LocalStorage;
const localStorageService = require('../services/local-storage-service');
const configConstants = require('../config/config-constants');
const dataModel = require('../model/data-model');// pattern MVC

/////////// Exporter les fonctions publiques
module.exports = {
  //init:init
  init:init,
};

function init(){
  // DEV TEST
  testLocalStorage();
  testLocalStorageService();

  testChangeDataModel();
}

function testChangeDataModel()
{
  // OK
  console.log ( "dataModel.get_dernierJeuDeDonneesCsv() = " + JSON.stringify(dataModel.get_dernierJeuDeDonneesCsv()) );
  // OK
  console.log ( "dataModel.get_dernierJeuDeDonneesCsv().nom = " + JSON.stringify(dataModel.get_dernierJeuDeDonneesCsv().nom) );
  dataModel.set_dernierJeuDeDonneesCsv( configConstants.MOCK_FICHIERS_GENERES[1].nom, configConstants.MOCK_FICHIERS_GENERES[1].poids, 
    configConstants.MOCK_FICHIERS_GENERES[1].dateCreation, configConstants.MOCK_FICHIERS_GENERES[1].nombreSessionsUtilisateurs,
    configConstants.MOCK_FICHIERS_GENERES[1].nombreActionsUtilisateurs, configConstants.MOCK_FICHIERS_GENERES[1].dateDebutJeuDonnees,
    configConstants.MOCK_FICHIERS_GENERES[1].dateFinJeuDonnees );
  // OK
  console.log ( "dataModel.get_dernierJeuDeDonneesCsv() = " + JSON.stringify(dataModel.get_dernierJeuDeDonneesCsv()) );
}
function testLocalStorage()
{
  console.log("//// testLocalStorage ////");
  //#Tests R&D
  //  store
  var localStorage = new LocalStorage( process.env.CHEMIN_LOCAL_STORAGE );
 
  // stocker
  localStorage.setItem("user1-key1", "Ma donnée 1");
  console.log("user1-key1 = " + localStorage.getItem("user1-key1"));

  // stocker
  localStorage.setItem("user2-key1", "My 1st data");
  console.log("user2-key1 = " + localStorage.getItem("user2-key1"));
  
  /* NOK : non implémenté dans le module 
  var a = [{actionsUtilisateurs:6128, sessionsUtilisateur:1989}];
  // stocker
  localStorage.setItem("user2-key2", a);
  console.log( "\n\nlocalStorage.getItem("user2-fichiers")[0].poids = "+ localStorage.getItem("user2-fichiers")[0].poids ); 
  console.log( "JSON.stringify(localStorage.getItem("user2-fichiers") = " + JSON.stringify(localStorage.getItem("user2-fichiers")) ); */

  /* NOK : non implémenté dans le module 
  // stocker
  localStorage.setItem("user2-key2", {fichiers:[{actionsUtilisateurs:6128, sessionsUtilisateur:1989}]} );
  console.log( "\n\nlocalStorage.getItem("user2").fichiers[0].poids = "+ localStorage.getItem("user2").fichiers[0].poids ); 
  //console.log( JSON.stringify(localStorage.getItem("user2")) ); */

  // Solution OK 
  // NB : formattage requiert d'encadrer chaque attribut avec "
  localStorage.setItem("user2", '{"fichiers":['+
      '{"fichierNom":"truc1.csv", "actionsUtilisateurs":6128, "sessionsUtilisateur":1989} ,'+
      '{"fichierNom":"truc543.csv", "actionsUtilisateurs":200, "sessionsUtilisateur":100}'+
    ']}');
  var strUser2 = localStorage.getItem("user2");
  console.log( "JSON.stringify( strUser2 ) = " + JSON.stringify( strUser2 ) ); 
  var o = JSON.parse( strUser2 );
  console.log( " o = " + JSON.stringify(o) ); 
  console.log( "\n\n o.fichiers[0].actionsUtilisateurs = "+ o.fichiers[0].actionsUtilisateurs );


  /* NOK : non implémenté dans le module 
  // stocker
  var o = {
    "fichiers":
    [
      {"actionsUtilisateurs":6128, "sessionsUtilisateur":1989},
      {"actionsUtilisateurs":6128, "sessionsUtilisateur":1989},
    ]
    ,"configuration": {"databaseURL": "egegFDF333.com", "databasePsw": "trucmuche"}
  };
  localStorage.setItem("user2-key2", o);
  console.log( JSON.stringify(" o = " + o)  ); 
  var user2 = localStorage.getItem("user2");
  console.log( "\n\nuser2.fichiers[1].actionsUtilisateurs = "+ user2.fichiers[1].actionsUtilisateurs ); 

  /* SI objets nok : structure de stockage :
    keyname => user<2-<fichiers> , value => type string au format json à parser en lecture 
  */
}

async function testLocalStorageService()
{
  console.log("//// testLocalStorageService ////");  
  console.log( "#1 JSON.stringify( localStorageService.getItem('user2') ) = " + JSON.stringify( localStorageService.getItem("user2") ) );
  localStorageService.removeItem("user2");
  console.log( "#2 JSON.stringify( localStorageService.getItem('user2') ) = " + JSON.stringify( localStorageService.getItem("user2") ) );
  localStorageService.setItem("user2", '{"fichiers":['+
    '{"fichierNom":"truc1.csv", "actionsUtilisateurs":6128, "sessionsUtilisateur":1989} ,'+
    '{"fichierNom":"truc543.csv", "actionsUtilisateurs":200, "sessionsUtilisateur":100}'+
  ']}');
  console.log( "\n\naprès localStorageService.getItem('user2') modifié ... strUser2 = " + JSON.stringify( localStorageService.getItem("user2") ) ); 
}