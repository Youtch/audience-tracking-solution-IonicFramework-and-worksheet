// services/firebase-service.js

const fbAdmin = require('firebase-admin');
const fbClient = require('firebase');
const config = {
  apiKey: "AIzaSyBxHmgmDdEJK0BOwxk1DiCsd-GVYaZ7P5s",
  authDomain: "swmg-meh.firebaseapp.com",
  databaseURL: "https://swmg-meh.firebaseio.com",
  projectId: "swmg-meh",
  storageBucket: "swmg-meh.appspot.com",
  messagingSenderId: "959209786345"
};
const Promise = require("bluebird"); // importation inutile sur cette version de node ?
const configConstants = require('../config/config-constants');
const DateOperationsService = require('./date-operations-service.js');
  //DEV Archi sans service firebase mock : const mock_firebaseService = require('./mock-firebase-service.js');
/* 
//If you are using native ES6 module with --experimental-modules flag, you should do:
// These imports load individual services into the firebase namespace.
// cf https://www.npmjs.com/package/firebase
import 'firebase/auth';
import 'firebase/database';*/
//var firebase = require('firebase/app');

/////////// Exporter les fonctions publiques
module.exports = {
  init : init, // émulation du constructor() d'une architecture de code POO
  //removeTestsBasic, // DEV test niveau 1
  //testUnitaire_removeSWMGStatsButNotLatest: testUnitaire_removeSWMGStatsButNotLatest // DEV test niveau 2
  // DEV : test_importerDonnees_v1:test_importerDonnees_v1 // DEV test niveau 3
  verifInitialisation:verifInitialisation, // utilisé sur ajax-controller.js :: lancerImportationJeuDonnees
  importerDonnees:importerDonnees,
  //DEV Archi sans service firebase mock : mockData_importerDonnees:mock_firebaseService.mockData_importerDonnees,// Mapping simple de méthode vers module app.js
  // DEV : 
  //getVariablesGlobalJeuDonnees:getVariablesGlobalJeuDonnees,
  checkFbCnx:checkFbCnx
};

var appInit;// firebase Database app
var checkFbCnxNode;// pour tester la connexion à un node attendu
var statsNode;
var statsSessionsNode;
var initializedFailed = false;

//SUPPR A VALIDER
//var dateUtilsService;

 // Pour tester si le service a déjà été utilisé
function verifInitialisation(){
  var o = false;
  console.log("statsNode = ", statsNode);
  if(statsNode!=undefined)
    o = true;
  return o;
}

/**
  @param _databaseUrl : donnée récupérée depuis le stockage persistant
  @param _serviceAccount : donnée récupérée depuis le stockage persistant
**/
function init(_databaseUrl, _serviceAccount)
{
  return new Promise( resolve=>{
    dateUtilsService = new DateOperationsService();
    //SUPPR A VALIDER
    
    console.log("firebase-service launched !");
    //init_FirebaseDatabase();
    init_FirebaseDB(_databaseUrl, _serviceAccount).then( ()=>{ // Connexion à la database SELON LE ROLE ADMIN (pas d'authentification nécessaire)
      // Méthode à utiliser seulement pour authentifier des utilisateurs 
      /*fbAuth = fbAdmin.auth();
      console.log("fbAuth = ",fbAuth);
      console.log("typeof fbAuth = ",typeof fbAuth);*/
   
      //statsNode = fbAdmin.database().ref('test_stats'); 
      statsNode = fbAdmin.database().ref('stats');
      //statsNode = fbAdmin.database().ref('statsISTIQUES');
      
      //statsSessionsNode = fbAdmin.database().ref('test_statsSessions');
      statsSessionsNode = fbAdmin.database().ref('statsSessions');
      //statsSessionsNode = fbAdmin.database().ref('statsSessionsDESTATISTIQUES');
      
      checkFbCnxNode = fbAdmin.database().ref('statsConfigDistante');
      // DEV : Attention les commandes retournent TOUT le contenu des nodes !
      console.log("statsNode = "+JSON.stringify(statsNode) );
      console.log("statsSessionsNode = "+JSON.stringify(statsSessionsNode) );    
      console.log("checkFbCnxNode = "+JSON.stringify(checkFbCnxNode) );    
      
      //Tester seulement cnx :*/
      initializedFailed = false;

      checkFbCnx().then( databaseURLIsValid=>{
        if(!databaseURLIsValid)
          console.log("init exception : _databaseUrl invalide ! \n******************\n ")
        resolve(databaseURLIsValid);
      });


    /** Vérifier si serviceAccount est invalide : **/  
    },(erreur)=>{
      // TODO pour cette branche : résoudre cette erreur => rejection FirebaseError: Firebase: Firebase App named '[DEFAULT]' already exists
      console.log("init exception : _serviceAccount invalide ! \n******************\n ",erreur);
      /* Resultat affiché : 
        errorInfo:
        { code: 'app/invalid-credential',
          message:
          'Failed to parse service account json file: Error: ENOENT: no such file or directory, open \'https://swmg-meh.firebaseio.com\'' },
          codePrefix: 'app' 
        }*/
      initializedFailed = true;
      resolve(false);
    });
  })
}

/*function removeTestsBasic(){
  setTimeout( ()=>{
  test_removeAStat("2020-1-13-18:44:0");
    test_addAStat("-LyV-KKRPjYfJ8GQaH8z");
    old_test_getStats();
  }, 20000)
}*/

/** Initialiser l'appli avec le "service account", qui accorde des privilèges d'administrateur : CF doc https://fbAdmin.google.com/docs/admin/setup
  @param _databaseUrl : donnée EN MAPPING récupérée depuis le stockage persistant
  @param _serviceAccount : donnée EN MAPPING récupérée depuis le stockage persistant
 **/
