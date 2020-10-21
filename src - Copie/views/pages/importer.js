<!-- views/pages/importer.js
  Dépendances
    ../partiels/animer-toggleCollapse.js
      ::toggleCollapse
    ../partiels/peupler-modale.js
      ::afficherModalEtat
      ::fermerModal
    commun.js
      ::navGoTo
    commun-ui.js
      ::ajouterRetourligne
    header-loader.js
      ::initHeaderBadges
      ::initHeadersUIs
      ::getAccessFbDbState
      ::getSessionCSVFileExists
    utils-ajax.js
      ::getAjaxFunction
      ::setAjaxFunction
    validateurs-input.js
      ::validerMotifsModelFichierCSV
-->

<script>

function init()
{ 
  setTimeout( ()=>{
    activerHeaderMenuBtn(1);// Surligner le bouton de menu activé
  },50);
     
  initUICollapse();
  initUIDatePickers();

  //  DEV test 
  // testPeuplerJeuDonnees();
  // Récupérer les variables globales existant dans cette session
  ajaxGetSessionVars().then( oSessionVars=>{
    //Vérifier si des variables de jeu de données existent déjà dans cette session
    if(oSessionVars!=false)
      peuplerUIsJeuDonnees( oSessionVars, false );
    console.log("oSessionVars = ",oSessionVars);

    getAccessFbDbState().then( booAccessFbDbState=>{
      initHeadersUIs(booAccessFbDbState, "booAccessFbDbState");
      // TODO : gérer 
      initUIVisuEtSelect(booAccessFbDbState, oSessionVars);
      showControlesImportation();
      if(booAccessFbDbState)
        $('#legend-fieldset-selectionPeriodeDonnees, #legend-fieldset-importerDonnees').removeClass("estGrise");
    });
  });
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    //console.log("checkConfigurationUIs(booSessionCSVFileExists) lancé !");
    initHeadersUIs(booSessionCSVFileExists, "booSessionCSVFileExists");
  });
  
}

// DEV test : 
// 
function testPeuplerJeuDonnees(){
  var txt = "{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8r6aMXyOBS0sKwVV\":{\"composantUI\":\"barreRechSaisir\", \"date\":\"2020-1-4-11:53:28\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl8rlcYybPcMNkvg07\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-4-11:53:30\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9-b69afdk1Eu7WTp\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-4-11:54:6\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl92iBtNOSe8tOScit\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-4-11:54:19\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},{-Lxl9EN4dmC2PbTg84Sz\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:55:12\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl9EN4dmC2PbTg84Sz\"},{-LyDo6bJ24rxWqKoon4Y\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-10:37:6\", \"page\":\"app.component\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo8r9qp2yigcDb7C5\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:15\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDo9HO7DfGRAnOTZJH\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-10:37:16\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoAqsDjWEIgHblRLD\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-10:37:23\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoI6lpy2ai5PlD8pG\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-10:37:53\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoK4_N9O7q2ZvOX7f\":{\"composantUI\":\"btnFermer\", \"date\":\"2020-1-10-10:38:1\", \"page\":\"StationsFavoritesModal\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyDoKh-N0yXmup1FIGC\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-10:38:3\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyDo6bJ24rxWqKoon4Y\"},{-LyEGTlYBvUCrKeN2HrI\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-10-12:45:50\", \"page\":\"app.component\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGUkB-musQoRs9SXy\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:54\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGV-3Frr96y24VVjM\":{\"composantUI\":\"btnSuivant\", \"date\":\"2020-1-10-12:45:55\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGYfm273MI4mBQr0b\":{\"composantUI\":\"btnFinirTuto\", \"date\":\"2020-1-10-12:46:10\", \"page\":\"TutorielPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGd5XvI3qyAbDLD35\":{\"composantUI\":\"btnGeoloc\", \"date\":\"2020-1-10-12:46:32\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGje70nR5W3d9hpGL\":{\"composantUI\":\"btnMenu\", \"date\":\"2020-1-10-12:46:59\", \"page\":\"PrevisionsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},{-LyEGuTgFosScjikOIoN\":{\"composantUI\":\"btnAcheter\", \"date\":\"2020-1-10-12:47:43\", \"page\":\"SettingsPage\", \"statsSessionId\":\"-LyEGTlYBvUCrKeN2HrI\"},";  
  //OLD: $('#div-content-codeJeuDonnees').html( ajouterRetourligne(txt, "},{", 2) );
  $('#pre-wrapper-codeJeuDonnees').removeClass("estCache").addClass("estMontre");
  $('#icon-codeJeuDonnees').removeClass("estMontre").addClass("estCache");

  $('#txtarJeuDonnees').val(ajouterRetourligne(txt, "},{", 2) );
  $('#txtarJeuDonnees').removeClass("estCache").addClass("estMontre");
}

