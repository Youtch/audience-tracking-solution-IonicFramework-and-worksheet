// services/generer-csv-service.js
const configConstants = require('../config/config-constants');

module.exports = {
  miseEnFormeContenu:miseEnFormeContenu
}

/**
 * @Description formatter le contenu : ajout des séparateurs de champs et retour chariot ; ajout des libellés
 * @param _aJeuDonneesConcat:Array<?????Object??????>
 * @return string
 */
function miseEnFormeContenu(_aJeuDonneesConcat){
  let contenuFichier;
	// Ajouter le header du fichier CSV
  contenuFichier = configConstants.LIBELLES; // + "\n";
  
  // Ajouter chaque ligne de données :
  _aJeuDonneesConcat.forEach( (item)=>{
    contenuFichier = contenuFichier + item.key + ";" + item.date + ";" + item.sessionKey + ";" + item.statsSessionId + ";" + item.licenceEstPremium + ";" +  item.androidVersion + ";" + item.page + ";" + item.composantUI + ";" + 
//SUPPR A VALIDER
//    item.nbUiAidesOuverts + ";" + item.dureeSession + ";" + item.nombrePagesVisitees + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" + item.cheminNavigation +
    item.cheminNavigation + ";" + item.nombreCmpsCmpsntUINonDstnctVisites + ";" + item.nombrePagesVisitees + ";" + item.nbUiAidesOuverts +
    "\r\n" ;
    //+ "\n";
    // concatenner champs1 + ";" +champ2 + (champ n) + ligne+"\n"
  });
	// console.log("////////////////////////////////\ngenererFichierCSV =>"+JSON.stringify(contenuFichier) );
	return contenuFichier;
}