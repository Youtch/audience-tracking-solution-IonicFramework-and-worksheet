/////////// Exporter les fonctions publiques
module.exports = {
  init:init,
   // DEV niveau 1
  //testGlobalVisible:testGlobalVisible,
  test_getParamsConfig:test_getParamsConfig
};

// ATTENTION : ne pas typer les variable (!= Typescript)
var testGlobalVisible;// attendu : N'EST PAS visible dans controller 
var testGlobalInvisible;// attendu : EST visible dans controller

function init(){
  /* NOK : créer des variables de portée globale
  var drinks = getDrinks();
  var tagline = getTagline();*/

  // une serie d'initialisation : création de session, ...
  testGlobalVisible = true;
  testGlobalInvisible = true;
  var testVisible = false;

  return;
}

// Public
function test_getParamsConfig(){
  console.log("////// configService //////");
  
  
  console.log("configService::testGlobalVisible ="+ testGlobalVisible);
  console.log("configService::testGlobalInvisible ="+ testGlobalInvisible);
  return({"param1":true, "param2":"2020-01-17-20:10:05"}); 
}