/** Setter gérée seulemnt coté serveur
*/
/**@return Object{
 *   data:Array<{key, composantUI, date, page, statsSessionId,
 *      sessionKey, androidVersion, licenceEstPremium,
 *      nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation}>
 *   metadata:Object{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}
 * }
 */
function ajaxGetSessionVars()
{
  // R&D test : TESTE OK !
  /*testSetData({// Requete HTTP en mode post
    "data": [{truc:1,machin:4},{truc:33,machin:34},{truc:51,machin:54}] ,
    "metadata": {bidule:1,datation1:"3-1-20",datation2:"4-2-20"} 
  });*/
  return new Promise( resolve=>{
    getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?getSessionVars=true").then( (oSessionVars)=>{
      if(oSessionVars<0){ // TODO=> Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        // TODO : à gérer
        console.log("getModeleFichierCSV::errno = "+oSessionVars)
        resolve(false);
      }
     //DEV console.log(" :: oJeuDonneesConcat.data.length = "+ oSessionVars.data.length +
     //   "oSessionVars.metadata = "+JSON.stringify(oSessionVars.metadata) );
      resolve(oSessionVars);
    });
  });
}

function ajaxSetModeleFichierCSV(_data)
{
  //console.log("setGlobalVars :: _data = ", [_data]);
  return new Promise( resolve=>{
    //Méthode A)
    //postAjaxJQUERY(dataToSend, "json", "http://localhost:3000/ajax/v1.7/importer/?setGlobalVars=true").then( (results)=>{
    // NOK : dans la méthode postAjaxJQUERY : 
    // importer:70 Uncaught (in promise) TypeError: Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.
    //Méthode B)
    setAjaxFunction("http://localhost:3000/ajax/v1.7/importer/?setModeleFichierCSV=true&",
     [_data]
    ).then( (results)=>{
      if(results<0){ //TODO : Cas d'erreur sur le serveur : alors "setAjaxFunction" renvoie un numéro d'erreur
        resolve(false);
      }
      resolve(results);
    });
  });
}


function showControlesImportation(){
  $("#btn-imprtrJD-std, #btnSupprDonnees").removeClass("estCache").addClass("estMontre");
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// Gestion évènementielle //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * Bloquer toute saisie au clavier
 * @param  {object} event [description]
 * @return {void}
 */
function onKeyDown_datePicker(event){
  //console.log("onKeyDown_validerDates event = ",event);
  event.preventDefault();
}
///TODO : déplacer vers validateurs
/**
 * [Valider la cohérence des dates de la période, le format des dates est déjà vérifiées]
 * @return Boolean
 */
function validerCoherencePeriode()
{
  let o = false;
  if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre") || $("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){// si btn-tggl-DatePlusAncienne-Min ou si btn-tggl-DatePlusRecente-Max est enfoncé
    o = true;
  }
  else{
    var aInptDate = $("#inpt-dateMinLimite").val().split('-');
    var dMin = new Date( Number(aInptDate[2]), Number(aInptDate[1])-1, aInptDate[0] );
    aInptDate = $("#inpt-dateMaxLimite").val().split('-');
    var dMax = new Date( Number(aInptDate[2]), Number(aInptDate[1])-1, aInptDate[0] );
    if(dMax.getTime()>dMin.getTime()){ 
      o = true;
    }
  }
  return o;
}

var arrMsgErreurSaisie = [
  "La saisie attendue est vide.",
  "La date de début DOIT ÊTRE ANTÉRIEURE à la date de début."
];
var dateMinLimite = 0;
var dateMaxLimite = 0;
/**
 * [Valider la combinaison de remplissage des dates ou cochage des boutons]
 * @return void
 */
