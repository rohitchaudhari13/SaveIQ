var SHEET_NAMES = {
  USERS: 'Users',
  GOALS: 'Goals',
  TRANSACTIONS: 'Transactions',
  SETTINGS: 'Settings'
};

function getSpreadsheet() {
  var spreadsheetId =
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID is missing.');
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function setupDatabase() {
  var spreadsheet = getSpreadsheet();

  var definitions = [
    { name: 'Users', headers: ['userId','name','email','currency','createdAt'] },
    { name: 'Goals', headers: ['goalId','userId','name','targetAmount','savedAmount','deadline','category','createdAt','status'] },
    { name: 'Transactions', headers: ['transactionId','goalId','amount','type','date','note'] },
    { name: 'Settings', headers: ['key','value'] }
  ];

  definitions.forEach(function(definition) {
    var sheet = spreadsheet.getSheetByName(definition.name);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(definition.name);
    }

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1,1,1,definition.headers.length).setValues([definition.headers]);
    }
  });

  SpreadsheetApp.flush();
  return true;
}

function getGoals() {
  setupDatabase();

  var sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.GOALS);

  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  var goals = [];

  data.forEach(function(row) {
    if (!row[0]) return;

    var goal = {};

    headers.forEach(function(header,index) {
      var value = row[index];

      if (value instanceof Date) {
        value = Utilities.formatDate(
          value,
          Session.getScriptTimeZone(),
          'yyyy-MM-dd'
        );
      }

      goal[header] = value;
    });

    goals.push(goal);
  });

  return goals;
}

function createGoal(goal) {
  setupDatabase();

  if (!goal) {
    throw new Error('Goal information is missing.');
  }

  var name = String(goal.name || '').trim();
  var targetAmount = Number(goal.targetAmount) || 0;
  var savedAmount = Number(goal.savedAmount) || 0;
  var deadline = goal.deadline || '';
  var category = goal.category || 'General';

  if (!name) {
    throw new Error('Please enter a goal name.');
  }

  if (targetAmount <= 0) {
    throw new Error('Target amount must be greater than zero.');
  }

  if (savedAmount < 0) {
    throw new Error('Saved amount cannot be negative.');
  }

  var sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.GOALS);
  var goalId = Utilities.getUuid();

  sheet.appendRow([
    goalId,
    'default-user',
    name,
    targetAmount,
    savedAmount,
    deadline,
    category,
    new Date(),
    'Active'
  ]);

  SpreadsheetApp.flush();
  return goalId;
}

function getDashboardData() {
  setupDatabase();

  var goals = getGoals();
  var totalTarget = 0;
  var totalSaved = 0;

  goals.forEach(function(goal) {
    totalTarget += Number(goal.targetAmount) || 0;
    totalSaved += Number(goal.savedAmount) || 0;
  });

  var progress = 0;

  if (totalTarget > 0) {
    progress = Math.round((totalSaved / totalTarget) * 100);
  }

  progress = Math.min(100, Math.max(0, progress));

  return {
    goals: goals,
    totalGoals: goals.length,
    totalTarget: totalTarget,
    totalSaved: totalSaved,
    progress: progress
  };
}

function testDatabase() {
  var spreadsheet = getSpreadsheet();
  var goals = getGoals();

  Logger.log('Spreadsheet: ' + spreadsheet.getName());
  Logger.log('Goals found: ' + goals.length);

  return {
    spreadsheet: spreadsheet.getName(),
    goals: goals.length,
    message: 'Database connection is working.'
  };
}
