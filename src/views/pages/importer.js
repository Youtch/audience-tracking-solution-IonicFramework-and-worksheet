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
      ::addCarriageReturnToStringLine
    header-loader.js
      ::initHeadersBadges
      ::overliningActualMenuButton
      ::getAccessFbDbState
      ::getSessionCSVFileExists
    utils-ajax.js
      ::getAjaxFunction
      ::setAjaxFunction
    validateurs-input.js
      ::validerMotifsModelFichierCSV
-->

<script>
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

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// INITIALIZING FUNCTIONS //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
function init()
{ 
  setTimeout( ()=>{
    overliningActualMenuButton(1);
  },50);
     
  initUICollapse();
  initUIDatePickers();

  ajaxGetSessionVars().then( oSessionVars=>{
    
    //Check for existing variables of dataset on this session
    if(oSessionVars!=false)
      peuplerUIsJeuDonnees( oSessionVars, false);
    console.log("oSessionVars = ",oSessionVars);

    if(!oSessionVars.isMockData){//Use case : when .ENV provide MOCK_DATA=0

      getAccessFbDbState().then( booAccessFbDbState=>{
        initHeadersBadges(booAccessFbDbState, "booAccessFbDbState");
        
        initUIComponentsOfPage(false, oSessionVars, booAccessFbDbState);
        if(booAccessFbDbState)
          showControlesImportation();
        if(booAccessFbDbState)
          $('#legend-fieldset-selectionPeriodeDonnees, #legend-fieldset-importerDonnees').removeClass("estGrise");
      });
    }

    else{ //Use case : when .ENV provide MOCK_DATA=1
      
      getAccessFbDbState().then( booAccessFbDbState=>{//Even checking the Firebase Database connection
        initHeadersBadges(booAccessFbDbState, "booAccessFbDbState");
      });
      
      initUIComponentsOfPage(true, oSessionVars, false);
      showControlesImportation();
      $('#legend-fieldset-selectionPeriodeDonnees, #legend-fieldset-importerDonnees').removeClass("estGrise");
    } 

  });
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    initHeadersBadges(booSessionCSVFileExists, "booSessionCSVFileExists");
  });
  
}

/**
 * Get server's data for this session
 * @return {Boolean=false | Object{
 *   data:Array<[
 *     {key, composantUI, date, page, statsSessionId, sessionKey, androidVersion, licenceEstPremium,
 *      nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation}
 *   ]>,
 *   metadata:Object<dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string>
 * }}
 */
function ajaxGetSessionVars()
{
  return new Promise( resolve=>{
    getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?getSessionVars=true").then( (oSessionVars)=>{
      if(oSessionVars<0){
        console.log("getModeleFichierCSV::errno = "+oSessionVars)
        resolve(false);
      }
      resolve(oSessionVars);
    });
  });
}

function ajaxSetModeleFichierCSV(_data)
{
  return new Promise( resolve=>{
    setAjaxFunction("http://localhost:3000/ajax/v1.7/importer/?setModeleFichierCSV=true&",
     [_data]
    ).then( (results)=>{
      if(results<0){
        resolve(false);
      }
      resolve(results);
    });
  });
}