function onChange_validerDates()
{
  //console.log("event = ",event);
  //console.log("onChange_validerDates lancé !");
  if( ($("#inpt-dateMinLimite").val()!="" || $("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre"))// si dateMin est vide ou btn-tggl-DatePlusAncienne-Min est relevé
    && ($("#inpt-dateMaxLimite").val()!="" || $("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre"))// si dateMax est vide ou btn-tggl-DatePlusRecente-Max est relevé
  ){
    $("#div-errorMsg-dateMinLimite, #div-errorMsg-dateMaxLimite").removeClass("estMontre").addClass("estCache");
    $("#inpt-dateMinLimite, #inpt-dateMaxLimite").removeClass("is-invalid");

    $("#btn-imprtrJD-std").prop("disabled",false);
  }  
}

function onSubmitImporter()
{
  let canCommitImporter = false;
  if($('#cbToutesDonnees:checked').length==1){//s'il est coché
    nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
    nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
    canCommitImporter = true;
  }
  else{//s'il est décoché
    
    if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre")){// si btn-tggl-DatePlusAncienne-Min est enfoncé
      nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
      if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){// si btn-tggl-DatePlusRecente-Max est enfoncé
        nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
        canCommitImporter = true;
      }
      else{
        dateMaxLimite = $("#inpt-dateMaxLimite").val();
        canCommitImporter = true;
      }
    }
    else{// si btn-tggl-DatePlusAncienne-Min est relevé
      dateMinLimite = $("#inpt-dateMinLimite").val();
      //Tester : est que les saisies attendues sont vides [Cas limite : si btn-tggl-DatePlusAncienne-Min ou btn-tggl-DatePlusRecente-Max vient juste d'être décoché]
      if($("#inpt-dateMinLimite").val()==""){// Si l'une ou l'autre des saisie est vide
        // Même traitement que dans la fin de méthode onChange_validerDates, si errno==1
        $("#inpt-dateMinLimite").addClass(("is-invalid"));
        $("#div-errorMsg-dateMinLimite").html( arrMsgErreurSaisie[0]);// comme errno==1
        $("#div-errorMsg-dateMinLimite").removeClass("estCache").addClass("estMontre");
        //$("#inpt-dateMinLimite").focus();
      }
      else if(validerCoherencePeriode()){// Vérifier la cohérence des dates de la période
        $("#inpt-dateMaxLimite").removeClass("is-invalid");
        dateMaxLimite = $("#inpt-dateMaxLimite").val();
        canCommitImporter = true;
      }
      else{ //Si la validation de cohérence de la période des dates échoue :
        //$("#inpt-dateMinLimite").focus();
        // Obligatoire pour ne pas désactiver la class 'is-invalid' dès le focus qui déclencherait onChange_validerDates
        setTimeout( function(){
          $("#inpt-dateMinLimite, #inpt-dateMaxLimite").addClass("is-invalid");
          $("#div-errorMsg-btn-imprtrJD").html( arrMsgErreurSaisie[1]);// comme errno==5 (index 5-1=4)
          $("#div-errorMsg-btn-imprtrJD").removeClass("estCache").addClass("estMontre");
        },1000);
      }
    }

    if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){// si btn-tggl-DatePlusRecente-Max est enfoncé
      nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
      if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre")){// si btn-tggl-DatePlusAncienne-Min est enfoncé
        nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
        canCommitImporter = true;
      }
    }
    else{// si btn-tggl-DatePlusRecente-Max est relevé
      dateMaxLimite = $("#inpt-dateMaxLimite").val();
      if($("#inpt-dateMaxLimite").val()==""){// Si l'une ou l'autre des saisie est vide
        // Même traitement que dans la fin de méthode onChange_validerDates, si errno==1
        $("#inpt-dateMaxLimite").addClass(("is-invalid"));
        $("#div-errorMsg-dateMaxLimite").html( arrMsgErreurSaisie[0]);// comme errno==1 (index 1-1=0)
        $("#div-errorMsg-dateMaxLimite").removeClass("estCache").addClass("estMontre");
        //$("#inpt-dateMaxLimite").focus();
      }
      else if(validerCoherencePeriode()){// Vérifier la cohérence des dates de la période
        $("#inpt-dateMinLimite").removeClass("is-invalid");
        dateMinLimite = $("#inpt-dateMinLimite").val();
        canCommitImporter = true;
      }
      else{ //Si la validation de cohérence de la période des dates échoue :
        //$("#inpt-dateMinLimite").focus();
        // Obligatoire pour ne pas désactiver la class 'is-invalid' dès le focus qui déclencherait onChange_validerDates
        setTimeout( function(){
          $("#inpt-dateMinLimite, #inpt-dateMaxLimite").addClass("is-invalid");
          $("#div-errorMsg-btn-imprtrJD").html( arrMsgErreurSaisie[1]);// comme errno==5 (index 5-1=4)
          $("#div-errorMsg-btn-imprtrJD").removeClass("estCache").addClass("estMontre");
        },1000);
      }
    }

  }
  if(canCommitImporter){
    // DEBUG RAPIDE :
    if (dateMinLimite=="") dateMinLimite = 0;
    if (dateMaxLimite=="") dateMaxLimite = 0;

    commitImporter();// Déclencher l'action "Importer" du serveur
  }
  else{
    $("#btn-imprtrJD-std").prop("disabled",true);
  }
}


