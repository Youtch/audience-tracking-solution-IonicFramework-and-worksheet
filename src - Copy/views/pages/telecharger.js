<!-- views/scripts/telecharger.js
  Dépendances
    header-loader.js
      ::initHeadersBadges
      ::overliningActualMenuButton
      ::getAccessFbDbState
      ::getSessionCSVFileExists
    utils-ajax.js
      ::getAjaxFunction
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
    overliningActualMenuButton(2);
  },50);

  getAccessFbDbState().then( booAccessFbDbState=>{
    console.log("checkConfigurationUIs(booAccessFbDbState) :: booAccessFbDbState = ",booAccessFbDbState);
    initHeadersBadges(booAccessFbDbState, "booAccessFbDbState");
  })
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    console.log("checkConfigurationUIs(booSessionCSVFileExists) :: booSessionCSVFileExists = ",booSessionCSVFileExists);
    initHeadersBadges(booSessionCSVFileExists, "booSessionCSVFileExists");
    getFichierMetadata(booSessionCSVFileExists);
  });

}

/**
 * Get metadata : from the last generated file, from all of the previous generated files (=history of files)
 * @param  {Boolean} _booSessionCSVFileExists             
 */
function getFichierMetadata(_booSessionCSVFileExists)
{
  getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/telecharger/?getFichierMetadata=true" )
    .then( (metadata)=>{
      console.log("metadata = ",metadata);
      if(_booSessionCSVFileExists){
        peuplerUIDernierFichier( metadata.dernierJeuDeDonneesCsv );
        dernierFichier_nom = metadata.dernierJeuDeDonneesCsv.nom;
      }
      peuplerUIHistorique( metadata.fichiersGeneres );
    });
}


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// USER'S EVENTS HANDLERS //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
/**
 * @type {string}
 */
let dernierFichier_nom;

/**
 * [lancerTelechargement description]
 * @param  _nomFichier:string|undefined
 */
function lancerTelechargement(_nomFichier)
{
  // Creating a new element in the DOM, to define a temporary hidden-for-user auto-clicked link by programming.
	let link = document.createElement("a");
  if(_nomFichier==undefined)
    _nomFichier = dernierFichier_nom;
  link.download = _nomFichier;
	
  link.href = "http://localhost:3000/getCsv/?nomFichier="+_nomFichier;
  link.click();
}

/////////////////////////////////////////////////////////////////////////
////////////////////////////// UI FEATURES //////////////////////////////
/////////////////////////////////////////////////////////////////////////
function peuplerUIDernierFichier( _data )
{
  if(_data.poids!=undefined){
    $("#btn-downloadDernierFichierCsv").html( '<i class="fas fa-download"></i>&nbsp;'+_data.nom);
    $("#h6-detail-downloadDernierFichierCsv").html( 
      "File generated <b>while this session</b> ("+_data.dateCreation+")<BR>"+
      "<b>Size : </b> "+_data.poids+"<BR>"+
      "First data <span class='badge badge-info badge-pill'>"+_data.dateDebutJeuDonnees+"</span><BR>"+
      "Last data <span class='badge badge-info badge-pill'>"+_data.dateFinJeuDonnees+"</span><BR>"+
      "Count of user's actions <span class='badge badge-info badge-pill'>"+_data.nombreActionsUtilisateurs+"</span><BR>"+
      "Count of user's sessions <span class='badge badge-info badge-pill'>"+_data.nombreSessionsUtilisateurs+"</span><BR>"
       );
    $("#div-dernierFichier-estVide").removeClass("estMontre").addClass("estCache");
    $("#div-dernierFichier-nonVide").removeClass("estCache").addClass("estMontre");
  }
}

function peuplerUIHistorique( _filesData )
{
  if(_filesData.length>0){
    _filesData.reverse();//Resulting : Sorting by date and descendant order
    _filesData.forEach( data=>{
      $("#ul-listFichier-nonVide").append( 
        '<li class="historiqueFichier-li d-flex flex-row">'+
        '  <div class="pr-4">'+
        '    <button type="button" class="btn btn-primary p-4" onclick="lancerTelechargement(\''+data.nom+'\')"><i class="fas fa-download"></i></button>'+
        '  </div>'+
        '  <div class="pr-4">'+
        '  '+data.nom+'<BR>'+
        '  Generated '+data.dateCreation+'<BR>'+
        '  '+data.poids+
        '  </div>'+
        '  <div>'+
        '    First data <span class="badge badge-info badge-pill">'+data.dateDebutJeuDonnees+'</span><BR>'+
        '    Last data <span class="badge badge-info badge-pill">'+data.dateFinJeuDonnees+'</span><BR>'+
        '    Count of user\'s actions <span class="badge badge-info badge-pill">'+data.nombreActionsUtilisateurs+'</span><BR>'+
        '    Count of user\'s sessions <span class="badge badge-info badge-pill">'+data.nombreSessionsUtilisateurs+'</span><BR>'+
        '  <div>'+
        '</li>'
      );
    });
    $("#div-listFichier-estVide").removeClass("estMontre").addClass("estCache");
    $("#ul-listFichier-nonVide").removeClass("estCache").addClass("estMontre");
  }
}



init();
</script>