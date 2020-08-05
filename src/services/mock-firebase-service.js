// services/mock-firebase-service.js
const configConstants = require('../config/config-constants');
const DateOperationsService = require('./date-operations-service.js');

/////////// Exporter les fonctions publiques
module.exports = {
  mockData_importerDonnees:mockData_importerDonnees,
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
function preparerChampsCalculeDeSession(_oDonneesDeSession, _aActionsUtilisateur, _activRechercherFunnels){ // return object:{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string, listeFunnels:string}
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
  return calculVariablesRelativesASession(aActionsUsersDansSession, _activRechercherFunnels);
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
function calculVariablesRelativesASession(_aActionsUsersDansSession, _activRechercherFunnels){ // return object:{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string, listeFunnels:string};
  
  let nbUiAidesOuverts = 0;
//SUPPR A VALIDER
//  let dureeSession = 0; // en secondes
  let previousPage = "";
  let nombrePagesVisitees = 0;
  let nombreCmpsCmpsntUINonDstnctVisites = 0;
  let cheminNavigation = "";

  let aHistoriqueComposantsUI = [];
  let listeFunnels = ""; // TODO

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
  // Recherche des Funnels #2 : enregistrement
  //console.log("calculVariablesRelativesASession::cheminNavigation = "+cheminNavigation);
  
  //if(isDerniersRangs)
    //console.log("aHistoriqueComposantsUI::isDerniersRangs = "+JSON.stringify(aHistoriqueComposantsUI) );
  if(_activRechercherFunnels){
    configConstants.LISTE_VALS_LISTEFUNNELS.forEach( (constantItem)=>{
      if(aHistoriqueComposantsUI.length>0){
        let strHistoriqueComposantsUI = aHistoriqueComposantsUI.join(configConstants.CHEMIN_NAVIGATION_SEPARATEUR);
        //console.log("calculVariablesRelativesASession::strHistoriqueComposantsUI = "+JSON.stringify(strHistoriqueComposantsUI) );
        if( strHistoriqueComposantsUI.search( constantItem )>=0 ){
          if(listeFunnels != "")
            listeFunnels = listeFunnels + configConstants.FUNNELS_MULTIPLES_SEPARATEUR;// Concaténer les funnels de session s'ils sont multiples
          listeFunnels = listeFunnels + constantItem;
          //console.log("listeFunnels = "+cheminNavigation);
        }
      }
    });
  }
//SUPPR A VALIDER
//  dureeSession = dateUtilsService.getDateDiff(dateFin, dateDebut, "sec");
  //TODO : dureeSession = Math.round( dateUtilsService.getDateDiff(dateFin, dateDebut, "sec"));

  //console.log( "différence (test de bibliothèque) : "+ Math.round( dateUtilsService.getDateDiff(dateFin, dateDebut, 0)) );

//SUPPR A VALIDER
//let o = {nbUiAidesOuverts:nbUiAidesOuverts, dureeSession:dureeSession, nombrePagesVisitees:nombrePagesVisitees, cheminNavigation:cheminNavigation};
  let o = {nbUiAidesOuverts:nbUiAidesOuverts, nombrePagesVisitees:nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:cheminNavigation, listeFunnels:listeFunnels};
  //console.log("calculVariablesRelativesASession() => "+ JSON.stringify(o) );
  return o;
}




////////////////////////////////////// DEBUT DU LOT DE METHODES AVEC DONNEES MOCK  //////////////////////////////////////
/**
 * @param boolean
 * @param Date|undefined
 * @param Date|undefined
 * @return {
 *  metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}
 *  data:Array<{key, composantUI, date, page, statsSessionId,
 *    sessionKey, androidVersion, licenceEstPremium,
 *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation, listeFunnels}>
 * }
 */
function mockData_importerDonnees(_activRechercherFunnels, _dateMaxLimite, _dateMinLimite){ // format de dateMinLimite et dateMaxLimite  : undefined ou Date
// TODO : gérer une date maximal et minimale (pour tests) spécifique
  console.log("importerDonnees lancé");
  return new Promise((resolve, reject) => {
    let aSessions = [];
    let sessionsResult = configConstants.MOCK_SESSIONS;// format array d'objects
    sessionsResult.forEach( (itemSession)=>{
        // Tenir compte d'un bug d'enregistrement de la session utilisateur : itemSession.val().licenceEstPremium peut être undefined (type boolean)
        let licenceValue = itemSession.licenceEstPremium;
        if(itemSession.licenceEstPremium == "undefined")
          licenceValue = false;
        aSessions.push( {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:licenceValue, statsSessionId:itemSession.statsSessionId} );
    })
    mockData_getActionsUtilisateur(aSessions, _dateMaxLimite, _dateMinLimite, _activRechercherFunnels).then( oData=>{ 
      resolve(oData);
    },
    (error)=>{
      console.error("mockData_importerDonnees call getActionsUtilisateur error ="+error);
      resolve([]);
    });

    // TODO la limite selon la date, via une autre méthode que limitToLast, lecture du node et filtrage préalable (via les key de StatNode)
    // Solution pour la persistance de données en session, et la suppression des données sur FirebaseDB:
    // - cf notes du DTD
    // - Sol A) récupérer les éléments à importer (plus anciens), et les sessions liées 
    //   Note de conception A AJOUTER AU PROTOTYPE PAPIER : 
    //      Si le jeu de données récupérées, pas encore généré donc pas supprimées ; En SESSION : aucun jeu de données ne peut être importées MAIS SI appli est redémarré, les  données seront disponible à nouveau.
    //      Le jeu de donnée est supprimé QUAND le fichier a été généré avec SUCCES (NB notes pour Dev : jeu de données importé conservé, seront supprimées par ~fs-management-service::genererCSV )

  })  ;
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
 *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation, listeFunnels}>
 * }
  */
 function mockData_getActionsUtilisateur(_aSessions, _dateMaxLimite, _dateMinLimite, _activRechercherFunnels){
  
  var metadata = {dateDebut:"", dateFin:""};

  if(_dateMaxLimite==0){
    _dateMaxLimite = new Date( 2099, 11, 31);
    _dateMinLimite = new Date( 1970, 0, 1);
  }
  console.log( "mockData_getActionsUtilisateur :: _dateMaxLimite" +JSON.stringify(_dateMaxLimite) +"_dateMinLimite" +JSON.stringify(_dateMinLimite) );
  return new Promise((resolve, reject) => {
    let aStats = [];
    let statsResult = configConstants.MOCK_ACTIONS_UTILISATEURS;// format array d'objects
    
    statsResult.forEach( (itemStats)=>{
      // SWMG 1.7 : Exemple d'enregistrement = "2020-01-24-11:53:21" - Nécessaire pour le tableur "24-01-2020 11:53:21"
      // Modification de la composition de la date pour rendre compatible avec le format date du tableur
      aTempDate = (itemStats.date).split("-");
      //aTempDate = (itemStats.val().date).split("-");

      strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
      
      //FILTRER LES DONNEES COMPRIS DANS L'INTERVAL DE DATE SELECTIONNE :
      var date = new Date( Number(aTempDate[0]), Number(aTempDate[1])-1, Number(aTempDate[2]) );
      
      //console.log("mockData_getActionsUtilisateur :: item "+ k + ": strDateFormatee = "+strDateFormatee+ " ; date = "+JSON.stringify(date) );
      if(date.getTime()<=_dateMaxLimite.getTime() && date.getTime()>=_dateMinLimite.getTime() )
      // Pb d'algo : comment récupérer ceux du jours suivant si une donnée APPARTIENT à une session "placé entre 2 jours différents" ? 
      // TODO : selon la similarité de session, vérifier la donnée précédente, et la donnée suivante  
      {
        //console.log("date = "+JSON.stringify(date) );
        aStats.push( {key:itemStats.key, composantUI:itemStats.composantUI, date:strDateFormatee, page:itemStats.page, statsSessionId:itemStats.statsSessionId } );
        
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
       //"\naStats = "+JSON.stringify(aStats) );

    let searchedSession;
     // Ajouter ici : les variables lié au jeu de données (destiné à l'affichage de la page "Historique des jeux données") 
    oChampsCalculesJeuDonnees = preparerChampsCalculeJD(_aSessions, aStats);
    let aChampsCalculesDesSessions = [];// type Array<any> : contient pour les champs calculés de chaque session (disposés dans le même ordre que dans aSessions)

    let nbSessionsUsers = 0;
    let lastStatsSessionId = "";

    _aSessions.forEach( (itemSession)=>{ 
    //console.log("itemSession #"+j+" itemSession.statsSessionId = "+itemSession.statsSessionId+" ; aStats[i].statsSessionId = "+aStats[i].statsSessionId);
      searchedSession = {};
      for(i=0; i<aStats.length; i++){
          if(aStats[i].statsSessionId==itemSession.statsSessionId){
            /* DEV :  if(i>aStats.length-3) 
              isDerniersRangs = true;*/
            searchedSession = itemSession // {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:itemSession.licenceEstPremium, statsSessionId:itemSession.statsSessionId};
            // PREPARER l'ajout sur la "ligne de session de fichier CSV" les variables de champs calculés relatives à la session, 
            aChampsCalculesDesSessions.push( preparerChampsCalculeDeSession(searchedSession, aStats, _activRechercherFunnels) );// Selectionner uniquement les actions utilisateur lié à la session
            //console.log("aChampsCalculesDesSessions = "+JSON.stringify(aChampsCalculesDesSessions));

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
    for(i=0; i<aStats.length; i++){
        //console.log("aStats[i].statsSessionId = "+aStats[i].statsSessionId + " ; aStats[i+1].statsSessionId = "+aStats[i+1].statsSessionId +"\n...et i = "+i+" ; aStats.length-1 = "+(aStats.length-1) ) ;
            
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
                //console.log("session #" +j+ "searchedSession.statsSessionId = "+searchedSession.statsSessionId);
              }
            });
            //console.log("i="+i+" : searchedSession = "+JSON.stringify(searchedSession) );

            let aSplitAndroidVersion = searchedSession.androidVersion.split(";");
            let strAndroidVersion = 0
            if( aSplitAndroidVersion.length>1) 
              strAndroidVersion = aSplitAndroidVersion[1].trim();
            //aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
            //  sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium, statsSessionId:searchedSession.statsSessionId} );
              
              // CONCATENER l'ajout sur la "ligne de session de fichier CSV" les variables de champs calculés relatives à la session, 
            oChampsCalculesDeSession = aChampsCalculesDesSessions[s];// Selectionner uniquement le rang de champs calculés relatives à la session, 
            //console.log("session #"+s+" : oChampsCalculesDeSession = "+JSON.stringify(oChampsCalculesDeSession) );

            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:searchedSession.statsSessionId,
                sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium,
                nbUiAidesOuverts:oChampsCalculesDeSession.nbUiAidesOuverts, nombrePagesVisitees:oChampsCalculesDeSession.nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:oChampsCalculesDeSession.cheminNavigation, listeFunnels:oChampsCalculesDeSession.listeFunnels} 
            );
          }
          else if(i<aStats.length-1){ 
            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
              sessionKey:"", androidVersion:"", licenceEstPremium:"",
              nbUiAidesOuverts:"", nombrePagesVisitees:"", nombreCmpsCmpsntUINonDstnctVisites:"", cheminNavigation:"", listeFunnels:""} );
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

          aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:searchedSession.statsSessionId,
              sessionKey:searchedSession.key, androidVersion:strAndroidVersion, licenceEstPremium:searchedSession.licenceEstPremium,
              nbUiAidesOuverts:oChampsCalculesDeSession.nbUiAidesOuverts, nombrePagesVisitees:oChampsCalculesDeSession.nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:oChampsCalculesDeSession.cheminNavigation, listeFunnels:oChampsCalculesDeSession.listeFunnels} 
          );
        }
      }
      s++;  
    }
    // En reparsant aStatsResult voire _aSessions pour calculer les *variables calculées*
    // durée session actuelle cumulée durée session totale  Chemin de navigation d’une session  Nombres de pages consultées Nombre d’UI d’aide affichées  durée de session  durée moyenne consultation d'une page Eca typ consultation d'une page Variance consultation d'une page
    // console.log( "//////////////////////////nRESULTAT : aOutputStats = "+JSON.stringify(aOutputStats) );
    //console.log( "mockData_getActionsUtilisateur terminé !");
    resolve({
      data: aOutputStats,
      metadata:{
       dateDebut: metadata.dateDebut, dateFin: metadata.dateFin, nbActionsUtilisateurs:aOutputStats.length.toString(), nbSessionsUtilisateurs: nbSessionsUsers.toString()
      }
    });
    console.log( "dateDebut = "+ metadata.dateDebut +" , dateFin: " + metadata.dateFin +" , nbActionsUtilisateurs: = "+ aOutputStats.length.toString() + ", nbSessionsUtilisateurs: "+nbSessionsUsers.toString());
    //DEV console.log( " ; _dateMaxLimite = "+JSON.stringify(_dateMaxLimite)+" ; _dateMinLimite.getTime()="+JSON.stringify(_dateMinLimite) );
  
  });
}
////////////////////////////////////// FIN DU LOT DE METHODE AVEC DONNEES MOCK  //////////////////////////////////////

