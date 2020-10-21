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

// services/mock-firebase-service.js

/**
 * Module's description
 * - connect to the mock database
 * - get the data set from the mock database according to the selected date range (by the app's user)
 *  @MOCK
 *
 * NB : To import a mock data set : edit the client-side code on the function named *commitImporter* : 
 *   please uncomment the line under "MOCK", comment the line under "PRODUCTION".
 */

const communFirebaseService = require('./commun-firebase-service.js');//Provide the required methods both by 'firebase-service.js' and by 'mock-firebase-service.js'
const configConstants = require('../config/config-constants');
const DateOperationsService = require('./date-operations-service.js');
const dateUtilsService = new DateOperationsService();

module.exports = {
  mockData_importerDonnees:mockData_importerDonnees,
}

/**
 * Launch *mock* import of the data set
 * @param _dateMaxLimite:number=0|Date
 * @param _dateMinLimite:number=0|Date
 * @return {Object<
 *   metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
 *  data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
 *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
 *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}
 */
function mockData_importerDonnees(_dateMaxLimite, _dateMinLimite){
  return new Promise((resolve, reject) => {

    let aSessions = [];
    
    configConstants.MOCK_SESSIONS.forEach( (itemSession)=>{
    
        let licenceValue = itemSession.licenceEstPremium;
        //User session recording data : itemSession.val().licenceEstPremium can be recorded undefined, but the expected type is boolean
        if(itemSession.licenceEstPremium == "undefined")
          licenceValue = false;
        aSessions.push( {key:itemSession.key, androidVersion:itemSession.androidVersion, licenceEstPremium:licenceValue, statsSessionId:itemSession.statsSessionId} );
    })
    mockData_getActionsUtilisateur(aSessions, _dateMaxLimite, _dateMinLimite).then( oData=>{ 
      resolve(oData);
    },
    (error)=>{
      console.error("mockData_importerDonnees call getActionsUtilisateur error ="+error);
      resolve([]);
    });

  })  ;
 }


 /**
  * @param  _aSessions:Array<{key:string, androidVersion:string, licenceEstPremium:Boolean, statsSessionId::string}>
  * @param  _dateMaxLimite Date|number=0
  * @param  _dateMinLimite Date|number=0
  * @return {Object<
  *  metadata:{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string} 
  *  data:{Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
  *    sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
  *    nbUiAidesOuverts:number|string, nombrePagesVisitees:number|string, nombreCmpsCmpsntUINonDstnctVisites:number|string, cheminNavigation:string}>}
  * >}
  */
 function mockData_getActionsUtilisateur(_aSessions, _dateMaxLimite, _dateMinLimite){
  
  let metadata = {dateDebut:"", dateFin:""};

  if(_dateMaxLimite==0){
    _dateMaxLimite = new Date( 2099, 11, 31);
  }
  if(_dateMinLimite==0){
    _dateMinLimite = new Date( 1970, 0, 1);
  }
  return new Promise((resolve, reject) => {

    //aStats will contents the lines of each components UI tracking of users behaviors
    let aStats = [];
    
    let statsResult = configConstants.MOCK_ACTIONS_UTILISATEURS;// format array d'objects
    //console.log("statsResult.length = ",statsResult.length);

    statsResult.forEach( (itemStats)=>{
      
      // Remove the separator between date and hours : to be consistent with expected date format to the speadsheet which will receive later the CSV file.
      aTempDate = (itemStats.date).split("-");
      
      strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
      
      ///////////////////////////////////////////////////////////
      //Filter the data set according to the selected date range 
      ///////////////////////////////////////////////////////////
      let date = new Date( Number(aTempDate[0]), Number(aTempDate[1])-1, Number(aTempDate[2]) );
      
      if(date.getTime()<=_dateMaxLimite.getTime() && date.getTime()>=_dateMinLimite.getTime() )
      
      // TODO : Fix the USE CASE when getting a session is straddled between two days.
      {
        // build the data object:
        aStats.push( {key:itemStats.key, composantUI:itemStats.composantUI, date:strDateFormatee, page:itemStats.page, statsSessionId:itemStats.statsSessionId } );
        
        //build the metadata object:
        aTempHeure = aTempDate[3].split(":");
        date = new Date( aTempDate[0], aTempDate[1]-1, aTempDate[2], aTempHeure[0], aTempHeure[1], aTempHeure[2]);
        if(metadata.dateDebut==""){//While dataDebut is empty : only first itemStats' iteration
          metadata.dateDebut = dateUtilsService.getDateToShortHumanText_i18n(date, configConstants.DATE_LANG_IS_FR, true, configConstants.DATE_FORMAT, false, true, 1, false);
        }
        else{//Only at the last iterated item of statsResult
          metadata.dateFin = dateUtilsService.getDateToShortHumanText_i18n(date, configConstants.DATE_LANG_IS_FR, true, configConstants.DATE_FORMAT, false, true, 1, false);
        }

      }
    })

    
    /**
     * Contents the session data associated to the iterated data
     * @type {key:string, androidVersion:string, licenceEstPremium:Boolean, statsSessionId:string}
     */
    let sessionData;
    /**
     * Contents the calculated fields of each session. It's sorted as aSession sort order.
     * @type {object<{nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string}>}
     */
    let aCalculatedFieldsOfSession = [];

    let nbSessionsUsers = 0;
    let lastStatsSessionId = "";

    _aSessions.forEach( (itemSession)=>{ 
      sessionData = {};
      for(i=0; i<aStats.length; i++){
          if(aStats[i].statsSessionId==itemSession.statsSessionId){
            sessionData = itemSession;

            aCalculatedFieldsOfSession.push( communFirebaseService.preparerChampsCalculeDeSession(sessionData, aStats) );// Selectionner uniquement les actions utilisateur lié à la session

            //Counting number of sessions (for metadata)
            if(lastStatsSessionId=="" || lastStatsSessionId!=itemSession.statsSessionId) 
              nbSessionsUsers++;
            lastStatsSessionId = itemSession.statsSessionId;
          }
        };
    });
    
    /**
     * At the end of the function, it will pass the "data" pararameter on the returned object
     * @type {Array<{key:string, composantUI:string, date:string, page:string, statsSessionId:string,
              sessionKey:string, androidVersion:string, licenceEstPremium:Boolean,
              nbUiAidesOuverts:number, nombrePagesVisitees:number, nombreCmpsCmpsntUINonDstnctVisites:number, cheminNavigation:string>}
     */
    let aOutputStats = [];
    /**
     * Count the length of aCalculatedFieldsOfSession (items are sorted as aSessions sorting)
     * @type {Number}
     */
    let numLength = 0;
    
    for(i=0; i<aStats.length; i++){
        // 1st CONDITION : check if ACTUAL aStats' id and NEXT aStats' sessionId are matching
        // 2nd CONDITION : check for the last aStats iteration
        if(i<aStats.length-1){
          if(aStats[i].statsSessionId!=aStats[i+1].statsSessionId || i==aStats.length-1){
            sessionData = {};
            j=0;
            _aSessions.forEach( (itemSession)=>{ 
              j++;
              if(aStats[i].statsSessionId==itemSession.statsSessionId){
                sessionData = itemSession;
              }
            });
            
            let aSplitAndroidVersion = sessionData.androidVersion.split(";");
            let strAndroidVersion = 0
            if( aSplitAndroidVersion.length>1) 
              strAndroidVersion = aSplitAndroidVersion[1].trim();
            
            //Prepare the final session's line after its aStats lines (= its components UI of users behaviors)
            oChampsCalculesDeSession = aCalculatedFieldsOfSession[numLength];

            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:sessionData.statsSessionId,
                sessionKey:sessionData.key, androidVersion:strAndroidVersion, licenceEstPremium:sessionData.licenceEstPremium,
                nbUiAidesOuverts:oChampsCalculesDeSession.nbUiAidesOuverts, nombrePagesVisitees:oChampsCalculesDeSession.nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:oChampsCalculesDeSession.cheminNavigation} 
            );
          }
          else if(i<aStats.length-1){ 
            aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:aStats[i].statsSessionId,
              sessionKey:"", androidVersion:"", licenceEstPremium:"",
              nbUiAidesOuverts:"", nombrePagesVisitees:"", nombreCmpsCmpsntUINonDstnctVisites:"", cheminNavigation:""} );
          }
      }
      else{ //If parsing the last rank of the session : get the session data
        
        //Pass the dateDebut parameter if it's not yet done (for the metadata super parameter)
        aTempHeure = aTempDate[3].split(":");
        date = new Date( aTempDate[0], aTempDate[1]-1, aTempDate[2], aTempHeure[0], aTempHeure[1], aTempHeure[2]);
        

        //Check if the last rank includes a date between dateMinLimite and dateMaxLimite
        if(date.getTime()<=_dateMaxLimite.getTime() && date.getTime()>=_dateMinLimite.getTime() )
        

        // TODO : Fix the USE CASE when getting a session is straddled between two days .
        
        {
          metadata.dateFin = dateUtilsService.getDateToShortHumanText_i18n(date, configConstants.DATE_LANG_IS_FR, true, configConstants.DATE_FORMAT, false, true, 1, false);
        }

        sessionData = {};
        j=0;
        _aSessions.forEach( (itemSession)=>{ 
          j++;
          if(aStats[i].statsSessionId==itemSession.statsSessionId){
            sessionData = itemSession;
          }
        });
        
        let aSplitAndroidVersion = sessionData.androidVersion.split(";");
        let strAndroidVersion = 0
        if( aSplitAndroidVersion.length>1) 
          strAndroidVersion = aSplitAndroidVersion[1].trim();
        
        //Prepare the final session's line after its aStats lines (= its components UI of users behaviors)
        oChampsCalculesDeSession = aCalculatedFieldsOfSession[aCalculatedFieldsOfSession.length-1];// Selectionner uniquement le rang de champs calculés relatives à la session, 
        
        aOutputStats.push( {key:aStats[i].key, composantUI:aStats[i].composantUI, date:aStats[i].date, page:aStats[i].page, statsSessionId:sessionData.statsSessionId,
            sessionKey:sessionData.key, androidVersion:strAndroidVersion, licenceEstPremium:sessionData.licenceEstPremium,
            nbUiAidesOuverts:oChampsCalculesDeSession.nbUiAidesOuverts, nombrePagesVisitees:oChampsCalculesDeSession.nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites:oChampsCalculesDeSession.nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation:oChampsCalculesDeSession.cheminNavigation} 
        );
      }
      numLength++;
    }
    
    resolve({
      data: aOutputStats,
      metadata:{
       dateDebut: metadata.dateDebut, dateFin: metadata.dateFin, nbActionsUtilisateurs:aOutputStats.length.toString(), nbSessionsUtilisateurs: nbSessionsUsers.toString()
      }
    });
    
  });
}