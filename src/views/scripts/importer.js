<!-- views/scripts/importer.js
  Dépendances : 
    utils-ajax.js
      ::getAjaxFunction
      ::setAjaxFunction
    header-loader.js
      ::initHeaderBadges
      ::initHeadersUIs
      ::getAccessFbDbState
      ::getSessionCSVFileExists
-->
<script>

// DEV test : 
// 
function testPeuplerJeuDonnees(){
  var txt = "{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},";  
  //OLD: $('#div-content-codeJeuDonnees').html( ajouterRetourligne(txt, "},{", 2) );
  $('#div-content-codeJeuDonnees').html( ajouterRetourligne(oResults.data, "},{", 2) );
  $('#pre-wrapper-codeJeuDonnees').removeClass("estCache").addClass("estMontre");
  $('#icon-codeJeuDonnees').removeClass("estMontre").addClass("estCache");

  $('#txtarJeuDonnees').val(ajouterRetourligne(txt, "},{", 2) );
  $('#txtarJeuDonnees').removeClass("estCache").addClass("estMontre");
}

function init()
{ 
  initUICollapse();
  initUIDatePickers();
  //  DEV test 
  //testPeuplerJeuDonnees();
  //Vérifier si des variables de jeu de données existent déjà dans cette session
  getGlobalVars().then( oGlobalVars=>{
    if(oGlobalVars!=false)
      peuplerUIsJeuDonnees( oGlobalVars, false );
    //console.log("oGlobalVars = ",oGlobalVars);

    getAccessFbDbState().then( booAccessFbDbState=>{
      initHeadersUIs(booAccessFbDbState, "booAccessFbDbState");
      // TODO : gérer 
      initUIVisuEtSelect(booAccessFbDbState, oGlobalVars);
    });
  });
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    //console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
    initHeadersUIs(booSessionCSVFileExists, "booSessionCSVFileExists");
  });
  
}

/** Setter gérée seulemnt coté serveur
*/
/**@return Object{
 *   data:Array<{key, composantUI, date, page, statsSessionId,
 *      sessionKey, androidVersion, licenceEstPremium,
 *      nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation, listeFunnels}>
 *   metadata:Object{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}
 * }
 */
function getGlobalVars()
{
  // R&D test : TESTE OK !
  /*testSetData({// Requete HTTP en mode post
    "data": [{truc:1,machin:4},{truc:33,machin:34},{truc:51,machin:54}] ,
    "metadata": {bidule:1,datation1:"3-1-20",datation2:"4-2-20"} 
  });*/
  return new Promise( resolve=>{
    postAjaxJQUERY("", "json", "http://localhost:3000/ajax/v1.7/importer/?getGlobalVars=true").then( (oGlobalVars)=>{
      if(!oGlobalVars){ // TODO=> Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        // TODO : à gérer
        console.log("getGlobalVars::errno = "+oGlobalVars)
        resolve(false);
      }
     //DEV console.log(" :: oJeuDonneesConcat.data.length = "+ oGlobalVars.data.length +
     //   "oGlobalVars.metadata = "+JSON.stringify(oGlobalVars.metadata) );
      resolve(oGlobalVars);
    });
  });
}

function setGlobalVars(_data, _bConvertToStringJson=true)
{
  var dataToSend = _data;
  if(_bConvertToStringJson)
    dataToSend = JSON.stringify(_data);
  return new Promise( resolve=>{
    postAjaxJQUERY(dataToSend, "json", "http://localhost:3000/ajax/v1.7/importer/?setGlobalVars=true").then( (results)=>{
      if(results<0){ //TODO : Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        // TODO : à gérer
        console.log("setGlobalVars::errno = "+results)
        resolve(false);
      }
      console.log("setGlobalVars :: results = "+ JSON.stringify(results) );
      resolve(results);
    });
  });
}

