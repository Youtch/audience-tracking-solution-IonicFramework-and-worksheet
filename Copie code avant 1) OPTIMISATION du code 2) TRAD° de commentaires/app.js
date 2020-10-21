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

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* NOK : mais aucune erreur signalée par console
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
*/
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser()); // UTILE ?
app.use(express.static(path.join(__dirname, 'public')));

modelInit();

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


// démarrage : UTILE ? 
app.get('/', function(req, res) {
  getRootPage(req, res);
});

app.get('/configurer', function(req, res) {
  // configurer l'appli
  controller.configurerController(req, res);
});


//////////////// Routage vers les pages de l'appli ////////////////
// affichage du template EJS de la page :
app.get('/importer', function(req, res) {
  // importer jeux de données sur Firebase DB
  getRootPage(req, res);
});

app.get('/generer', function(req, res) {
  // generer des fichiers CSV
  controller.genererController(req, res);
});

app.get('/telecharger', function(req, res) {
  // telecharger et afficher l'historique des fichiers CSV
  controller.telechargerController(req, res);
});


// R&D tests d'UIs : Bootstrap...
app.get('/RDTestsUIs', function(req, res) {
  // tester différents composants, et différents modules logiciels externes
  controller.rdTestsUisController(req, res);
});

function modelInit() // Démarrer le "model" (pattern MVC) de l'appli
{
  dataModel.init();
}




///////////////// routage sous page telecharger : requête de téléchargement d'un fichier csv :
//Post data from the client
//Send the requested file back to the client
app.get("/getCsv", function (req, res){
    var f = req.query.nomFichier;
    console.log("debug chemin = ./" + process.env.URL_FICHIERS_CSV + f);
    res.download( "./"+ process.env.URL_FICHIERS_CSV + f);
});




//////////////// routage via le mécanisme ajax ////////////////
app.get('/ajax/v1.7/importer', function(req, res, next) {
  //TESTE OK : testImporterViaAjax(req, res, next);

  console.log("/ajax/v1.7/importer lancé ; req = "+JSON.stringify( req.query ));
  // Erreur : parfois sur alert de JS : retourne erreur 500, parfois aucun retour
  ajaxController.lancerImportationJeuDonnees(req).then( (result)=>{
    res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
    res.write(  result );
    res.end();
  });
  //console.log( " ajaxController.lancerImportationJeuDonnees(req) = "+ajaxController.lancerImportationJeuDonnees(req));
  // TODO : vers le gestionnaire ajax => ajaxController.<methode>(req, res, next); , 
  // Schéma méthode ajax redistribue vers méthodes privées selon les attribus : lancerImport , getStatsJeuDonnees, ...
  //
});

//DEV TEST 
function testImporterViaAjax(req, res, next) { // GET
  console.log("importerViaAjax:: req.query  = "+JSON.stringify( req.query ));
  // http://localhost:3000/ajax/v1.7/importer/?dateMax=2020-01-19-23:59:59 =>  req.query  = {"dateMax":"2020-01-19-23:59:59"}
  // http://localhost:3000/ajax/v1.7/importer/?truc=machin&date=2020-01-27 => req.query  =  {"truc":"machin","date":"2020-01-27"}
  console.log("importerViaAjax:: req.params  = "+JSON.stringify( req.params ));
  console.log("importerViaAjax:: req.body  = "+JSON.stringify( req.body ));
  res.writeHead(200, {"Content-Type": "text/plain;charset=utf-8"});
  res.write('{responseText{stats:"10 actions utilisateur",sessions:"3 sessions"}}');
  res.end();
}

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
});

//////////////// gestion des messages d'erreurs ////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

module.exports = app;
