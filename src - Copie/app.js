let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// importing modules for MVC pattern's "controllers"
let controller = require('./controller/controller');
let ajaxController = require('./controller/ajax-controller');
let app = express();

// importing modules for MVC pattern's "model"
const persistantDataModel = require('./model/persistant-data-model');
const firebaseService = require('./services/firebase-service');
const mockFirebaseService = require('./services/mock-firebase-service.js');//To test "Import" page working without firebase account

// configuring path and library for MVC pattern's "view"
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use(logger('dev'));

// importing the constants for all the app
const configConstants = require('./config/config-constants');
// importing module and declaring classe for various modules
const DateUtilsService = require('./services/date-operations-service.js');//Declare the class to instanciate
const dateUtilsService = new DateUtilsService();// instancier la classe "statique" dans une seule instance d'objet, transmise dans toute l'appli (= meilleure performance)

// Public assets folders declaring
app.use(express.static(__dirname + '/assets/public'));
app.use(express.static(__dirname + '/assets/fichiers_generes'));


initializeAppDataservice();// Be carefull to initialize it before to declare the routes. e.g. : app.get('/configurer', function(req, res) { etc

function getRootPage(req, res){
  // controller for importing firebase data
  controller.importerController(req, res);
}


////////////////////////////////////////////////////////////
//////////////// Declaring the pages routes ////////////////
////////////////////////////////////////////////////////////

app.get('/', function(req, res) {
  getRootPage(req, res);
});

app.get('/configurer', function(req, res) {
  // navigate to the page when configuring the app (get or set)
  controller.configurerController(req, res);
});

app.get('/importer', function(req, res) {
  // navigate to the page when importing the firebase data set, and when generating a CSV file
  getRootPage(req, res);
});

app.get('/telecharger', function(req, res) {
  // navigate to the page when downloading the generated file, or when getting the history list of CSV files
  controller.telechargerController(req, res);
});


async function initializeAppDataservice()
{
  // Start the persistant data module (from the local storage). Particularly, it initializes local storage at the first time launching of the application
  await persistantDataModel.init(); 

  // Check the Firebase DB connection
  let oServ_reglagesApp = persistantDataModel.get_reglagesApp();
  let servFbDbEstDispo = await firebaseService.init( oServ_reglagesApp.databaseUrl, oServ_reglagesApp.serviceAccount);
  await persistantDataModel.set_fbDbEstDispo(servFbDbEstDispo);
  
  return;
}

//Download a file
app.get("/getCsv", function (req, res){
    let f = req.query.nomFichier;
    console.log("debug chemin = ./" + process.env.URL_FICHIERS_CSV + f);
    res.download(  "./"+process.env.URL_FICHIERS_CSV + f);
});


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//////////////// Declaring the ajax routes ////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
app.get('/ajax/v1.7/commun', function(req, res, next) {
  switch(req.query.t){
    case "getAccessFbDbState":
      accessFbDbState(req, res);
    break
    case "getSessionCSVFileExists":
      sessionCSVFileExists(req, res);
  }
});

async function accessFbDbState(req, res){
  try{
    let strServFbDbEstDispo = await ajaxController.getServeurFireBDisponibilite(firebaseService);
   
    res.writeHead(200, {"Content-Type": "application/text"});
    res.write( strServFbDbEstDispo ); 
    res.end();
  }
  catch(err){
    console.log("accessFbDbState::erreur : ",err);
  }
};

async function sessionCSVFileExists(req, res){
  try{
    let strSessionCSVFileExists = await ajaxController.getSessionCSVFileExists();
   
    res.writeHead(200, {"Content-Type": "application/text"});
    res.write( strSessionCSVFileExists ); 
    res.end();
  }
  catch(err){
    console.log("accessFbDbState::erreur : ",err);
  }
}


app.get('/ajax/v1.7/configurer', function(req, res, next) {
  configurer(req, res);
});

async function configurer(req, res){
  try{

    if(req.query.setConfiguration==undefined){
      let strJsonResult = await ajaxController.getConfiguration();
      
      res.writeHead(200, {"Content-Type": "application/json"});
      res.write( strJsonResult ); 
    }

    else{
      let strNumResult = await ajaxController.setConfiguration(req);
      res.writeHead(200, {"Content-Type": "application/text"});
      res.write( strNumResult ); 
    }
    res.end();
  }
  catch(err){
    console.log("configurer::erreur : ",err);
  }
}


/**
 * Stored from the app launched to the app ended
 * @type {String}
 */
let session_aJeuDonneesConcat = "";

/**
/**
 * Stored from the app launched to the app ended
 * @type {Object{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}}
**/
let session_metadata = {};


