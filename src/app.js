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

// app.js

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

// importing modules for MVC pattern's "controllers"
const controller = require('./controller/controller');
const ajaxController = require('./controller/ajax-controller');
let app = express();

// importing modules for MVC pattern's "model"
const localStorageModel = require('./model/local-storage-model');
const firebaseService = require('./services/firebase-service');
const mockFirebaseService = require('./services/mock-firebase-service');//To test "Import" page working without firebase account

// configuring path and library for MVC pattern's "view"
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/assets/favicon.ico'));

// importing module and declaring classe for various modules
const DateUtilsService = require('./services/date-operations-service');//Declare the class to instanciate
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
  // Start the local-data-storing module. Particularly, it initializes local storage at the first time launching of the application
  await localStorageModel.init(); 

  // Check the Firebase DB connection
  let oServ_reglagesApp = localStorageModel.get_reglagesApp();
  let servFbDbEstDispo = await firebaseService.init( oServ_reglagesApp.databaseUrl, oServ_reglagesApp.serviceAccount);
  await localStorageModel.set_fbDbEstDispo(servFbDbEstDispo);
  
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
    localStorageModel.set_reglagesApp_modelGenerFic(req.query.modeleFichierCsv);
    res.writeHead(200);
    res.write( JSON.stringify({"added": true }) );
    res.end();
  }

  // Getting and returning : the data set, metadata, pattern of CSV file
  else if(req.query.getSessionVars=="true"){
    res.writeHead(200, {"Content-Type": "application/json"});
    
    let strSession_metadata = session_metadata;//Change the type to return well to the AJAX callback
      if(session_metadata=={}) 
        strSession_metadata = "";
    res.write( 
      JSON.stringify( {"modeleFichierCsv": localStorageModel.get_reglagesApp().modeleFichierCsv , 
      "metadata": strSession_metadata , "data": session_aJeuDonneesConcat, "isMockData": Boolean(Number(process.env.MOCK_DATA)) } ) 
    ); 
    res.end();
  }

  // Request for importing a data set (mock or production)
  else{ 
  
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

    if(!Boolean(Number(process.env.MOCK_DATA)) ){
      ajaxController.importerJeuDonnees(firebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{
        getJeuDonnees(oJeuDonneesConcat, res) 
      });
    }
    else{
      ajaxController.mockData_importerDonnees(mockFirebaseService, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{
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
    localStorageModel.get_reglagesApp().modeleFichierCsv, session_metadata.nbSessionsUtilisateurs,
    dateUtilsService
  ).then( (dataStats)=>{
    if(dataStats!=false){
      localStorageModel.set_fichierCSVGenereExiste(true);
  
      // Update the local-data-storing :
      let oLatestDataSet = localStorageModel.get_dernierJeuDeDonneesCsv();
      //1. Make an newest data for CSV-formatted-text file
      localStorageModel.add_fichiersGeneres( oLatestDataSet.nom, oLatestDataSet.poids, oLatestDataSet.dateCreation, oLatestDataSet.nombreSessionsUtilisateurs, oLatestDataSet.nombreActionsUtilisateurs, oLatestDataSet.dateDebutJeuDonnees, oLatestDataSet.dateFinJeuDonnees );
      //2. fill metadata of the latest generated file (not associated to THIS session)
      localStorageModel.set_dernierJeuDeDonneesCsv( dataStats.nom, dataStats.poidsHuman, dataStats.creaDateHoraireHuman,
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
    dernierJeuDeDonneesCsv = localStorageModel.get_dernierJeuDeDonneesCsv();// 1st parameter to return
    fichiersGeneres = localStorageModel.get_fichiersGeneres();// 2nd parameter to return
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write( JSON.stringify(
      {"dernierJeuDeDonneesCsv": dernierJeuDeDonneesCsv, "fichiersGeneres": fichiersGeneres}
    ) );
    res.end();
  }
});


//Unit test handler
const utilsService = require('./services/utils-service');
app.get('/unitTests', async function(req, res) {
    let sequence = req.query.sequence;
    let value = req.query.value;
    let poids;
    console.log("\n###############################\n");
    console.log("##         Unit tests        ##\n");
    console.log("###############################\n\n");
    console.log("# Beginning\n");
    switch(sequence){

      // Testing services/utilsService :: getHumanReadableFileSize
      case "utilsService__getHumanReadableFileSize_custom":
        console.log("unitTests => req.query.sequence = " + req.query.sequence + " ; req.query.value = "+req.query.value);
        // URL pour poids en To attendu : http://localhost:3000/unitTests?sequence=utilsService__getHumanReadableFileSize_custom&value=1987654321098
        poids = await utilsService.getHumanReadableFileSize( Number(value) );
        console.log("poids = ",poids);//ex => poids = {size:12,unitOfMeasure:"ko"}
      break;
      case "utilsService__getHumanReadableFileSize_allCases":
        poids = await utilsService.getHumanReadableFileSize( 1987654321098 );
        console.log("poids attendu ~1.98 To : " + JSON.stringify(poids) +"\n\n");
        poids = await utilsService.getHumanReadableFileSize( 87654321098 );
        console.log("poids attendu ~82 Go : " + JSON.stringify(poids) +"\n\n"); 
        poids = await utilsService.getHumanReadableFileSize( 54321098 );
        console.log("poids attendu ~51 Mo: " + JSON.stringify(poids) +"\n\n");
        poids = await utilsService.getHumanReadableFileSize( 21098 );
        console.log("poids attendu ~21 Ko : " + JSON.stringify(poids) +"\n\n");
        poids = await utilsService.getHumanReadableFileSize( 1098 );
        console.log("poids attendu ~1.9 Ko : " + JSON.stringify(poids) +"\n\n");
        poids = await utilsService.getHumanReadableFileSize( 98 );
        console.log("poids attendu ~98 o : " + JSON.stringify(poids) +"\n\n");
      break;

      case "utilsService__sortArrayOfObject_allCases":
        let aObject = [{id: 1, val: "Mango"},{id: 2, val: "Banana"},{id: 10, val: "Strawberry"}];
        let sortedObject;
        sortedObject = await utilsService.sortArrayOfObject(aObject, "id", true);
        console.log('expected is ASCENDANT sorting order applied ON id parameter : [{"id":1,"val":"Mango"},{"id":2,"val":"Banana"},{"id":10,"val":"Strawberry"}]');
        console.log('RESULT:', sortedObject );
        console.log('\n');
        sortedObject = await utilsService.sortArrayOfObject(aObject, "val", true);
        console.log('expected is ASCENDANT sorting order applied ON val parameter : [{"id":2,"val":"Banana"},{"id":1,"val":"Mango"},{"id":10,"val":"Strawberry"}]');
        console.log('RESULT:', sortedObject );
        console.log('\n');
        sortedObject = await utilsService.sortArrayOfObject(aObject, "id", false);
        console.log('expected is DESCENDANT sorting order applied ON id parameter : [{"id":10,"val":"Strawberry"},{"id":2,"val":"Banana"},{"id":1,"val":"Mango"}]');
        console.log('RESULT:', sortedObject );
        console.log('\n');
        sortedObject = await utilsService.sortArrayOfObject(aObject, "val", false);
        console.log('expected is DESCENDANT sorting order applied ON val parameter: [{"id":10,"val":"Strawberry"},{"id":1,"val":"Mango"},{"id":2,"val":"Banana"}]');
        console.log('RESULT:', sortedObject );
        console.log('\n');
      break;
    }
    console.log("# Ending\n");
    res.writeHead(200, {"Content-Type": "application/text"});
    res.end();
});

///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Error messages & redirection handlers //////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Development error handler : if debug_mode is configured then will print stacktrace
 */
if(Boolean(Number(process.env.DEBUG_MODE)) === false) {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

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