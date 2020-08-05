<!-- views/pages/configurer.js 
  Dépendances : TODO
-->

<script>
function init(){
   initDatePickers();
}


function initDatePickers()
{
    var today = new Date();
    $('#startDate').datepicker({
        locale:"fr-fr",
        uiLibrary: 'bootstrap4',
        autoclose: true,
        format: "dd-mm-yyyy",
        immediateUpdates: true,
        todayBtn: true,
        todayHighlight: true,
        maxDate: today,
        close: onCloseDatePicker
    });

    /*var now = new Date();
    now.setMonth(now.getMonth()-1);
    var dateLastMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() );
    */
    var dateLastMonth = new Date();
    dateLastMonth = dateLastMonth.setMonth(dateLastMonth.getMonth()-1);

     $('#endDate').datepicker({
        locale:"fr-fr",
        uiLibrary: 'bootstrap4',
        autoclose: true,
        format: "dd-mm-yyyy",
        immediateUpdates: true,
        todayBtn: true,
        todayHighlight: true,
        minDate: dateLastMonth,
        close: function (e) {
             console.log('#endDate "Close" is fired.');
         }
     });
}

function onCloseDatePicker(e) {
    // DEV : 
    // console.log("e = ",e);
    console.log("#"+e.target.id + " 'Close' is fired.");
}



function navGoTo(_chemin){
  alert("_chemin = "+_chemin);
   window.location.assign(_chemin);
}

function testerAjaxJQuery(){ // Autoformation : cf https://learn.jquery.com/
// objectif : remplacer les UI li dans l'ul listeProjets
    var data = {"AjoutTrucs":30,"AjoutBidules":20,"AjoutMachins":10};
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        cache: false,
        contentType: 'application/json',
        datatype: "json",
        url: '/TODO/',
        success: function (result) {     
        	console.log("Here are the response in json format: " + result);
		    $('listeProjets').empty();
		    for (var data in result) {
		       $('listeProjets').append('<li>'+data+'</li>');
		    }
		}
    });
}

///////////////////// Tests des fonctionnalité métiers / business object "peupler-modale" ///////////////////// 

///////////////////// Gestion de la modale d'état des traitements /////////////////////
function demanderSupprimerTrucs()
{
  afficherModalEtat(
    1,
    "Confirmez vous la suppression des TRUCS?",
    "fa-exclamation-triangle",
    "Seules les TRUCS vont êtres supprimés", 
    true, 
    true,
    "Oui supprimer",
    "Non annuler"
  );
}
function demanderSupprimerBidules()
{
  afficherModalEtat(
    2,
    "Confirmez vous suppression des BIDULES ?",
    "fa-exclamation-triangle",
    "...."+
    ".....", 
    true, 
    true,
    "Oui supprimer",
    "Non annuler"
  );
}


function ctaValiderModalEtatsTrt()
{
  console.log("numPageModalId ="+numPageModalId);
  if(numPageModalId==1){
    console.log("CONFIRMER la suppression des données !");
  }
  else if(numPageModalId==2){
    console.log("CONFIRMER demanderAfficherHerons !");
  }
  //Cacher :
  fermerModal();
}
function ctaAnnulerModalEtatsTrt()
{
  if(numPageModalId==1){
    console.log("ANNULER la suppression des données !") 
  }
  else if(numPageModalId==2){
    console.log("ANNULER demanderAfficherHerons !");
  }
  //Caché automatiquement
}


