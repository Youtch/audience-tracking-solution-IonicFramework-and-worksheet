<script>
/* views/partiels/bo/peupler-modale.ejs

  Gestion de la fenêtre modal d'affichage des états des traitements
    
    #fonctions évenementielles rattachés aux CTA des boutons de l'UI :
      modalEtatsTrts-btnValider => ctaValiderModalEtatsTrt(<numPageModalId>)
      modalEtatsTrts-btnAnnuler => ctaAnnulerModalEtatsTrt(<numPageModalId>)
 **/

///////////////////// Tests des fonctionnalité métiers / business object "peupler-modale" ///////////////////// 
// DEV TEST
var numPageModalId;// liés aux bouton CTA attendus

function testerAfficherModalEtat()
{
  afficherModalEtat(
    "Mon beau bateau, roi des bateau, que tu navige bien sur l'eau !",
    "fa-exclamation-triangle",
    "Le fichier est disponible tant qu'il n'est pas écrasé par un nouveau fichier, ce qui intervient quand un nouveau jeu de donnée est importé, puis qu'un fichier CSV est généré.", 
    true, 
    true,
    "Génialiser",
    "Anihiler"
  );
}

// Note pour DEV : méthode appelée par ce script, par Ajax ou par une fonction traditionnel synchrone
// Sol A) pas de découplement du code de description POUR NE PAS GERER une éventuelle l'icone/image d'illustration dans le contenu 
function afficherModalEtat(_numPageModalId, _titre, _iconeTitre, _contenuHtml, _btnValider, _btnAnnuler, _btnValiderLabel, _btnAnnulerLabel)
{ // _titre:string, _iconeTitre:string, _contenuHtml:string, _btnAnnuler:boolean, _btnValider:boolean, _btnValiderLabel:string, _btnAnnulerLabel:string
  //alert( _titre + "\n;" +  _iconeTitre + "\n;" +_contenuHtml + "\n;" +_btnValider + "\n;" +_btnAnnuler);
  
  /*$("#modalEtatsTrts").on("shown.bs.modal", function (_event) {
    alert("utile pour tester l'ouverture du modale (après fin de lecture du CSS dont la transition)");
  })
  // Déclencher l'écouteur d'event :	
  $("#modalEtatsTrts").on("hidden.bs.modal", function (_event) {
    alert("utile pour tester la fermeture du modale (après fin de lecture du CSS dont la transition)");
  })
  */
  // accessible depuis la page : désigne d'id de modal à utiliser, déclenchant la fonction d'event 
  //   (déclaré dans le script de page) lors du clique d'un bouton 
  numPageModalId = _numPageModalId;// modifiée la modal en cours d'utilisation
  
  // Montrer le modal
  $("#modalEtatsTrts").modal("show");

  // Définir les élémente du modal
  $("#modalEtatsTrts-titre").text( _titre );
  if(_iconeTitre!="")
  	$("#modalEtatsTrts-iconeTitre").attr("class", "fas "+ _iconeTitre ); // ou removeClass("fas").removeClass("estCache").addClass("fas "+ _iconeTitre)
  $("#modalEtatsTrts-contenu").html(_contenuHtml);

  if(_btnValider)
    $("#modalEtatsTrts-btnValider").removeClass("estCache");
  if(_btnAnnuler)
    $("#modalEtatsTrts-btnAnnuler").removeClass("estCache");

  if(_btnValiderLabel!="")
    $("#modalEtatsTrts-btnValider").text(_btnValiderLabel);
  if(_btnAnnulerLabel!="")
    $("#modalEtatsTrts-btnAnnuler").text(_btnAnnulerLabel);
}


function fermerModal(){
  $("#modalEtatsTrts").modal("hide");
}
</script>