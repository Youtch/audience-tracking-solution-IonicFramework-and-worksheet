var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); // UTILE en parallèle avec ejs ?
var bodyParser = require('body-parser');// UTILE en parallèle avec ejs ?

// A) Sans controller : 
//var importerService = require('./services/importer');
// B) Avec controller :
var controller = require('./controller/controller');
var ajaxController = require('./controller/ajax-controller');
var app = express();

const configConstants = require('./config/config-constants');
const dataModel = require('./model/data-model');// pattern MVC
const firebaseService = require('./services/firebase-service');
const mockFirebaseService = require('./services/mock-firebase-service.js');
const DateUtilsService = require('./services/date-operations-service.js');

// view engine setup
app.set('views', __dirname + '/views');// indispensable avec structure de filesystème utilisant le dossier "src"
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/assets/favicon.ico'));
/* NOK : mais aucune erreur signalée par console
*/
app.use(logger('dev'));

/**
 * Requis pour formater la récupération, via http post body
 * - bodyParser.json : formatage de la réception
 * - limit : dimensionner body pour réception d'un jeu de données de taille conséquente
**/
app.use(bodyParser.json({limit: '50mb'}));

/** Dossier des images de l'UI **/
app.use(express.static(__dirname + '/assets/public'));
app.use(express.static(__dirname + '/assets/fichiers_generes'));


appDataInit();// Initialisation de gestion de données de l'appli
// ATTENTION : à faire AVANT la définition du routage !
// 
const dateUtilsService = new DateUtilsService();// instancier la classe "statique" dans une seule instance d'objet, transmise dans toute l'appli (= meilleure performance)

/* Sans controller : obligé de déclarer les méthodes dans cette partie du code, en déclarant un controller on peut isoler 
  - dans app.js : le routage
  - dans controller.js : l'appel au code qui est attaché à chaque page/template
function getRootPage(res){
  // NOK : erreur de serveur
  //importerService.init();

  res.render('pages/importer', {
      drinks: importerService.getDrinks(),
      tagline: importerService.getTagline()
  });
}*/
// Avec controller
function getRootPage(req, res){
  /* NOK : erreur de serveur
  importerService.init();*/
  controller.importerController(req, res);
}




///////////////////////////////////////////////////////////////////
//////////////// Routage vers les pages de l'appli ////////////////
///////////////////////////////////////////////////////////////////

app.get('/', function(req, res) {
  getRootPage(req, res);
});

app.get('/configurer', function(req, res) {
  // configurer l'appli
  controller.configurerController(req, res);
});

app.get('/importer', function(req, res) {
  // importer jeux de données sur Firebase DB, et generer un fichiers CSV
  getRootPage(req, res);
});

app.get('/telecharger', function(req, res) {
  // telecharger le fichier généré et afficher l'historique des fichiers CSV
  controller.telechargerController(req, res);
});


async function appDataInit()
{
  // TODO : le contenu de méthode à découpler d'app.js : dans ajaxController::appDataInit et dans ajaxCommun.appDataInit (aucun return)
  // 1) Démarrer le "model" (pattern MVC) de l'appli
  await dataModel.init(); 

  // 2) Tester la connexion à Firebase DB
  var oServ_reglagesApp = dataModel.get_reglagesApp();
  // console.log("oServ_reglagesApp.databaseUrl, oServ_reglagesApp.serviceAccount = " +oServ_reglagesApp.databaseUrl +", "+ oServ_reglagesApp.serviceAccount );
  var servFbDbEstDispo = await firebaseService.init( oServ_reglagesApp.databaseUrl, oServ_reglagesApp.serviceAccount);
  // console.log("servFbDbEstDispo = " +JSON.stringify(servFbDbEstDispo) );
  await dataModel.set_fbDbEstDispo(servFbDbEstDispo);
  return;
  // NOK : A présent firebaseService pourrait il être passé à CHAQUE routeur qui utilisera firebaseDB ? Soit importerPage, configurerPage?
  // ...puis initialiser dataModel = données globales et autres
}


///////////////// routage sous page telecharger : requête de téléchargement d'un fichier csv :
//Post data from the client
//Send the requested file back to the client
app.get("/getCsv", function (req, res){
    var f = req.query.nomFichier;
    console.log("debug chemin = ./" + process.env.URL_FICHIERS_CSV + f);
    res.download(  "./"+process.env.URL_FICHIERS_CSV + f);
});




