// services/generer-csv-service.js
const configConstants = require('../config/config-constants');

module.exports = {
  miseEnFormeContenu:miseEnFormeContenu
}

/**
 * @Description formatter le contenu : ajout des séparateurs de champs et retour chariot ; ajout des libellés
 * @param _aJeuDonneesConcat:Array<?????Object??????>
 * @param _activRechercherFunnels:Boolean
 * @return string
 */
function miseEnFormeContenu(_aJeuDonneesConcat, _activRechercherFunnels){
  let contenuFichier;
  if(_activRechercherFunnels){
  	// Ajouter le header du fichier CSV
    contenuFichier = configConstants.LIBELLES_AVEC_FUNNELS; // + "\n";
    
    // Ajouter chaque ligne de données :
    _aJeuDonneesConcat.forEach( (item)=>{
      contenuFichier = contenuFichier + item.key + ";" + item.date + ";" + item.sessionKey + ";" + item.statsSessionId + ";" + item.licenceEstPremium + ";" +  item.androidVersion + ";" + item.page + ";" + item.composantUI + ";" + 
        item.cheminNavigation + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" + item.nombrePagesVisitees + ";" + item.nbUiAidesOuverts + ";" + item.listeFunnels + 
        "\r\n" ;
    });
  }
  else{
  	// Ajouter le header du fichier CSV
    contenuFichier = configConstants.LIBELLES_SANS_FUNNELS; // + "\n";
    
    // Ajouter chaque ligne de données :
    _aJeuDonneesConcat.forEach( (item)=>{
      contenuFichier = contenuFichier + item.key + ";" + item.date + ";" + item.sessionKey + ";" + item.statsSessionId + ";" + item.licenceEstPremium + ";" +  item.androidVersion + ";" + item.page + ";" + item.composantUI + ";" + 
//SUPPR A VALIDER
//    item.nbUiAidesOuverts + ";" + item.dureeSession + ";" + item.nombrePagesVisitees + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" + item.cheminNavigation +
      item.cheminNavigation + item.nbUiAidesOuverts + ";" + item.nombrePagesVisitees + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" +
      "\r\n" ;
      //+ "\n";
      // concatenner champs1 + ";" +champ2 + (champ n) + ligne+"\n"
    });
  }
	// console.log("////////////////////////////////\ngenererFichierCSV =>"+JSON.stringify(contenuFichier) );
	return contenuFichier;
}