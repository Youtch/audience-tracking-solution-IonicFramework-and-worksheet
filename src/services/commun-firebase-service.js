/*MIT License

Copyright (c) 2020 FRANÇOIS GARDIEN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

// services/commun-firebase-service.js

const configConstants = require('../config/config-constants');

module.exports = {
  preparerChampsCalculeDeSession:preparerChampsCalculeDeSession
};

/**
 * [preparerChampsCalculeDeSession description]
 * @param  _oDonneesDeSession:Object<key:string, androidVersion:string, licenceEstPremium:string, statsSessionId:string>
 * @param  _aActionsUtilisateur:Array<key:string, composantUI:string, date:string, page:string, statsSessionId:string>
 * @return {Object<{
 *   nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string
 * }>}
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