app.get('/ajax/v1.7/importer', function(req, res, next) {
  
  if(req.query.setModeleFichierCSV=="true"){
    persistantDataModel.set_reglagesApp_modelGenerFic(req.query.modeleFichierCsv);
    res.writeHead(200);
    res.write( JSON.stringify({"added": true }) );
    res.end();
  }

  // Getting and returning : the data set, metadata, pattern of CSV file
  else if(req.query.getSessionVars=="true"){
    console.log("/ajax/v1.7/importer:: req.query  = ", req.query);
    res.writeHead(200, {"Content-Type": "application/json"});
    
    let strSession_metadata = session_metadata;//Change the type to return well to the AJAX callback
      if(session_metadata=={}) 
        strSession_metadata = "";
    res.write( 
      JSON.stringify( {"modeleFichierCsv": persistantDataModel.get_reglagesApp().modeleFichierCsv , 
      "metadata": strSession_metadata , "data": session_aJeuDonneesConcat} ) 
    ); 
    res.end();
  }

  // Request for importing a data set (mock or production)
  else{ 
    
    let mockData = false;
    // mockData can be actived/desactivated on the client-side JS code
    if(req.query.mockData=="true")
      mockData = true;
    
    // JS client side request's format : dateMaxLimite=<"0"|"dd-mm-yyyy">&dateMinLimite=<"0"|"dd-mm-yyyy">
    let dateMaxLimite = 0;
    let dateMinLimite = 0;
    if( req.query.dateMaxLimite!= "0"){
     const aDateMaxLimite = req.query.dateMaxLimite.split("-");
     dateMaxLimite = new Date( Number(aDateMaxLimite[2]),Number(aDateMaxLimite[1]-1),Number(aDateMaxLimite[0]) );
    }
    if( req.query.dateMinLimite!= "0"){
     const aDateMinLimite = req.query.dateMinLimite.split("-");
     dateMinLimite = new Date( Number(aDateMinLimite[2]),Number(aDateMinLimite[1]-1),Number(aDateMinLimite[0]) );
    }

    if(!mockData){
      ajaxController.importerJeuDonnees(firebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{
        getJeuDonnees(oJeuDonneesConcat, res) 
      });
    }
    else{
      console.log("ajaxController.mockData_importerDonnees(mockFirebaseService, dateMaxLimite, dateMinLimite) dont dateMaxLimite = "+dateMaxLimite+" ; dateMinLimite = "+dateMinLimite);
      ajaxController.mockData_importerDonnees(mockFirebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{
        console.log("resultat de oJeuDonneesConcat = ",oJeuDonneesConcat);
        getJeuDonnees(oJeuDonneesConcat, res) 
      });
    }
   
  }
});

function getJeuDonnees(_oJeuDonneesConcat, _res)
{
  session_aJeuDonneesConcat = _oJeuDonneesConcat.data;
  session_metadata = _oJeuDonneesConcat.metadata;
  _res.writeHead(200, {"Content-Type": "application/json"});
  _res.write( JSON.stringify( _oJeuDonneesConcat) );
  _res.end();
}

app.get('/ajax/v1.7/generer', function(req, res, next) {
  ajaxController.genererFichierCSV(session_aJeuDonneesConcat,
    persistantDataModel.get_reglagesApp().modeleFichierCsv, session_metadata.nbSessionsUtilisateurs,
    dateUtilsService
  ).then( (dataStats)=>{
    console.log("ajaxController.genererFichierCSV caller :: dataStats = ", dataStats);
    if(dataStats!=false){
      persistantDataModel.set_fichierCSVGenereExiste(true);
  
      // Update the persistant data :
      let oLatestDataSet = persistantDataModel.get_dernierJeuDeDonneesCsv();
      //1. Make an newest data for CSV-formatted-text file
      persistantDataModel.add_fichiersGeneres( oLatestDataSet.nom, oLatestDataSet.poids, oLatestDataSet.dateCreation, oLatestDataSet.nombreSessionsUtilisateurs, oLatestDataSet.nombreActionsUtilisateurs, oLatestDataSet.dateDebutJeuDonnees, oLatestDataSet.dateFinJeuDonnees );
      //2. fill metadata of the latest generated file (not associated to THIS session)
      persistantDataModel.set_dernierJeuDeDonneesCsv( dataStats.nom, dataStats.poidsHuman, dataStats.creaDateHoraireHuman,
        session_metadata.nbSessionsUtilisateurs, session_metadata.nbActionsUtilisateurs, 
        session_metadata.dateDebut, session_metadata.dateFin
      );
      
      res.writeHead(200, {"Content-Type": "application/text"});
      res.write( "true" );
    }
    else{
      //If the file can't be written the stats infos are not readable 
      res.writeHead(500, {"Content-Type": "application/text"}); 
      res.write( "false" );
    }
    res.end();
  });
});

app.get('/ajax/v1.7/telecharger', function(req, res, next) {
  
  if(req.query.getFichierMetadata=="true"){
    let dernierJeuDeDonneesCsv;
    let fichiersGeneres;
    dernierJeuDeDonneesCsv = persistantDataModel.get_dernierJeuDeDonneesCsv();
    fichiersGeneres = persistantDataModel.get_fichiersGeneres();
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write( JSON.stringify(
      {"dernierJeuDeDonneesCsv": dernierJeuDeDonneesCsv, "fichiersGeneres": fichiersGeneres}
    ) );
    res.end();
  }
});



/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Error messages handlers //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

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


/**
 * Syntax error when page is not found (HTTP 404 status code)
 */
app.use(function(req, res, next){
  res.status(404);
  //Return an HTML page
  if (req.accepts('html')) {
    controller.status404PageController(req, res);
    return;
  }
  //Return a JSON feed
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  //Return a plain-text feed (default)
  res.type('txt').send('Not found');
});

module.exports = app;