// R&D : 
/*
function testSetData(data)
{
  // DEV 
  var dataToSend = JSON.stringify(data);
  return new Promise( resolve=>{
    postAjaxJQUERY(dataToSend, "json", "http://localhost:3000/ajax/v1.7/RdHTTPPost/?setDataTest=true").then( (results)=>{
      if(results<0){ // TODO : Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        // TODO : à gérer
        console.log("testSetData::errno = "+results)
        return false; //Fin
      }

      console.log("testSetData::results = "+ JSON.stringify(results) );
      resolve(results);
    });
  });
}*/



///////////////////// Gestion évènementielle /////////////////////
function lancerImportation(_activRechercherFunnels){
  //TODO : if(validateurBtnsImporter()){

    toggleEtatsUIBtnsImporter(true, _activRechercherFunnels)
    
    const dateMaxLimite = ($('#inpt-dateMaxLimite').val()==""? 0 : $('#inpt-dateMaxLimite').val());// attribuer 0 ou sa valeur
    const dateMinLimite = ($('#inpt-dateMinLimite').val()==""? 0 : $('#inpt-dateMinLimite').val());// attribuer 0 ou sa valeur
    // TODO : gérer le contenu du "btn-imprtrJD-funnels"

    // MOCK : 
    getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?mockData=true&activRechercherFunnels="+_activRechercherFunnels+"&dateMaxLimite=" + dateMaxLimite + "&dateMinLimite="+ dateMinLimite )
    // PROD :
    //getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?activRechercherFunnels="+_activRechercherFunnels+"&dateMaxLimite=" + dateMaxLimite + "&dateMinLimite="+ dateMinLimite )
    // OLD .then( (strResults)=>{
    .then( (oResults)=>{
      
      if(oResults<0){ // Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        toggleEtatsUIBtnsImporter(false, _activRechercherFunnels, true, oResults);
        return false; //Fin
      }

      peuplerUIsJeuDonnees(oResults, _activRechercherFunnels);
      actionModeleFichierCSV(2);
    },
    (error)=>{ //TODO : Si la requête au serveur Firebase échoue 
      console("#1 erreur = ",error);
      toggleEtatsUIBtnsImporter(false, _activRechercherFunnels, true)
      // TODO : afficher une modal signalant l'erreur du serveur
    });
  //}
}


function toogleEditerDonnees(){
  if( $("#txtarJeuDonnees").hasClass("estCache") ){
    $("#spinner-btnEditerDonnees").removeClass("estCache").addClass("estMontre");
    $("#btnEditerDonnees").prop("disabled", true);
    $("#pre-wrapper-codeJeuDonnees").removeClass("estMontre").addClass("estCache");
    $("#txtarJeuDonnees").removeClass("estCache").addClass("estMontre");
    $("#btnEnregistrerDonnees, #btnAideEnregistrerDonnees, #btnAnnulerEditDonnees").removeClass("estCache").addClass("estMontre");
    $("#spinner-btnEditerDonnees").removeClass("estMontre").addClass("estCache");
  }
  else{
    $("#btnEditerDonnees").prop("disabled", false);
    $("#pre-wrapper-codeJeuDonnees").removeClass("estCache").addClass("estMontre");
    $("#txtarJeuDonnees").removeClass("estMontre").addClass("estCache");
    $("#btnEnregistrerDonnees, #btnAideEnregistrerDonnees, #btnAnnulerEditDonnees").removeClass("estMontre").addClass("estCache"); 
    $("#p-subTitleBtnEnregData").text( "");//RAZ
    $("#p-subTitleBtnEnregData").text("");//RAZ
    $("#icon-enregEditDonnees-fait").removeClass("estMontre").addClass("estCache");//RAZ
    $("#p-subTitleBtnEnregData").text("").removeClass("estMontre").addClass("estCache");//RAZ
  }
}

