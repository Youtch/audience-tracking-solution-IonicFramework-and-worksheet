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


//////////////// Routage vers les pages de l'appli ////////////////
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

// DEV : à ne pas conserver sur STAU v1.0
app.get('/datavisualisation', function(req, res) {
  // telecharger le fichier généré et afficher l'historique des fichiers CSV
  controller.datavisualisationController(req, res);
});

// R&D tests d'UIs : Bootstrap...
// DEV : à ne pas conserver sur STAU v1.0
app.get('/RDTestsUIs', function(req, res) {
  // tester différents composants, et différents modules logiciels externes
  controller.rdTestsUisController(req, res);
});
// Retourner des données pour un snippet de pagination
app.get('/jsonFilmsData', function(req, res) {
  var strJsonData = JSON.stringify(
  {
    "films": [
        {
            "id": 1,
            "Name": "Ai Weiwei: Never sorry",
            "Year": 2012,
            "Stars": ["Ai Weiwei", "Dan Ai", "Lao Ai"],
            "Description": "A documentary that chronicles artist and activist Ai Weiwei as he prepares for a series of exhibitions and gets into an increasing number of clashes with the Chinese government.",
            "Poster": "./img/aiWeiwei.jpg",
            "Director": "Alison Klayman"
        },
        {
            "id": 2,
            "Name": "Apocalypse Now",
            "Year": 1979,
            "Stars": [
                    "Marlon Brando",
                    "Robert Duvall",
                    "Martin Sheen",
                    "Frederic Forrest",
                    "Albert Hall",
                    "Sam Bottoms",
                    "Laurence Fishburne",
                    "Dennis Hopper"],
            "Description": "Apocalypse Now is a 1979 American epic war film directed, produced, and co-written by Francis Ford Coppola. It was co-written by John Milius with narration written by Michael Herr. It stars Marlon Brando, Robert Duvall, Martin Sheen, Frederic Forrest, Albert Hall, Sam Bottoms, Larry Fishburne, and Dennis Hopper. The screenplay, written by Milius, adapts the story of Joseph Conrad's novella Heart of Darkness, changing its setting from late nineteenth-century Congo to the Vietnam War.[4] ",
            "Poster": "./img/apocalypseNow.jpg",
            "Director": "Francis Coppola"
        },
        {
            "id": 3,
            "Name": "A woman under the influance",
            "Year": 1974,
            "Stars": ["Gena Rowlands", "Peter Falk", "Fred Draper"],
            "Description": "Mabel Longhetti (Gena Rowlands), desperate and lonely, is married to a Los Angeles municipal construction worker, Nick (Peter Falk). Increasingly unstable, especially in the company of others, she craves happiness, but her extremely volatile behavior convinces Nick that she poses a danger to their family and decides to commit her to an institution for six months. Alone with a trio of kids to raise on his own, he awaits her return, which holds more than a few surprises.",
            "Poster": "./img/aWomanUnderTheInfluance.jpg",
            "Director": "John Cassavetes"
        },
        {
            "id": 4,
            "Name": "By the sea",
            "Year": 2015,
            "Stars": ["Brad Pitt", "Angelina Jolie", "Mélanie Laurent"],
            "Description": "A troubled American couple (Brad Pitt, Angelina Jolie Pitt) befriend young newlyweds and local villagers while staying at French seaside resort.",
            "Poster": "./img/byTheSea.jpg",
            "Director": "Angelina Jolie Pitt"
        },
        {
            "id": 5,
            "Name": "Cinema Paradiso",
            "Year": 1988,
            "Stars": ["Philippe Noiret", "Enzo Cannavale", "Antonella Attili"],
            "Description": "Young Salvatore Di Vita (Salvatore Cascio) discovers the perfect escape from life in his war-torn Sicilian village: the Cinema Paradiso movie house, where projectionist Alfredo (Philippe Noiret) instills in the boy a deep love of films. When Salvatore grows up, falls in love with a beautiful local girl (Agnese Nano) and takes over as the Paradiso's projectionist, Alfredo must convince Salvatore to leave his small town and pursue his passion for filmmaking.",
            "Poster": "./img/cinemaParadiso.jpg",
            "Director": "Giuseppe Tornatore"
        },
        {
            "id": 6,
            "Name": "A Fistful of Dollars",
            "Year": 1964,
            "Stars": ["Clint Eastwood", "Gian Maria Volontè", "Marianne Koch"],
            "Description": "The Man With No Name (Clint Eastwood) enters the Mexican village of San Miguel in the midst of a power struggle among the three Rojo brothers (Antonio Prieto, Benny Reeves, Sieghardt Rupp) and sheriff John Baxter (Wolfgang Lukschy). When a regiment of Mexican soldiers bearing gold intended to pay for new weapons is waylaid by the Rojo brothers, the stranger inserts himself into the middle of the long-simmering battle, selling false information to both sides for his own benefit.",
            "Poster": "./img/clintEastwood.jpg",
            "Director": "Sergio Leone"
        },
        {
            "id": 7,
            "Name": "The Bridges of Madison County",
            "Year": 1995,
            "Stars": ["Clint Eastwood", "Meryl Streep", "Annie Corley"],
            "Description": "A moving love story about a photographer on assignment to shoot the historic bridges of Madison County. He meets a housewife, whose husband and children are away on a trip, and the film traces a brief affair that is never sordid but instead one of two soul mates who have met too late.",
            "Director": "Clint Eastwood"
        },
        {
            "id": 8,
            "Name": "Fight Club",
            "Year": 1999,
            "Stars": ["Brad Pitt", "Edward Norton", "Meat Loaf"],
            "Description": "A depressed man (Edward Norton) suffering from insomnia meets a strange soap salesman named Tyler Durden (Brad Pitt) and soon finds himself living in his squalid house after his perfect apartment is destroyed. The two bored men form an underground club with strict rules and fight other men who are fed up with their mundane lives. Their perfect partnership frays when Marla (Helena Bonham Carter), a fellow support group crasher, attracts Tyler's attention.",
            "Poster": "./img/fightClub.jpg",
            "Director": "David Fincher"
        },
        {
            "id": 9,
            "Name": "Gladiator",
            "Year": 2000,
            "Stars": ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"],
            "Description": "Commodus (Joaquin Phoenix) takes power and strips rank from Maximus (Russell Crowe), one of the favored generals of his predecessor and father, Emperor Marcus Aurelius, the great stoical philosopher. Maximus is then relegated to fighting to the death in the gladiator arenas.",
            "Poster": "./img/gladiator.jpg",
            "Director": "Ridley Scott"
        },
        {
            "id": 10,
            "Name": "Inception",
            "Year": 2010,
            "Stars": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
            "Description": "Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people's dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone's mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb's every move.",
            "Poster": "./img/inception.jpg",
            "Director": "Christopher Nolan"
        },
        {
            "id": 11,
            "Name": "Leon",
            "Year": 1994,
            "Stars": ["Jean Reno", "Gary Oldman", "Natalie Portman"],
            "Description": "Mathilda (Natalie Portman) is only 12 years old, but is already familiar with the dark side of life: her abusive father stores drugs for corrupt police officers, and her mother neglects her. Léon (Jean Reno), who lives down the hall, tends to his houseplants and works as a hired hitman for mobster Tony (Danny Aiello). When her family is murdered by crooked DEA agent Stansfield (Gary Oldman), Mathilda joins forces with a reluctant Léon to learn his deadly trade and avenge her family's deaths.",
            "Poster": "./img/leon.jpg",
            "Director": "Luc Besson"
        },
        {
            "id": 12,
            "Name": "Peaky Blinders",
            "Year": 2013,
            "Stars": ["Cillian Murphy", "Paul Anderson", "Helen McCrory"],
            "Description": "Britain is a mixture of despair and hedonism in 1919 in the aftermath of the Great War. Returning soldiers, newly minted revolutions and criminal gangs are fighting for survival in a nation rocked by economic upheaval. One of the most powerful gangs of the time is the Peaky Blinders, run by returning war hero Thomas Shelby and his family.",
            "Poster": "./img/peakyBlinders.jpg",
            "Director": "Steven Knight and crew"
        },
        {
            "id": 13,
            "Name": "Pompeii",
            "Year": 2014,
            "Stars": ["Kit Harington", "Emily Browning", "Kiefer Sutherland"],
            "Description": "In 79 A.D., Pompeii, a bustling port city, stands in the shadow of Mount Vesuvius. Milo (Kit Harington), a former slave, is a gladiator who has caught the eye of Cassia (Emily Browning), a wealthy merchant's daughter. However, their difference in social status is not the only obstacle to their love; Cassia has been promised to Corvus (Kiefer Sutherland), a corrupt Roman senator.",
            "Poster": "./img/pompeii.jpg",
            "Director": "Paul W. S. Anderson"
        },
        {
            "id": 14,
            "Name": "Remember me",
            "Year": 2010,
            "Stars": ["Robert Pattinson", "Emilie de Ravin", "Caitlyn Rund"],
            "Description": "Tyler (Robert Pattinson) has had a strained relationship with his father (Pierce Brosnan) since a family tragedy. Rebellious and troubled, he thinks no one can understand his pain, then he meets Ally (Emilie de Ravin). Her warmth and spirit soon begin to heal him, and they fall in love. But just when Tyler begins to rediscover happiness and meaning in his life, emerging secrets threaten their romance.",
            "Poster": "./img/rememberMe.jpg",
            "Director": "Allen Coulter"
        },
        {
            "id": 15,
            "Name": "The Revenant",
            "Year": 2015,
            "Stars": ["Leonardo DiCaprio", "Tom Hardy", "Will Poulter"],
            "Description": "While exploring the uncharted wilderness in 1823, frontiersman Hugh Glass (Leonardo DiCaprio) sustains life-threatening injuries from a brutal bear attack. When a member (Tom Hardy) of his hunting team kills his young son (Forrest Goodluck) and leaves him for dead, Glass must utilize his survival skills to find a way back to civilization.",
            "Poster": "./img/revenant.jpg",
            "Director": "Alejandro G. Iñárritu"
        },
        {
            "id": 16,
            "Name": "Seven",
            "Year": 1995,
            "Stars": ["Morgan Freeman", "Brad Pitt", "Kevin Spacey"],
            "Description": "When retiring police Detective William Somerset (Morgan Freeman) tackles a final case with the aid of newly transferred David Mills (Brad Pitt), they discover a number of elaborate and grizzly murders. They soon realize they are dealing with a serial killer (Kevin Spacey) who is targeting people he thinks represent one of the seven deadly sins.",
            "Poster": "./img/seven.jpg",
            "Director": "David Fincher"
        },
        {
            "id": 17,
            "Name": "Shutter Island",
            "Year": 2010,
            "Stars": ["Leonardo DiCaprio", "Emily Mortimer", "Mark Ruffalo"],
            "Description": "The implausible escape of a brilliant murderess brings U.S. Marshal Teddy Daniels (Leonardo DiCaprio) and his new partner (Mark Ruffalo) to Ashecliffe Hospital, a fortress-like insane asylum located on a remote, windswept island.",
            "Poster": "./img/shutterIsland.jpg",
            "Director": "Martin Scorsese"
        },
        {
            "id": 18,
            "Name": "Taboo",
            "Year": 2107,
            "Stars": ["Tom Hardy", "David Hayman", "Jonathan Pryce"],
            "Description": "Adventurer James Keziah Delaney, long believed to be dead, returns home to London from Africa in 1814 in order to inherit his late father's shipping empire. All is not what it seems, however, as Delaney encounters numerous enemies intent on making his life back in the United Kingdom very difficult.",
            "Poster": "./img/taboo.jpg",
            "Director": "Tom Hardy"
        },
        {
            "id": 19,
            "Name": "The Godfather",
            "Year": 1972,
            "Stars": ["Marlon Brando", "Al Pacino", "James Caan"],
            "Description": "Widely regarded as one of the greatest films of all time, this mob drama, based on Mario Puzo's novel of the same name, focuses on the powerful Italian-American crime family of Don Vito Corleone (Marlon Brando). When the don's youngest son, Michael (Al Pacino), reluctantly joins the Mafia, he becomes involved in the inevitable cycle of violence and betrayal.",
            "Poster": "./img/theGodfather.jpg",
            "Director": "Francis Ford Coppola"
        },
        {
            "id": 20,
            "Name": "To Kill A Mockingbird",
            "Year": 1962,
            "Stars": ["Gregory Peck", "John Megna", "Frank Overton"],
            "Description": "Scout Finch (Mary Badham), 6,and her older brother, Jem (Phillip Alford), live in sleepy Maycomb, Ala., spending much of their time with their friend Dill (John Megna) and spying on their reclusive and mysterious neighbor, Boo Radley (Robert Duvall).",
            "Poster": "./img/toKillAMockingbird.jpg",
            "Director": "Robert Mulligan"
        },
        {
            "id": 21,
            "Name": "Troy",
            "Year": 2004,
            "Stars": ["Brad Pitt", "Eric Bana", "Orlando Bloom"],
            "Description": "Based on Homer's \"Iliad,\" this epic portrays the battle between the ancient kingdoms of Troy and Sparta. While visiting Spartan King Menelaus (Brendan Gleeson), Trojan prince Paris (Orlando Bloom) falls for Menelaus' wife, Helen (Diane Kruger), and takes her back to Troy.",
            "Poster": "./img/troy.jpg",
            "Director": "Wolfgang Petersen"
        },
        {
            "id": 22,
            "Name": "Taxi Driver",
            "Year": 1976,
            "Stars": ["Robert De Niro", "Jodie Foster", "Cybill Shepherd"],
            "Description": "Suffering from insomnia, disturbed loner Travis Bickle (Robert De Niro) takes a job as a New York City cabbie, haunting the streets nightly, growing increasingly detached from reality as he dreams of cleaning up the filthy city.",
            "Director": "Martin Scorsese"
        },
        {
            "id": 23,
            "Name": "Vinyl",
            "Year": 2016,
            "Stars": ["Bobby Cannavale", "Paul Ben-Victor", "P.J. Byrne"],
            "Description": "The music scene in 1970s New York is still awash in sex and drugs, but rock 'n' roll is giving way to an era of punk, disco and hip-hop. Desperately trying to navigate the changing landscape is American Century Records founder and president Richie Finestra.",
            "Poster": "./img/vinyl.jpg",
            "Director": "Martin Scorsese"
        }
    ]
  });
  res.writeHead(200, {"Content-Type": "application/text"});
  res.write( strJsonData ); 
  res.end();
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
 *    nbUiAidesOuverts, nombrePagesVisitees, nombreCmpsCmpsntUINonDstnctVisites, cheminNavigation, listeFunnels}>*/
var global_aJeuDonneesConcat = "";// par défaut : valeur vide obligatoire (pour /ajax/v1.7/importer => req.query.getGlobalVars=="true")
/**Boolean **/
var global_activRechercherFunnels;
/**Object{dateDebut:string, dateFin:string, nbActionsUtilisateurs:string, nbSessionsUtilisateurs:string}**/
var global_metadata = "";// par défaut : valeur vide obligatoire (pour /ajax/v1.7/importer => req.query.getGlobalVars=="true")

// Cas d'utilisation
// 
/**
 * Cas d'utilisations : 
 *   Edition du jeu de données, sans modification des metatadata
 *   Récupération du jeu de données, des metadata
 */
app.post('/ajax/v1.7/importer', function(req, res, next) {
  // Récupération du jeu de données, des metadata ; Récupérer globalVars
  if(req.query.getGlobalVars=="true"){
    console.log("/ajax/v1.7/importer:: req.query  = ", req.query);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write( 
      JSON.stringify( {"modeleGenerationFichierCsv": dataModel.get_reglagesApp().modeleGenerationFichierCsv , 
      "metadata": global_metadata , "data": global_aJeuDonneesConcat} ) 
    ); 
    res.end();
  }

  // Edition du jeu de données, sans modification des metatadata ; MAJ globalVars
  if(req.query.setGlobalVars=="true"){
    console.log("/ajax/v1.7/importer:: req.body  = ", req.body);
    if(req.body.data!=undefined)
      global_aJeuDonneesConcat = req.body.data;
    // TODO ARCHI 
    //   Un problème non anticipé existe : si les metatdata ne sont pas modifiées par l'appli, les valeurs qui seront enregistrées pour le prochain fichier généré, en stockage persistant via add_fichiersGeneres, sont POSSIBLEMENT ERRONNEES car étant non actualisées 
    //   NB : les valeurs POSSIBLEMENT NON ACTUALISEES étant : _nombreSessionsUtilisateurs=null, _nombreActionsUtilisateurs=null, _dateDebutJeuDonnees=null, _dateFinJeuDonnees=null
    //   Une résolution : Pour conserver cette fonctionnamité il faudrait ajouter des contraintes NON CONTROLLABLE par l'appli , soit RESPONSABILISER l'utilisateur :
    //   Le prévenir et lui permettre de signaler ses modifications :
    //   - chaque session utilisateur supprimé ou ajoutée doit être signalée - UI : label + input de valeur numérique
    //   - chaque action utilisateur supprimée ou ajoutée doit être signalée - UI : label + input de valeur numérique
    //   - la première et la dernières actions utilisateur ne DOIVENT PAS être modifiée (ni suppression ni ajout) UI : label
    //   - valider ses modification : UI : btn (=existant)
    // TODO :  dataModel.set_reglagesApp_modelGenerFic(req.body.modeleGenerationFichierCsv)
    
    else if(req.body.modeleGenerationFichierCsv!=undefined){
      console.log("req.body.modeleGenerationFichierCsv = "+req.body.modeleGenerationFichierCsv);
      dataModel.set_reglagesApp_modelGenerFic(req.body.modeleGenerationFichierCsv);
    }
    res.writeHead(200);
    res.write( '{"added": "true"}' );
    res.end();
  }
});

app.get('/ajax/v1.7/importer', function(req, res, next) {

  if(req.query.setModeleFichierCSV!=undefined){
    var modeleFichierCSV = req.query.setModeleFichierCSV;
    // TODO 
  }
  else{
    // modèle du wrapping de req => dateMaxLimite=<"0"|"dd/mm/yyyy">&dateMinLimite=<"0"|"dd/mm/yyyy">&funnels=<"true"|"false">
    // Erreur : parfois sur alert de JS : retourne erreur 500, parfois aucun retour
    var mockData = false;
    if(req.query.mockData=="true")
      mockData = true;
    var activRechercherFunnels = false;
    if(req.query.activRechercherFunnels=="true")
      activRechercherFunnels = true;
    var getGlobalVars = false;
    console.log("/ajax/v1.7/importer :: mockData = ",mockData);
    // récupérer globalVars ; modifier globalVars 
    // => routé par app.post('/ajax/v1.7/importer')

    // importer jeu de données :
    // DEV :
    //console.log("activRechercherFunnels = " + activRechercherFunnels);
    var dateMaxLimite = 0;
    var dateMinLimite = 0;
    if(req.query.dateMaxLimite!= "0" && req.query.dateMinLimite!= "0"){
     const aDateMaxLimite = req.query.dateMaxLimite.split("-");
     dateMaxLimite = new Date( Number(aDateMaxLimite[2]),Number(aDateMaxLimite[1]-1),Number(aDateMaxLimite[0]) );
     const aDateMinLimite = req.query.dateMinLimite.split("-");
     dateMinLimite = new Date( Number(aDateMinLimite[2]),Number(aDateMinLimite[1]-1),Number(aDateMinLimite[0]) );
    }
    //DEV Archi avec service firebase mock :
    if(!mockData){
      ajaxController.importerJeuDonnees(firebaseService, activRechercherFunnels, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{ 
        call_repartirJeuDonnees(oJeuDonneesConcat, activRechercherFunnels, res) 
      });
    }
    else{
      ajaxController.mockData_importerDonnees(mockFirebaseService, activRechercherFunnels, dateMaxLimite, dateMinLimite).then( (oJeuDonneesConcat)=>{ 
        call_repartirJeuDonnees(oJeuDonneesConcat, activRechercherFunnels, res) 
      });
    }
    // 
    //DEV Archi sans service firebase mock : 
    /*ajaxController.importerJeuDonnees(firebaseService, activRechercherFunnels, dateMaxLimite, dateMinLimite, mockData).then( (oJeuDonneesConcat)=>{
      //const aJeuDonneesConcat = oResults.aJeuDonneesConcat;
      //const metadata = oResults.metadata;
      // DEV 
      //console.log("ajaxController.importerJeuDonnees caller :: aJeuDonneesConcat.length = "+ aJeuDonneesConcat.length );
      console.log("ajaxController.importerJeuDonnees caller :: oJeuDonneesConcat.data.length = "+ oJeuDonneesConcat.data.length +" ; oJeuDonneesConcat.metadata = "+JSON.stringify(oJeuDonneesConcat.metadata) );
      // [HACK] TODO stockage volatile pour respect de SOLID :
      global_aJeuDonneesConcat = oJeuDonneesConcat.data;
      global_activRechercherFunnels = activRechercherFunnels;
      global_metadata = oJeuDonneesConcat.metadata;

      // INUTILES : 
      //global_dateMaxLimite = global_dateMaxLimite;
      //global_dateMinLimite = global_dateMinLimite;
      res.writeHead(200, {"Content-Type": "application/json"});
      // TESTER 
      //res.write( data: JSON.stringify(oJeuDonneesConcat.data), metadata: JSON.stringify(oJeuDonneesConcat.metadata) );
      res.write( JSON.stringify( oJeuDonneesConcat) );
      // TODO metadata
      //res.writeHead(200, {"Content-Type": "application/json"});
      //res.write( '{"metadata": '+ global_metadata +', "aJeuDonneesConcat": '+JSON.stringify(aJeuDonneesConcat)'}' );
      res.end();
    });
    //console.log( " ajaxController.lancerImportationJeuDonnees(req) = "+ajaxController.lancerImportationJeuDonnees(req));
    // TODO : vers le gestionnaire ajax => ajaxController.<methode>(req, res, next); , 
    // Schéma méthode ajax redistribue vers méthodes privées selon les attribus : lancerImport , getStatsJeuDonnees, ...
    //
    */
  }
});

// Fonction commune aux données de mock, et données de production
function call_repartirJeuDonnees(_oJeuDonneesConcat, _activRechercherFunnels, _res)
{
  //const aJeuDonneesConcat = oResults.aJeuDonneesConcat;
  //const metadata = oResults.metadata;
  // DEV 
  //console.log("ajaxController.importerJeuDonnees caller :: aJeuDonneesConcat.length = "+ aJeuDonneesConcat.length );
  console.log("ajaxController.importerJeuDonnees caller :: _oJeuDonneesConcat.data.length = "+ _oJeuDonneesConcat.data.length +" ; _oJeuDonneesConcat.metadata = "+JSON.stringify(_oJeuDonneesConcat.metadata) );
  // [HACK] TODO stockage volatile pour respect de SOLID :
  global_aJeuDonneesConcat = _oJeuDonneesConcat.data;
  global_activRechercherFunnels = _activRechercherFunnels;
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
  ajaxController.genererFichierCSV(global_aJeuDonneesConcat, global_activRechercherFunnels,
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
//////////////// gestion des messages d'erreurs ////////////////


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


/** Gestion des erreur formulation de routes par l'utilisateur : via HTTP code 404 */
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