//////////////// routages via le mécanisme ajax ////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
app.get('/ajax/v1.7/commun', function(req, res, next) {
  console.log("/ajax/v1.7/commun lancé !");
  // DEV 
  console.log("/ajax/v1.7/commun lancé ; req.query = "+JSON.stringify( req.query ));
  switch(req.query.t){
    case "getAccessFbDbState":
      accessFbDbState(req, res);
    break
    case "getSessionCSVFileExists":
      sessionCSVFileExists(req, res);
    /* autres cas à venir : dont get et set des variables globales */
  }
});
async function accessFbDbState(req, res){ // subtype:boolean (false=>"set"|true=>"get")
  try{
    var strServFbDbEstDispo = await ajaxController.getServeurFireBDisponibilite(firebaseService);
    // DEV 
    console.log("ajaxController.getServeurFireBDisponibilite caller :: strServFbDbEstDispo = "+ JSON.stringify(strServFbDbEstDispo) );
    res.writeHead(200, {"Content-Type": "application/text"});
    res.write( strServFbDbEstDispo ); 
    res.end();
  }
  catch(err){
    console.log("accessFbDbState::erreur : ",err);
  }
};
async function sessionCSVFileExists(req, res){ // subtype:boolean (false=>"set"|true=>"get")
  try{
    var strSessionCSVFileExists = await ajaxController.getSessionCSVFileExists();
    // DEV 
    console.log("ajaxController.getSessionCSVFileExists caller :: strSessionCSVFileExists = "+ JSON.stringify(strSessionCSVFileExists) );
    res.writeHead(200, {"Content-Type": "application/text"});
    res.write( strSessionCSVFileExists ); 
    res.end();
  }
  catch(err){
    console.log("accessFbDbState::erreur : ",err);
  }
};


app.get('/ajax/v1.7/configurer', function(req, res, next) {
  // DEV 
  //console.log("/ajax/v1.7/getConfiguration lancé ; req = "+JSON.stringify( req.query ));
  configurer(req, res);
});
async function configurer(req, res){
  try{
    if(req.query.setConfiguration==undefined){ // TOTEST
      strJsonResult = await ajaxController.getConfiguration();
      // DEV 
      //console.log("ajaxController.getConfiguration caller :: strJsonResult = "+ JSON.stringify(strJsonResult) );
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write( strJsonResult ); 
    }
    // condition vérifiant querystring :
    //else if(req.query.setConfiguration==true && req.query.databaseUrl!=undefined && req.query.serviceAccount!=undefined) { 
    // condition pas sécurisée :
    else{
      strNumResult = await ajaxController.setConfiguration(req);
      // DEV 
      //console.log("ajaxController.setConfiguration caller :: strNumResult = "+ JSON.stringify(strNumResult) );
      res.writeHead(200, {"Content-Type": "application/text"});
      res.write( strNumResult ); 
    }
    res.end();
    //console.log( " ajaxController.lancerImportationJeuDonnees(req) = "+ajaxController.lancerImportationJeuDonnees(req));
  }
  catch(err){
    console.log("configurer::erreur : ",err);
  }
};


//DEV TEST dans configurer
/*
app.get('/ajax/v1.7/gererStockageDonnees', function(req, res, next) {
  //TESTE OK : testImporterViaAjax(req, res, next);
  //console.log("gererStockageDonnees  lancé ; req = "+JSON.stringify( req.query ));
  // Erreur : parfois sur alert de JS : retourne erreur 500, parfois aucun retour
  ajaxController.gererStockageDonnees(req, dataModel).then( (result)=>{ // Passage de dataModel pour éviter de redéclarer dataModel dans un autre fichier : utilisation du pattern singleton.
    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    res.write( result );
    res.end();
  });
  //console.log( " ajaxController.lancerImportationJeuDonnees(req) = "+ajaxController.lancerImportationJeuDonnees(req));
  // TODO : vers le gestionnaire ajax => ajaxController.<methode>(req, res, next); , 
  // Schéma méthode ajax redistribue vers méthodes privées selon les attribus : lancerImport , getStatsJeuDonnees, ...
  //
});*/


/* R&D test :
app.post('/ajax/v1.7/RdHTTPPost', function(req, res, next) {
  if(req.query.setDataTest=="true"){
    var aJeuDonneesConcat = req.body.data;
    console.log("/ajax/v1.7/RdHTTPPost:: req.body  = ", req.body);
    console.log("typeof aJeuDonneesConcat[0] =" + typeof aJeuDonneesConcat[1]);
    console.log("aJeuDonneesConcat[1].truc =" + aJeuDonneesConcat[1].truc);
    var metadata = req.body.metadata;
    console.log("typeof metadata =" + typeof metadata);
    console.log("metadata.truc =" + metadata.truc);
    
    res.writeHead(200);  // TODO vérifier le code status coté client, si coode != => cnx serveur indisponible
    res.write( '{"added": "true"}' );
    res.end();
  }
});*/

/**
 * x3 variables globale seulement exploitées dans importer-page : pourraient aussi être enregistrée en stockage persistant
 * TODO stockage volatile pour respect de SOLID 
 */
