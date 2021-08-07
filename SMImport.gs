/*
 * Import Opening data to firebase
 * brokingArray contents:
 *     - key
 *     - buydate YYYY/MM/DD
 *     - buyrates
 *     - buyprice
 *     - selldate YYYY/MM/DD
 *     - sellrates
 *     - sellprice
 *     - change
 */
function importBrokingInfo(brokingArray) {
  var dataToImport = {};
  // For convert date to YYYYMMDD
  var reg = new RegExp('\/', 'gi');
  var row = 0;
  for (; row < brokingArray.length; row++) {
    var key = brokingArray[row][0];
    var buydate = brokingArray[row][1];
    console.log('BrokingInfo: ' + brokingArray[row]);
    dataToImport[key+buydate.replace(reg, "")] = {
      buydate:buydate,
      buyprice:brokingArray[row][2],
      buyrates:brokingArray[row][3],
      selldate:brokingArray[row][4],
      sellprice:brokingArray[row][5],
      sellrates:brokingArray[row][6],
      change:brokingArray[row][7]
    };
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("BrokingInfo", dataToImport);
}

/*
 * Import today trading data to firebase
 * priceArray contents:
 *     - key
 *     - date YYYY/MM/DD
 *     - open
 *     - high
 *     - low
 *     - close
 *     - adjclose
 *     - volume
 */
function importPrice(priceArray) {
  var dataToImport = {};
  // For convert date to YYYYMMDD
  var reg = new RegExp('\/', 'gi');
  
  var row = 0;
  for (; row < priceArray.length; row++) {
    var key = priceArray[row][0];
    var date = priceArray[row][1];
    
    if (priceArray[row][2] !== "") {
      dataToImport[key+date.replace(reg, "")] = {
        date:date,
        open:priceArray[row][2],
        high:priceArray[row][3],
        low:priceArray[row][4],
        close:priceArray[row][5],
        adjclose:priceArray[row][6],
        volume:priceArray[row][7],
        foreignvolume:priceArray[row][8],
        foreignroom:priceArray[row][9]
      };
    }
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("Historicaldata", dataToImport);
}

/*
 * Import today events to firebase
 * eventArray contents:
 *     - key
 *     - EXERCISE DATE YYYY/MM/DD
 *     - EX-DIVIDEND DATE
 *     - RECORD DATE
 *     - RATE
 *     - CONTENT
 */
function importEvents(eventArray) {
  EventDataService().setEvents(eventArray);
}

/* INCOME STATEMENT
 * incomeArray contents:
 *     - key
 *     - stage
 *     - sales
 *     - cost
 *     - financialcharges
 *     - grossfrofit
 *     - pretaxincome
 *     - incometax
 *     - netincome
 */
function importIncomeArray(incomeArray) {
  var dataToImport = {};
  var row = 0;
  for (; row < incomeArray.length; row++) {
    var key = incomeArray[row][0];
    var stage = incomeArray[row][1];
    var sales = incomeArray[row][2];
    var cost = incomeArray[row][3];
    var financialcharges = incomeArray[row][4];
    var grossfrofit = incomeArray[row][5];
    var pretaxincome = incomeArray[row][6];
    var incometax = incomeArray[row][7];
    var netincome = incomeArray[row][8];
    if (sales !== "") {
      dataToImport[key+stage] = {
        stage:stage,
        sales:sales,
        cost:cost,
        financialcharges:financialcharges,
        grossfrofit:grossfrofit,
        pretaxincome:pretaxincome,
        incometax:incometax,
        netincome:netincome
      };
    }
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("IncomeData", dataToImport);
}

/* 
 * BALANCE SHEET
 * incomeArray contents:
 *     - key
 *     - stage
 *     - assets
 *     - cash
 *     - liabilities
 *     - shareholdersequity
 *     - netequity
 *     - total
 */
function importBalanceSheetArray(balanceArray) {
  var dataToImport = {};
  var row = 0;
  for (; row < balanceArray.length; row++) {
    var key = balanceArray[row][0];
    var stage = balanceArray[row][1];
    var assets = balanceArray[row][2];
    var cash = balanceArray[row][3];
    var liabilities = balanceArray[row][4];
    var shareholdersequity = balanceArray[row][5];
    var netequity = balanceArray[row][6];
    var total = balanceArray[row][7];
    var undistEarnings = balanceArray[row][8];
    var sharePremium = balanceArray[row][9];
    if (total !== "") {
      dataToImport[key+stage] = {
        stage:stage,
        assets:assets,
        cash:cash,
        liabilities:liabilities,
        shareholdersequity:shareholdersequity,
        netequity:netequity,
        total:total,
        undistearnings:undistEarnings,
        sharepremium:sharePremium
      };
    }
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("BalanceSheet", dataToImport);
}

/* 
 * CashFlow
 * incomeArray contents:
 *     - key
 *     - stage
 *     - operatingcash
 *     - investingcash
 *     - financingcash
 *     - beginningcash
 *     - endcash
 *     - changeincash
 */
function importCashFlowArray(cashArray) {
  var dataToImport = {};
  var row = 0;
  for (; row < cashArray.length; row++) {
    var key = cashArray[row][0];
    var stage = cashArray[row][1];
    var operatingcash = cashArray[row][2];
    var investingcash = cashArray[row][3];
    var financingcash = cashArray[row][4];
    var beginningcash = cashArray[row][5];
    var endcash = cashArray[row][6];
    var changeincash = cashArray[row][7];
    if (operatingcash !== "") {
      dataToImport[key+stage] = {
        stage:stage,
        operatingcash:operatingcash,
        investingcash:investingcash,
        financingcash:financingcash,
        beginningcash:beginningcash,
        endcash:endcash,
        changeincash:changeincash
      };
    }
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("CashFlow", dataToImport);
}

/* 
 * Ebroker
 * ebrokerArray contents:
 *     - key
 *     - date
 *     - ebroker
 *     - price
 *     - todaychg
 *     - weeks52low
 *     - weeks52high
 *     - ...
 */
function importEbrokerArray(ebrokerArray) {
  var dataToImport = {};
  //Replace all / in YYYY/MM/DD
  var reg = new RegExp('\/', 'gi');
  var row = 0
  for (; row < ebrokerArray.length; row++) {
     var key = ebrokerArray[row][0];
     var date = ebrokerArray[row][1];
     var ebroker = ebrokerArray[row][2];
     var price = ebrokerArray[row][3];
     var todaychg = ebrokerArray[row][4];
     var weeks52low = ebrokerArray[row][5];
     var weeks52high = ebrokerArray[row][6];
     var vol100 = ebrokerArray[row][7];
     var vol50 = ebrokerArray[row][8];
     var vol20 = ebrokerArray[row][9];
     var macd50 = ebrokerArray[row][10];
     var macd26 = ebrokerArray[row][11];
     var macd12 = ebrokerArray[row][12];
     var ma100 = ebrokerArray[row][13];
     var ma50 = ebrokerArray[row][14];
     var ma20 = ebrokerArray[row][15];
     var cci60 = ebrokerArray[row][16];
     var cci40 = ebrokerArray[row][17];
     var sar50 = ebrokerArray[row][18];
     var blg20 = ebrokerArray[row][19];
     var ghilo10 = ebrokerArray[row][20];
     var dmi7 = ebrokerArray[row][21];
     var pvt = ebrokerArray[row][22];
     var weekchg = ebrokerArray[row][23];
     var monthchg = ebrokerArray[row][24];
     //Foreign 5 days Trading Vol
     var foreign5daysvol = ebrokerArray[row][25];
     //Foreign Holding rate
     var foreignhold = ebrokerArray[row][26];
     //Chaikin Money Flow
     var cmf = ebrokerArray[row][27];
     //Beta
     var beta = ebrokerArray[row][28];
     var ebrokerPoint = SMUtils().calcEbrokerPoint(ebrokerArray[row]);
     if(ebrokerPoint > BUY_POINT && vol20 > BUY_VOLUME) {
       ebroker = "Mua";
     } else if(ebrokerPoint <= SEL_POINT) {
       ebroker = "Bán";
     } else {
       ebroker = "Giữ";
     }
     console.log('Ebroker(' + key + '): ' + ebroker + ', Point: ' + ebrokerPoint);
     if(ebroker !== "") {
       dataToImport[key+date.replace(reg, "")] = {
         date:date,
         ebroker:ebroker,
         price:price,
         todaychg:todaychg,
         weekchg:weekchg,
         monthchg:monthchg,
         weeks52low:weeks52low,
         weeks52high:weeks52high,
         vol100:vol100,
         vol50:vol50,
         vol20:vol20,
         macd50:macd50,
         macd26:macd26,
         macd12:macd12,
         ma100:ma100,
         ma50:ma50,
         ma20:ma20,
         cci60:cci60,
         cci40:cci40,
         sar50:sar50,
         blg20:blg20,
         ghilo10:ghilo10,
         dmi7:dmi7,
         pvt:pvt,
         foreign5daysvol:foreign5daysvol,
         foreignhold:foreignhold,
         cmf:cmf,
         beta:beta
      };
    }
  }
  var firebaseUrl = SMUtils().getFirebaseUrl("");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  base.updateData("Ebroker", dataToImport);
}

/**
 * Import today trading data to firebase
 * indexArray contents:
 *     - key
 *     - date YYYY/MM/DD
 *     - indexValue
 *     - indexVND
 */
function importVNIndexdata(indexArray) {
  HistoricalDataService().setVNIndexdata(indexArray);
}