function showControlesImportation(){
  $("#btn-imprtrJD").removeClass("estCache").addClass("estMontre");
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// USER'S EVENTS HANDLERS //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

/**
 * Prevent any keyboard typing on the text input
 * @param  {object} event
 * @return {void}
 */
function onKeyDown_datePicker(event){
  event.preventDefault();
}

/**
 * Checking the consistency after selecting the range of two dates
 * @return Boolean
 */
function validerCoherencePeriode()
{
  let o = false;
  if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre") || $("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){
  // if btn-tggl-DatePlusAncienne-Min or btn-tggl-DatePlusRecente-Max is DOWN
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
  "The expected input is empty.",
  "The start date MUST BE EARLIER to the end date."
];
var dateMinLimite = 0;
var dateMaxLimite = 0;

/**
 * Checking after doing these mix actions : selecting a range of dates or clicking extremes-dates buttons ("oldest date", "latest date")
 */
function onChange_validerDates()
{
  if( ($("#inpt-dateMinLimite").val()!="" || $("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre"))// if dateMin is empty or btn-tggl-DatePlusAncienne-Min is UP
    && ($("#inpt-dateMaxLimite").val()!="" || $("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre"))// if dateMax is empty or btn-tggl-DatePlusRecente-Max is UP
  ){
    $("#div-errorMsg-dateMinLimite, #div-errorMsg-dateMaxLimite").removeClass("estMontre").addClass("estCache");
    $("#inpt-dateMinLimite, #inpt-dateMaxLimite").removeClass("is-invalid");

    $("#btn-imprtrJD").prop("disabled",false);
  }  
}

/**
 * Checking UI components before to submit or cancel to import data
 * @return {[type]} [description]
 */
function onSubmitImporter()
{
  let canCommitImporter = false;
  if($('#cbToutesDonnees:checked').length==1){//'cbToutesDonnees' is CHECKED: IT WON'T get ALL data by dataset
    nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
    nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
    canCommitImporter = true;
  }
  else{//'cbToutesDonnees' is UNCHECKED: IT WILL get ALL data by dataset
    
    if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre")){// if btn-tggl-DatePlusAncienne-Min is DOWN
      nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
      if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){// if btn-tggl-DatePlusRecente-Max is DOWN
        nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
        canCommitImporter = true;
      }
      else{
        dateMaxLimite = $("#inpt-dateMaxLimite").val();
        canCommitImporter = true;
      }
    }
    else{// if btn-tggl-DatePlusAncienne-Min is UP
      dateMinLimite = $("#inpt-dateMinLimite").val();
      
      // Are the expected input empty ?
      if($("#inpt-dateMinLimite").val()==""){// If one or twice input are empty
        $("#inpt-dateMinLimite").addClass(("is-invalid"));
        $("#div-errorMsg-dateMinLimite").html( arrMsgErreurSaisie[0]);// equal to errno==1
        $("#div-errorMsg-dateMinLimite").removeClass("estCache").addClass("estMontre");
        //$("#inpt-dateMinLimite").focus();
      }
      else if(validerCoherencePeriode()){
        $("#inpt-dateMaxLimite").removeClass("is-invalid");
        dateMaxLimite = $("#inpt-dateMaxLimite").val();
        canCommitImporter = true;
      }
      else{
        //$("#inpt-dateMinLimite").focus();
        setTimeout( function(){ //Waiting is needed to avoid to desactivate the 'is-invalid' class when the focus begins. Otherwise it would trigger 'onChange_validerDates'
          $("#inpt-dateMinLimite, #inpt-dateMaxLimite").addClass("is-invalid");
          $("#div-errorMsg-btn-imprtrJD").html( arrMsgErreurSaisie[1]);// equal to errno==5 (index 5-1=4)
          $("#div-errorMsg-btn-imprtrJD").removeClass("estCache").addClass("estMontre");
        },1000);
      }
    }

    if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estMontre")){// if btn-tggl-DatePlusRecente-Max is DOWN
      nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
      if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estMontre")){// if btn-tggl-DatePlusAncienne-Min is DOWN
        nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
        canCommitImporter = true;
      }
    }
    else{// if btn-tggl-DatePlusRecente-Max is UP
      dateMaxLimite = $("#inpt-dateMaxLimite").val();
      if($("#inpt-dateMaxLimite").val()==""){// If one or twice input are empty
        $("#inpt-dateMaxLimite").addClass(("is-invalid"));
        $("#div-errorMsg-dateMaxLimite").html( arrMsgErreurSaisie[0]);// equal to errno==1 (index 1-1=0)
        $("#div-errorMsg-dateMaxLimite").removeClass("estCache").addClass("estMontre");
        //$("#inpt-dateMaxLimite").focus();
      }
      else if(validerCoherencePeriode()){
        $("#inpt-dateMinLimite").removeClass("is-invalid");
        dateMinLimite = $("#inpt-dateMinLimite").val();
        canCommitImporter = true;
      }
      else{ //If checking of 'validerCoherencePeriode' fails then...
        //$("#inpt-dateMinLimite").focus();
        setTimeout( function(){ //Waiting is needed to avoid to desactivate the 'is-invalid' class when the focus begins. Otherwise it would trigger 'onChange_validerDates'
          $("#inpt-dateMinLimite, #inpt-dateMaxLimite").addClass("is-invalid");
          $("#div-errorMsg-btn-imprtrJD").html( arrMsgErreurSaisie[1]);// equal to errno==5 (index 5-1=4)
          $("#div-errorMsg-btn-imprtrJD").removeClass("estCache").addClass("estMontre");
        },1000);
      }
    }

  }
  if(canCommitImporter){
    if (dateMinLimite=="") dateMinLimite = 0;
    if (dateMaxLimite=="") dateMaxLimite = 0;

    commitImporter();// Déclencher l'action "Importer" du serveur
  }
  else{
    $("#btn-imprtrJD").prop("disabled",true);
  }
}


