 /**
 * @param  {object} ckIDs a set of stocks id
 */
 function exportLastestPrice(ckIDs) { 
   if (DEBUG) {
     console.info('exportLastestPrice');
   }
   var outerArray = [];
   var row = 0;
   for (; row < ckIDs.length&&ckIDs[row]!=""; row++) {
     var data = HistoricalDataService().getLastestHistoricaldata(ckIDs[row],EXP_HISTORY_CNT);
     for (var i in data) {
       outerArray.push(data[i]);
     }
   }
   return outerArray;
 };
 
 /**
 * @param  {object} ckIDs a set of stocks id
 * @param  {number} days
 */
 function exportAvgVolume(ckIDs,days) {
   if (DEBUG) {
     console.info('exportAvgVolume');
   }
   var outerArray = new Array();
   var row = 0;
   
   for (; row < ckIDs.length&&ckIDs[row]!=""; row++) {
     var avgSum = 0;
     var cnt = 0;
     var data = HistoricalDataService().getLastestHistoricaldata(ckIDs[row],days);
     for (var i in data) {
       cnt += 1;
       avgSum += Number(data[i][9]);
     }
     var avgArray = new Array();
     avgArray[0] = [[(avgSum/cnt).toFixed(0)]];
     outerArray.push(avgArray);
   }
   return outerArray;
 };

function exportBrokingByYear(ckIDs,year) {
  return BrokingInfoDataService().getBrokingByYear(ckIDs,year);
}

function exportTodayBrokingInfo(today) {
  if (DEBUG) {
     console.info('exportTodayBrokingInfo: '+ today);
  }
  var outerArray = new Array();
  var ebrokerArray = new Array();
  var buyingBrokers = new Array();
  var todayBrokers = new Array();
  buyingBrokers = BrokingInfoDataService().getBuyingBrokingInfo();
  todayBrokers = EbrokerDataService().getTodayBroker(today);
  for (var i = 0; i < todayBrokers.length; i++) {
    var key = todayBrokers[i][0];
    var broker = todayBrokers[i][2];
    var pos = SMUtils().isInBuyingArrays(key,buyingBrokers);
    if (pos >= 0) {
      ebrokerArray = new Array();
      ebrokerArray[0] = buyingBrokers[pos][0];
      ebrokerArray[1] = buyingBrokers[pos][1];
      ebrokerArray[2] = buyingBrokers[pos][2];
      ebrokerArray[3] = buyingBrokers[pos][3];
      ebrokerArray[4] = "";
      ebrokerArray[5] = todayBrokers[i][3];
      ebrokerArray[6] = todayBrokers[i][4];
      ebrokerArray[7] = ((ebrokerArray[5]-ebrokerArray[2])/ebrokerArray[2]).toFixed(2);
      if (broker == "Bán") {
        // New Bán
        ebrokerArray[4] = todayBrokers[i][1];
        console.log('SoldArray: ' + ebrokerArray);
      }
      outerArray.push(ebrokerArray);
    } else if(broker == "Mua") {
      // New Mua
      ebrokerArray = new Array();
      ebrokerArray[0] = key;
      ebrokerArray[1] = todayBrokers[i][1];
      ebrokerArray[2] = todayBrokers[i][3];
      ebrokerArray[3] = todayBrokers[i][4];
      ebrokerArray[4] = "";
      ebrokerArray[5] = todayBrokers[i][3];
      ebrokerArray[6] = todayBrokers[i][4];
      ebrokerArray[7] = "0";
      console.log('BuyArray: ' + ebrokerArray);
      outerArray.push(ebrokerArray);
    }
  }
  return outerArray;
}

/**
 * Export EPS 3Year for stocks list
 * @param  {object} ckIDs a set of stocks id
 */