/**Array<{key, composantUI, date, page, statsSessionId,
 *    sessionKey, androidVersion, licenceEstPremium,
 *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation}>*/
var global_aJeuDonneesConcat = "";// par défaut : valeur vide obligatoire (pour /ajax/v1.7/importer => req.query.getGlobalVars=="true")
/**Object{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}**/
var global_metadata = "";// par défaut : valeur vide obligatoire (pour /ajax/v1.7/importer => req.query.getGlobalVars=="true")


app.get('/ajax/v1.7/importer', function(req, res, next) {
  
  if(req.query.setGlobalVars=="true"){
    console.log("/ajax/v1.7/importer:: req.query  = ", req.query);
    console.log("req.query.modeleGenerationFichierCsv = "+req.query.modeleGenerationFichierCsv);
    dataModel.set_reglagesApp_modelGenerFic(req.query.modeleGenerationFichierCsv);
    res.writeHead(200);
    res.write( JSON.stringify({"added": true }) );
    res.end();
  }

  // Récupération du jeu de données, des metadata ; Récupérer globalVars
  else if(req.query.getGlobalVars=="true"){
    console.log("/ajax/v1.7/importer:: req.query  = ", req.query);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write( 
      JSON.stringify( {"modeleGenerationFichierCsv": dataModel.get_reglagesApp().modeleGenerationFichierCsv , 
      "metadata": global_metadata , "data": global_aJeuDonneesConcat} ) 
    ); 
    res.end();
  }
  else if(req.query.setModeleFichierCSV!=undefined){
    var modeleFichierCSV = req.query.setModeleFichierCSV;
    // TODO 
  }
  else{
    // modèle du wrapping de req => dateMaxLimite=<"0"|"dd/mm/yyyy">&dateMinLimite=<"0"|"dd/mm/yyyy">
    // Erreur : parfois sur alert de JS : retourne erreur 500, parfois aucun retour
    var mockData = false;
    if(req.query.mockData=="true")
      mockData = true;
    var getGlobalVars = false;
    console.log("/ajax/v1.7/importer :: mockData = ",mockData);
    // récupérer globalVars ; modifier globalVars 
    // => routé par app.post('/ajax/v1.7/importer')

    // importer jeu de données :
    // DEV :
    console.log("req.query = ",req.query);
    var dateMaxLimite = 0;
    var dateMinLimite = 0;
    if( req.query.dateMaxLimite!= "0"){
     const aDateMaxLimite = req.query.dateMaxLimite.split("-");
     dateMaxLimite = new Date( Number(aDateMaxLimite[2]),Number(aDateMaxLimite[1]-1),Number(aDateMaxLimite[0]) );
    }
    if( req.query.dateMinLimite!= "0"){
     const aDateMinLimite = req.query.dateMinLimite.split("-");
     dateMinLimite = new Date( Number(aDateMinLimite[2]),Number(aDateMinLimite[1]-1),Number(aDateMinLimite[0]) );
    }

    //DEV Archi avec service firebase mock :
    if(!mockData){
      ajaxController.importerJeuDonnees(firebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{ 
        call_repartirJeuDonnees(oJeuDonneesConcat, res) 
      });
    }
    else{
      ajaxController.mockData_importerDonnees(mockFirebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{ 
        call_repartirJeuDonnees(oJeuDonneesConcat, res) 
      });
    }
   
  }
});

// Fonction commune aux données de mock, et données de production
function call_repartirJeuDonnees(_oJeuDonneesConcat, _res)
{
  //const aJeuDonneesConcat = oResults.aJeuDonneesConcat;
  //const metadata = oResults.metadata;
  // DEV 
  //console.log("ajaxController.importerJeuDonnees caller :: aJeuDonneesConcat.length = "+ aJeuDonneesConcat.length );
  console.log("ajaxController.importerJeuDonnees caller :: _oJeuDonneesConcat.data.length = "+ _oJeuDonneesConcat.data.length +" ; _oJeuDonneesConcat.metadata = "+JSON.stringify(_oJeuDonneesConcat.metadata) );
  // [HACK] TODO stockage volatile pour respect de SOLID :
  global_aJeuDonneesConcat = _oJeuDonneesConcat.data;
  global_metadata = _oJeuDonneesConcat.metadata;

  /* INUTILES : 
  global_dateMaxLimite = global_dateMaxLimite;
  global_dateMinLimite = global_dateMinLimite; */
  _res.writeHead(200, {"Content-Type": "application/json"});
  // TESTER 
  //_res.write( data: JSON.stringify(oJeuDonneesConcat.data), metadata: JSON.stringify(oJeuDonneesConcat.metadata) );
  _res.write( JSON.stringify( _oJeuDonneesConcat) );
  /* TODO metadata
  _res.writeHead(200, {"Content-Type": "application/json"});
  _res.write( '{"metadata": '+ global_metadata +', "aJeuDonneesConcat": '+JSON.stringify(aJeuDonneesConcat)'}' );*/
  _res.end();
  //console.log( " ajaxController.lancerImportationJeuDonnees(req) = "+ajaxController.lancerImportationJeuDonnees(req));
  // TODO : vers le gestionnaire ajax => ajaxController.<methode>(req, _res, next); , 
  // Schéma méthode ajax redistribue vers méthodes privées selon les attribus : lancerImport , getStatsJeuDonnees, ...
  //
}

