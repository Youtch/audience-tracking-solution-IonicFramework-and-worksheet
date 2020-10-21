<!-- views/scripts/telecharger.js
  Dépendances
    header-loader.js
      ::initHeadersUIs
      ::getAccessFbDbState
      ::getSessionCSVFileExists
    utils-ajax.js
      ::getAjaxFunction
-->
<script>
function init()
{
  setTimeout( ()=>{
    activerHeaderMenuBtn(2);// Surligner le bouton de menu activé
  },50);

  // getFichiersInfos();
  getAccessFbDbState().then( booAccessFbDbState=>{
    console.log("checkConfigurationUIs(booAccessFbDbState) :: booAccessFbDbState = ",booAccessFbDbState);
    initHeadersUIs(booAccessFbDbState, "booAccessFbDbState");
  })
  getSessionCSVFileExists().then( booSessionCSVFileExists=>{
    console.log("checkConfigurationUIs(booSessionCSVFileExists) :: booSessionCSVFileExists = ",booSessionCSVFileExists);
    initHeadersUIs(booSessionCSVFileExists, "booSessionCSVFileExists");

    /* Solution A:  complexité coté client :
    if(booSessionCSVFileExists){
      // Fichier en tête : Utiliser données de get_dernierJeuDeDonneesCsv
      // Fichier de l'historique :  Utiliser données de get_fichiersGeneres
    }else{
      //////// NOK 
      ///////   Fichier en tête : Utiliser la dernierer donnée de : get_fichiersGeneres
      ///////   Fichier de l'historique :  Utiliser données, sauf la dernière, de get_fichiersGeneres
      // Fichier en tête : Utiliser données de get_dernierJeuDeDonneesCsv
      // Fichier de l'historique :  Utiliser données de get_fichiersGeneres
    }*/
  });
  // Solution B : complexité coté serveur
  getFichierMetadata();
  
}

/** Récupérer les metadatas : du dernier fichier généré et des fichiers de l'historique*/
function getFichierMetadata()
{
  getAjaxFunction("json", "http://localhost:3000/ajax/v1.7/telecharger/?getFichierMetadata=true" )
    .then( (metadata)=>{
      /*
      if(oResults<0){ // Cas d'erreur sur le serveur : alors "getAjaxFunction" renvoie un numéro d'erreur
        return false; //Fin
      }*/
      peuplerUIDernierFichier( metadata.dernierJeuDeDonneesCsv );
      peuplerUIHistorique( metadata.fichiersGeneres );
      dernierFichier_nom = metadata.dernierJeuDeDonneesCsv.nom;
      console.log("dernierFichier_nom = "+dernierFichier_nom +" ; metadata = ",metadata);
    }/*,
    (error)=>{ //TODO : Si la requête au serveur Firebase échoue 
      console("#1 erreur = ",error);
      // TODO : afficher une modal signalant l'erreur du serveur
    }*/);
  //}
}



///////////////////// Gestion évènementielle /////////////////////
var dernierFichier_nom;
/**
 * [lancerTelechargement description]
 * @param  _nomFichier:string|undefined
 * @return void
 */
function lancerTelechargement(_nomFichier)
{

	var link = document.createElement("a");
  if(_nomFichier==undefined)
    _nomFichier = dernierFichier_nom;//Utilisation d'info récupéré lors de l'init de page
  link.download = _nomFichier;
	console.log("lancerTelechargement de '"+"http://localhost:3000/getCsv/?nomFichier="+_nomFichier+"'");
    link.href = "http://localhost:3000/getCsv/?nomFichier="+_nomFichier;
    link.click();
}



////////////////////////////// METHODE MODIFIANT LES UIS //////////////////////////////
function peuplerUIDernierFichier( _data )
{
  if(_data!=undefined){
    $("#btn-downloadDernierFichierCsv").html( '<i class="fas fa-download"></i>&nbsp;'+_data.nom);
    $("#h6-detail-downloadDernierFichierCsv").html( 
      "Fichier généré <b>lors de cette session</b> ("+_data.dateCreation+")<BR>"+
      "<b>Poids : </b> "+_data.poids+"<BR>"+
      "Première donnée <span class='badge badge-info badge-pill'>"+_data.dateDebutJeuDonnees+"</span><BR>"+
      "Dernière donnée <span class='badge badge-info badge-pill'>"+_data.dateFinJeuDonnees+"</span><BR>"+
      "Nombre d'actions d'utilisateurs <span class='badge badge-info badge-pill'>"+_data.nombreActionsUtilisateurs+"</span><BR>"+
      "Nombre de sessions d'utilisateurs <span class='badge badge-info badge-pill'>"+_data.nombreSessionsUtilisateurs+"</span><BR>"
       );
    $("#div-dernierFichier-estVide").removeClass("estMontre").addClass("estCache");
    $("#div-dernierFichier-nonVide").removeClass("estCache").addClass("estMontre");
  }
}

function peuplerUIHistorique( _filesData )
{
  if(_filesData!=undefined){
    _filesData.reverse();//Trier par date décroissant
    _filesData.forEach( data=>{
      $("#ul-listFichier-nonVide").append( 
        '<li class="historiqueFichier-li d-flex flex-row">'+
        '  <div class="pr-4"><!-- pr-4 => padding right de taille #4 CF https://getbootstrap.com/docs/4.4/utilities/spacing/-->'+
        '    <button type="button" class="btn btn-primary p-4" onclick="lancerTelechargement(\''+data.nom+'\')"><i class="fas fa-download"></i></button>'+
        '  </div>'+
        '  <div class="pr-4">'+
        '  '+data.nom+'<BR>'+
        '  Généré le '+data.dateCreation+'<BR>'+
        '  '+data.poids+
        '  </div>'+
        '  <div>'+
        '    Première donnée <span class="badge badge-info badge-pill">'+data.dateDebutJeuDonnees+'</span><BR>'+
        '    Dernière donnée <span class="badge badge-info badge-pill">'+data.dateFinJeuDonnees+'</span><BR>'+
        '    Nombre d\'actions d\'utilisateurs <span class="badge badge-info badge-pill">'+data.nombreActionsUtilisateurs+'</span><BR>'+
        '    Nombre de sessions d\'utilisateurs <span class="badge badge-info badge-pill">'+data.nombreSessionsUtilisateurs+'</span><BR>'+
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