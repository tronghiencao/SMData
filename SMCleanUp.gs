//Delete Historicaldata
function removeHistoricaldata(key) {
  HistoricalDataService().deleteHistoricaldata(key);
}

//Delete Ebroker
function removeEbroker(key) {
  var queryParameters = {orderBy:"$key",startAt:key,endAt:key+'\uf8ff'};
  var firebaseUrl = SMUtils().getFirebaseUrl("Ebroker");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var data = base.getData("", queryParameters);
  for(var i in data) {
    console.log('Removed: ' + i);
    base.removeData(i,"");
  }
}

//Delete selldate="" BrokingInfo
function removeBrokingInfo(key) {
  var queryParameters = {orderBy:"$key",startAt:key,endAt:key+'\uf8ff'};
  var firebaseUrl = SMUtils().getFirebaseUrl("BrokingInfo");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var data = base.getData("", queryParameters);
  for(var i in data) {
    if(data[i].selldate == "") {
      console.log('Removed: ' + i);
      base.removeData(i,"");
    }
  }
}

//Delete IncomeData by key
function removeIncomeData(key) {
  var firebaseUrl = SMUtils().getFirebaseUrl("IncomeData");
  var year = SMUtils().getCurrentYear();
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var queryParameters = {orderBy:"$key",startAt:key,endAt:key+year+"1231"};
  
  var data = base.getData("", queryParameters);
  for(var i in data) {
    base.removeData(i,"");
  }
}

//Delete BalanceSheet by key
function removeBalanceSheet(key) {
  var firebaseUrl = SMUtils().getFirebaseUrl("BalanceSheet");
  var year = SMUtils().getCurrentYear();
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var queryParameters = {orderBy:"$key",startAt:key,endAt:key+year+"1231"};
  
  var data = base.getData("", queryParameters);
  for(var i in data) {
    base.removeData(i,"");
  }
}

//CleanUp BalanceSheet
function cleanUpBalanceSheet() {
  var firebaseUrl = SMUtils().getFirebaseUrl("BalanceSheet");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var queryParameters = {orderBy:"stage",startAt:"",endAt:"%20"};
  
  var data = base.getData("", queryParameters);
  for(var i in data) {
    base.removeData(i,"");
  }
}

//CleanUp IncomeData
function cleanUpIncomeData() {
  var firebaseUrl = SMUtils().getFirebaseUrl("IncomeData");
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var queryParameters = {orderBy:"stage",startAt:"",endAt:"%20"};
  
  var data = base.getData("", queryParameters);
  for(var i in data) {
    base.removeData(i,"");
  }
}

//CleanUp BrokingInfo
function cleanUpBrokingInfo() {
  var firebaseUrl = SMUtils().getFirebaseUrl("BrokingInfo");
  var today = SMUtils().formatDate(new Date(), COMMON_DATE_FORMAT);
  var secret = SMUtils().getSecret();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
  var queryParameters = {orderBy:"selldate",startAt:APP_START_DATE, endAt:today};
  var startTime = new Date();
  
  var data = base.getData("", queryParameters);
  for(var i in data) {
    if(SMUtils().isTimeUp(startTime)) {
       console.log('exceededMax!');
       break;
    }
    var canSellDate = SMUtils().calcCanSellDate(data[i].buydate);
    var selldate = data[i].selldate;
    if (selldate < canSellDate) {
      console.log("Deleted! %s(selldate: %s, canSellDate: %s)", i, selldate, canSellDate);
      //base.updateData(i, {deleteFlag:true});
      base.removeData(i,"");
    }
  }
}