function exportEPSYearly(ckIDs,firstYear) {
  if (DEBUG) {
     console.info('exportEPSYearly: '+ firstYear);
  }
  var bSheetArray = new Array();
  var incomeArray = new Array();
  var EPSYearlyArray = new Array();
  var EPSYearly = new Array();
  var years = 0;
  //data for 4Q
  var limitQuater = 4;
  var limitYear = 4;
  var startTime = new Date();
  
  for (n in ckIDs) {
    if(SMUtils().isTimeUp(startTime)) {
       console.log('[Export-EPSYearly] exceededMax! At %s', ckIDs[n]);
       break;
    }
    if (ckIDs[n] !== "") {
      //Reset to current year
      years = firstYear;
      var key = ckIDs[n];
      EPSYearly = new Array();
      //Loop for 3 year
      for (var i=0; i<limitYear; i++) {
        bSheetArray = BSheetDataService().getBSheetBykey(key+years+"Q4",limitQuater,SEARCH_TYPE_YEARLY);
        incomeArray = IncomeDataService().getIncomeBykey(key+years+"Q4",limitQuater,SEARCH_TYPE_YEARLY);
        var tempArr = SMUtils().calcStatisticsArray(bSheetArray,incomeArray);
        for (j=0; j<tempArr.length; j++){
          EPSYearly.push([tempArr[j]]);
        }
        //Prev year
        years = years - 1;
      }
      //Calc EPS Growth
      for (var n=0; n<limitYear-1; n++) {
        EPSYearly[n*12+5] = EPSYearly[n*12+4]/Math.abs(EPSYearly[n*12+16])-1;
        EPSYearly[n*12+7] = EPSYearly[n*12+6]/Math.abs(EPSYearly[n*12+18])-1;
        EPSYearly[n*12+9] = EPSYearly[n*12+8]/Math.abs(EPSYearly[n*12+20])-1;
        EPSYearly[n*12+11] = EPSYearly[n*12+10]/Math.abs(EPSYearly[n*12+22])-1;
      }
      console.log('exportEPSYearly('+key+years+') = '+EPSYearly);
      EPSYearlyArray.push(EPSYearly);
    }
  }
  return EPSYearlyArray;
};

/**
 * Export IncRev of this year for stocks list
 * @param  {object} ckIDs a set of stocks id
 */
function exportIncRevEPSYearly(ckIDs, year){
  if (DEBUG) {
     console.log("[Export-IncRevEPSYearly]");
  }
  var incRevArray = new Array();
  var incomeArray = new Array();
  var bSheetArray = new Array();
  var startTime = new Date();
  
  for (n in ckIDs) {
    if(SMUtils().isTimeUp(startTime)) {
       console.log('[Export-IncRevEPSYearly] exceededMax! At %s', ckIDs[n]);
       break;
    }
    var limitNum = 4;
    var EPS4Q = 0;
    var StickCnt = 0;
    if (ckIDs[n] !== "") {
      var key = ckIDs[n]+year+"Q4";
      incomeArray = IncomeDataService().getIncomeBykey(key,limitNum,SEARCH_TYPE_YEARLY);
      if (incomeArray.length !== 0) {
        bSheetArray = BSheetDataService().getBSheetBykey(key,limitNum,SEARCH_TYPE_YEARLY);
      }
      var epsCalcBln = true;
      if(bSheetArray.length !== incomeArray.length || incomeArray.length == 0) {
        epsCalcBln = false;
      }
      var IncRev = new Array();
      //Data trouble return "#N/A"
      IncRev[0] = "#N/A";
      IncRev[1] = "#N/A";
      IncRev[2] = "#N/A";
      if (epsCalcBln) {
        var Inc = 0;
        var Rev = 0;
        for (var i = 0; i < incomeArray.length; i++) {
          StickCnt = Number(bSheetArray[i][3])/10000;
          var stage = String(incomeArray[i][6]);
          if(stage.length == 4) {
            //Yearly record, set return and break
            Inc = Number(incomeArray[i][3]);
            Rev = Number(incomeArray[i][5]);
            break;
          }
          Inc += Number(incomeArray[i][3]);
          Rev += Number(incomeArray[i][5]);
        }
        EPS4Q = (Inc/StickCnt).toFixed(0);
        IncRev[0] = Inc;
        IncRev[1] = Rev;
        IncRev[2] = EPS4Q;
      }
      incRevArray.push(IncRev);
      console.log('IncRevEPSYearly(%s): %s', key, IncRev);
    }
  }
  return incRevArray;
};