async function enregistrerEditDonnees(){
  //console.log("$(\"#pre-wrapper-codeJeuDonnees\").text() =",$("#pre-wrapper-codeJeuDonnees").text() );
  // Update d'UIs :
  $("#div-content-codeJeuDonnees").text( $("#txtarJeuDonnees").val() ); // .val() et pas .html() ni .text()
  // Update du serveur :
  var result = await setGlobalVars( '{"data": '+$("#txtarJeuDonnees").val()+'}', false);  
  
  if(result){
    // TODO : SOL A modal ou toast centré qui signale "Fait !"
    //        Sol B : message qui disparait après 3 secondes...
    // Sol C affichage d'un message et modification du bouton
    $("#icon-enregEditDonnees").removeClass("estMontre").addClass("estCache");
    $("#icon-enregEditDonnees-fait").removeClass("estCache").addClass("estMontre");
    $("#p-subTitleBtnEnregData").text( "Fait !").removeClass("estCache").addClass("estMontre");
    setTimeout( ()=>{
      toogleEditerDonnees();
    },5000);
  }
  else{
    // TODO : SOL A modal ou toast centré qui signale "Erreur du serveur !"
    //        Sol B : message qui disparait après 3 secondes...
    // Sol C affichage d'un message et modification du bouton
    $("#icon-enregEditDonnees").removeClass("estMontre").addClass("estCache");
    $("#icon-enregEditDonnees-erreur").removeClass("estCache").addClass("estMontre");
    $("#p-subTitleBtnEnregData").text( "Erreur du serveur !").removeClass("estCache").addClass("estMontre");
    setTimeout( ()=>{
      toogleEditerDonnees();
    },5000); 
  }
}

function annulerEditDonnees(){
  toogleEditerDonnees();
}


/**
 * @param  _type:number 0=>CTA annuler ; 1=>CTA enregistrer ; 2=>check pour activation/désactivation d'UI
 * @return {[type]}
 */
async function actionModeleFichierCSV(_type)
{
  var resultatValidateur;
  switch(_type){
    case 0:// Cas : vider input
      $("#inpt-modeleFichierCSV").val("");
      $("#btn-gnrrFchr").prop( "disabled", true );// désactiver le btn
    break;

    case 1:// Cas : enregistrer input
      //TODO validateur : interdire les caractères interdit dans les fichier 
      resultatValidateur = true;
      //   Les listes sur StackOverflox " , : , ; , * 
      //   créer une méthode dans le service fs-management-service : checkForbidenChars(str:string)
      if(resultatValidateur){
        $("#btn-gnrrFchr").prop( "disabled", false );// activer le btn
        // TODO : 
        //  - enregistrer le modèle = requete Ajax envoyer la valeur de inpt-modeleFichierCSV
        var result = await setGlobalVars( {"modeleGenerationFichierCsv": $("#inpt-modeleFichierCSV").val()}, true);
        if(result){
          $("#icon-enregModelFich-fait").removeClass("estCache").addClass("estMontre");
          $("#btn-gnrrFchr").prop( "disabled", false );// activer le btn
        }
        // TODO : changer icone bouton
        // si données importer, activer le bouton Générer
      }
      else{
        //  - ?? déclencher l'affichage, via classes isInvalid à intégrer en UIs, via addClass
        $("#btn-gnrrFchr").prop( "disabled", true );// désactiver le btn
      }
    break;
    case 2:// Cas : check pour activation/désactivation d'UI [séquence de fin d'import des données]
      console.log(" actionModeleFichierCSV lancé param=2");
      resultatValidateur = true;
      if(resultatValidateur){
        $("#btn-gnrrFchr").prop( "disabled", false );// activer le btn
      }
      else{
        $("#btn-gnrrFchr").prop( "disabled", true );// désactiver le btn
        // TODO : requete Ajax envoyer la valeur de inpt-modeleFichierCSV
        // 
      }
    break;
  }
}