function commitImporter(){
  toggleEtatsUIBtnsImporter(true)
  
  // MOCK
  getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?mockData=true&dateMaxLimite=" + dateMaxLimite + "&dateMinLimite="+ dateMinLimite )
  // PRODUCTION
  //getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?dateMaxLimite=" + dateMaxLimite + "&dateMinLimite="+ dateMinLimite )
  // OLD .then( (strResults)=>{
  .then( (oResults)=>{
    
    if(oResults<0){ // Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
      toggleEtatsUIBtnsImporter(false, true, oResults);
      return false; //Fin
    }

    peuplerUIsJeuDonnees(oResults);
    actionModeleFichierCSV(2);
  },
  (error)=>{ //TODO : Si la requête au serveur Firebase échoue 
    console("#1 erreur = ",error);
    toggleEtatsUIBtnsImporter(false, true)
    // TODO : afficher une modal signalant l'erreur du serveur
  });
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Méthodes utilitaire ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/**
 * TODO : rationnaliser => _typeUI devient number => 0|1 [0=>vider dateMaxLimite | 1=>vider dateMaxLimite]
 * [nettoyerSaisieClasseEtVar description]
 * @param  _typeUI:string 
 * @param  _idUi:string   [#inpt-dateMinLimite|#inpt-dateMaxLimite]
 * @return {[type]}         [description]
 */
function nettoyerSaisieClasseEtVar(_typeUI, _idUi)
{
  //Nettoyer la saisie de date
  if(_typeUI=="dateMinLimite")
    dateMinLimite = 0;
  else if(_typeUI=="dateMaxLimite") // if(_typeUI=="dateMaxLimite")
    dateMaxLimite = 0;
  // Sinon, si _typeUI == "" alors ne pas attribuer les variables
  //console.log("dateMinLimite = "+dateMinLimite+" ; dateMaxLimite = "+dateMaxLimite);
  $(_idUi).removeClass("is-invalid");
  //Nettoyer le essage d'erreur
  $( "#div-errorMsg-" + _idUi.split("-")[1] ).removeClass("estMontre").addClass("estCache");
}

/**
 * [onClick_cbToutesDonnees description]
 * @param  e:Event
 * @param  isInit:Boolean
 * @return void
 */
function onClick_cbToutesDonnees(e, isInit=false) {
  if(!isInit){
    //console.log("e =", e );
    if(e.target.checked){//Cas: Après le cochage :
      nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
      nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
      //Non implémenté par gijgo "datepicker": la désactivation ne modifie pas l'event lors du click du bouton "calendar"
      /*$('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
        .prop( "disabled", true );*/
      $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", true );
      $('#div-inpt-dateMinLimite .input-group-append, #div-inpt-dateMaxLimite .input-group-append').removeClass("estMontre").addClass("estCache");
    }
    else{//Cas: Après le décochage :
      //Non implémenté par gijgo "datepicker": la désactivation ne modifie pas l'event lors du click du bouton "calendar"
      /*$('#inpt-dateMinLimite, #inpt-dateMaxLimite, #div-inpt-dateMinLimite button, #div-inpt-dateMaxLimite button')
        .prop( "disabled", false );*/
      $('#btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", false );

      if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estCache")){// si btn-tggl-DatePlusAncienne-Min est relevé
        //... (ré)activer inpt-dateMinLimite
        $('#inpt-dateMinLimite').prop( "disabled", false );
        $('#div-inpt-dateMinLimite .input-group-append').removeClass("estCache").addClass("estMontre");
      }
      // si btn-tggl-DatePlusAncienne-Min est enfoncé : ne pas (ré)activer inpt-dateMinLimite
            
      if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estCache")){// si btn-tggl-DatePlusRecente-Max est relevé
        //... (ré)activer inpt-dateMaxLimite
        $('#inpt-dateMaxLimite').prop( "disabled", false );
        $('#div-inpt-dateMaxLimite .input-group-append').removeClass("estCache").addClass("estMontre");
      }
      // si btn-tggl-DatePlusRecente-Max est enfoncé : ne pas (ré)activer inpt-dateMaxLimite
      
    }
  }
  else{
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", true );
    $('#div-inpt-dateMinLimite .input-group-append, #div-inpt-dateMaxLimite .input-group-append').removeClass("estMontre").addClass("estCache");
  }
}