/**
 * Export IncRev of this year for stocks list
 * @param  {object} ckIDs a set of stocks id
 */
function exportIncRevEPSQuarterly(ckIDs, yearQter){
  if (DEBUG) {
     console.log("[Export-IncRevEPSQuarterly]");
  }
  var incRevArray = new Array();
  var incomeArray = new Array();
  var bSheetArray = new Array();
  var startTime = new Date();
  
  for (n in ckIDs) {
    if(SMUtils().isTimeUp(startTime)) {
      console.log('[Export-IncRevEPSQuarterly] exceededMax! At %s', ckIDs[n]);
      break;
    }
    var epsCalcBln;
    if (ckIDs[n] !== "") {
      var key = ckIDs[n]+yearQter;
      //1.Quaterly calc
      incomeArray = IncomeDataService().getIncomeBykey(key,4,SEARCH_TYPE_YEARLY);
      if (incomeArray.length !== 0) {
        bSheetArray = BSheetDataService().getBSheetBykey(key,1,SEARCH_TYPE_EQUALTO);
      }
      var IncRev = new Array();
      IncRev[0] = "#N/A";
      IncRev[1] = "#N/A";
      IncRev[2] = "#N/A";
      epsCalcBln = true;
      if(incomeArray.length == 0 || bSheetArray.length == 0) {
        epsCalcBln = false;
      }
      if (epsCalcBln) {
        var Inc = Number(incomeArray[0][3]);
        var Rev = Number(incomeArray[0][5]);
        var StickCnt = Number(bSheetArray[0][3])/10000;
        var EPS4Q = (Inc/StickCnt).toFixed(0);
        IncRev[0] = Inc;
        IncRev[1] = Rev;
        IncRev[2] = EPS4Q;
        //console.log('StickCnt(%s): %s', key, StickCnt);
      }
      //2.Yearly calc
      IncRev[3] = "#N/A";
      epsCalcBln = true;
      if(incomeArray.length == 0) {
        epsCalcBln = false;
      }
      if (epsCalcBln) {
        var Inc = 0;
        for (var i = 0; i < incomeArray.length; i++) {
          var Stage = String(incomeArray[i][6]);
          //console.log('Stage: '+Stage+', Stage.length: '+Stage.length);
          //Exclude yearly record
          if(Stage.length == 6) Inc += Number(incomeArray[i][3]);
        }
        IncRev[3] = Inc;
      }
      
      incRevArray.push(IncRev);
      console.log('IncRevEPSQuarterly(%s): %s', key, IncRev);
    }
  }
  return incRevArray;
};

/**
 * Export yearly finance
 * @param  {object} ckIDs a set of stocks id
 */