/**
 * Importing dataset, by retrieving data from Firebase Database, or from mocking data.
 */
function commitImporter(){
  toggleEtatsUIBtnsImporter(true)
  
  getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/importer/?dateMaxLimite=" + dateMaxLimite + "&dateMinLimite="+ dateMinLimite )
  .then( (oResults)=>{
    
    if(oResults<0){
      toggleEtatsUIBtnsImporter(false, true, oResults);
      return false;
    }

    peuplerUIsJeuDonnees(oResults);
    actionModeleFichierCSV(2);
  },
  (error)=>{
    console("#1 erreur = ",error);
    toggleEtatsUIBtnsImporter(false, true)
  });
}



////////////////////////////////////////////////////////////////////////////
////////////////////////////// Utils features //////////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * @param  {string} _typeUI
 * @param  {string="#inpt-dateMinLimite"|"#inpt-dateMaxLimite"} _idUi
 */
function nettoyerSaisieClasseEtVar(_typeUI, _idUi)
{
  //Cleaning of the date input
  if(_typeUI=="dateMinLimite")
    dateMinLimite = 0;
  else if(_typeUI=="dateMaxLimite")
    dateMaxLimite = 0;
  
  $(_idUi).removeClass("is-invalid");
  //Cleaning the UI component of error message 
  $( "#div-errorMsg-" + _idUi.split("-")[1] ).removeClass("estMontre").addClass("estCache");
}

/**
 * [onClick_cbToutesDonnees description]
 * @param  {Event} e
 * @param  {Boolean} isInit
 */