function init_FirebaseDB(_databaseUrl, _serviceAccount)
{
  // OK : console.log("avant .initializeApp : fbAdmin.apps.length = " + fbAdmin.apps.length); => return 1|0
  if(fbAdmin.apps.length>0) // Cas d'utilisation : réinitialisation lors du changement des paramètres de configuration
   appInit.delete()

  return new Promise( resolve=>{
    // TODO : peupler depuis data.model::get_reglagesApp.databaseUrl et data.model::get_reglagesApp.serviceAccount
    var serviceAccountComplet = require("../assets/"+ _serviceAccount); 
    appInit = fbAdmin.initializeApp({ // l'initialisation entraine la génération de l'app ...
      credential: fbAdmin.credential.cert(serviceAccountComplet),
      databaseURL: _databaseUrl
    });
    // console.log("après .initializeApp : fbAdmin.apps.length = " + fbAdmin.apps.length); => return 1(success)|0(fail)
    resolve();
  });
}

// DEV test testé OK
// DEV test testé OK
/*
function old_test_getStats()
{
  statsNode.once('value', (result)=>{
    var aStats = [];
    var i =0;
    result.forEach( (item)=> {
      //console.log(i+" => key ="+item.key );
      aStats.push( {date: item.val().date, key: item.key} );
      i++;
    });
    console.log("statsNode en array , i="+i+" = "+JSON.stringify(aStats) );
  },
  (error) =>{
    console.log("getAllPosts_test error ="+error);
  });
}*/


/** Vérifier si databaseUrl est invalide **/
function checkFbCnx()
{
  return new Promise( resolve=>{
     var r = false;
      console.log("checkFbCnx lancé !");
      try{
        
        var t = setTimeout( ()=>{ 
          resolve(false);// cas : databaseUrl est invalide, ce qui bloquer la méthode ".once" suivante jusqu'en fin de setTimeout
        },10000);          
        
        checkFbCnxNode.once('value', function(snap){
          resolve(true);// cas : databaseUrl est valide
        }, (err)=>{
          console.log("err =",err);
          resolve(false);
        });
      }
      catch(err){
        console.log("checkFbCnx catch error = ",err);
        resolve(false)
      };

  });
}



//////////// Méthodes de suppression de données ////////////
// Tests de fonctionnalité :
function testUnitaire_removeSWMGStatsButNotLatest()
{
  console.log("//////////////////////// removeSWMGStatsButNotLatest(443, true) :");
  // - Test à 443 (key = -LyDo6bJ24rxWqKoon4Y) : actionsUtilisateur supprimable est le premier élément d'une session : attendu = session N'EST PAS supprimable => TESTE OK
  removeSWMGStatsButNotLatest(443, true).then( (result)=>{
    console.log("//////////////////////// removeSWMGStatsButNotLatest(440, true) :");
    // - Test à 440 (key = -LyDo9HO7DfGRAnOTZJH) : actionsUtilisateur supprimable est au milieu d'une session : attendu = session N'EST PAS supprimable => TESTE OK
    removeSWMGStatsButNotLatest(440, true).then( (result)=>{
      console.log("//////////////////////// removeSWMGStatsButNotLatest(437, true) :");
      //  - Test à 437 (key = -LyDoKh-N0yXmup1FIGC): actionsUtilisateur supprimable est le dernier élément d'une session : attendu = session EST supprimable => TESTE OK
      removeSWMGStatsButNotLatest(437, true).then( (result)=>{
        console.log("//////////////////////// removeSWMGStatsButNotLatest(356, true) :");
        //  - Test à 437-81=356 (key = -LyInOWQcDngxBWWKS7o) : actionsUtilisateur supprimable est le premier élément et unique pour une session : attendu = session EST supprimable => TESTE OK
        removeSWMGStatsButNotLatest(356, true);
      });  
    });
  })
}

/*function test_removeAStat(_date) // DEV testé OK
// TODO Tester avec la valeur du champ "date"
{
    statsNode.once('value', (readResult)=>{
    // equiv ref de database unique : fireRef.child('posts').once('value')
    //console.log("allPosts = "+JSON.stringify(result) ); // Test OK : suite d'objet
    //console.log("allPosts => key="+result.key+' ; val='+result.val().JSON.stringify() );// Test ?
    let i = 0;
    readResult.forEach( (item)=> {
      // console.log(JSON.stringify(item)); OK
      console.log(i+" => key ="+item.key+" ; typeof item['date'] ="+typeof item.val().date);
      if(item.val().date == _date) 
      {
        statsNode.child(item.key).remove();
        console.log("suppression quand i="+i+", key = "+item.key+" et date = "+_date ); // Test ?
      } 
      i++;
    });
  },
  (error) =>{
    console.log("test_removeAStat error ="+error);
  });
}*/

// DEV testé OK
/*
function test_addAStat(_key)
{
  console.log("ajout dans statsNode : pour key="+_key);
    //let newKey = statsNode.push().key; // Write the new post's empty data and return the key
    let updatePath = {};
    let statsData = {
      composantUI : "initApp",
      date: "2020-1-13-18:44:0",
      page : "app.component",
      statsSessionId : "-LyV-KKRPjYfJ8GQaH8z",
  };
  updatePath[_key] = statsData;
  statsNode.update(updatePath);
}*/