function exportYearlyFinance(ckIDs, year){
  if (DEBUG) {
     console.log("[Export-YearlyFinance]");
  }
  //data for 4Q
  const limitQuater = 4;
  var incRevArray = new Array();
  var incomeArray = new Array();
  var bSheetArray = new Array();
  var startTime = new Date();
  
  for (n in ckIDs) {
    if(SMUtils().isTimeUp(startTime)) {
     console.log('[Export-YearlyFinance] exceededMax! At %s', ckIDs[n]);
      break;
    }
    var epsCalcBln;
    if (ckIDs[n] !== "") {
      var key = ckIDs[n]+yearQter;
      //1.Quaterly calc
      bSheetArray = BSheetDataService().getBSheetBykey(key+years+"Q4",limitQuater,SEARCH_TYPE_YEARLY);
      incomeArray = IncomeDataService().getIncomeBykey(key+years+"Q4",limitQuater,SEARCH_TYPE_YEARLY);
      var IncRev = new Array();
      IncRev[0] = "#N/A";
      IncRev[1] = "#N/A";
      IncRev[2] = "#N/A";
      epsCalcBln = true;
      if(incomeArray.length == 0 || bSheetArray.length == 0) {
        epsCalcBln = false;
      }
      if (epsCalcBln) {
        var IncRev = new Array();
        IncRev[0] = "#N/A";
        IncRev[1] = "#N/A";
        IncRev[2] = "#N/A";
        for (var i = 0; i < incomeArray.length; i++) {
          var Inc = Number(incomeArray[0][3]);
          var Rev = Number(incomeArray[0][5]);
          var StickCnt = Number(bSheetArray[0][3])/10000;
          var EPS4Q = (Inc/StickCnt).toFixed(0);
          IncRev[0] = Inc;
          IncRev[1] = Rev;
          IncRev[2] = EPS4Q;
          var Stage = String(incomeArray[i][6]);
          //console.log('Stage: '+Stage+', Stage.length: '+Stage.length);
          //Exclude yearly record
          if(Stage.length == 6) Inc += Number(incomeArray[i][3]);
        }
        IncRev[3] = Inc;
      }
      
      incRevArray.push(IncRev);
      console.log('IncRevEPSQuarterly(%s): %s', key, IncRev);
    }
  }
  return incRevArray;
};

/**
 * Export IncRev of this year for stocks list
 * @param  {object} ckIDs a set of stocks id
 */
function exportStockScreener(ckIDs,year){
  if (DEBUG) {
     console.log("[Export-StockScreener]");
  }
  var priceArray = new Array();
  var incomeArray = new Array();
  var bSheetArray = new Array();
  var eBrokerArray = new Array();
  var keyArray = new Array();
  var outerArray = new Array();
  var startTime = new Date();
  
  for (n in ckIDs) {
    if(SMUtils().isTimeUp(startTime)) {
       console.log('[Export-StockScreener] exceededMax! At %s', ckIDs[n]);
       break;
    }
    var assets = 0;
    var liabilities = 0;
    var undisEarning = 0;
    var StickCnt = 0;
    var bookValue = 0;
    var Inc = 0;
    var Equity = 0;
    var liabilitiesRate = 0;
    var Chg = 0;
    if (ckIDs[n] !== "") {
      keyArray = new Array();
      var key = ckIDs[n];
      priceArray = HistoricalDataService().getLatestPriceByYear(key,year);
      incomeArray = IncomeDataService().getIncomeBykey(key+year+"Q4",4,SEARCH_TYPE_QUATERLY);
      //Calc Inc
      for (var i = 0; i < incomeArray.length; i++) {
        var Stage = String(incomeArray[i][6]);
        //Exclude yearly record
        if(Stage.length == 6) Inc += Number(incomeArray[i][3]);
      }
      if (incomeArray.length !== 0) {
        bSheetArray = BSheetDataService().getBSheetBykey(key+year+"Q4",1,1);
      }
      if (bSheetArray.length !== 0) {
        StickCnt = bSheetArray[0][3]/10000;
        assets = bSheetArray[0][0];
        liabilities = bSheetArray[0][2];
        undisEarning = (bSheetArray[0][7]/StickCnt).toFixed(0);
        Equity = Number(bSheetArray[0][4]);
        liabilitiesRate = (liabilities/bSheetArray[0][6]).toFixed(2);
        bookValue = ((assets-liabilities)/StickCnt).toFixed(0);
      }
      //Add
      if(priceArray.length == 0) {
        keyArray.push("");
      } else {
        keyArray.push(priceArray[5]*StickCnt);
      }
      keyArray.push(bookValue);
      //Undistributed earnings per share
      keyArray.push(undisEarning);
      //Liabilities Rate
      keyArray.push(liabilitiesRate);
      //EPS
      keyArray.push((Inc/StickCnt).toFixed(0));
      //ROE
      keyArray.push((Inc/Equity).toFixed(2));
      //Beta
      // keyArray.push(eBrokerArray[14]);
      console.log('Export-StockScreener(' + key +'): ' + keyArray);
      outerArray.push(keyArray);
    }
  }
  return outerArray;
};

