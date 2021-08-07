/**
 * Working with BrokingInfo data.
 */
function BrokingInfoDataService() {
  /**
  * Reads now buying BrokingInfo data.
  */
  function getBuyingBrokingInfo() {
    if (DEBUG) {
      console.info('BrokingInfoDataService.getBuyingBrokingInfo');
    }
    const CACHE_OK_KEY = "BuyingBrokingInfo";
    var firebaseUrl = SMUtils().getFirebaseUrl("BrokingInfo");
    var secret = SMUtils().getSecret();
    var data = null;
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    var queryParameters = {orderBy:"selldate",startAt:"",endAt:"%20"};
    data = base.getData("", queryParameters);

    var outerArray = new Array();
    var ebrokingArray = new Array();
    for(var i in data) {
      ebrokingArray = new Array();
      ebrokingArray[0] = i.substring(0,3); //Key
      ebrokingArray[1] = data[i].buydate;
      ebrokingArray[2] = data[i].buyprice;
      ebrokingArray[3] = data[i].buyrates;
      outerArray.push(ebrokingArray);
    }
    return outerArray;
  }

  /**
  * Reads BrokingInfo data in year.
  */
  function getBrokingByYear(ckIDs,year) {
    if (DEBUG) {
      console.info('BrokingInfoDataService.getBrokingByYear: '+ year);
    }
    var firebaseUrl = SMUtils().getFirebaseUrl("BrokingInfo");
    var secret = SMUtils().getSecret();
    var data = null;
    var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);
    var queryParameters = {orderBy:"buydate", startAt: year+"/01/01", endAt: year+"/12/31"};
    data = base.getData("", queryParameters);
    var outerArray = new Array();
    var ebrokingArray = new Array();

    for(var i in data) {
      var key = i.substring(0,3); //Key
      if (SMUtils().isValueInArrays(key,ckIDs) === true) {
        ebrokingArray = new Array();
        ebrokingArray[0] = key;
        ebrokingArray[1] = data[i].buydate;
        ebrokingArray[2] = data[i].buyprice;
        ebrokingArray[3] = data[i].buyrates;
        ebrokingArray[4] = data[i].selldate;
        ebrokingArray[5] = data[i].sellprice;
        ebrokingArray[6] = data[i].sellrates;
        ebrokingArray[7] = data[i].change;
        ebrokingArray[8] = EventDataService().getEvents(key,data[i].buydate,data[i].selldate);
        outerArray.push(ebrokingArray);
      }
    }
    return outerArray;
  }

  return {
    getBuyingBrokingInfo,
    getBrokingByYear
  };
}