function removeSWMGStatsButNotLatest(_nombreElementsAConserver, isTestDeveloppeur)
{
  return new Promise((resolve, reject) => {// Structure de promise : utilisé par les tests unitaire
    let aSessionsSupprimables = [];

    // Choix des "actions utilisateurs" à supprimer, puis lot de suppressions
    // En parallèle choix des "session" à supprimer
    statsNode.once('value', (statsResult)=>{
      // Compter les éléments ; soustraire total - 10; récupérer les éléments limité aux  premier de total - 10
      // Seulement pour compter les éléments : car aucune commande dédiée n'existe
      let aStatsResult = [];
      statsResult.forEach( (item) => {
        aStatsResult.push(item);
      })
      // Définir les éléments à supprimer
      let rgDernierElementSupprimable = aStatsResult.length - _nombreElementsAConserver;// TOTEST : -1
      console.log("nombre des premiers élements supprimables = "+rgDernierElementSupprimable);
      
      let previousSessionId = "";// RAZ
      // Supprimer les éléments
      let i=0;
      statsResult.forEach( (itemActionUser)=>{
        //console.log("itemActionUser.key = "+itemActionUser.key+" ; itemActionUser.val().statsSessionId");
        //console.log(" ################################ \nitemActionUser = "+JSON.stringify(itemActionUser) +"\n ################################");
        // Solution d'export TEXTUEL des données :
        // console.log("\""+itemActionUser.key+"\":{\"composantUI\""+itemActionUser.val().composantUI+"\", \"date\":\""+itemActionUser.val().date+"\", \"page\":\""+itemActionUser.val().page+"\", \"statsSessionId\":\""+itemActionUser.val().statsSessionId+"\"},");

        if(i<rgDernierElementSupprimable){

          ////////// Préparer les éléments de 'session' à supprimer plus base = "session" dépendante des actions utilisateurs
          if(previousSessionId!=itemActionUser.val().statsSessionId || previousSessionId==""){ // Si la statsSessionId vient juste de changer, ou si la statsSessionId est encore vide en 1ère itération
            if((i+1)==rgDernierElementSupprimable){// Lors du passage au dernier rang de i
              // TODO A gérer ? if(_nombreElementsAConserver>aStatsResult.length)// sauf en cas de suppression de TOUS les éléments
                // cas d'utilisation particulier : lorsqu'une session est attaché à des actionsUtilisteurs qui ne sont différentes des éléments à supprimer : 
                //     gérer la suppression ou non suppression des actions d'UNE SESSION considérée comme supprimable.... alors qu'elle restera attachée à des actions non supprimées.
                console.log("la statsSessionId vient juste de changer ; aStatsResult[i+1].val().statsSessionId = "+aStatsResult[i+1].val().statsSessionId);
                // Vérifier l'égalité  entre statsSessionId du rang actuel (dernier éléments supprimable) et le suivant (premier élément non supprimable)
                if(aStatsResult[i+1].val().statsSessionId==itemActionUser.val().statsSessionId) {
                  console.log("Denier élément sessionId non supprimable !");
                }     
                else{// Passage à n'importe quel rang de i
                  aSessionsSupprimables.push( itemActionUser.val().statsSessionId );
                }
              //}
            }
            else{// Passage à n'importe quel rang de i
              // Ajouter la session seulement si la valeur de statsSessionId est nouvelle
              aSessionsSupprimables.push( itemActionUser.val().statsSessionId );
              previousSessionId = itemActionUser.val().statsSessionId;
            }
          }

          else if(previousSessionId==itemActionUser.val().statsSessionId && (i+1)==rgDernierElementSupprimable){// Si la statsSessionId a déjà été ajoutée/ne vient pas de changer, et lors du passage au dernier rang de i
            // TODO A gérer ? if(_nombreElementsAConserver>aStatsResult.length)// sauf en cas de suppression de TOUS les éléments
              // cas d'utilisation particulier : lorsqu'une session est attaché à des actionsUtilisteurs qui ne sont différentes des éléments à supprimer : 
              //     gérer la suppression ou non suppression des actions d'UNE SESSION considérée comme supprimable.... alors qu'elle restera attachée à des actions non supprimées.
                
              console.log("la statsSessionId a déjà été ajoutée/ne vient pas de changer ; aStatsResult[i+1].val().statsSessionId = "+aStatsResult[i+1].val().statsSessionId);
              // Vérifier l'égalité  entre statsSessionId du rang actuel (dernier éléments supprimable) et le suivant (premier élément non supprimable)
              if(aStatsResult[i+1].val().statsSessionId==itemActionUser.val().statsSessionId){
                console.log("Denier élément sessionId non supprimable ET DESACTIVER SA SUPPRESSION !");
                aSessionsSupprimables.pop();
              } 
            //}
          }
          ////////// Fin de préparation

          if(!isTestDeveloppeur)
            statsNode.child(itemActionUser.key).remove();
          console.log("suppression d'une 'action utilisateur'#"+i.toString()+" ayant key = "+itemActionUser.key+ " et statsSessionId = "+itemActionUser.val().statsSessionId);
        }

        i++;
      });
      //console.log( "#1 aSessionsSupprimables.length= " + aSessionsSupprimables.length );
    },
    (error) =>{
      console.log("statsNode.once error ="+error);
      resolve(false);
    });
   
    // Lot de suppression des "sessions"
    statsSessionsNode.once('value', (sessionsResult)=>{
      // DEV : tester => sync est attendu = donc identique à #1
      // console.log( "#2 aSessionsSupprimables.length= " + aSessionsSupprimables.length );
      // DEV : vérifier par l'exemple l'absence de tout doublon
      console.log( "#2 aSessionsSupprimables= " + JSON.stringify(aSessionsSupprimables) );
      sessionsResult.forEach( (itemSession)=>{
        // console.log("\""+itemSession.key+"\":{\"androidVersion\""+itemSession.val().androidVersion+"\", \"licenceEstPremium\":\""+itemSession.val().licenceEstPremium+"\", \"statsSessionId\":\""+itemSession.val().statsSessionId+"\"},");
        aSessionsSupprimables.forEach( (sessionIdSupprimable)=>{
          if(sessionIdSupprimable == itemSession.val().statsSessionId){
            if(!isTestDeveloppeur)
              statsSessionsNode.child(itemSession.key).remove();
            // Solution d'export TEXTUEL des données :
            // console.log(" suppression de la la \"session\" dépendante de stats ayant statsSessionId = "+sessionIdSupprimable+" et key = "+itemSession.key);
            resolve(true);
          }
        });
      })
    },
    (error) =>{
      console.log("statsSessionsNode.once error ="+error);
      resolve(false);
    });
  });
}