///////////////////// Tests des bibliothèques de data-visualization ///////////////////// 

  ////////////////////// Créer un custom theme //////////////////////
  function am4themes_customChartTheme(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        // Classement de données : de la plus grande vers la plus petite
        am4core.color("indigo"),
        am4core.color("purple"),
        am4core.color("blue"),
        am4core.color("silver"),
        am4core.color("grey"),
        am4core.color("green")
      ];
    }
  }
  
  ////////////////////// Code pour Charts.js //////////////////////
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [{
        data: [19, 12, 5, 3, 2],
        backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)"
        ],
        borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)"
        ],
      }],
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["PrevisionsP", "FavoritesM", "TutorielP", "Settings", "APropos"],
    },
    options : {
      cutoutPercentage: 25, // Si >0 : Transforme le camember/pie en anneau/doughnut 
      title: {
          display: true,
          text: "Pourcentage des pages ouvertes (%)",
          fontSize:14, // par défaut : 12
          fontColor:"indigo",
          fontFamily: "Verdana,Helvetica",
      },
    }
  });

  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: ["PrevisionsP", "FavoritesM", "TutorielP", "Settings", "APropos"],
        datasets: [{
            data: [19, 12, 5, 3, 2],
            backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)"
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        title: {
          display: true,
          text: "Pourcentage des pages ouvertes (%)",
          fontSize:14, // par défaut : 12
          fontColor:"cyan",
          fontFamily: "Verdana,Helvetica",
        },
    }
  });



  ////////////////////// Code pour amCharts //////////////////////
  am4core.ready(function() {


    //////////////////#Pie: graphe pie / camembert en 3D interactif //////////////////
    // Themes begin
    // am4core.useTheme(am4themes_material); 
    am4core.useTheme(am4themes_customChartTheme);
    // Themes end
    
    var chart = am4core.create("div-chartPieComparatifPages", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();

    chart.data = [
      {
        pageNom: "PrevisionsP",
        pourcentage: 19
      },
      {
        pageNom: "FavoritesM",
        pourcentage: 12
      },
      {
        pageNom: "TutorielP",
        pourcentage: 5
      },
      {
        pageNom: "Settings",
        pourcentage: 3
      },
      {
        pageNom: "APropos",
        pourcentage: 2
      }
    ];

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "pourcentage";
    series.dataFields.category = "pageNom";



    //////////////////#Pie: Dragging Pie Slices : Camembert réparti en deux partie personnalisable //////////////////
    // Themes begin
    // am4core.useTheme(am4themes_material); 
    am4core.useTheme(am4themes_customChartTheme);
    // Themes end
 
    var data = [{
    "pageNom": "", // SI un des sous-graphe est vide
    "disabled": true,
    "pourcentage": 100,
    "color": am4core.color("#dadada"),
    "opacity": 0.3,
    "strokeDasharray": "4,4"
    },
    {
      pageNom: "PrevisionsP",
      pourcentage: 19
    },
    {
      pageNom: "FavoritesM",
      pourcentage: 12
    },
    {
      pageNom: "TutorielP",
      pourcentage: 5
    },
    {
      pageNom: "Settings",
      pourcentage: 3
    },
    {
      pageNom: "APropos",
      pourcentage: 2
    }];
    // cointainer to hold both charts
    var container = am4core.create("div-chartDraggingPieSlices", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";

    container.events.on("maxsizechanged", function () {
        chart1.zIndex = 0;
        separatorLine.zIndex = 1;
        dragText.zIndex = 2;
        chart2.zIndex = 3;
    })

    var chart1 = container.createChild(am4charts.PieChart);
    chart1 .fontSize = 11;
    chart1.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart1.data = data;
    chart1.radius = am4core.percent(70);
    chart1.innerRadius = am4core.percent(40);
    chart1.zIndex = 1;

    var series1 = chart1.series.push(new am4charts.PieSeries());
    series1.dataFields.value = "pourcentage";
    series1.dataFields.category = "pageNom";
    series1.colors.step = 2;
    series1.alignLabels = false;
    series1.labels.template.bent = true;
    series1.labels.template.radius = 3;
    series1.labels.template.padding(0,0,0,0);

    var sliceTemplate1 = series1.slices.template;
    sliceTemplate1.cornerRadius = 5;
    sliceTemplate1.draggable = true;
    sliceTemplate1.inert = true;
    sliceTemplate1.propertyFields.fill = "color";
    sliceTemplate1.propertyFields.fillOpacity = "opacity";
    sliceTemplate1.propertyFields.stroke = "color";
    sliceTemplate1.propertyFields.strokeDasharray = "strokeDasharray";
    sliceTemplate1.strokeWidth = 1;
    sliceTemplate1.strokeOpacity = 1;

    var zIndex = 5;

    sliceTemplate1.events.on("down", function (event) {
        event.target.toFront();
        // also put chart to front
        var series = event.target.dataItem.component;
        series.chart.zIndex = zIndex++;
    })

    series1.ticks.template.disabled = true;

    sliceTemplate1.states.getKey("active").properties.shiftRadius = 0;

    sliceTemplate1.events.on("dragstop", function (event) {
        handleDragStop(event);
    })

    // separator line and text
    var separatorLine = container.createChild(am4core.Line);
    separatorLine.x1 = 0;
    separatorLine.y2 = 300;
    separatorLine.strokeWidth = 3;
    separatorLine.stroke = am4core.color("#dadada");
    separatorLine.valign = "middle";
    separatorLine.strokeDasharray = "5,5";


    var dragText = container.createChild(am4core.Label);
    dragText.text = "Glissez des éléments selon cette ligne";
    dragText.rotation = 90;
    dragText.valign = "middle";
    dragText.align = "center";
    dragText.paddingBottom = 5;

    // second chart
    var chart2 = container.createChild(am4charts.PieChart);
    chart2.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart2 .fontSize = 11;
    chart2.radius = am4core.percent(70);
    chart2.data = data;
    chart2.innerRadius = am4core.percent(40);
    chart2.zIndex = 1;

    var series2 = chart2.series.push(new am4charts.PieSeries());
    series2.dataFields.value = "pourcentage";
    series2.dataFields.category = "pageNom";
    series2.colors.step = 2;

    series2.alignLabels = false;
    series2.labels.template.bent = true;
    series2.labels.template.radius = 3;
    series2.labels.template.padding(0,0,0,0);
    series2.labels.template.propertyFields.disabled = "disabled";

    var sliceTemplate2 = series2.slices.template;
    sliceTemplate2.copyFrom(sliceTemplate1);

    series2.ticks.template.disabled = true;

    function handleDragStop(event) {
        var targetSlice = event.target;
        var dataItem1;
        var dataItem2;
        var slice1;
        var slice2;

        if (series1.slices.indexOf(targetSlice) != -1) {
            slice1 = targetSlice;
            slice2 = series2.dataItems.getIndex(targetSlice.dataItem.index).slice;
        }
        else if (series2.slices.indexOf(targetSlice) != -1) {
            slice1 = series1.dataItems.getIndex(targetSlice.dataItem.index).slice;
            slice2 = targetSlice;
        }


        dataItem1 = slice1.dataItem;
        dataItem2 = slice2.dataItem;

        var series1Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series1.slicesContainer);
        var series2Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series2.slicesContainer);

        var series1CenterConverted = am4core.utils.svgPointToSprite(series1Center, series2.slicesContainer);
        var series2CenterConverted = am4core.utils.svgPointToSprite(series2Center, series1.slicesContainer);

        // tooltipY and tooltipY are in the middle of the slice, so we use them to avoid extra calculations
        var targetSlicePoint = am4core.utils.spritePointToSvg({ x: targetSlice.tooltipX, y: targetSlice.tooltipY }, targetSlice);

        if (targetSlice == slice1) {
            if (targetSlicePoint.x > container.pixelWidth / 2) {
                var value = dataItem1.value;

                dataItem1.hide();

                var animation = slice1.animate([{ property: "x", to: series2CenterConverted.x }, { property: "y", to: series2CenterConverted.y }], 400);
                animation.events.on("animationprogress", function (event) {
                    slice1.hideTooltip();
                })

                slice2.x = 0;
                slice2.y = 0;

                dataItem2.show();
            }
            else {
                slice1.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
            }
        }
        if (targetSlice == slice2) {
            if (targetSlicePoint.x < container.pixelWidth / 2) {

                var value = dataItem2.value;

                dataItem2.hide();

                var animation = slice2.animate([{ property: "x", to: series1CenterConverted.x }, { property: "y", to: series1CenterConverted.y }], 400);
                animation.events.on("animationprogress", function (event) {
                    slice2.hideTooltip();
                })

                slice1.x = 0;
                slice1.y = 0;
                dataItem1.show();
            }
            else {
                slice2.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
            }
        }

        toggleEmptySlice(series1);
        toggleEmptySlice(series2);

        series1.hideTooltip();
        series2.hideTooltip();
    }

    function toggleEmptySlice(series) {
        var show = true;
        for (var i = 1; i < series.dataItems.length; i++) {
            var dataItem = series.dataItems.getIndex(i);
            if (dataItem.slice.visible && !dataItem.slice.isHiding) {
                show = false;
            }
        }

        var dummySlice = series.dataItems.getIndex(0);
        if (show) {
            dummySlice.show();
        }
        else {
            dummySlice.hide();
        }
    }

    series2.events.on("datavalidated", function () {

        var dummyDataItem = series2.dataItems.getIndex(0);
        dummyDataItem.show(0);
        dummyDataItem.slice.draggable = false;
        dummyDataItem.slice.tooltipText = undefined;

        for (var i = 1; i < series2.dataItems.length; i++) {
            series2.dataItems.getIndex(i).hide(0);
        }
    })

    series1.events.on("datavalidated", function () {
        var dummyDataItem = series1.dataItems.getIndex(0);
        dummyDataItem.hide(0);
        dummyDataItem.slice.draggable = false;
        dummyDataItem.slice.tooltipText = undefined;
    })


    //////////////////#Bars : simple columns / simple graphe en bâtons //////////////////
    // COMPOSANTS UI : Distribution des dénombrements
    // Create chart instance
    var chart = am4core.create("div-chartSimpleColumns", am4charts.XYChart);

    // Add data
    chart.data = [{
      "composantUI": "btnMenu",
      "visites": 80 
    }, {
      "composantUI": "btnGeoloc",
      "visites": 57 
    }, {
      "composantUI": "btnAjouterFavoriteRefuse",
      "visites": 0
    }, {
      "composantUI": "btnAjouterFavoriteAccepte",
      "visites": 7 
    }, {
      "composantUI": "rafraichMeteo",
      "visites": 35
    }, {
      "composantUI": "swipeVersVuePlanete",
      "visites": 35
    }];

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "composantUI";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "visites";
    series.dataFields.categoryX = "composantUI";
    series.name = "Visites";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1



    ////////////////// #Bars : Grouped and sorted columns / graphe en bâtons groupés et triés : Ma démo //////////////////
    //COMPOSANTS UI : Distribution des dénombrements
    var chart = am4core.create("div-chartGroupAndSortedColumns", am4charts.XYChart);

    // some extra padding for range labels
    chart.paddingBottom = 50;

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();

    // will use this to store colors of the same items
    var colors = {};

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataItems.template.text = "{realName}";
    categoryAxis.adapter.add("tooltipText", function(tooltipText, target){
      return categoryAxis.tooltipDataItem.dataContext.realName;
    })

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.min = 0;

    // single column series for all data
    var columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.columns.template.width = am4core.percent(80);
    columnSeries.tooltipText = "{provider}: {realName}, {valueY}";
    columnSeries.dataFields.categoryX = "category";
    columnSeries.dataFields.valueY = "value";

    // second value axis for quantity
    var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.opposite = true;
    valueAxis2.syncWithAxis = valueAxis;
    valueAxis2.tooltip.disabled = true;

    // fill adapter, here we save color value to colors object so that each time the item has the same name, the same color is used
    columnSeries.columns.template.adapter.add("fill", function(fill, target) {
     var name = target.dataItem.dataContext.realName;
     if (!colors[name]) {
       colors[name] = chart.colors.next();
     }
     target.stroke = colors[name];
     return colors[name];
    })


    var rangeTemplate = categoryAxis.axisRanges.template;
    rangeTemplate.tick.disabled = false;
    rangeTemplate.tick.location = 0;
    rangeTemplate.tick.strokeOpacity = 0.6;
    rangeTemplate.tick.length = 60;
    rangeTemplate.grid.strokeOpacity = 0.5;
    rangeTemplate.label.tooltip = new am4core.Tooltip();
    rangeTemplate.label.tooltip.dy = -10;
    rangeTemplate.label.cloneTooltip = false;

    ///// DATA
    var chartData = [];
    var lineSeriesData = [];

    var data =
    {
     "Provider 1": {
       "item 1": 10,
       "item 2": 35,
       "item 3": 5,
       "item 4": 20,
       "quantity":430
     },
     "Provider 2": {
       "item 1": 15,
       "item 3": 21,
       "quantity":210
     },
     "Provider 3": {
       "item 2": 25,
       "item 3": 11,
       "item 4": 17,
       "quantity":265
     },
     "Provider 4": {
       "item 3": 12,
       "item 4": 15,
       "quantity":98
     }
    }
/* NOK :
    var data =
    {
     "PrevisionsPage": {
       "initApp": 233,
       "btnMenu": 80,
       "btnGeoloc": 57,
       "btnAjouterFavoriteRefuse": 0,
       "quantity":370
     },
     "CreditsWeatherDataModal": {
       "lienFournisseurDS": 4,
       "lienFournisseurYW": 3,
       "quantity":7
     },
     "StationsFavoritesModal": {
       "btnFermer": 64,
       "quantity":64
     },
     "SettingsPage": {
       "SettingsPage>btnRetourPage": 20,
       "SettingsPage>btnAcheter": 2,
       "btnRestaurer": 7,
       "RestaureAchetePage > btnRetourPage": 4,
       "RestaureAchetePage > btnAcheter": 0,
       "btnVerifier": 0
       "quantity":34
     }
    }
*/
    // process data ant prepare it for the chart
    for (var providerName in data) {
     var providerData = data[providerName];

     // add data of one provider to temp array
     var tempArray = [];
     var count = 0;
     // add items
     for (var itemName in providerData) {
       if(itemName != "quantity"){
       count++;
       // we generate unique category for each column (providerName + "_" + itemName) and store realName
       tempArray.push({ category: providerName + "_" + itemName, realName: itemName, value: providerData[itemName], provider: providerName})
       }
     }
     // sort temp array
     tempArray.sort(function(a, b) {
       if (a.value > b.value) {
       return 1;
       }
       else if (a.value < b.value) {
       return -1
       }
       else {
       return 0;
       }
     })

     // add quantity and count to middle data item (line series uses it)
     var lineSeriesDataIndex = Math.floor(count / 2);
     tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
     tempArray[lineSeriesDataIndex].count = count;
     // push to the final data
     am4core.array.each(tempArray, function(item) {
       chartData.push(item);
     })

     // create range (the additional label at the bottom)
     var range = categoryAxis.axisRanges.create();
     range.category = tempArray[0].category;
     range.endCategory = tempArray[tempArray.length - 1].category;
     range.label.text = tempArray[0].provider;
     range.label.dy = 30;
     range.label.truncate = true;
     range.label.fontWeight = "bold";
     range.label.tooltipText = tempArray[0].provider;

     range.label.adapter.add("maxWidth", function(maxWidth, target){
       var range = target.dataItem;
       var startPosition = categoryAxis.categoryToPosition(range.category, 0);
       var endPosition = categoryAxis.categoryToPosition(range.endCategory, 1);
       var startX = categoryAxis.positionToCoordinate(startPosition);
       var endX = categoryAxis.positionToCoordinate(endPosition);
       return endX - startX;
     })
    }

    chart.data = chartData;


    // last tick
    var range = categoryAxis.axisRanges.create();
    range.category = chart.data[chart.data.length - 1].category;
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;

  }); // end am4core.ready()


  ///// #Datatables /////
  var stringI18nFrenchTranslating = {
    info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ (sur _TOTAL_)",
    infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 (sur 0)",
    infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
    infoPostFix:    "",
    //sInfoThousands:  " ",
    sLengthMenu:    "_MENU_ éléments affichés",
    loadingRecords: "Chargement en cours...",
    sSearch:         "Rechercher :",
    zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
    emptyTable:     "Aucune donnée disponible dans le tableau",
    paginate: {
        first:      "Premier",
        previous:   "Pr&eacute;c&eacute;dent",
        next:       "Suivant",
        last:       "Dernier"
    },
    aria: {
        sortAscending:  ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
    }
  };
  // TODO : au besoin puiser dans cette tradution exhaustive (https://datatables.net/plug-ins/i18n/German) : 
  /*
  {
    "sEmptyTable":      "Keine Daten in der Tabelle vorhanden",
    "sInfo":            "_START_ bis _END_ von _TOTAL_ Einträgen",
    "sInfoEmpty":       "Keine Daten vorhanden",
    "sInfoFiltered":    "(gefiltert von _MAX_ Einträgen)",
    "sInfoPostFix":     "",
    "sInfoThousands":   ".",
    "sLengthMenu":      "_MENU_ Einträge anzeigen",
    "sLoadingRecords":  "Wird geladen ..",
    "sProcessing":      "Bitte warten ..",
    "sSearch":          "Suchen",
    "sZeroRecords":     "Keine Einträge vorhanden",
    "oPaginate": {
        "sFirst":       "Erste",
        "sPrevious":    "Zurück",
        "sNext":        "Nächste",
        "sLast":        "Letzte"
    },
    "oAria": {
        "sSortAscending":  ": aktivieren, um Spalte aufsteigend zu sortieren",
        "sSortDescending": ": aktivieren, um Spalte absteigend zu sortieren"
    },
    "select": {
        "rows": {
            "_": "%d Zeilen ausgewählt",
            "0": "",
            "1": "1 Zeile ausgewählt"
        }
    },
    "buttons": {
        "print":    "Drucken",
        "colvis":   "Spalten",
        "copy":     "Kopieren",
        "copyTitle":    "In Zwischenablage kopieren",
        "copyKeys": "Taste <i>ctrl</i> oder <i>\u2318</i> + <i>C</i> um Tabelle<br>in Zwischenspeicher zu kopieren.<br><br>Um abzubrechen die Nachricht anklicken oder Escape drücken.",
        "copySuccess": {
            "_": "%d
    }   
  }*/

  //////////////////// Définition de tableauJeuxDonneesSessions  ////////////////////
  var dataSet = [
      [ "-Lxl9EN4dmC2PbTg84Sz", "04/01/2020  11:55:12", "-Lxl9EN4dmC2PbTg84Sz", "false", "9", "app.component", "initApp", "", "", "app.component", "0", "0", "0", "" ],
      [ "-Lxl9EN4dmC2PbTg84Sz", "10/01/2020  10:37:06", "-LyDo6bJ24rxWqKoon4Y", "", "", "app.component", "initApp", "", "", "", "", "", "", ""  ],
      [ "-LyDo8r9qp2yigcDb7C5", "10/01/2020  10:37:15", "-LyDo6bJ24rxWqKoon4Y", "", "", "TutorielPage", "btnSuivant", "", "", "", "", "", "", ""  ],
      [ "-LyDo9HO7DfGRAnOTZJH", "10/01/2020  10:37:16", "-LyDo6bJ24rxWqKoon4Y", "", "", "TutorielPage", "btnSuivant", "", "", "", "", "", "", ""  ],
      [ "-LyDoAqsDjWEIgHblRLD", "10/01/2020  10:37:23", "-LyDo6bJ24rxWqKoon4Y", "", "", "TutorielPage", "btnFinirTuto", "", "", "", "", "", "", ""  ],
      [ "-LyDoI6lpy2ai5PlD8pG", "10/01/2020  10:37:53", "-LyDo6bJ24rxWqKoon4Y", "", "", "PrevisionsPage", "btnMenu", "", "", "", "", "", "", ""  ],
      [ "-LyDoK4_N9O7q2ZvOX7f", "10/01/2020  10:38:01", "-LyDo6bJ24rxWqKoon4Y", "", "", "StationsFavoritesModal", "btnFermer", "", "", "", "", "", "", ""  ],
      [ "-LyDoKh-N0yXmup1FIGC", "10/01/2020  10:38:03", "-LyDo6bJ24rxWqKoon4Y", "false", "7.0", "PrevisionsPage", "btnGeoloc", "00:00:57", "00:00:14", "app.component>TutorielPage>PrevisionsPage>StationsFavoritesModal>PrevisionsPage", "6", "4", "0", ""  ],
      [ "-LyHudGrBuC6zEQ1rpwk", "11/01/2020 5:44:04","-LyHudGrBuC6zEQ1rpwk" , "", "", "app.component", "initApp", "", "", "", "", "", "", ""],
      [ "-LyHuoAI7I-MO6zp6Fh9", "11/01/2020 5:44:49","-LyHudGrBuC6zEQ1rpwk" , "", "", "TutorielPage", "btnSuivant", "", "", "", "", "", "", ""],
      [ "-LyHup3uae26Zs6hg0QH", "11/01/2020 5:44:52","-LyHudGrBuC6zEQ1rpwk" , "false",  "7.0",  "TutorielPage", "btnSuivant", "00:00:48", "00:00:48", "app.component>TutorielPage", "2",  "1",  "0", ""],
      [ "-LyIo3VjQLqUQjY641gm", "11/01/2020 9:55:03","-LyIo3VjQLqUQjY641gm", "", "", "app.component" , "initApp", "", "", "", "", "", "", ""],
      [ "-LyIo5RD8NDXzRMHisz5", "11/01/2020 9:55:11","-LyIo3VjQLqUQjY641gm", "", "", "PrevisionsPage" , "rafraichMeteo", "", "", "", "", "", "", ""],
      [ "-LyJE5GKaTd6XjJi5xSQ", "11/01/2020 11:53:08","-LyIo3VjQLqUQjY641gm", "", "", "PrevisionsPage" , "btnAjouterFavoriteAccepte", "", "", "", "", "", "", ""],
      [ "-LyJE61jFSBBcR71AVp6", "11/01/2020 11:53:12","-LyIo3VjQLqUQjY641gm", "", "", "PrevisionsPage" , "btnMenu", "", "", "", "", "", "", ""],
      [ "-LyJE8MgYNVeHWDINxe8", "11/01/2020 11:53:21","-LyIo3VjQLqUQjY641gm" , "", "", "StationsFavoritesModal" , "btnFermer", "", "", "", "", "", "", ""],
      [ "-LyJE9ao0RLopEpcHb1D", "11/01/2020 11:53:26","-LyIo3VjQLqUQjY641gm" , "false" , "8.0.0" , "PrevisionsPage" , "btnGeoloc", "01:58:23", "00:39:28" , "app.component>PrevisionsPage>StationsFavoritesModal>PrevisionsPage" , "5" , "3" , "0", ""] 

  ];
   
  //////////////////// Habiller du tableau tableauJeuxDonneesSessions ////////////////////
  $(document).ready(function() {
      $('#tableauJeuxDonneesSessions').DataTable( {
          language: stringI18nFrenchTranslating,
          /* NOK
          "language": {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/French.json" ou url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/German.json" ou "//cdn.datatables.net/plug-ins/1.10.16/i18n/French.json"
            ni
            url: "datatables-language-French.json" ou "./datatables-language-French.json" ou "/datatables-language-French.json" ou "//datatables-language-French.json"
          },*/
          data: dataSet,
          columns: [
              { title: "btnMenu" },
              { title: "btnGeoloc" },
              { title: "btnAjouterFavoriteRefuse" },
              { title: "btnAjouterFavoriteAccepte" },
              { title: "lienFournisseurDS" },
              { title: "lienFournisseurYW" },
              { title: "btnFermer" },
          ],
          "orderMulti": true/* Par défaut :
          ,
          "paging": true,
          "searching": true*/
      } );
  } );


  //////////////////// Habiller du tableau tableauSyntheseDnmbrmntPages ////////////////////
  $(document).ready(function() {
      $('#tableauSyntheseDnmbrmntPages').DataTable( {
          language: stringI18nFrenchTranslating,
          /* NOK
          "language": {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/French.json"
          },*/
          "columnDefs": [ {
              "visible": false,
              "targets": -1
          } ],
          "paging": false,
          "searching": false
      } );
  } );

  //////////////////// Habiller du tableau tableauSyntheseSessions ////////////////////
  $(document).ready(function() {
      $('#tableauSyntheseSessions').DataTable( {
          language: stringI18nFrenchTranslating,
          /* NOK
          "language": {
            url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/French.json"
          },*/
          "columnDefs": [ {
              "visible": false,
              "targets": -1
          } ],
          "paging": false,
          "searching": false
      } );
  } );

init();
</script>