function onClick_cbToutesDonnees(e, isInit=false) {
  if(!isInit){
    if(e.target.checked){//Use cas: after having CHECKED the calling UI component
      nettoyerSaisieClasseEtVar("dateMinLimite", "#inpt-dateMinLimite");
      nettoyerSaisieClasseEtVar("dateMaxLimite", "#inpt-dateMaxLimite");
      //Not implemented on the 'gijgo datepicker': desactivating don't alter the event when click is done on the 'calendar' button
      $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", true );
      $('#div-inpt-dateMinLimite .input-group-append, #div-inpt-dateMaxLimite .input-group-append').removeClass("estMontre").addClass("estCache");
    }
    else{//Use cas: after having UNCHECKED the calling UI component
      //Not implemented on the 'gijgo datepicker': desactivating don't alter the event when click is done on the 'calendar' button
      $('#btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", false );

      if($("#icon-btn-tggl-DatePlusAncienne-Min-chkd").hasClass("estCache")){// si btn-tggl-DatePlusAncienne-Min est relevé
        //... (re)activating inpt-dateMinLimite
        $('#inpt-dateMinLimite').prop( "disabled", false );
        $('#div-inpt-dateMinLimite .input-group-append').removeClass("estCache").addClass("estMontre");
      }
      //if btn-tggl-DatePlusAncienne-Min is DOWN : don't (re)activate inpt-dateMinLimite
            
      if($("#icon-btn-tggl-DatePlusRecente-Max-chkd").hasClass("estCache")){// si btn-tggl-DatePlusRecente-Max est relevé
        //... (re)activating  inpt-dateMaxLimite
        $('#inpt-dateMaxLimite').prop( "disabled", false );
        $('#div-inpt-dateMaxLimite .input-group-append').removeClass("estCache").addClass("estMontre");
      }
      //if btn-tggl-DatePlusRecente-Max is DOWN : don't (re)activate inpt-dateMaxLimite
      
    }
  }
  else{
    $('#inpt-dateMinLimite, #inpt-dateMaxLimite, #btn-tggl-DatePlusAncienne-Min, #btn-tggl-DatePlusRecente-Max').prop( "disabled", true );
    $('#div-inpt-dateMinLimite .input-group-append, #div-inpt-dateMaxLimite .input-group-append').removeClass("estMontre").addClass("estCache");
  }
}


function onClick_btnTgglDateLimite(e)
{
  var aName = e.target.id.split("-");// Get string-part of the id attributed : get "Min" or "Max"
  if($('#inpt-date'+aName[3]+'Limite').hasClass("is-invalid") && (!$('#'+e.target.id).hasClass("active")) ){
    nettoyerSaisieClasseEtVar("", '#inpt-date'+aName[3]+'Limite');
  }
  
  setTimeout(function(){
    console.log("e = ",e);
    if( $('#'+e.target.id).hasClass("active") ){
      $("#icon-"+e.target.id+"-unchkd").removeClass("estMontre").addClass("estCache");
      $("#icon-"+e.target.id+"-chkd").removeClass("estCache").addClass("estMontre");
      // DESACTIVATING the date input and cleaning its value
      $('#inpt-date'+aName[3]+'Limite').val("");
      $('#inpt-date'+aName[3]+'Limite').prop( "disabled", true );
      $(' #div-inpt-date'+aName[3]+'Limite .input-group-append').removeClass("estMontre").addClass("estCache");
    }
    else{ 
      $("#icon-"+e.target.id+"-chkd").removeClass("estMontre").addClass("estCache");
      $("#icon-"+e.target.id+"-unchkd").removeClass("estCache").addClass("estMontre");
      // ACTIVATING the date input and cleaning its value
      $('#inpt-date'+aName[3]+'Limite').prop( "disabled", false );
      $('#div-inpt-date'+aName[3]+'Limite .input-group-append').removeClass("estCache").addClass("estMontre");
    }

    //Validator to activate or desactivate the btn-imprtrJD button
    if( ($("#btn-tggl-DatePlusAncienne-Min").hasClass("active") || $('#inpt-dateMinLimite').val()!="") && // if dateMin is not empty or btn-tggl-DatePlusAncienne-Min is DOWN
      ($("#btn-tggl-DatePlusRecente-Max").hasClass("active") || $('#inpt-dateMaxLimite').val()!="")// if dateMax is not empty or btn-tggl-DatePlusRecente-Max is DOWN
    ){
      $("#btn-imprtrJD").prop("disabled",false);
    }

  },200);
}


function onChange_enregistrerModeleFichierCSV(event)
{
  //Remove all special chars (space included) : expected result will be different from the negatived regex pattern.
  $("#inpt-modeleFichierCSV").val($("#inpt-modeleFichierCSV").val().replace(/[^0-9a-zA-Z\-]+/g,""))
  
  var s = $("#inpt-modeleFichierCSV").val();
  // Replace "-", search for it consecutively repeated ("+-" regex pattern) and several times ("g" regex pattern) ( eg: "Ipsum----Lorum-Ipsum-Lorum" must result to "Ipsum-Lorum-Ipsum-Lorum" )
  $("#inpt-modeleFichierCSV").val( s.replace(/-+/gi,"-") );
  var errorValiderMotifsModelFichierCSV = validerMotifsModelFichierCSV($("#inpt-modeleFichierCSV").val());
  if(errorValiderMotifsModelFichierCSV.errNo==0 ){ // Use case : no syntax error
    $("#btn-gnrrFchr").prop( "disabled", false );// activating button
    $("#btn-gnrrFchr").removeClass("is-invalid");// making VALID the input component
    $("#div-errorMsg-btn-enregModelFich").removeClass("estMontre").addClass("estCache");// HIDING the message
  }
  else{// if(errorValiderMotifsModelFichierCSV.errNo<0) // Use case : one or more syntax error
    $("#btn-gnrrFchr").addClass("is-invalid");// making INVALID the input component
    $("#div-errorMsg-btn-enregModelFich").removeClass("estCache").addClass("estMontre");// SHOWING the message
    switch(errorValiderMotifsModelFichierCSV.errNo)
    {
      case -1:
        $("#div-errorMsg-btn-enregModelFich").html("These keywords don't match with the PERMITTED KEYWORDS : "+errorValiderMotifsModelFichierCSV.errStr)
      break;
      case -2:
        if($("#div-errorMsg-btn-enregModelFich").html("Theses words was typed SEVERAL TIMES : "+errorValiderMotifsModelFichierCSV.errStr))
      break;
    }
  }
}


/**
* @param  {number} _type Expected values are : 0=>CTA annuler ; 1=>CTA enregistrer ; 2=>check pour activation/désactivation d'UI
 */
async function actionModeleFichierCSV(_type)
{
  switch(_type){
    case 0:// use case : clearing the input's content
      $("#inpt-modeleFichierCSV").val("");
    break;

    case 1:// use case : save input's content
      if(! $("#btn-gnrrFchr").hasClass("is-invalid")){
        //Saving the filename pattern : send the value of inpt-modeleFichierCSV
        var result = await ajaxSetModeleFichierCSV( {key: "modeleFichierCsv", val: $("#inpt-modeleFichierCSV").val()} );
        if(result){
          $("#icon-enregModelFich-fait").removeClass("estCache").addClass("estMontre");//Show the "done" icon 
          $("#icon-enregModelFich-erreur").removeClass("estMontre").addClass("estCache");//Hide the "error" icon
          $("#div-errorMsg-btn-enregModelFich").removeClass("estMontre").addClass("estCache");//Hide the "error" message
        }
        else{
          $("#icon-enregModelFich-erreur").removeClass("estCache").addClass("estMontre");//Show the "error" icon
          $("#icon-enregModelFich-fait").removeClass("estMontre").addClass("estCache");//Hide the "done" icon
          $("#div-errorMsg-btn-enregModelFich").removeClass("estCache").addClass("estMontre");//Show the "error" message
          $("#div-errorMsg-btn-enregModelFich").html("L'enregistrement a échoué !")
        }
      }
    break;
  }
}

function lancerGenererCSV()
{
  getAjaxFunction("text", "http://localhost:3000/ajax/v1.7/generer")
  .then( (result)=>{
    console.log(" result = ", result);
    
    if(result==-1)
      console.log("errno = -1");
    else if(result==-2){
      console.log("errno = -2");
      // Use case : trying to create a file FAILS because...
      // 1) a file exists already with the same filename 2) the allocated disk space is satured
      afficherModalEtat(
        2,
        "Unable to generate the file",
        "fa-exclamation-triangle",
        "One file has already the same name, or disk space is satured ! Change the filename pattern and retry.<BR>These keywords are advised : <kbd>dateFr</kbd>, <kbd>dateUs</kbd>,<kbd>horaire</kbd>.",
        true, 
        false,
        "Close",
      );
      //failing => show a modal to explain the problem, and a way to resolve it (server issue)
    }
    else{
      // Use case : trying to create a file IS A SUCCESS !
      afficherModalEtat(
        4,
        "File is well generated",
        "fa-check",
        "The CSV file is now available on the top of the page named <em>\"Download the generated CSV & get history of files\"</em>.<BR>\
          Later, when you'll generate a new file, the first file will be available (and downloadable) in the the <em>history</em>.<BR>\
          <BR>\
          Do you want to download the file ?",
        true, 
        true,
        "Yes, go to this page",
        "Not now"
      );
    // Stopping the spinner component
    }
  }); 
}

/**
 * A feature to type automaticaly keywords on the "inpt-modeleFichierCSV" input by simple clicks
 * @param {Event} event
 */
function addTag(event){
  $("#inpt-modeleFichierCSV").val( $("#inpt-modeleFichierCSV").val() + event.target.innerText);
}

/**
 * @param {Boolean} _intentionCTA Expected values are : false=>en cours d'arrêt ; true=>en cours de lancement
 * @param {Boolean} _etatEchec
 * @param {number} _errno
 */
function toggleEtatsUIBtnsImporter(_intentionCTA, _etatEchec=false, _errno=0){
  // Modfier l'état des UIs:
  if(_intentionCTA){
    $("#p-subTitle-btn-imprtrJD").text( "On progress..." );
    $("#spinner-btn-imprtrJD, #p-subTitle-btn-imprtrJD").removeClass("estCache").addClass("estMontre");
    $("#btn-imprtrJD").prop( "disabled", true );
  }
  else{
    var msg = "<span class='text-success'>Success !</span> <i class='fa fa-check text-success'></i>";
    if(_etatEchec)
    {
      switch(_errno){
        case -1:
          msg = "<span class='text-danger'>Failure ! <i class='fas fa-exclamation-circle text-danger'></i><BR>"+
          "- There is some inconsistency on the retrieved dataset from Firebase Database : check the source data on the Firebase Database console.<BR>"+
          "OR<BR>"+
          "- The maximum server response time is exceeded !</span>";
        break;
        case -2:
          msg = "<span class='text-danger'>Failure ! <i class='fas fa-exclamation-circle text-danger'></i><BR>The Firebase Database is inaccessible!</span>";
      }
    }
  
    $("#p-subTitle-btn-imprtrJD").html( msg );
    $("#spinner-btn-imprtrJD").removeClass("estMontre").addClass("estCache");// Masquer le message de l'autre alternative du bouton d'importation
    $("#btn-imprtrJD").prop( "disabled", false );
  }
}



//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// MESSAGES MODALS FEATURES //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function ctaValiderModalEtatsTrt()
{
  navGoTo('/telecharger');
  fermerModal();
}



///////////////////////////////////////////////////////////////////////////////////
////////////////////////////// COMPONENT UI FEATURES //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/**
 * On EJS : unfold the sections (Bootstrap functions don't implement this feature)
 */
function initUICollapse()
{
  // Unfold all sections
  $("#btn-collapseUn-chevron").addClass("animate-collapseUI-deplier");
  $("#btn-collapseDeux-chevron").addClass("animate-collapseUI-deplier");
  
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
    maxDate: today
  });

  $('#inpt-dateMaxLimite').datepicker({
    locale:"fr-fr",
    uiLibrary: 'bootstrap4',
    autoclose: true,
    format: "dd-mm-yyyy",
    immediateUpdates: true,
    todayBtn: true,
    todayHighlight: true,
    maxDate: today
   });

}