function test_importerDonnees_v1()
{
  importerDonnees(false);
} 




////////////////////////////////////// DEBUT DU LOT DES COMMUNS AUX METHODES DE PRODUCTION ET DE MOCK  //////////////////////////////////////
//let oChampsCalculesJeuDonnees = {};
/*function getVariablesGlobalJeuDonnees(){
  return oChampsCalculesJeuDonnees;
}*/



// DEV : var isDerniersRangs = false;
var jeuDonnees_nombreActUti = 0;
var jeuDonnees_nombreSessions = 0;
// TODO pour swmg v1.8 (API serveur v1.8 ?)
// jeuDonnees_nombreUtilisateurs
// jeuDonnees_nombreVisitesAppli
function preparerChampsCalculeDeSession(_oDonneesDeSession, _aActionsUtilisateur){ // return object:{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string}
    // console.log("////////////// Lancement de preparerChampsCalcule relatif à la SESSION ////////////");
    let aActionsUsersDansSession = [];
    // Retrouver chaque action utilisateur dans la session afin de calculer les variables
    _aActionsUtilisateur.forEach( (itemActionsUser)=>{// Concerne uniquement la session concernée
      if(itemActionsUser.statsSessionId == _oDonneesDeSession.statsSessionId){
        aActionsUsersDansSession.push(itemActionsUser);
        //console.log("itemActionsUser ajouté = "+JSON.stringify(itemActionsUser)+" DONT .statsSessionId = "+ itemActionsUser.statsSessionId );
      }
    });
    //console.log("aActionsUsersDansSession = " + JSON.stringify(aActionsUsersDansSession) );
  return calculVariablesRelativesASession(aActionsUsersDansSession);
}

function preparerChampsCalculeJD(_aDonneesDeSession, _aActionsUtilisateur){
  //console.log("////////////// Lancement de preparerChampsCalcule relatif au JEU DE DONNEES ////////////");
  jeuDonnees_nombreActUti = _aActionsUtilisateur.length;
  jeuDonnees_nombreSessions = _aDonneesDeSession;
  let o = {jeuDonnees_nombreActUti:jeuDonnees_nombreActUti, jeuDonnees_nombreSessions: jeuDonnees_nombreSessions};  
  //console.log("preparerChampsCalculeJD:: o = "+ JSON.stringify(o) );
  return (o);
}

var dateDebut;
var dateFin;
function calculVariablesRelativesASession(_aActionsUsersDansSession){ // return object:{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string};
  
  let nbUiAidesOuverts = 0;
//SUPPR A VALIDER
//  let dureeSession = 0; // en secondes
  let previousPage = "";
  let nombrePagesVisitees = 0;
  let nombreCmpsCmpsntUINonDstnctVisites = 0;
  let cheminNavigation = "";

  let aHistoriqueComposantsUI = [];

  let i=0;
//SUPPR A VALIDER
//  dateDebut = new Date();
//  dateFin = new Date();

  _aActionsUsersDansSession.forEach( (item)=>{
      configConstants.LISTE_VALS_NBUIAIDESOUVERTS.forEach( (constantItem)=>{
        if(item.composantUI==constantItem)
          nbUiAidesOuverts++;  
      })

//SUPPR A VALIDER
//      calculerDureeSession(item, i, _aActionsUsersDansSession.length);
//      i++;

      if(previousPage == "" || previousPage!=item.page){
        if(item.page!="app.component")// L'init d'appli/de session n'est PAS une page !
          nombrePagesVisitees++;
        previousPage = item.page;
        if(cheminNavigation=="") 
          cheminNavigation = item.page;
        else{
          cheminNavigation = cheminNavigation + configConstants.CHEMIN_NAVIGATION_SEPARATEUR + item.page;
        }
      }
      if(item.composantUI!="initApp"){
        nombreCmpsCmpsntUINonDstnctVisites++;
        aHistoriqueComposantsUI.push(item.composantUI);
      }

  });
  // console.log("calculVariablesRelativesASession::aHistoriqueComposantsUI = "+JSON.stringify(aHistoriqueComposantsUI) );
  //console.log("calculVariablesRelativesASession::cheminNavigation = "+cheminNavigation);
  
  //if(isDerniersRangs)
    //console.log("aHistoriqueComposantsUI::isDerniersRangs = "+JSON.stringify(aHistoriqueComposantsUI) );
    //
//SUPPR A VALIDER
//  dureeSession = dateUtilsService.getDateDiff(dateFin, dateDebut, "sec");
  //TODO : dureeSession = Math.round( dateUtilsService.getDateDiff(dateFin, dateDebut, "sec"));

  //console.log( "différence (test de bibliothèque) : "+ Math.round( dateUtilsService.getDateDiff(dateFin, dateDebut, 0)) );

//SUPPR A VALIDER
//let o = {nbUiAidesOuverts:nbUiAidesOuverts, dureeSession:dureeSession, nombrePagesVisitees:nombrePagesVisitees, cheminNavigation:cheminNavigation};
  let o = {nbUiAidesOuverts:nbUiAidesOuverts, nombrePagesVisitees:nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:cheminNavigation};
  //console.log("calculVariablesRelativesASession() => "+ JSON.stringify(o) );
  return o;
}



