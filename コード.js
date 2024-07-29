
function updateScores() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  // Assuming names are in column A (1st column), and scores are to be placed in column E (5th column)
  var namesRange = sheet.getRange(2, 1, lastRow - 1); // Assuming names start from row 2
  var names = namesRange.getValues();
  
  for (var i = 0; i < names.length; i++) {
    var name = names[i][0];
    if (name) {
      var tankId = getTankIdByName(name);
      Logger.log("tankId: " + tankId);
      if (tankId) {
        var latestScore = getLatestScoreByTankId(tankId);
        // Update column E with the score
        sheet.getRange(i + 2, 5).setValue(latestScore); // Adjust if necessary
      } else {
        Logger.log("No tankId found for name: " + name);
      }
    }
  }
}

function getTankIdByName(name) {
  var url = "https://dev-moniqua-api.innoqua.jp/api/tanks?name=" + encodeURIComponent(name);
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer 25ba6fdd17f61c544d3d2db01cea2ea46cef30b3c15d0c74b66af877be6a564c3992bd16b00afb6e3962cffc1bd35fce76e3feb64848993ff09baeae8724091'
    },
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log("Response Content (getTankIdByName): " + response.getContentText());
  if (response.getResponseCode() == 200) {
    var data = JSON.parse(response.getContentText());
    Logger.log("Data (getTankIdByName): " + JSON.stringify(data));
    return data[0] ? data[0].id : null;
  } else {
    Logger.log("Error (getTankIdByName): " + response.getContentText());
  }
  return null;
}

function getLatestScoreByTankId(tankId) {
  if (!tankId) {
    return null;
  }

  var url = `https://dev-moniqua-api.innoqua.jp/api/scores?tank_id=${tankId}`;
  Logger.log("URL (getLatestScoreByTankId): " + url);
  var options = {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer 25ba6fdd17f61c544d3d2db01cea2ea46cef30b3c15d0c74b66af877be6a564c3992bd16b00afb6e3962cffc1bd35fce76e3feb64848993ff09baeae8724091'
    },
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log("Response Content (getLatestScoreByTankId): " + response.getContentText());
  if (response.getResponseCode() == 200) {
    var data = JSON.parse(response.getContentText());
    Logger.log("Data (getLatestScoreByTankId): " + JSON.stringify(data));
    return data.length > 0 ? data[0].score : null;
  } else {
    Logger.log("Error (getLatestScoreByTankId): " + response.getContentText());
  }
  return null;
}