function lancerGenererCSV()
{
  // TODO : validateur, selon format du texte, et vide interdit.
  getAjaxFunction("text", "http://localhost:3000/ajax/v1.7/generer")
  .then( (result)=>{
    console.log(" result = ", result);
    
    if(result==-1)
      // timeout
      console.log("errno = -1");
    else if(result==-2){
      console.log("errno = -2");
      // error statut !=200 :  cas d'erreur généré lors de création du fichier...
      //  1) existe déjà avec nom identique 2) espace disque saturé
      afficherModalEtat(
        2,
        "Fichier non généré",
        "fa-exclamation-triangle",
        "Un fichier du même nom existe déjà ! Modifiez le modèle puis recommencez.<BR>Ces mots-clés d'horodatage sont recommandés : <kbd>dateFr</kbd>, <kbd>dateUs</kbd>,<kbd>horaire</kbd>.",
        true, 
        false,
        "Fermer",
      );
      //échec => afficher une modal expliquant le problème + moyen resolution (pb de serveur)
    }
    else{
      console.log("reussite");
      afficherModalEtat(
        4,
        "Fichier généré !",
        "fa-check",
        "Ce fichier est maintenant disponible en tête de la page <em>\"Télécharger le fichier CSV\"</em>.<BR>\
          Dès lors qu'un nouveau fichier sera généré, l'ancien fichier sera inséré dans l'historique, et toujours disponible en téléchargement<BR>\
          <BR>\
          Voulez-vous télécharger ce fichier ?",
        true, 
        true,
        "Oui, aller sur la page",
        "Pas maintenant"
      );
    /* TODO : informer =
      succès => 
        signaler la réussite (bouton et icone check), propose de naviguer vers Télécharger
        Dans une modale, ou toast + dans le panel du validateur (au couleurs "success") => 
          indiquer : la disponibilité du fichier sur TelechargerPage, ET la possibilité de supprimer les données
          proposer la redirection vers page télécharger 
    */
    // stopper le spinner
    }
  }); 
}

/**
 * Permet d'ajouter un tag dans l'input par un simple clic
 * @param event:Event
 */
function addTag(event){
  $("#inpt-modeleFichierCSV").val( $("#inpt-modeleFichierCSV").val() + event.target.innerText);
}

function affchrAideEnregJD()
{
  afficherModalEtat(
  3,
  "Informations importantes",
  "fa-exclamation-circle",
  "- L'enregistrement concerne le serveur : cela ne produira aucune modification sur Firebase Database.<BR>- Les métadonnées ne seront pas recalculées.",
  true, 
  false,
  "Fermer",
);
}

///////////////////// Validateurs /////////////////////
function validateurBtnsImporter(){
  console.log("$('#cbToutesDonnees').is(':checked')  = "+ $('#cbToutesDonnees').is(':checked') );
  //console.log("verif des masques $('#inpt-dateMaxLimite').val() = " + $('#inpt-dateMaxLimite').val().match(/\d\d-\d\d-\d\d\d\d/) )
  //console.log("verif des masques $('#inpt-dateMinLimite').val() = " + $('#inpt-dateMinLimite').val().match(/\d\d-\d\d-\d\d\d\d/) )
  var o = false;
  if( 
    ((!$('#cbToutesDonnees').checked) && $('#inpt-dateMaxLimite').val()!="" && $('#inpt-dateMinLimite').val()!="")
    // &&  ) // TODO à trouver le bon masque des deux date selon regex .~match(/\d\d-\d\d-\d\d\d\d/)
    ||
    ($('#cbToutesDonnees').checked )
  )
    o = true;
  return o;
}
///////////////////// Gestion de la modale d'état des traitements /////////////////////
function demanderSupprimerDonnees()
{
  afficherModalEtat(
    1,
    "Confirmez vous la suppression des données sur Firebase Database ?",
    "fa-exclamation-triangle",
    "Seules les données correspondante aux données que vous avez importé seront supprimées (celles affichées ci-dessous).<BR>"+
    "Attention, CETTE ACTION EST IRREVERSIBLE : Veillez à les convertir vers un fichier CSV AVANT LA FIN DE VOTRE SESSION",
    true, 
    true,
    "Oui, supprimer",
    "Non, annuler"
  );
}