app.get('/ajax/v1.7/generer', function(req, res, next) {
  // DEV 
  // console.log
  ajaxController.genererFichierCSV(global_aJeuDonneesConcat,
    dataModel.get_reglagesApp().modeleGenerationFichierCsv, global_metadata.nbSessionsUtilisateurs,
    dateUtilsService
  ).then( (dataStats)=>{
    console.log("ajaxController.genererFichierCSV caller :: dataStats = ", dataStats);
    if(dataStats!=false){
      dataModel.set_fichierCSVGenereExiste(true);
      // MAJ du stockage persistant :
      // 1) transférer les metadatas de l'ex dernier fichier généré, DEPUIS dernierJeuDeDonneesCsv VERS FichiersGeneres
      var oDJD = dataModel.get_dernierJeuDeDonneesCsv();
      dataModel.add_fichiersGeneres( oDJD.nom, oDJD.poids, oDJD.dateCreation, oDJD.nombreSessionsUtilisateurs, oDJD.nombreActionsUtilisateurs, oDJD.dateDebutJeuDonnees, oDJD.dateFinJeuDonnees );
      // DEV
      console.log("/ajax/v1.7/generer => dataModel.get_fichiersGeneres = ", dataModel.get_fichiersGeneres() );

      // 2) peupler les metadatas du dernier fichier généré (non dépendant cette session)
      dataModel.set_dernierJeuDeDonneesCsv( dataStats.nom, dataStats.poidsHuman, dataStats.creaDateHoraireHuman,
        global_metadata.nbSessionsUtilisateurs, global_metadata.nbActionsUtilisateurs, 
        global_metadata.dateDebut, global_metadata.dateFin
      );
      // DEV
      //console.log("/ajax/v1.7/generer => dataModel.get_dernierJeuDeDonneesCsv = ", dataModel.get_dernierJeuDeDonneesCsv() );

      res.writeHead(200, {"Content-Type": "application/text"});
      res.write( "true" );
    }
    else{
      // Si le fichier ne peut pas être écrit, ou ne peut pas lire les infos de stats
      res.writeHead(500, {"Content-Type": "application/text"}); 
      res.write( "false" );
    }
    res.end();
  });
});
//DEV TEST dans importer
/*
function testImporterViaAjax(req, res, next) { // GET
  console.log("importerViaAjax:: req.query  = "+JSON.stringify( req.query ));
  // http://localhost:3000/ajax/v1.7/importer/?dateMax=2020-01-19-23:59:59 =>  req.query  = {"dateMax":"2020-01-19-23:59:59"}
  // http://localhost:3000/ajax/v1.7/importer/?truc=machin&date=2020-01-27 => req.query  =  {"truc":"machin","date":"2020-01-27"}
  console.log("importerViaAjax:: req.params  = "+JSON.stringify( req.params ));
  console.log("importerViaAjax:: req.body  = "+JSON.stringify( req.body ));
  res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
  res.write('{responseText{stats:"10 actions utilisateur",sessions:"3 sessions"}}');
  res.end();
}*/

app.get('/ajax/v1.7/telecharger', function(req, res, next) {
  
  if(req.query.getFichierMetadata=="true"){
    var dernierJeuDeDonneesCsv;// dernierFichierGenere 
    var fichiersGeneres;// historiqueFichiersGeneres
    dernierJeuDeDonneesCsv = dataModel.get_dernierJeuDeDonneesCsv();
    fichiersGeneres = dataModel.get_fichiersGeneres();
    console.log("/ajax/v1.7/telecharger :: fichiersGeneres = ",fichiersGeneres);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write( JSON.stringify(
      {"dernierJeuDeDonneesCsv": dernierJeuDeDonneesCsv, "fichiersGeneres": fichiersGeneres}
    ) );
    res.end();
  }
});



////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// gestion des messages d'erreurs //////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});


// Gestion des erreur formulation de routes par l'utilisateur : via HTTP code
app.use(function(req, res, next){
  res.status(404);
  // Retourner une page HTML
  if (req.accepts('html')) {
    controller.status404PageController(req, res);
    return;
  }
  // Retourner un flux JSON
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // retourner un flux plain-text (Par défaut)
  res.type('txt').send('Not found');
});


module.exports = app;
