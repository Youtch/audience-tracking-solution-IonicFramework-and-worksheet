// services/date-operations-service.js 
// TODO : remove the app's unused functions 

// Private vars:
const daysOfWeekHumanText_fr_short = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];//Attention ! Ordre numérique à l'anglaise 
const daysOfWeekHumanText_fr_long = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];//Attention ! Ordre numérique à l'anglaise 
const monthsHumanText_fr_short = ["Janv","Févr","Mars","Avr","Mai","Juin","Juil","Aoû","Sept","Oct","Nov","Déc"];
const monthsHumanText_fr_long = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
// Private vars:
const daysOfWeekHumanText_en_short = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];//Attention ! Ordre numérique à l'anglaise 
const daysOfWeekHumanText_en_long = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];//Attention ! Ordre numérique à l'anglaise !
const monthsHumanText_en_short = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthsHumanText_en_long = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	
module.exports = class DateOperationsService {
	
	// /!\ public constants or variables are forbbiden
	constructor() 
    {}

    /** conversion from date to ISO string, without any timezone offset (date & hours) */
	getDateToISOWithoutOffset(_date)
	{
		var tzoffset = (_date).getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(_date.getTime() - tzoffset)).toISOString().slice(0,-1);
		return localISOTime;
	}

    /**
    * @param input:number
    * @return string
    **/
	getNumberToTwoDigitsString(input)
	{
		if((input).toString().length<2)
			return ("0"+input).toString();
		else
			return input.toString();
	}
	
	/**
	** @param strDate:Date (format = 24:00)
	** @return Date
	**/
	getHoursFromString(strDate)
	{
		let aDate = strDate.split( ":" );
		return new Date(0, 0, 0, Number(aDate[0]) , Number(aDate[1]), 0);
	}

	/**
	** @param date1:Date
	** @param date2:Date
	** @param typeOutput:string
	** @return number
	**/
	getDateDiff(dateMax, dateMin, typeOutput)
	{
		let diff;
		diff = dateMax.getTime() - dateMin.getTime();
		switch(typeOutput){
			case "ms": // to get number of milliseconds
			  diff = diff;
			break;
			case "sec": // to get number of seconds
			  diff = diff / 1000;
			break;
			case "min": // to get number of minutes
			  diff = diff / 1000 / 60;
			break;
			case "hour": // to get number of hours
			  diff = diff / 1000 / 60 / 60;
			break;
			case "days": // to get number of days
			  diff = diff / 1000 / 60 / 60 / 24;
			break;
			case "weeks": // to get number of weeks;
			  diff = diff / 1000 / 60 / 60 / 24 / 7;
			break;
		}
		console.log("[after] diff ="+diff);
		return diff;
	}

	/**
	** @param date:string (pattern : "##-##-####-##:##:##"|"####-##-##-##:##:##")
	** @param convertType:string (values : "frToUs", "usToFr")
	** @param showTime:Boolean
	** @return string
	**/
	convertStringDateToLocal(date, convertType, showTime=false)
	{
		// TODO : ajouter des masques 0 , ajouter le nom du jour en français
		aTempDate = (dateStringType).split("-");
        //aTempDate = (itemStats.val().date).split("-");
        if(conversionType=="usToFr")
		  strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
		else//if(conversionType=="frToUs")
		  strDateFormatee = aTempDate[2] + "-" + aTempDate[1]+ "-" + aTempDate[0]+ " "+aTempDate[3];
		return strDateFormatee;
	}
		
	/**
	** @param date:Date
	** @param numberOfDays:number
	** @return Date
	**/
	dateAddSomeDays(date,numberOfDays)
	{
		let newDate = new Date( date.getTime() + numberOfDays*24*60*60*1000);
		//console.log("BOUtils::date = "+this.getDateToISOWithoutOffset(date)+" ; BOUTILS::newDate = "+this.getDateToISOWithoutOffset(newDate) );
		return newDate;
	}

	/** 
	  #About english translations of dates
	    CF  : https://bilingueanglais.com/blog/2788/les-dates-en-anglais/ et bbc.co.uk 
	    1) short US format the more used is : mm/dd/yyyy.
		month/day/year 
		e.g.: 12/31/17 explains the december 31th of 2017.
	    2) British format :
	    "Wed 07 Aug" or "Wed 07 Aug 2018"
		The short british format is : dd/mm/yyyy.
		day/month/year : it's similar to the french format
		e.g.: 31/12/2017 explains the december 31th of 2017.
	 **/

	/**
	 * @param date:Date
	 * @param langIsFr:Boolean
	 * @param displayYear:Boolean
	 * @param shortFormat:Boolean
	 * @param shortFullYear:Boolean
	 * @param showTime:Boolean
	 * @param timeFormat:number
	 * @param ajoutArticles:Boolean
	 * @return string
	 */
	getDateToShortHumanText_i18n(date, langIsFr=true, displayYear=true, shortFormat=true, shortFullYear=false, showTime=false, timeFormat=1, ajoutArticles=false)
	{ 
		let strDate;
		let formatedYear;
		if(langIsFr){// Language is french
			(shortFullYear==true)? formatedYear = date.getFullYear().toString().substr(2) : formatedYear = date.getFullYear().toString();
			if(shortFormat==true){
				strDate = daysOfWeekHumanText_fr_short[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_fr_short[date.getMonth()];
			}else{
				strDate = daysOfWeekHumanText_fr_long[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_fr_long[date.getMonth()];
			}
			if(displayYear==true)
				strDate = strDate +" "+formatedYear;
		}
		else{// Language is english
			(shortFullYear==true)? formatedYear = date.getFullYear().toString().substr(2) : formatedYear = date.getFullYear().toString();
			if(shortFormat==true){
				strDate = daysOfWeekHumanText_en_short[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_en_short[date.getMonth()];
			}else{
				strDate = daysOfWeekHumanText_en_long[Number(date.getDay())]+" "+this.getNumberToTwoDigitsString( date.getDate() )+" "+monthsHumanText_en_long[date.getMonth()];
			}
			if(displayYear==true)
				strDate = strDate +" "+formatedYear;
		}
		
		// And add an article to the statement's part
    	if(ajoutArticles)
          strDate = "le " + strDate;

		if(showTime)
		{
		    var minutes = date.getMinutes();
			if(date.getMinutes()<10)
				minutes = "0"+minutes ;
			var h;
			switch(timeFormat){
			  case 1:
			    h = date.getHours() + ":" + minutes;
			  break;
			  case 2:
			    h = date.getHours() + " h " + minutes+" min";
			  break;
			}
			// And add an article to the statement's part
	        if(ajoutArticles)
		      strDate = strDate + " à " + h;
		    else
		      strDate = strDate + " " + h;
		}
		return strDate;
	}

	/**
	** @param strDate:string
	** @param separateurDate:string
	** @param onlyDate:Boolean
	** @param makedUpResult:Boolean
	** @param amPm_or_24h_format:Boolean
	** @param fr_or_en_country_date_order:Boolean
	** @return string
	**/
	getStringDateFromGMT(strDate, separateurDate="/", onlyDate=false, makedUpResult=true, amPm_or_24h_format=true, fr_or_en_country_date_order=true)
	{
		// 2017-09-14 13:00:00 GMT
		let aTemp1 = strDate.split( "-" );
		let aTemp2 =  aTemp1[2].split(":");
		let o;
		//console.log( "aTemp1 ="+JSON.stringify(aTemp1) );
		//console.log( "aTemp2 ="+JSON.stringify(aTemp2) );

		let heure;
		let mu_part1 = "";// makeUpResult_part1
  		let mu_part2 = "";// makeUpResult_part2
  		let tranche = "";// soit am soit pm soit vide
		  	
		switch(amPm_or_24h_format){
		  case true:
		  	heure = aTemp2[0].substr(2);
		  break;
		  case false:
		  // TODO : à tester 
		  	// Déterminer l'horaire 
		  	heure = aTemp2[0].substr(2);
		  	if(Number(heure)==0 ){
		  		heure = "12";  tranche = "am";// cas minuit
		  	}
		  	else if(Number(heure)<12 ){
		  		heure = tranche = "am";// cas matinée
		  	}
		  	else if(Number(heure)==12) {
		  		heure = tranche = "am";// cas midi
		  	}
		  	else if(Number(heure)>12){
		  		heure = ( Number(heure)/2 ).toString(); tranche = "pm";// cas après-midi
		  	}

		  	// TODO : cf prevision.ts::getParsedDate et inverser la demande
		  	// 2 cas difficiles : mode 24 :  00:10 => 12:10 am
		  	// Sinon  mode 24 avec x:00 => 
		  	//				si x==0 alors x=12 et  tranche="am" (minuit)
		  	//				sinon si x>12 alors x=x/2 et tranche="pm"
		  	//				sinon si x==12 alors tranche="pm"
		  	//				sinon si x<=12 alors x=x/2 et tranche="am" (jusqu'à midi)
		  break;
		}
		if(fr_or_en_country_date_order){ // Langue française
	  		
			if(makedUpResult){
				mu_part1 = "le "; mu_part2 = " à "; 
			}
			o =  mu_part1 + aTemp1[2].substr(0,2) + separateurDate +aTemp1[1] + separateurDate + aTemp1[0];
	  	}
	  	else{ // Langue anglaise
	  		if(makedUpResult){
	  			mu_part1 = "the "; mu_part2 = " at "; 
	  		}
			o =  mu_part1 + aTemp1[0] +separateurDate + aTemp1[1] + separateurDate + aTemp1[2].substr(0,2) ;
		}	
		if(!onlyDate)
			o = o + mu_part2 + heure + ":" +aTemp2[1]+":"+aTemp2[2] + tranche;
		// console.log( "debugDate.toISOString()  = "+this.getDateToISOWithoutOffset(debugDate) );
		return o;
	}

	/**
	 * Add a two-digit mask to numeric value : (e.g. : 1 returns 01, and 20 returns 20)
	 * @param valeur:number
 	 * @return string
	 */
	masquageDeuxCaract(valeur)
	{
	  if(valeur<10)
        valeur = "0"+valeur;	
      return valeur;
	}

}