function ctaValiderModalEtatsTrt()
{
  console.log("numPageModalId ="+numPageModalId);
  if(numPageModalId==1){
    // TODO : trt
    console.log("CONFIRMER la suppression des données !");
  }
  else if(numPageModalId==4){
    navGoTo('/telecharger');
  }
  //else if(numPageModalId==2){
    // Ne rien faire
  //}
  //Cacher :
  fermerModal();
}
function ctaAnnulerModalEtatsTrt()
{
  if(numPageModalId==1){
    console.log("ANNULER la suppression des données !") 
  }
  //Caché automatiquement
}

////////////////////////////// METHODE MODIFIANT LES UIS //////////////////////////////
function initUICollapse()
{
  // Dans page EJS :Plier toutes les branches, car les fonctions JS des UI ne sont pas prévus pour déplier lors du chargement
  // Déplier toutes les branches
  /*$("#btn-collapseUn-chevron").addClass("animate-collapseUI-deplier");// NOK : tester le style 
  $("#btn-collapseDeux-chevron").addClass("animate-collapseUI-deplier");// NOK : tester le style 
  $("#btn-collapseTrois-chevron").addClass("animate-collapseUI-deplier");// NOK : tester le style */
  // Plier toutes les branches
  $("#btn-collapseUn-chevron").addClass("animate-collapseUI-plier");// NOK : tester le style 
  $("#btn-collapseDeux-chevron").addClass("animate-collapseUI-plier");// NOK : tester le style 
  $("#btn-collapseTrois-chevron").addClass("animate-collapseUI-plier");// NOK : tester le style 
}



function initUIDatePickers()
{
  var today = new Date();
  $('#inpt-dateMinLimite').datepicker({
    locale:"fr-fr",
    uiLibrary: 'bootstrap4',
    autoclose: true,
    format: "dd-mm-yyyy",
    immediateUpdates: true,
    todayBtn: true,
    todayHighlight: true,
    maxDate: today,
    //close: onClose_inpt-dateMinLimite
  });

  $('#inpt-dateMaxLimite').datepicker({
    locale:"fr-fr",
    uiLibrary: 'bootstrap4',
    autoclose: true,
    format: "dd-mm-yyyy",
    immediateUpdates: true,
    todayBtn: true,
    todayHighlight: true,
    maxDate: today,
    //close: onClose_inpt-dateMaxLimite
   });
}

/**
 * Description : initialiser visibilités et selection 
 * @param  _booAccessFbDbState:boolean
 * @param  _oGlobalVars:Object{}
 * @return void
 */
function initUIVisuEtSelect(_booAccessFbDbState, _oGlobalVars){
  //////////// Gestion des dates minimum et date maximum pour l'import
  
  //PROD 1/3
  //if(_booAccessFbDbState){
  
    //console.log("_oGlobalVars = ",_oGlobalVars);
    $('#cbToutesDonnees').attr('checked', true);
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
        .prop( "disabled", true );
    // TODO : bug du onclick des boutons VISUELLEMENT desactivé mais onclick fonctionne !
    $('gj-datepicker').click( function(event){ 
      console.log("stop !")
      event.stopImmediatePropagation();
    });
  //PROD 2/3 : DEBUT
  /*}
  else{
    //console.log("_oGlobalVars = ",_oGlobalVars);
    $('#cbToutesDonnees').attr('checked', true).prop( "disabled", true );
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
        .prop( "disabled", true );
    // TODO : bug du onclick des boutons VISUELLEMENT desactivé mais onclick fonctionne !
    $('gj-datepicker').click( function(event){ 
      console.log("stop !")
      event.stopImmediatePropagation();
    });
    $("#div-cmd-importer button").prop( "disabled", true );
  //PROD 2/2 : FIN 
  }*/
  
  //////////// Gestion des voyants/badges indiquant la connexion à Firebase DB
  if(_booAccessFbDbState){
    $("#accessFbDbStateSuccess").removeClass("estCache").addClass("estMontre"); $("#accessFbDbStateFailed").removeClass("estMontre").addClass("estCache");
  }else{
    $("#accessFbDbStateFailed").removeClass("estCache").addClass("estMontre"); $("#accessFbDbStateSuccess").removeClass("estMontre").addClass("estCache"); 
  }

  //////////// Gestion de la zone de composition du modèle de nom de fichier
  if(_oGlobalVars==false){// Cas d'erreur de requête de serveur
    $("#btn-gnrrFchr").prop( "disabled", true );
  }
  if(_oGlobalVars.data==""){//Si aucune données n'a été importé, ou données importées sont vides
    $("#btn-gnrrFchr").prop( "disabled", true );
  }  
  //console.log("_oGlobalVars.modeleGenerationFichierCsv = ",_oGlobalVars.modeleGenerationFichierCsv);
  if(_oGlobalVars.modeleGenerationFichierCsv!="")// Si le modèle de nom de fichier n'est pas défini
    $("#inpt-modeleFichierCSV").val( _oGlobalVars.modeleGenerationFichierCsv );
  else
    $("#btn-gnrrFchr").prop( "disabled", true );

  // Si pas de cnx : afficher accessFbDbStateSuccess & cacher accessFbDbStateFailed ; sinon afficher accessFbDbStateFailed & cacher   accessFbDbStateSuccess
  // Si aucune données importée : desactiver => btn-gnrrFchr
}