// TODO : 
//1) via importerDonnees
// Récupérer les éléments statsNode et statsSessionsNode , et repérer les éléments statsNode et de statsSessionsNode à supprimer
//  passer les key à supprimer dans aStatsKeySupprimables et aStatsSessionsKeySupprimables
//2) via supprimerDonnees : déclenchement lors de la validation d'import après présentation du jeu de données visuellement, et après confirmation de la demande de confirmation
//  supprimer les key stocké dans aStatsKeySupprimables et aStatsSessionsKeySupprimables
//NB Cycle de vie des données :
//  Si la page est quitté, les données devraient être enregistrée, l'état "fbDBDonneesImporteesPresentees=true" aussi
////////////////////////////////////// FIN DU LOT DES COMMUNS AUX METHODES DE PRODUCTION ET DE MOCK  //////////////////////////////////////



////////////////////////////////////// DEBUT DU LOT DE METHODES AVEC DONNEES DE PRODUCTION  //////////////////////////////////////
/**
 * @param boolean
 * @param Date|undefined
 * @param Date|undefined
 * @return {
 *  metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:session}
 *  data:Array<{key, composantUI, date, page, statsSessionId,
 *    sessionKey, androidVersion, licenceEstPremium,
 *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites}>
 * }
 */
function importerDonnees(_dateMaxLimite, _dateMinLimite){ // format de dateMinLimite et dateMaxLimite  : undefined ou Date
// TODO : gérer une date maximal et minimale (pour tests) spécifique
  console.log("importerDonnees lancé");
  return new Promise((resolve, reject) => {
    let aSessions = [];
    statsSessionsNode.once('value', (sessionsResult)=>{
    
      sessionsResult.forEach( (itemSession)=>{
        // Tenir compte d'un bug d'enregistrement de la session utilisateur : itemSession.val().licenceEstPremium peut être undefined (type boolean)
        let licenceValue = itemSession.val().licenceEstPremium;
        if(itemSession.val().licenceEstPremium == "undefined" || itemSession.val().licenceEstPremium == undefined)
          licenceValue = false;
        aSessions.push( {key:itemSession.key, androidVersion:itemSession.val().androidVersion, licenceEstPremium:licenceValue, statsSessionId:itemSession.val().statsSessionId} );
      })
      //console.log("aSessions = "+JSON.stringify(aSessions) );
    /**/
      getActionsUtilisateur(aSessions, _dateMaxLimite, _dateMinLimite).then( oData=>{ 
        resolve(oData);
      },
      (error)=>{
        console.error("getActionsUtilisateur error ="+error);
        resolve([]);
      });
    },
    (error) =>{
      console.error("statsSessionsNode.once error ="+error);
      resolve("");
    });
    /**/

    // TODO la limite selon la date, via une autre méthode que limitToLast, lecture du node et filtrage préalable (via les key de StatNode)
    // Solution pour la persistance de données en session, et la suppression des données sur FirebaseDB:
    // - cf notes du DTD
    // - Sol A) récupérer les éléments à importer (plus anciens), et les sessions liées 
    //   Note de conception A AJOUTER AU PROTOTYPE PAPIER : 
    //      Si le jeu de données récupérées, pas encore généré donc pas supprimées ; En SESSION : aucun jeu de données ne peut être importées MAIS SI appli est redémarré, les  données seront disponible à nouveau.
    //      Le jeu de donnée est supprimé QUAND le fichier a été généré avec SUCCES (NB notes pour Dev : jeu de données importé conservé, seront supprimées par ~fs-management-service::genererCSV )
   });
 }

 /**
  * @param  Array
  * @param  Date
  * @param  Date
  * @param  Boolean
  * @return {
  *  metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}
  *  data:Array<{key, composantUI, date, page, statsSessionId,
  *    sessionKey, androidVersion, licenceEstPremium,
  *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation}>
  * }
  */
 function getActionsUtilisateur(_aSessions, _dateMaxLimite, _dateMinLimite){
  var metadata = {dateDebut:"", dateFin:""};

  if(_dateMaxLimite==0){
    _dateMaxLimite = new Date( 2099, 11, 31);
  }
  if(_dateMinLimite==0){
    _dateMinLimite = new Date( 1970, 0, 1);
  }
  console.log( "getActionsUtilisateur :: _dateMaxLimite" +JSON.stringify(_dateMaxLimite) +"_dateMinLimite" +JSON.stringify(_dateMinLimite) );
  return new Promise((resolve, reject) => {
    let aStats = [];
    // NOK :statsNode.limitToFirst(10).once('value', (statsResult)=>{
    // DEV statsNode.orderByKey().limitToLast(50).once('value', (statsResult)=>{  
    //statsNode.orderByKey().limitToLast(50).once('value', (statsResult)=>{ 
    statsNode.once('value', (statsResult)=>{  
      
      statsResult.forEach( (itemStats)=>{
        // SWMG 1.7 : Exemple d'enregistrement = "2020-01-24-11:53:21" - Nécessaire pour le tableur "24-01-2020 11:53:21"
        // Modification de la composition de la date pour rendre compatible avec le format date du tableur
        aTempDate = (itemStats.val().date).split("-");

        strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
    
        //FILTRER LES DONNEES COMPRIS DANS L'INTERVAL DE DATE SELECTIONNE :
        var date = new Date( Number(aTempDate[0]), Number(aTempDate[1])-1, Number(aTempDate[2]) );

        //console.log("mockData_getActionsUtilisateur :: item "+ k + ": strDateFormatee = "+strDateFormatee+ " ; date = "+JSON.stringify(date) );
        if(date.getTime()<=_dateMaxLimite.getTime() && date.getTime()>=_dateMinLimite.getTime() )
        // Pb d'algo : comment récupérer ceux du jours suivant si une donnée APPARTIENT à une session "placé entre 2 jours différents" ? 
        // TODO : selon la similarité de session, vérifier la donnée précédente, et la donnée suivante  
        {
          aStats.push( {key:itemStats.key, composantUI:itemStats.val().composantUI, date:strDateFormatee, page:itemStats.val().page, statsSessionId:itemStats.val().statsSessionId } );
       
          ///// Gérer l'objet "metadata" 
          aTempHeure = aTempDate[3].split(":");
          date = new Date( aTempDate[0], aTempDate[1]-1, aTempDate[2], aTempHeure[0], aTempHeure[1], aTempHeure[2]);
          if(metadata.dateDebut==""){// tant qu'il est vide, soit attribuer seulement lors du premier passage
          //Définir pour l'objet "metadata" l'attribut 'dateDebut' :
            metadata.dateDebut = dateUtilsService.getDateToShortHumanText_i18n(date, true, true, true, false, true, 1, false);
            //console.log("metadata.dateDebut = "+metadata.dateDebut);
          }
          else{ // Sinon l'attribuer à chaque passage, seul le dernier étant attendu (inconnu : le nombre d'élément candidat selon les date limites)
            //Définir, si non attribué auparavant, pour l'objet "metadata" l'attribut 'dateDebut' :
            metadata.dateFin = dateUtilsService.getDateToShortHumanText_i18n(date, true, true, true, false, true, 1, false);
          }
        }
      })
      // DEV 
      //console.log("metadata = ",metadata);

      console.log("aStats.length ="+aStats.length);
      //console.log("aStats = "+JSON.stringify(aStats) );

      let searchedSession;
       // Ajouter ici : les variables lié au jeu de données (destiné à l'affichage de la page "Historique des jeux données") 
      oChampsCalculesJeuDonnees = preparerChampsCalculeJD(_aSessions, aStats);
      let aChampsCalculesDesSessions = [];// type Array<any> : contient pour les champs calculés de chaque session (disposés dans le même ordre que dans aSessions)
      
      let nbSessionsUsers = 0;
      let lastStatsSessionId = "";

      _aSessions.forEach( (itemSession)=>{ 
      //console.log("_aSessions = ",_aSessions);
      //console.log(" itemSession.statsSessionId = "+itemSession.statsSessionId+" ; aStats[i].statsSessionId = "+aStats[i].statsSessionId);
        searchedSession = {};
        for(i=0; i<aStats.length; i++){
            if(aStats[i].statsSessionId==itemSession.statsSessionId){
              /* DEV :  if(i>aStats.length-3) 
                isDerniersRangs = true;*/
              searchedSession = itemSession // {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:itemSession.licenceEstPremium, statsSessionId:itemSession.statsSessionId};
              // PREPARER l'ajout sur la "ligne de session de fichier CSV" les variables de champs calculés relatives à la session, 
              aChampsCalculesDesSessions.push( preparerChampsCalculeDeSession(searchedSession, aStats) );// Selectionner uniquement les actions utilisateur lié à la session
              //if(i>= (aStats.length-500))
              //  console.log(i +": aChampsCalculesDesSessions = "+JSON.stringify(aChampsCalculesDesSessions));
              
              // Comptage de la metadata "nombre de sessions utilisateur" :
              if(lastStatsSessionId=="" || lastStatsSessionId!=itemSession.statsSessionId) 
                nbSessionsUsers++;
              lastStatsSessionId = itemSession.statsSessionId;
            }
          };
      });
      //console.log("aChampsCalculesDesSessions complet = "+JSON.stringify(aChampsCalculesDesSessions) );

      let aOutputStats = []; // Array de sortie : affichable avant génération, pour vérifier des erreurs eventuelles lors de l'enregistrement !
      let s = 0;// Comptage des rangs de aChampsCalculesDesSessions, dans les éléments sont disposés dans le même ordre que dans aSessions
      //console.log("aStats[0] = ",aStats[0])
      //console.log("aStats.length = ",aStats.length)
      //console.log("aStats[aStats.length-1].statsSessionId = ",aStats[aStats.length-1].statsSessionId ) ;
      for(i=0; i<aStats.length; i++){
                  
        if(i<aStats.length-1){
          if(aStats[i].statsSessionId!=aStats[i+1].statsSessionId || i==aStats.length-1){ // .... OU  Dernier rang en cours 
            searchedSession = {};
            // DEV :
            j=0;
            _aSessions.forEach( (itemSession)=>{ 
              j++;
              //console.log("itemSession #"+j+" itemSession.statsSessionId = "+itemSession.statsSessionId+" ; aStats[i].statsSessionId = "+aStats[i].statsSessionId);
              if(aStats[i].statsSessionId==itemSession.statsSessionId){
                searchedSession = itemSession // {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:itemSession.licenceEstPremium, statsSessionId:itemSession.statsSessionId};
                // DEV 
                //console.log("session #" +j+ "searchedSession = ", searchedSession);
              }
            });
            //console.log("i="+i+" : searchedSession = "+JSON.stringify(searchedSession) );
            //console.log("searchedSession.androidVersion = ",searchedSession.androidVersion);
            let aSplitAndroidVersion;
            try{
               aSplitAndroidVersion = searchedSession.androidVersion.split(";");
            }
            catch(err){// erreur si le champ androidVersion ne contient pas ";"
              aSplitAndroidVersion = ["test browser","0"];
            }
            let strAndroidVersion = 0
            if( aSplitAndroidVersion.length>1) 
              strAndroidVersion = aSplitAndroidVersion[1].trim();
            //aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
            //  sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium, statsSessionId:searchedSession.statsSessionId} );
              
              // CONCATENER l'ajout sur la "ligne de session de fichier CSV" les variables de champs calculés relatives à la session, 
            oChampsCalculesDeSession = aChampsCalculesDesSessions[s];// Selectionner uniquement le rang de champs calculés relatives à la session, 
            //console.log("session #"+s+" : oChampsCalculesDeSession = "+JSON.stringify(oChampsCalculesDeSession) );

            let naid = 0; let npage = 0 ; let nui = 0; let nnav = 0;
            if(oChampsCalculesDeSession!=undefined){
               naid = oChampsCalculesDeSession.nbUiAidesOuverts;
               nanpageid = oChampsCalculesDeSession.nombrePagesVisitees;
               nui = oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites;
               nnav = oChampsCalculesDeSession.cheminNavigation;
            }
            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:searchedSession.statsSessionId,
                sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium,
                nbUiAidesOuverts:naid, nombrePagesVisitees:nanpageid, nombreCmpsCmpsntUINonDstnctVisites:nui, cheminNavigation:nnav} 
            );
          }
          else if(i<aStats.length-1){ 
            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
              sessionKey:"", androidVersion:"", licenceEstPremium:"",
              nbUiAidesOuverts:"", nombrePagesVisitees:"", nombreCmpsCmpsntUINonDstnctVisites:"", cheminNavigation:""} );
            //console.log("i="+i+" : aOutputStats ="+JSON.stringify(aOutputStats) );
          }
        }
        else{ // SI PARSAGE DU DERNIER RANG : toujours récupérer la session !
          console.log("PARSAGE DU DERNIER RANG  = ", aStats[i]);
          
          //Définir, si non attribué auparavant, pour l'objet "metadata" l'attribut 'dateDebut' :
          aTempHeure = aTempDate[3].split(":");
          date = new Date( aTempDate[0], aTempDate[1]-1, aTempDate[2], aTempHeure[0], aTempHeure[1], aTempHeure[2]);
          

          /// Tester si le dernier rang contient une date comprise entre les dates limites
          ///// Gérer l'objet "metadata"
          if(date.getTime()<=_dateMaxLimite.getTime() && date.getTime()>=_dateMinLimite.getTime() )
          // Pb d'algo : comment récupérer ceux du jours suivant si une donnée APPARTIENT à une session "placé entre 2 jours différents" ? 
          // TODO : selon la similarité de session, vérifier la donnée précédente, et la donnée suivante  
          {
            metadata.dateFin = dateUtilsService.getDateToShortHumanText_i18n(date, true, true, true, false, true, 1, false);
            // DEV 
            console.log("metadata.dateFin = "+metadata.dateFin);
          }

          if(aStats[i].key!="null"){ // CAS d'erreur d'enregistrement par "Meteo En Hyperespace" : TODO Bug à résoudre
            searchedSession = {};
            // DEV :
            j=0;
            _aSessions.forEach( (itemSession)=>{ 
              j++;
              //console.log("itemSession #"+j+" itemSession.statsSessionId = "+itemSession.statsSessionId+" ; aStats[i].statsSessionId = "+aStats[i].statsSessionId);
              if(aStats[i].statsSessionId==itemSession.statsSessionId){
                searchedSession = itemSession // {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:itemSession.licenceEstPremium, statsSessionId:itemSession.statsSessionId};
                // DEV 
                //console.log("session #" +j+ "searchedSession.statsSessionId = "+searchedSession.statsSessionId);
              }
            });
            //console.log("i="+i+" : searchedSession = "+JSON.stringify(searchedSession) );
            //console.log("searchedSession.androidVersion = ",searchedSession.androidVersion); => si erreur pour searchedSession.androidVersion.split(";") impossible car searchedSession.androidVersion et undefined => ERREUR DUE à l'incohérence des données sources !
            let aSplitAndroidVersion = searchedSession.androidVersion.split(";");
            let strAndroidVersion = 0
            if( aSplitAndroidVersion.length>1) 
              strAndroidVersion = aSplitAndroidVersion[1].trim();
            //aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
            //  sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium, statsSessionId:searchedSession.statsSessionId} );
              
              // CONCATENER l'ajout sur la "ligne de session de fichier CSV" les variables de champs calculés relatives à la session, 
            oChampsCalculesDeSession = aChampsCalculesDesSessions[aChampsCalculesDesSessions.length-1];// Selectionner uniquement le rang de champs calculés relatives à la session, 
            //  ... dans cette branche conditionnelle DU DERNIER RANG DES SESSIONS : lire les données de LA DERNIERE SESSION
            //console.log("session #"+s+" : oChampsCalculesDeSession = "+JSON.stringify(oChampsCalculesDeSession) );

            
            let naid = 0; let npage = 0 ; let nui = 0; let nnav = 0;
            if(oChampsCalculesDeSession!=undefined){
               naid = oChampsCalculesDeSession.nbUiAidesOuverts;
               nanpageid = oChampsCalculesDeSession.nombrePagesVisitees;
               nui = oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites;
               nnav = oChampsCalculesDeSession.cheminNavigation;
            }
            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:searchedSession.statsSessionId,
                sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium,
                nbUiAidesOuverts:naid, nombrePagesVisitees:nanpageid, nombreCmpsCmpsntUINonDstnctVisites:nui, cheminNavigation:nnav} 
            );

          }
        }
        s++;  
      }
      // En reparsant aStatsResult voire _aSessions pour calculer les *variables calculées*
      // durée session actuelle cumulée durée session totale  Chemin de navigation d’une session  Nombres de pages consultées Nombre d’UI d’aide affichées  durée de session  durée moyenne consultation d'une page Eca typ consultation d'une page Variance consultation d'une page
      // console.log( "//////////////////////////nRESULTAT : aOutputStats = "+JSON.stringify(aOutputStats) );
      //console.log( "getActionsUtilisateur terminé !");
      resolve({
        data: aOutputStats,
        metadata:{
         dateDebut: metadata.dateDebut, dateFin: metadata.dateFin, nbActionsUtilisateurs:aOutputStats.length.toString(), nbSessionsUtilisateurs: nbSessionsUsers.toString()
        }
      });
      console.log( "dateDebut = "+ metadata.dateDebut +" , dateFin: " + metadata.dateFin +" , nbActionsUtilisateurs: = "+ aOutputStats.length.toString() + ", nbSessionsUtilisateurs: "+nbSessionsUsers.toString());
      //DEV console.log( " ; _dateMaxLimite = "+JSON.stringify(_dateMaxLimite)+" ; _dateMinLimite.getTime()="+JSON.stringify(_dateMinLimite) );
    },
    (error) =>{
      console.log("statsSessionsNode.once error ="+error);
      resolve([]);
    });

  });
}
////////////////////////////////////// FIN DU LOT DE METHODES AVEC DONNEES DE PRODUCTION  //////////////////////////////////////