function onClick_btnTgglDateLimite(e)
{
  var aName = e.target.id.split("-");// Récupérer une partie de l'attribut id : "Min"|"Max"
  //console.log("$('#inpt-date'"+aName[3]+"'Limite').hasClass('is-invalid') =",$('#inpt-date'+aName[3]+'Limite').hasClass("is-invalid"));
  if($('#inpt-date'+aName[3]+'Limite').hasClass("is-invalid") && (!$('#'+e.target.id).hasClass("active")) ){
    nettoyerSaisieClasseEtVar("", '#inpt-date'+aName[3]+'Limite');
  }
  
  setTimeout(function(){
    console.log("e = ",e);
    //console.log("$('#'"+e.target.id+").hasClass('active') = ",$('#'+e.target.id).hasClass("active") );
    if( $('#'+e.target.id).hasClass("active") ){
      $("#icon-"+e.target.id+"-unchkd").removeClass("estMontre").addClass("estCache");
      $("#icon-"+e.target.id+"-chkd").removeClass("estCache").addClass("estMontre");
      // Désactiver le champ de saisie et vider sa valeur
      $('#inpt-date'+aName[3]+'Limite').val("");
      $('#inpt-date'+aName[3]+'Limite').prop( "disabled", true );
      $(' #div-inpt-date'+aName[3]+'Limite .input-group-append').removeClass("estMontre").addClass("estCache");
      /*
      $('#inpt-date'+aName[4]+'Limite, #div-inpt-date'+aName[3]+'Limite:first-child button').prop( "disabled", true );
      // TODO : bug du onclick des boutons VISUELLEMENT desactivé mais onclick fonctionne !
      $('#div-inpt-date'+aName[3]+'Limite:first-child button').click( function(event){ 
        //TODO : rétablir le listener
      });*/
    }
    else{ 
      $("#icon-"+e.target.id+"-chkd").removeClass("estMontre").addClass("estCache");
      $("#icon-"+e.target.id+"-unchkd").removeClass("estCache").addClass("estMontre");
      // Activer le champ de saisie et vider sa valeur
      $('#inpt-date'+aName[3]+'Limite').prop( "disabled", false );
      $('#div-inpt-date'+aName[3]+'Limite .input-group-append').removeClass("estCache").addClass("estMontre");
      /*$('#inpt-date'+aName[4]+'Limite, #div-inpt-date'+aName[3]+'Limite:first-child button').prop( "disabled", false );
      // TODO : bug du onclick des boutons VISUELLEMENT desactivé mais onclick fonctionne !
      $('#div-inpt-date'+aName[3]+'Limite').click( function(event){ 
        console.log("stop !");
        //event.stopPropagation();
      });*/
    }

    //Selon des changements : Validateur pour activer/désactiver les boutons btn-imprtrJD-std
    if( ($("#btn-tggl-DatePlusAncienne-Min").hasClass("active") || $('#inpt-dateMinLimite').val()!="") && // si dateMin n'est pas vide ou btn-tggl-DatePlusAncienne-Min est enfoncé
      ($("#btn-tggl-DatePlusRecente-Max").hasClass("active") || $('#inpt-dateMaxLimite').val()!="")// si dateMax n'est pas vide ou btn-tggl-DatePlusRecente-Max est enfoncé
    ){
      $("#btn-imprtrJD-std").prop("disabled",false);
    }

  },200);
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


//Public
function onChange_enregistrerModeleFichierCSV(event)
{
  // Supprimer tous les caractères spéciaux (y compris l'espacement), ceux différents du pattern négativisé.
  //console.log('Before: $("#inpt-modeleFichierCSV").val() = '+ $("#inpt-modeleFichierCSV").val() );
  $("#inpt-modeleFichierCSV").val($("#inpt-modeleFichierCSV").val().replace(/[^0-9a-zA-Z\-]+/g,""))
  //console.log('After: $("#inpt-modeleFichierCSV").val() = '+ $("#inpt-modeleFichierCSV").val() );
  // 
  var s = $("#inpt-modeleFichierCSV").val();
  // Remplacer le terme "-" trouvé de façon multiple ET consécutivement ( ex : "----", par un terme unique "-" )
  $("#inpt-modeleFichierCSV").val( s.replace(/-+/gi,"-") );
  //console.log('supprimer multiple - et " "', $("#inpt-modeleFichierCSV").val() );
  var errorValiderMotifsModelFichierCSV = validerMotifsModelFichierCSV($("#inpt-modeleFichierCSV").val());
  //console.log("validerMotifsModelFichierCSV = ",errorValiderMotifsModelFichierCSV);
  if(errorValiderMotifsModelFichierCSV.errNo==0 ){ // Cas : aucune erreur de syntaxe
    $("#btn-gnrrFchr").prop( "disabled", false );// activer le btn
    $("#btn-gnrrFchr").removeClass("is-invalid");// supprimer la classe
    $("#div-errorMsg-btn-enregModelFich").removeClass("estMontre").addClass("estCache");// cacher le message
  }
  else{// if(errorValiderMotifsModelFichierCSV.errNo<0) // Cas : une/des erreur(s) de syntaxe
    // Bloquer le click déjà fait du bouton ? event.stopPropagation();
    $("#btn-gnrrFchr").addClass("is-invalid");// ajouter la classe
    $("#div-errorMsg-btn-enregModelFich").removeClass("estCache").addClass("estMontre");// montrer le message
    //$("#btn-gnrrFchr").focus();
    switch(errorValiderMotifsModelFichierCSV.errNo)
    {
      case -1:
        $("#div-errorMsg-btn-enregModelFich").html("Ces mots ne correspondent pas AUX MOT-CLES INDIQUES : "+errorValiderMotifsModelFichierCSV.errStr)
      break;
      case -2:
        if($("#div-errorMsg-btn-enregModelFich").html("Ces mots ont été saisis PLUSIEURS FOIS : "+errorValiderMotifsModelFichierCSV.errStr))
      break;
    }
  }
}


/**
 * @param  _type:number 0=>CTA annuler ; 1=>CTA enregistrer ; 2=>check pour activation/désactivation d'UI
 * @return {[type]}
 */
async function actionModeleFichierCSV(_type)
{
  // TODO : récupérer les donnée dans init, si vide désactiver le bouton
  switch(_type){
    case 0:// Cas : vider input
      $("#inpt-modeleFichierCSV").val("");
// TEST DEBUG    
//      $("#btn-gnrrFchr").prop( "disabled", true );// désactiver le btn
    break;

    case 1:// Cas : enregistrer input
      //   créer une méthode dans le service fs-management-service : checkForbidenChars(str:string)
      if(! $("#btn-gnrrFchr").hasClass("is-invalid")){
        //  - enregistrer le modèle = requete Ajax envoyer la valeur de inpt-modeleFichierCSV
        var result = await ajaxSetModeleFichierCSV( {key: "modeleFichierCsv", val: $("#inpt-modeleFichierCSV").val()} );
        if(result){
          $("#icon-enregModelFich-fait").removeClass("estCache").addClass("estMontre");//montrer l'icone fait
          $("#icon-enregModelFich-erreur").removeClass("estMontre").addClass("estCache");//cacher l'icone erreur
          $("#div-errorMsg-btn-enregModelFich").removeClass("estMontre").addClass("estCache");// cacher le message d'erreur
        }
        else{
          $("#icon-enregModelFich-erreur").removeClass("estCache").addClass("estMontre");//montrer l'icone erreur
          $("#icon-enregModelFich-fait").removeClass("estMontre").addClass("estCache");//cacher l'icone fait
          $("#div-errorMsg-btn-enregModelFich").removeClass("estCache").addClass("estMontre");// montrer le message d'erreur
          $("#div-errorMsg-btn-enregModelFich").html("L'enregistrement a échoué !")
        }
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

/**
 * @param  _intentionCTA:Boolean : false=>en cours d'arrêt ; true=>en cours de lancement
 * @param  _etatEchec:Boolean : seulement exploité si _intentionCTA == "false"
 * @return void
 */
function toggleEtatsUIBtnsImporter(_intentionCTA, _etatEchec=false, _errno=0){
  // Modfier l'état des UIs:
  if(_intentionCTA){
    $("#p-subTitle-btn-imprtrJD-std").text( "En cours..." );
    $("#spinner-btn-imprtrJD-std, #p-subTitle-btn-imprtrJD-std").removeClass("estCache").addClass("estMontre");
    $("#btn-imprtrJD-std").prop( "disabled", true );
  }
  else{
    var msg = "<span class='text-success'>Réussite !</span> <i class='fa fa-check text-success'></i>";
    if(_etatEchec)
    {
      switch(_errno){
        case -1:
          msg = "<span class='text-danger'>Echec ! <i class='fas fa-exclamation-circle text-danger'></i><BR>"+
          "- La source de données de Firebase DB comporte des incohérences : vérifiez-la.<BR>"+
          "OU<BR>"+
          "- Temps de réponse maximal du serveur est dépassée !</span>";
        break;
        case -2:
          msg = "<span class='text-danger'>Echec ! <i class='fas fa-exclamation-circle text-danger'></i><BR>Accès impossible à Firebase Database !</span>";
      }
    }
  
    $("#p-subTitle-btn-imprtrJD-std").html( msg );
    $("#spinner-btn-imprtrJD-std").removeClass("estMontre").addClass("estCache");// Masquer le message de l'autre alternative du bouton d'importation
    $("#btn-imprtrJD-std").prop( "disabled", false );
  }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Gestion de la modale d'état des traitements ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/*function demanderSupprimerDonnees()
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
function ctaAnnulerModalEtatsTrt()
{
  if(numPageModalId==1){
    console.log("ANNULER la suppression des données !") 
  }
  //Caché automatiquement
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
*/

function ctaValiderModalEtatsTrt()
{
  navGoTo('/telecharger');
  //Cacher :
  fermerModal();
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////// METHODE MODIFIANT LES UIS /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function initUICollapse()
{
  // Dans page EJS :Plier toutes les branches, car les fonctions JS des UI ne sont pas prévus pour déplier lors du chargement
  // Déplier toutes les branches
  $("#btn-collapseUn-chevron").addClass("animate-collapseUI-deplier");// NOK : tester le style 
  $("#btn-collapseDeux-chevron").addClass("animate-collapseUI-deplier");// NOK : tester le style
  // Plier toutes les branches
  /*$("#btn-collapseUn-chevron").addClass("animate-collapseUI-plier");// NOK : tester le style 
  $("#btn-collapseDeux-chevron").addClass("animate-collapseUI-plier");// NOK : tester le style */
  $('#depliageUn').addClass("show");
  $('#depliageDeux').addClass("show");
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
    change: function (e) {
       console.log('inpt-dateMinLimite :: Change is fired ; e = ',e);
       //if(...)
    },
    keydown: function(e) {
      console.log('inpt-dateMinLimite :: keypress is fired ; e = ',e);
    }
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
 * @param  _oSessionVars:Object{}
 * @return void
 */
function initUIVisuEtSelect(_booAccessFbDbState, _oSessionVars){
  //////////// Gestion des dates minimum et date maximum pour l'import
  
  //console.log("_booAccessFbDbState = " +_booAccessFbDbState + " ; _oSessionVars = "+_oSessionVars);
  if(_booAccessFbDbState){
    $('#cbToutesDonnees').attr('checked', true);
    onClick_cbToutesDonnees(null, true);
  }
  else{
    $('#cbToutesDonnees').attr('checked', true).prop( "disabled", true );
    onClick_cbToutesDonnees(null, true);
  }
  
  //////////// Gestion des voyants/badges indiquant la connexion à Firebase DB
  if(_booAccessFbDbState){
    $("#accessFbDbStateSuccess").removeClass("estCache").addClass("estMontre"); 
    $("#accessFbDbStateFailed").removeClass("estMontre").addClass("estCache");
  }else{
    $("#accessFbDbStateFailed").removeClass("estCache").addClass("estMontre"); 
    $("#accessFbDbStateSuccess").removeClass("estMontre").addClass("estCache"); 
  }

  //////////// Gestion de la zone de composition du modèle de nom de fichier
  if(_oSessionVars==false){// Cas d'erreur de requête de serveur
// TEST DEBUG    
//    $("#btn-gnrrFchr").prop( "disabled", true );
  }
  if(_oSessionVars.data==""){//Si aucune données n'a été importé, ou données importées sont vides
    // TEST DEBUG    
//  $("#btn-gnrrFchr").prop( "disabled", true );
  }  
  //console.log("_oSessionVars.modeleFichierCsv = ",_oSessionVars.modeleFichierCsv);
  if(_oSessionVars.modeleFichierCsv!="")// Si le modèle de nom de fichier n'est pas défini
    $("#inpt-modeleFichierCSV").val( _oSessionVars.modeleFichierCsv );
  else
    $("#btn-gnrrFchr").prop( "disabled", true );

  // Si pas de cnx : afficher accessFbDbStateSuccess & cacher accessFbDbStateFailed ; sinon afficher accessFbDbStateFailed & cacher   accessFbDbStateSuccess
  // Si aucune données importée : desactiver => btn-gnrrFchr
}

/**
 * Peupler les UIs : soit à l'initialisation de page, soit lors de l'import d'un jeu de données
 * @param  oResults:Object
 * @return void
 */
function peuplerUIsJeuDonnees(oResults){
  if(oResults.data!=undefined && oResults.metadata!=undefined)
    console.log(" oResults.data.length = "+ oResults.data.length + "; \n oResults.metadata = "+ JSON.stringify(oResults.metadata) );
  /* TODO : informer =
    succès => débloquer aussi les UI de page concernés 
    échec => afficher une modal expliquant le problème + moyen resolution (pb de serveur).
  */
  if(oResults.data!=""){
    oResults.data = ajouterRetourligne( JSON.stringify(oResults.data), "},{", 2 );

    $('#legend-fieldset-jeuDonnees').removeClass("estGrise");
    $('#btnEditerDonnees').prop( "disabled", false );

     //OLD: $('#div-content-codeJeuDonnees').text(strResults);
    $('#div-content-codeJeuDonnees').text(oResults.data);
    $('#pre-wrapper-codeJeuDonnees').removeClass("estCache").addClass("estMontre");
    $('#icon-codeJeuDonnees').removeClass("estMontre").addClass("estCache");

    $('#txtarJeuDonnees').val(oResults.data);
    //  $('#txtarJeuDonnees').removeClass("estCache").addClass("estMontre");
      
    $('#metadonneesJeuDonnees-span-dateDebut').text(oResults.metadata.dateDebut);
    $('#metadonneesJeuDonnees-span-dateFin').text(oResults.metadata.dateFin);
    $('#metadonneesJeuDonnees-span-nbAU').text(oResults.metadata.nbActionsUtilisateurs);
    $('#metadonneesJeuDonnees-span-nbSU').text(oResults.metadata.nbSessionsUtilisateurs);

    //////////// Gestion de la zone de composition du modèle de nom de fichier
    //$("#btn-gnrrFchr").prop( "disabled", false );
    $('#btn-gnrrFchr').removeClass("estCache").addClass("estMontre");
  }
  else{
    $('#pre-wrapper-codeJeuDonnees').removeClass('estCache').addClass('estMontre');
    $('#icon-codeJeuDonnees').removeClass("estCache").addClass("estMontre");

    if($('#inpt-dateMaxLimite').val()=="" && $('#inpt-dateMinLimite').val()=="")
      $('#div-content-codeJeuDonnees').text("Aucune donnée récupérée");
    else
      $('#div-content-codeJeuDonnees').text("Aucune donnée pour la période demandée");
    
    $('#btnEditerDonnees').prop( "disabled", true );

    //////////// Gestion de la zone de composition du modèle de nom de fichier
    //$('#btn-gnrrFchr').prop( "disabled", true );
    $('#btn-gnrrFchr').removeClass("estMontre").addClass("estCache");
  }

  console.log("oResults.metadata.dateDebut = "+oResults.metadata.dateDebut);
  //////////// Gestion de la zone de metadata
  if(oResults.metadata.dateDebut!="" && oResults.metadata.dateDebut!=undefined)
    $('#div-metadonneesJeuDonnees').removeClass("estCache").addClass("estMontre");
  else
    $('#div-metadonneesJeuDonnees').removeClass("estMontre").addClass("estCache");

  // Modfier l'état des UIs:
  toggleEtatsUIBtnsImporter(false)
}


// TODO : à déplacer dans date-operations-services.js = qui devra être classé au passage
/** @param strDate:string format attendu : "dd-mm-yyyy"
 **/
/*
function formaterDateFrancaise(strDate)
{
  aDate = strDate.split( '-' );
  return new Date( Number(aDate[2]), Number(aDate[1])-1, Number(aDate[0]) );
}*/





init();
</script>