/**
 * Initializing visibility and selecting of page's components
 * @param  {Boolean} _appGetMockData     [description]
 * @param  {Object} _oSessionVars       [description]
 * @param  {Boolean} _booAccessFbDbState [description]
 */
function initUIComponentsOfPage(_appGetMockData, _oSessionVars, _booAccessFbDbState ){
  
  //////////// Feature : minimum/start date and end/maximum date of the range date to import dataset

  if(_booAccessFbDbState || _appGetMockData){
    $('#cbToutesDonnees').attr('checked', true);
    onClick_cbToutesDonnees(null, true);
  }
  else{
    $('#cbToutesDonnees').attr('checked', true).prop( "disabled", true );
    onClick_cbToutesDonnees(null, true);
  }
  
  //////////// Feature : badges showing the Firebase Database availability
  
  if(!_appGetMockData && _booAccessFbDbState){
    $("#accessFbDbStateSuccess").removeClass("estCache").addClass("estMontre"); 
    $("#accessFbDbStateFailed").removeClass("estMontre").addClass("estCache");
  }else if(!_appGetMockData && !_booAccessFbDbState){
    $("#accessFbDbStateFailed").removeClass("estCache").addClass("estMontre"); 
    $("#accessFbDbStateSuccess").removeClass("estMontre").addClass("estCache"); 
  }
  else{// if(_appGetMockData)
    $("#infoMockData").removeClass("estCache").addClass("estMontre");
  }

  //////////// Feature : filename pattern components section
  
  if(_oSessionVars==false){// Use case : server retriving error
    //    $("#btn-gnrrFchr").prop( "disabled", true );
  }
  if(_oSessionVars.data==""){//No dataset was retrieved, or imported dataset was empty
    //  $("#btn-gnrrFchr").prop( "disabled", true );
  }  
  if(_oSessionVars.modeleFichierCsv!="")// If filename pattern is not yet saved
    $("#inpt-modeleFichierCSV").val( _oSessionVars.modeleFichierCsv );
  else
    $("#btn-gnrrFchr").prop( "disabled", true );
}

