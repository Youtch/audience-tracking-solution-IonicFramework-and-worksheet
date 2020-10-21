'use strict'

var fs = require('fs');
var path = require('path');
const DateOperationsService = require('./date-operations-service.js')
var dotenv = require('dotenv').config();
const configConstants = require('../config/config-constants');
const utilsService = require('./utils-service');

/////////// Exporter les fonctions publiques
module.exports = {
  // init:init, // émulation du constructor() d'une architecture de code POO
  creerFichier : creerFichier,
  supprimerFichier : supprimerFichier,
  getInfosFichier : getInfosFichier,
  getInfosDossierCSV : getInfosDossierCSV,
  getContenuDossierCSV : getContenuDossierCSV,
  //telechargerFichier : telechargerFichier, // UTILE ?
};

// console.log("__dirname = "+__dirname);
// console.log(" process.env.DIR_FICHIERS_CSV = "+process.env.DIR_FICHIERS_CSV);
var UPLOAD_PATH = path.resolve(__dirname, "..", process.env.DIR_FICHIERS_CSV)
//var UPLOAD_PATH = path.resolve(__dirname, "..\\assets\\fichiers_generes");

function init(){
  // Créer le dossier dédié si il n'existe pas
  !fs.existsSync(this.uploadPath) && mkdirp.sync(this.uploadPath);
}

// (TODO P1 + : accéder au dossier UPLOAD_PATH avant d'écrire !)
// TODO P2 +++ : si besoin de fonction asynchrone, essayer la structure de promise async-await 
//	cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_fs_promises_api
//  dont exemple : https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_filehandle_truncate_len
function creerFichier(_fileName, _donneesTextuelles){
  // Options du mode d'écriture  (= File System Flags) cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_file_system_flags)
  //  w = Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
  //  wx = Like 'w' but fails if the path exists.
  console.log("_fileName = ",_fileName);
  return new Promise(resolve => {
  	try{
      fs.writeFile(UPLOAD_PATH + configConstants.DIR_SEPARATEUR + _fileName, _donneesTextuelles, {encoding:"utf8", flag:"wx"}, (err) => {
  	    // ou fs.writeFileSync ... pour attendre un résultat
  	    // TOTEST : erreur de nom de fichier par ex => renvoyer une resolve(false) => par throw, ou try catch ?
        if(err){
          console.log("creerFichier err#1 = ",err)
          resolve(false)  
        };
  	    console.log("/////////////\n"+
     	      "Fichier écrit s'il n'existe pas déjà !");
        resolve(true);
      });
    }
    catch(err){
      // DEV
      console.log("creerFichier err#3 = ",err);
      resolve(false);
    }
	});
}


function supprimerFichier(_fileName){
  try{
    fs.unlink(UPLOAD_PATH + configConstants.DIR_SEPARATEUR + _fileName, (err) => {
      if (err) throw err;
      console.log("successfully deleted "+UPLOAD_PATH + "/"+ _fileName);
    });
  }
  catch(err){
  	console.error("err = "+err);
  }   
}

// open file constants : cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_file_open_constants
// TODO : tester avec chemin absolu : trim des caractères non voulus
/**
 * @param  _fileName:string
 * @return {nom:string, poidsHuman:string, creaDateHoraireHuman:string, creaDateHoraireEpoch:string???}
 */
function getInfosFichier(_fileName){
  return new Promise(resolve => {
    fs.stat(UPLOAD_PATH + configConstants.DIR_SEPARATEUR + _fileName, (err, stat) => {
  	  if (err) throw err;
  	  // use stat
  	  // DEV : cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_class_fs_stats
  //  console.log("/////////////\n"+
  //  	"stat du fichier '"+_fileName+"'' => size = "+stat.size+" o ; humanReadable date-horaire de creation = "+stat.birthtime+" ; Epoch date-horaire de creation = "+stat.birthtimeMs );
  	  //console.log("\n... total = "+JSON.stringify(stat) );
  	  var dateStatCreation = new Date(stat.birthtimeMs);
  	  var dateService = new DateOperationsService();
      //console.log("poids = "+ stat.size+ " ; creaDateHoraireEpoch = " + stat.birthtimeMs +" ; creaDateHoraireHuman = "+ dateService.getDateToShortHumanText_i18n(dateStatCreation, true, true, true, false, true, 1, true) );
      const poids = utilsService.getHumanReadableFileSize(stat.size);
      var data = {
          nom: _fileName,
          poidsHuman: poids.poidsHR+" "+poids.uniteHR, // // TODO : convertir à l'unité la plus pertinente
          creaDateHoraireHuman: (dateService.getDateToShortHumanText_i18n(dateStatCreation, true, true, true, false, true, 1, true)).toLowerCase(),
          creaDateHoraireEpoch: stat.birthtimeMs
          // TODO : 
          //1) sélectionner les données utiles selon le modèle de données !
          //2) récupérer une partie de données dans le stockage persistant : cf model/persistant-data-modele.js
      };
      resolve(data);
    });
  });
}

