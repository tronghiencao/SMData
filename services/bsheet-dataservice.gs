function BSheetDataService() {
  /**
   * key: stockid + year + quater (AAA2017Q2)
   * cnt: limitToLast 1 for 1quater or 1year
   * searchType: 0->yearly, 1->quaterly, 2->equalTo
   * */ 
  function getBSheetBykey(key,cnt,type) {
    if (DEBUG) {
      console.info('[BSheetDataService.getBSheetBykey]');
    }
    const CACHE_OK_KEY = "BalanceSheet_"+key+"_"+cnt+"_"+type;
    var firebaseUrl = SMUtils().getFirebaseUrl("BalanceSheet");
    var secret = SMUtils().getSecret();
    var data = null;
    const cached_data = _getLastCacheResponseOK(CACHE_OK_KEY);
    if (cached_data && Object.keys(cached_data).length) {
      console.log("[BSheetDataService.getBSheetBykey] Return last cached OK response data..  =0");
      data = cached_data;
    } else {
      var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
      var queryParameters;
      var startAt;
      //substring to keyid, remove year
      if (type == 0) {
        startAt = key.substring(0,7);
        queryParameters = {orderBy:"$key",startAt:startAt,endAt:key,limitToLast:cnt};
      } else if(type == 1) {
        startAt = key.substring(0,3);
        queryParameters = {orderBy:"$key",startAt:startAt,endAt:key,limitToLast:cnt};
      } else {
        queryParameters = {orderBy:"$key",equalTo:key};
      }
      data = base.getData("", queryParameters);
      if (data && Object.keys(data).length) {
        // Keep last OK response
        _setLastCacheResponseOK(CACHE_OK_KEY, data);
      }
    }
    var ckKNs = new Array();
    var outerArray = new Array();
    for (n in data) {
      //console.log('data[n].assets:'+data[n].assets);
      if (data[n] !== "") {
        ckKNs = new Array();
        ckKNs[0] = [[data[n].assets]];
        ckKNs[1] = [[data[n].cash]];
        ckKNs[2] = [[data[n].liabilities]];
        ckKNs[3] = [[data[n].netequity]];
        ckKNs[4] = [[data[n].shareholdersequity]];
        ckKNs[5] = [[data[n].stage]];
        ckKNs[6] = [[data[n].total]];
        ckKNs[7] = [[data[n].undistearnings]];
        ckKNs[8] = [[data[n].sharepremium]];
        outerArray.push(ckKNs);
      }
    }
    return outerArray;
  }

  return {
    getBSheetBykey
  };
}
