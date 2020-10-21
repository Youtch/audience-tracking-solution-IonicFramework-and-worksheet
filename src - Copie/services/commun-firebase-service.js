// services/commun-firebase-service.js
const configConstants = require('../config/config-constants');

module.exports = {
  preparerChampsCalculeDeSession:preparerChampsCalculeDeSession
};

/**
 * [preparerChampsCalculeDeSession description]
 * @param  {Object<{key:string, androidVersion:string, licenceEstPremium:string, statsSessionId:string>} _oDonneesDeSession
 * @param  {Array<key:string, composantUI:string, date:string, page:string, statsSessionId:string>} _aActionsUtilisateur
 * @return {Object<{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string}>}
 */
function preparerChampsCalculeDeSession(_oDonneesDeSession, _aActionsUtilisateur){
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
    //
  return calculVariablesRelativesASession(aActionsUsersDansSession);
}

function calculVariablesRelativesASession(_aActionsUsersDansSession){ // return object:{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string};
  
  let nbUiAidesOuverts = 0;
//SUPPR A VALIDER
//  let dureeSession = 0; // en secondes
  let previousPage = "";
  let nombrePagesVisitees = 0;
  let nombreCmpsCmpsntUINonDstnctVisites = 0;
  let cheminNavigation = "";
  //let aHistoriqueComposantsUI = [];

  //let i=0;
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
        //aHistoriqueComposantsUI.push(item.composantUI);
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