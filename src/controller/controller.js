var rdTestsUisPage =  require('./rd-tests-uis-page');

module.exports = {
  configurerController: configurerController,
  importerController: importerController,
  telechargerController: telechargerController,
  status404PageController : status404PageController,
  // DEV : à ne pas conserver sur STAU v1.0
  rdTestsUisController:rdTestsUisController,
  // DEV : à ne pas conserver sur STAU v1.0
  datavisualisationController:datavisualisationController
}

function configurerController(req,res){
  // Chargement de la page par la VIEW
  res.render("pages/configurer");
}
function importerController(req,res){
	// Chargement de la page par la VIEW
  res.render("pages/importer");
}
function telechargerController(req,res){
  res.render("pages/telecharger");
}
function status404PageController(req,res){
  res.render("pages/status404");
}
// DEV TEST 
function rdTestsUisController(req,res){
  rdTestsUisPage.init();
  res.render("pages/RD-tests-UIs",{
    navPageNom : "rdTestsUis",
  });
}

function datavisualisationController(req,res){
  res.render("pages/datavisualisation");
}