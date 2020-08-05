//DEV var fsService = require('../services/fs-management-service');

/////////// Exporter les fonctions publiques
module.exports = {
  init : init, // émulation du constructor() d'une architecture de code POO
  getServeurFireBDisponibilite: getServeurFireBDisponibilite,
};

// Public
function init(req){
  initServerSession();
  //console.log("boolServeurFireBDisponibilite = "+boolServeurFireBDisponibilite);
  console.log("/// Preloading firebaseService.init ");
}

function initServerSession(){
  // TODO
}


// TODO : à affecter pour ou à transferer dans un module dédié firebase-service pour utiliser la structure singleton (accès depuis toutes les pages) = UX  rafraichissement de la valeur MOINS FREQUENTE 
function getServeurFireBDisponibilite(){
	// HOWTO ? cf https://firebase.google.com/docs/database/admin/retrieve-data
	/*var db = admin.database();
	var o=false;
	var ref = db.ref("server/saving-data/fireblog/posts");
	if(ref != undefined)
	o = true? 
	return Promise.resolve(o);
	*/
	//return Promise.resolve(false); // dev test
	return true; // dev test
}

// DEV : testé OK
/*
function testFileSystem(){
  //creerFichier("test1.csv", "-Lxl8pSPynGKnku9p4Ma\":{\"composantUI\":\"initApp\", \"date\":\"2020-1-4-11:53:21\", \"page\":\"app.component\", \"statsSessionId\":\"-Lxl8pSPynGKnku9p4Ma\"},");
  fsService.creerFichier("test1.csv", getTextData() );
  // TODO : insérer un Promise dans le callback de fsService.writeFile, pour attendre la fin avant d'enchainer d'autres actions fs
  setTimeout( ()=>{
    fsService.getInfosFichier("test1.csv");
    fsService.getInfosDossier();
    fsService.getContenuDossier();
  // fsService.supprimerFichier();
  },3000);
}*/