/**
 * @param  _intentionCTA:Boolean : false=>en cours d'arrêt ; true=>en cours de lancement
 * @param  _activRechercherFunnels:Boolean
 * @param  _etatEchec:Boolean : seulement exploité si _intentionCTA == "false"
 * @return void
 */
function toggleEtatsUIBtnsImporter(_intentionCTA, _activRechercherFunnels, _etatEchec=false, _errno=0){
  // Modfier l'état des UIs:
  if(_intentionCTA){
    if(_activRechercherFunnels){
      $("#p-subTitle-btn-imprtrJD-funnels").text( "En cours..." );
      $("#spinner-btn-imprtrJD-funnels, #p-subTitle-btn-imprtrJD-funnels").removeClass("estCache").addClass("estMontre");
      $("#p-subTitle-btn-imprtrJD-std").removeClass("estMontre").addClass("estCache");// Masquer le message de l'autre alternative du bouton d'importation
      $("#btn-imprtrJD-funnels").prop( "disabled", true );
    }else{
      $("#p-subTitle-btn-imprtrJD-std").text( "En cours..." );
      $("#spinner-btn-imprtrJD-std, #p-subTitle-btn-imprtrJD-std").removeClass("estCache").addClass("estMontre");
      $("#p-subTitle-btn-imprtrJD-funnels").removeClass("estMontre").addClass("estCache");// Masquer le message de l'autre alternative du bouton d'importation
      $("#btn-imprtrJD-std").prop( "disabled", true );
    }
  }
  else{
    var msg = "Réussite !";
    if(_etatEchec)
    {
      switch(_errno){
        case -1:
          msg = "Echec (Erreur du serveur) !";
        break;
        case -2:
          msg = "Echec (Erreur d'accès à FirebaseDB) !";
      }
    }
    if(_activRechercherFunnels){
      $("#p-subTitle-btn-imprtrJD-funnels").text( msg );
      $("#spinner-btn-imprtrJD-funnels, #p-subTitle-btn-imprtrJD-std").removeClass("estMontre").addClass("estCache"); // Masquer le message de l'autre alternative du bouton d'importation
      $("#btn-imprtrJD-funnels").prop( "disabled", false );
    }else{
      $("#p-subTitle-btn-imprtrJD-std").text( msg );
      $("#spinner-btn-imprtrJD-std, #p-subTitle-btn-imprtrJD-funnels").removeClass("estMontre").addClass("estCache");// Masquer le message de l'autre alternative du bouton d'importation
      $("#btn-imprtrJD-std").prop( "disabled", false );
    }
  }
}