/*directive "export" NOK : OK seulement sur Typescript 
export interface IMetadata {
  dateDebut:string,
  dateFin:string,
  nbActionsUtilisateurs:string,
  nbSessionsUtilisateurs:string,
}
export interface IDataJS { // TODO : types
  key, composantUI, date, page, statsSessionId,
  sessionKey, androidVersion, licenceEstPremium,
  nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation
}
*/

////////////////////////////////////// METHODES DE SUPPRESSION DES DONNEES : A VALIDER ///////////////////////////////////////////////////
/*
function calculerDureeSession(item, i, nbActionsUsersDansSession){
  // TODO :  Incrémenter le temps passé entre chaque élément = définir dureeSession ;
  // Exemple de date d'entrée : "24-01-2020 11:53:21"
  let aTemp1; let aTemp2; let aTemp3;

  let now = new Date();
  let tomorow = new Date();
  tomorow.setTime( now.getTime() + (1000*60*60*24));

  if(i==0){
    aTemp1 = (item.date).split("-");
    aTemp2 = aTemp1[2].split(" ");
    aTemp3 = aTemp2[1].split(":");
    console.log( "Pour item.date = " +item.date+ " => aTemp1 (DD,MM,...) = "+JSON.stringify(aTemp1) + " ; aTemp2(YYY, ...) = " +JSON.stringify(aTemp2)+ " ; aTemp3(hh,mm,ss) = "+JSON.stringify(aTemp3) );
    dateDebut = now;// Modèle : numDate, numMonth, numFullYear, numHours=0, numMinutes=0, numSeconds=0
    console.log( "dateDebut = "+ dateUtilsService.getDateToISOWithoutOffset(dateDebut) );
  }
  if(i==(nbActionsUsersDansSession-1) ){
    aTemp1 = (item.date).split("-");
    aTemp2 = aTemp1[2].split(" ");
    aTemp3 = aTemp2[1].split(":");
    console.log( "Pour item.date = " +item.date+ " => aTemp1 (DD,MM,...) = "+JSON.stringify(aTemp1) + " ; aTemp2(YYY, ...) = " +JSON.stringify(aTemp2)+ " ; aTemp3(hh,mm,ss) = "+JSON.stringify(aTemp3) );
    console.log( "aTemp1 (DD,MM,...) = "+JSON.stringify(aTemp1) + " ; aTemp2(YYY, ...) = " +JSON.stringify(aTemp2)+ " ; aTemp3(hh,mm,ss) = "+JSON.stringify(aTemp3) );
    dateFin = tomorow;// Modèle : numDate, numMonth, numFullYear, numHours=0, numMinutes=0, numSeconds=0
    console.log( "dateFin = "+ dateUtilsService.getDateToISOWithoutOffset(dateFin) );
  }
}
*/