/**
 * @param  {object} ckIDs a set of stocks id
 * @param  {string} fromDate YYYYMMDD
 */
 function exportLatestMaAndEbroker(ckIDs) {
   if (DEBUG) {
     console.info('exportLatestMaAndEbroker');
   }
   var year = SMUtils().getCurrentYear();
   var keyArray = new Array();
   var outerArray = new Array();
   var row = 0;
   for (; row < ckIDs.length&&ckIDs[row]!=""; row++) {
     keyArray = EbrokerDataService().getLatestEbrokerByYear(ckIDs[row],year);
     var brokerItems = new Array();
     brokerItems.push(keyArray[0]);
     brokerItems.push(keyArray[1]);
     brokerItems.push(keyArray[2]);
     brokerItems.push(keyArray[3]);
     brokerItems.push(keyArray[4]);
     brokerItems.push(keyArray[5]);
     outerArray.push(brokerItems);
   }
   return outerArray;
 };
 
 /**
 * @param  {object} ckIDs a set of stocks id
 * @param  {string} year YYYY
 */
 function exportLatestEbroker(ckIDs,year) {
  if (DEBUG) {
    console.info('[Export-LatestEbroker]');
  }
  var keyArray = new Array();
  var priceArray = new Array();
  var ebrokerArray = new Array();
  var outerArray = new Array();
  var row = 0;
  var Chg = 0;
  var startTime = new Date();

  for (; row < ckIDs.length&&ckIDs[row]!=""; row++) {
    if(SMUtils().isTimeUp(startTime)) {
     console.log('[Export-LatestEbroker] exceededMax! At %s', ckIDs[row]);
      break;
    }
    var key = ckIDs[row];
    keyArray = new Array();
    priceArray = HistoricalDataService().getLatestPriceByYear(key,year);
    keyArray.push(priceArray[5]);
    ebrokerArray = EbrokerDataService().getLatestEbrokerByYear(key,year);
    if (ebrokerArray.length == 0) {
      keyArray.push("");
      keyArray.push(priceArray[6]);
      for (i = 0; i < 15; ++i){
        keyArray.push("");
      }
    } else {
      Chg = (ebrokerArray[7]/(priceArray[5]-ebrokerArray[7])).toFixed(3);
      keyArray.push(Chg);
      keyArray.push(priceArray[6]);
      for (i = 0; i < ebrokerArray.length; ++i){
        keyArray.push(ebrokerArray[i]);
      }
    }
    outerArray.push(keyArray);
    if (DEBUG) {
      console.log('Export-LatestEbroker(' + key +'): ' + keyArray);
    }
  }
  return outerArray;
 };

 function exportVNIndexdata() {
   return HistoricalDataService().getLastestVNIndexdata(EXP_HISTORY_CNT);
 };

 /**
 * Cleans the cache to ensure getting fresh data from API!
 */
function cacheClean() {
  EasyCache().clean(); // Clean cache!
}

/**
  * Sets last OK response into cache.
  */
  function _setLastCacheResponseOK(qs, data) {
    const CACHE_TTL = 60 * 60; // 1 hour, in seconds
    if (DEBUG) {
      console.info('[Cache-OK] Saving OK response to cache for "+CACHE_TTL+" seconds."');
    }
    return EasyCache().write("OK_"+qs, data, CACHE_TTL);
  }

  /**
  * Gets last OK response from cache.
  */
  function _getLastCacheResponseOK(qs) {
    if (DEBUG) {
      console.info('[Cache-OK] Getting OK response from cache.');
    }
    return EasyCache().read("OK_"+qs);
  }