/**
 * Filling the UIS : either at page initialization, or when importing a dataset
 * @param  {Object} oResults
 */
function peuplerUIsJeuDonnees(oResults){
  if(oResults.data!=undefined && oResults.metadata!=undefined)
    console.log(" oResults.data.length = "+ oResults.data.length + "; \n oResults.metadata = "+ JSON.stringify(oResults.metadata) );
 
  if(oResults.data!=""){
    oResults.data = addCarriageReturnToStringLine( JSON.stringify(oResults.data), "},{", 2 );

    $('#legend-fieldset-jeuDonnees').removeClass("estGrise");

    $('#div-content-codeJeuDonnees').text(oResults.data);
    $('#pre-wrapper-codeJeuDonnees').removeClass("estCache").addClass("estMontre");
    $('#icon-codeJeuDonnees').removeClass("estMontre").addClass("estCache");
      
    $('#metadonneesJeuDonnees-span-dateDebut').text(oResults.metadata.dateDebut);
    $('#metadonneesJeuDonnees-span-dateFin').text(oResults.metadata.dateFin);
    $('#metadonneesJeuDonnees-span-nbAU').text(oResults.metadata.nbActionsUtilisateurs);
    $('#metadonneesJeuDonnees-span-nbSU').text(oResults.metadata.nbSessionsUtilisateurs);

    //////////// Feature : filename pattern components section
    $('#btn-gnrrFchr').removeClass("estCache").addClass("estMontre");
  }
  else{
    $('#pre-wrapper-codeJeuDonnees').removeClass('estCache').addClass('estMontre');
    $('#icon-codeJeuDonnees').removeClass("estCache").addClass("estMontre");

    if($('#inpt-dateMaxLimite').val()=="" && $('#inpt-dateMinLimite').val()=="")
      $('#div-content-codeJeuDonnees').text("Aucune donnée récupérée");
    else
      $('#div-content-codeJeuDonnees').text("Aucune donnée pour la période demandée");
    
    //////////// Feature : filename pattern components section
    //$('#btn-gnrrFchr').prop( "disabled", true );
    $('#btn-gnrrFchr').removeClass("estMontre").addClass("estCache");
  }

  console.log("oResults.metadata.dateDebut = "+oResults.metadata.dateDebut);
  //////////// Feature : dataset's metadata components section
  if(oResults.metadata.dateDebut!="" && oResults.metadata.dateDebut!=undefined)
    $('#div-metadonneesJeuDonnees').removeClass("estCache").addClass("estMontre");
  else
    $('#div-metadonneesJeuDonnees').removeClass("estMontre").addClass("estCache");

  // Modfier l'état des UIs:
  toggleEtatsUIBtnsImporter(false)
}







init();
</script>