// NOK : function getInfosDossierCSV(_dir = UPLOAD_PATH){
function getInfosDossierCSV(_dir = UPLOAD_PATH){
  fs.stat(_dir, (err, stat) => {
   
   if (err) throw err;
   // use stat
   // DEV : cf https://nodejs.org/docs/latest-v10.x/api/fs.html#fs_class_fs_stats
   // console.log("stat du dossier '"+_dir+"'' => size = "+stat.size+" o ; humanReadable date-horaire de creation = "+stat.birthtime+" ; Epoch date-horaire de creation = "+stat.birthtimeMs );
   // console.log("\n... total = "+JSON.stringify(stat) );
   console.log("/////////////\n"+
   	 "stat du dossier '"+_dir+"'' => humanReadable date-horaire de creation = "+stat.birthtime+" ; Epoch date-horaire de creation = "+stat.birthtimeMs
   );
   return Promise.resolve({
     creaDateHoraireHuman: stat.birthtime,
     creaDateHoraireEpoch: stat.birthtimeMs,
   });

  });
}

function getContenuDossierCSV(_dir = UPLOAD_PATH){
  // R&D : pour plus d'infos au sujets du contenu du dossiers : 
    // demander (via l'option "{encoding:utf8, withFileTypes:true} ) un array d'élément de classe "fs.Dirent" (donne ces infos : isFile, isDirectory, isSymbolicLink, name)
  //fs.readdir( _dir, {encoding:"utf8", withFileTypes:true}, (err, files) => {
  var aFiles = []; 
  return new Promise(resolve => {
    fs.readdir( _dir, (err, files) => {

      if (err) throw err;
      //console.log("Contenu du dossier \""+_dir+"\" = "+JSON.stringify(files)+ " ; typeof files = "+typeof files ); // typeof files => Objets
      
      var strFilesNames = JSON.stringify(files);
      var aFilesNames = [];
      strFilesNames = strFilesNames.replace(/"|\[|\]/g,"");// remplacer " ou [ ou ] en plusieurs itérations
      aFilesNames = strFilesNames.split(",");
      aFilesNames = aFilesNames.sort();// Trier alphabétiquement
      // MOCK : 
      /*resolve ( [
        { poids: "453ko", creaDateHoraireHuman: "2020-03-30T14_50_54_648", fileName: "2020-2-25-14-31-20.csv"},
        { poids: "321ko", creaDateHoraireHuman: "2020-03-30T15_54_54_648", fileName: "2020-3-2-12-52-42.csv"},
        { poids: "210ko", creaDateHoraireHuman: "2020-03-30T16_33_54_648", fileName: "2020-2-18-13-3-31_janvTotal-fevPartiel.csv"}
      ] );*/
      // PROD
      var aFiles = []; 
      Promise.each(aFilesNames, function(fileName, index, arrayLength) {
        return fs.stat( UPLOAD_PATH + configConstants.DIR_SEPARATEUR + fileName, (err, fc)=> {
          // console.log(index+": "+JSON.stringify(fc) );
          var dateStatCreation = new Date(fc.birthtimeMs);
          var dateService = new DateOperationsService();
          aFiles.push({
            nom: fileName,
            poidsHuman: fc.size+" o",// TODO : convertir à l'unité la plus pertinente
            creaDateHoraireHuman: (dateService.getDateToShortHumanText_i18n(dateStatCreation, true, true, true, false, true, 1, true)).toLowerCase(),
            creaDateHoraireEpoch: fc.birthtimeMs
            // TODO : 
            //1) sélectionner les données utiles selon le modèle de données !
            //2) récupérer une partie de données dans le stockage persistant : cf model/persistant-data-modele.js
          });
          if(aFiles.length == arrayLength){
            //console.log("aFiles = "+JSON.stringify(aFiles) );
            resolve(aFiles);
          }
        },(err)=>{
          console.log("erreur fs.readFile = ",err );
        });
      /* NOK : la fin de boucle n'est pas attendu ici
      }).then(function(result) { // Finalement:
        console.log( " Final post promise.each : aFiles = "+ JSON.stringify(aFiles) );
        console.log( " result =  "+ JSON.stringify(result) );
        resolve(aFiles);
      });*/
      });

    });
  })
}

// TODO :
// Ajouter une méthode : resetLocalStorageFileInfos()
// Utile dans le cas d'une migration du serveur et de ses fichiers CSV historiques. Qui permet de réinitialiser le localstorage selon les infos des fichiers
// - implémenter récupération de 2 valeurs : nombre de sessions d'utilisateurs, nombre des actions d'utilisateurs