// DEV
function removeStatsOfARange(dateMinLimite, dateMaxLimite){// dateMinLimite et dateMaxLimite sont inclus dans la suppression
  //TODO
}

// DEV
function removeStatsFromLastYear(){
  // TODO
  // Ceux dont la date est 2019
}

//DEV
function removeASWMGStatseforeTLsWeek(){
  // Rôle : supprimer les éléments dont la date DE LA SESSION commence avant la date limite / ~~de péremption~~ / ~~d'echeance~~
  // Contraintes :
  //  La session dont la première AU (action utilisateur) attachée commence avant la date limite sera supprimée, l'ensemble constitué par l'AU en question et toutes les autres AU attachées seront supprimée , Y COMPRIS si leur donnée "date" est comprise après l'échéance
  //  La session dont la première AU (action utilisateur) attachée commence après la date limite ne sera pas supprimée, l'ensemble constitué par l'AU en question et toutes les autres AU attachées ne seront pas supprimée

  // TODO Codage
  // Coder selon une date en paramètre : pour production la date sera séléctionnée via un UI type "dataPicker"
  /*
  this.postsNode.once('value', (readResult)=>{
    // Définir les éléments à supprimer
    // sdaot : Exemple de chaine  "2019 jun 9"
    // back office STAU : Exemple de chaine ""
    let now:Date = new Date();
    let dateDernierJourSemaineDenière = new Date() //TODO :  A 23h59:59
    // TODO Comment connaitre la date du dernier jour de la semaine dernière ? selon date, puis calculer time de différence entre now et ce moment
    //    Puis définir timeBeginningOfThisWeek
    //    Puis définir timeBeginningOfThisWeek = new Date( timeDiff );
    // DEV non juste :
    let timeBeginningOfThisWeek = new Date( now.getFullYear(), now.getMonth(), new.getDate()-3);

    readResult.forEach( (item)=>{
      let aDate = item.date.split(" ");
      let aHeure1 = aDate[4].split(":");
      let dateItem = new Date( aDate[3], this.getMonthNumberValue(aDate[1]), aDate[2], aDate1[0], aDate1[1], aDate2[2])///
      if(dateItem.getTime() < timeBeginningOfThisWeek.getTime() ){
        this.postsNode.child(item.key).remove();
        console.log("suppression d'élément #"+i.toString()+" ayant key = "+item.key);
      }
      i++;
    });
  });
*/
}

function getMonthNumberValue(strMonth)
{
  let o ;
  switch(strMonth){
    case "Jan" : o = 1;
    break;
    case "Feb" : o = 2;
    break;
  }
  // TODO ....
  return o;
}

function getMockJeuDonnees(){ // Return array d'objects
}