/**
 * Peupler les UIs : soit à l'initialisation de page, soit lors de l'import d'un jeu de données
 * @param  oResults:Object
 * @param  _activRechercherFunnels:Boolean
 * @return void
 */
function peuplerUIsJeuDonnees(oResults, _activRechercherFunnels=false){
  console.log(" oResults.data.length = "+ oResults.data.length + "; \n oResults.metadata = "+ JSON.stringify(oResults.metadata) );
  /* TODO : informer =
    succès => débloquer aussi les UI de page concernés 
    échec => afficher une modal expliquant le problème + moyen resolution (pb de serveur).
  */
  if(oResults.data!=""){
    oResults.data = ajouterRetourligne( JSON.stringify(oResults.data), "},{", 2 );

    $('#legend-fieldset-jeuDonnees').removeClass("estGrise");
    $('#btnEditerDonnees').prop( "disabled", false );
    $('#metadonneesJeuDonnees-span-dateDebut').text(oResults.metadata.dateDebut);
    $('#metadonneesJeuDonnees-span-dateFin').text(oResults.metadata.dateFin);
    $('#metadonneesJeuDonnees-span-nbAU').text(oResults.metadata.nbActionsUtilisateurs);
    $('#metadonneesJeuDonnees-span-nbSU').text(oResults.metadata.nbSessionsUtilisateurs);
    $('#div-metadonneesJeuDonnees').removeClass("estCache").addClass("estMontre");

    //OLD: $('#div-content-codeJeuDonnees').text(strResults);
    $('#div-content-codeJeuDonnees').text(oResults.data);
    $('#pre-wrapper-codeJeuDonnees').removeClass("estCache").addClass("estMontre");
    $('#icon-codeJeuDonnees').removeClass("estMontre").addClass("estCache");

    $('#txtarJeuDonnees').val(oResults.data);
    //  $('#txtarJeuDonnees').removeClass("estCache").addClass("estMontre");
  }
  else{
    $('#pre-wrapper-codeJeuDonnees').removeClass('estCache').addClass('estMontre');
    $('#icon-codeJeuDonnees').removeClass("estCache").addClass("estMontre");

    if($('#inpt-dateMaxLimite').val()=="" && $('#inpt-dateMinLimite').val()=="")
      $('#div-content-codeJeuDonnees').text("Aucune donnée récupérée");
    else
      $('#div-content-codeJeuDonnees').text("Aucune donnée pour la période demandée");
    
    $('#btnEditerDonnees').prop( "disabled", true );
  }
  // Modfier l'état des UIs:
  toggleEtatsUIBtnsImporter(false, _activRechercherFunnels)
}

/* Non fonctionnelles selon bonnes pratiques ajax : format Date
var dateMinLimite;
var dateMaxLimite;
function onClose_inpt-dateMinLimite(e) {
  console.log("dateMinLimite:string = " + $("#"+e.target.id).val() );
  dateMinLimite = formaterDateFrancaise( $("#"+e.target.id).val() );
  console.log("dateMinLimite:Date = ", dateMinLimite );
}

function onClose_inpt-dateMaxLimite(e) {
  console.log("dateMaxLimite:string = " + $("#"+e.target.id).val() );
  dateMaxLimite = formaterDateFrancaise( $("#"+e.target.id).val() );
  console.log("dateMaxLimite:Date = ", dateMinLimite );
}*/

// TODO : à déplacer dans date-operations-services.js = qui devra être classé au passage
/** @param strDate:string format attendu : "dd-mm-yyyy"
 **/
/*
function formaterDateFrancaise(strDate)
{
  aDate = strDate.split( '-' );
  return new Date( Number(aDate[2]), Number(aDate[1])-1, Number(aDate[0]) );
}*/



function onClick_cbToutesDonnees(e) {
  //console.log("e =", e );
  if(e.target.checked){
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
      .prop( "disabled", true );
  }
  else{
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
      .prop( "disabled", false );
  }
}



init();
</script>
