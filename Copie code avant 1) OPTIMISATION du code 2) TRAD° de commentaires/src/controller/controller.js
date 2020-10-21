module.exports = {
  configurerController: configurerController,
  importerController: importerController,
  telechargerController: telechargerController,
  status404PageController : status404PageController,
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