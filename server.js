// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var request = require('request');
var path    = require("path");
var PythonShell = require('python-shell');
const TABLE_NAME = 'clientSentimentTable';
const COLUMN_FAMILY_NAME = 'sentimentData';
const TABLE_NAME_CONSTANTS = 'regressionModelValue';
const COLUMN_FAMILY_NAME_CONSTANTS = 'regressionValuesFamily';
app.use('/public', express.static(__dirname + "/public"));
//const TABLE_NAME = 'regressionModelValue';
//const COLUMN_FAMILY_NAME = 'regressionValuesFamily';

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// DATABASE SETUP
var bigtable = require('@google-cloud/bigtable');

var bigtableClient = bigtable({
  projectId: 'serious-azimuth-140706'
});
var instance;
instance = bigtableClient.instance('codegrind');
var table;
table = instance.table(TABLE_NAME);
table_constant = instance.table(TABLE_NAME_CONSTANTS);
const getRowGreeting = (row) => {
	console.log(JSON.stringify(row.key));
	var myJSON = JSON.stringify(row.data);
  return myJSON;
};
 
 /*Promise.resolve()
  .then(() => {

   instance = bigtableClient.instance('codegrind');

    table = instance.table(TABLE_NAME);
    return table.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    console.log(data[0]);
    if (!tableExists) {
      console.log(`Creating table ${TABLE_NAME}`);
      const options = {
        families: [COLUMN_FAMILY_NAME],
      };
      return table.create(options);
    }
  })
  .then(() => {
    console.log('Write some greetings to the table');
    //const greetings = [{'email':'magsworldz@gmail.com','clientid':'10001', 'age':'35','gender':'female','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz1@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz2@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' }];
     const greetings =[{'email':'10001@gmail.com', 'clientid':'10001', 'age':'23', 'gender':'0', 'noOfCalls':'2', 'noOfVisits':'1', 'Positive':'4', 'Negative':'0', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.801471559935921'},{'email':'10002@gmail.com', 'clientid':'10002', 'age':'19', 'gender':'1', 'noOfCalls':'5', 'noOfVisits':'1', 'Positive':'3', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.946677748738041'},{'email':'10003@gmail.com', 'clientid':'10003', 'age':'33', 'gender':'0', 'noOfCalls':'6', 'noOfVisits':'2', 'Positive':'2', 'Negative':'3', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.995229407661719'},{'email':'10004@gmail.com', 'clientid':'10004', 'age':'47', 'gender':'0', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'1', 'Negative':'1', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.038968752005193'},{'email':'10005@gmail.com', 'clientid':'10005', 'age':'50', 'gender':'1', 'noOfCalls':'1', 'noOfVisits':'0', 'Positive':'1', 'Negative':'0', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.00637239665284722'},{'email':'10006@gmail.com', 'clientid':'10006', 'age':'65', 'gender':'1', 'noOfCalls':'4', 'noOfVisits':'1', 'Positive':'2', 'Negative':'2', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.031407687504241'},{'email':'10007@gmail.com', 'clientid':'10007', 'age':'29', 'gender':'0', 'noOfCalls':'3', 'noOfVisits':'1', 'Positive':'1', 'Negative':'2', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.941575039899503'},{'email':'10008@gmail.com', 'clientid':'10008', 'age':'36', 'gender':'1', 'noOfCalls':'7', 'noOfVisits':'1', 'Positive':'4', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.791179118189708'},{'email':'10009@gmail.com', 'clientid':'10009', 'age':'42', 'gender':'0', 'noOfCalls':'8', 'noOfVisits':'1', 'Positive':'4', 'Negative':'2', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.830614880331633'},{'email':'10010@gmail.com', 'clientid':'10010', 'age':'31', 'gender':'1', 'noOfCalls':'9', 'noOfVisits':'3', 'Positive':'4', 'Negative':'8', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999997324946615'},{'email':'10011@gmail.com', 'clientid':'10011', 'age':'37', 'gender':'1', 'noOfCalls':'4', 'noOfVisits':'1', 'Positive':'3', 'Negative':'4', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.968958873760287'},{'email':'10012@gmail.com', 'clientid':'10012', 'age':'45', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'1', 'Positive':'9', 'Negative':'3', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.598894565754781'},{'email':'10013@gmail.com', 'clientid':'10013', 'age':'27', 'gender':'0', 'noOfCalls':'5', 'noOfVisits':'1', 'Positive':'2', 'Negative':'2', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.973019815435261'},{'email':'10014@gmail.com', 'clientid':'10014', 'age':'56', 'gender':'0', 'noOfCalls':'6', 'noOfVisits':'0', 'Positive':'4', 'Negative':'4', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.278486456432371'},{'email':'10015@gmail.com', 'clientid':'10015', 'age':'46', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'2', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.0200080847370478'},{'email':'10016@gmail.com', 'clientid':'10016', 'age':'48', 'gender':'0', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'5', 'Negative':'3', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.163344729188944'},{'email':'10017@gmail.com', 'clientid':'10017', 'age':'38', 'gender':'1', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'6', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.120282475520993'},{'email':'10018@gmail.com', 'clientid':'10018', 'age':'29', 'gender':'0', 'noOfCalls':'4', 'noOfVisits':'0', 'Positive':'0', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.632920365849812'},{'email':'10019@gmail.com', 'clientid':'10019', 'age':'19', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'1', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.87303648367039'},{'email':'10020@gmail.com', 'clientid':'10020', 'age':'66', 'gender':'0', 'noOfCalls':'6', 'noOfVisits':'2', 'Positive':'5', 'Negative':'4', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.583245789258303'},{'email':'10021@gmail.com', 'clientid':'10021', 'age':'72', 'gender':'0', 'noOfCalls':'7', 'noOfVisits':'3', 'Positive':'5', 'Negative':'7', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.983511875193442'},{'email':'10022@gmail.com', 'clientid':'10022', 'age':'35', 'gender':'0', 'noOfCalls':'6', 'noOfVisits':'1', 'Positive':'4', 'Negative':'2', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.909569350780473'},{'email':'10023@gmail.com', 'clientid':'10023', 'age':'46', 'gender':'1', 'noOfCalls':'5', 'noOfVisits':'0', 'Positive':'4', 'Negative':'3', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.376378249233735'},{'email':'10024@gmail.com', 'clientid':'10024', 'age':'57', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'4', 'Negative':'2', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.0187518441464885'},{'email':'10025@gmail.com', 'clientid':'10025', 'age':'68', 'gender':'1', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'3', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.000306881828484222'},{'email':'10026@gmail.com', 'clientid':'10026', 'age':'41', 'gender':'0', 'noOfCalls':'1', 'noOfVisits':'1', 'Positive':'0', 'Negative':'3', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.770381705804242'},{'email':'10027@gmail.com', 'clientid':'10027', 'age':'52', 'gender':'1', 'noOfCalls':'1', 'noOfVisits':'0', 'Positive':'6', 'Negative':'2', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.0237475475586478'},{'email':'10028@gmail.com', 'clientid':'10028', 'age':'63', 'gender':'0', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'3', 'Negative':'1', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.0021294314598436'},{'email':'10029@gmail.com', 'clientid':'10029', 'age':'29', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'4', 'Negative':'2', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.726572041912048'},{'email':'10030@gmail.com', 'clientid':'10030', 'age':'30', 'gender':'0', 'noOfCalls':'11', 'noOfVisits':'3', 'Positive':'12', 'Negative':'10', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999999717889067'},{'email':'10031@gmail.com', 'clientid':'10031', 'age':'44', 'gender':'0', 'noOfCalls':'8', 'noOfVisits':'3', 'Positive':'4', 'Negative':'12', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999999405905552'},{'email':'10032@gmail.com', 'clientid':'10032', 'age':'55', 'gender':'1', 'noOfCalls':'7', 'noOfVisits':'2', 'Positive':'10', 'Negative':'13', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999985611079302'},{'email':'10033@gmail.com', 'clientid':'10033', 'age':'66', 'gender':'0', 'noOfCalls':'5', 'noOfVisits':'1', 'Positive':'1', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.0144216974624022'},{'email':'10034@gmail.com', 'clientid':'10034', 'age':'56', 'gender':'1', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'7', 'Negative':'0', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.00255947235858752'},{'email':'10035@gmail.com', 'clientid':'10035', 'age':'52', 'gender':'0', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'2', 'Negative':'4', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.239939483192707'},{'email':'10036@gmail.com', 'clientid':'10036', 'age':'49', 'gender':'1', 'noOfCalls':'4', 'noOfVisits':'0', 'Positive':'2', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.0153301606609995'},{'email':'10037@gmail.com', 'clientid':'10037', 'age':'47', 'gender':'1', 'noOfCalls':'1', 'noOfVisits':'0', 'Positive':'1', 'Negative':'0', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.0107647552231906'},{'email':'10038@gmail.com', 'clientid':'10038', 'age':'39', 'gender':'1', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'1', 'Negative':'5', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.894720595886797'},{'email':'10039@gmail.com', 'clientid':'10039', 'age':'38', 'gender':'0', 'noOfCalls':'9', 'noOfVisits':'4', 'Positive':'3', 'Negative':'0', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.994968633888692'},{'email':'10040@gmail.com', 'clientid':'10040', 'age':'41', 'gender':'1', 'noOfCalls':'8', 'noOfVisits':'3', 'Positive':'3', 'Negative':'5', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.999621148332142'},{'email':'10041@gmail.com', 'clientid':'10041', 'age':'61', 'gender':'0', 'noOfCalls':'3', 'noOfVisits':'0', 'Positive':'3', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.00144498133632828'},{'email':'10042@gmail.com', 'clientid':'10042', 'age':'54', 'gender':'1', 'noOfCalls':'6', 'noOfVisits':'1', 'Positive':'4', 'Negative':'3', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.474815204006703'},{'email':'10043@gmail.com', 'clientid':'10043', 'age':'70', 'gender':'0', 'noOfCalls':'5', 'noOfVisits':'2', 'Positive':'8', 'Negative':'4', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.307156717258088'},{'email':'10044@gmail.com', 'clientid':'10044', 'age':'22', 'gender':'1', 'noOfCalls':'12', 'noOfVisits':'3', 'Positive':'15', 'Negative':'2', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.999799356126137'},{'email':'10045@gmail.com', 'clientid':'10045', 'age':'46', 'gender':'0', 'noOfCalls':'17', 'noOfVisits':'5', 'Positive':'2', 'Negative':'21', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999999999999592'},{'email':'10046@gmail.com', 'clientid':'10046', 'age':'37', 'gender':'1', 'noOfCalls':'2', 'noOfVisits':'0', 'Positive':'4', 'Negative':'4', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.786988535399848'},{'email':'10047@gmail.com', 'clientid':'10047', 'age':'36', 'gender':'1', 'noOfCalls':'5', 'noOfVisits':'1', 'Positive':'6', 'Negative':'6', 'Exit':'1', 'lastSentiment':'1', 'Probability':'0.99661516391389'},{'email':'magsworldz@gmail.com', 'clientid':'10048', 'age':'51', 'gender':'1', 'noOfCalls':'9', 'noOfVisits':'0', 'Positive':'3', 'Negative':'1', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.0919199807502488'},{'email':'nikshah41@gmail.com', 'clientid':'10049', 'age':'47', 'gender':'0', 'noOfCalls':'20', 'noOfVisits':'7', 'Positive':'9', 'Negative':'10', 'Exit':'1', 'lastSentiment':'0', 'Probability':'0.999999999088865'},{'email':'shroff.parimal@gmail.com', 'clientid':'10050', 'age':'48', 'gender':'0', 'noOfCalls':'1', 'noOfVisits':'0', 'Positive':'5', 'Negative':'4', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.290570085503356'}];

    const rowsToInsert = greetings.map((greeting, index) => ({
      key: greeting.email,
      data: {
        [COLUMN_FAMILY_NAME]: {
        'email':greeting.email,
        'clientid':greeting.clientid,
          'age': greeting.age,
          'gender':greeting.gender,
          'noOfVisits': greeting.noOfVisits,
          'noOfCalls': greeting.noOfCalls,
          'Positive': greeting.Positive,
          'Negative': greeting.Negative,
          'lastSentiment' : greeting.lastSentiment,
          'Probability': greeting.Probability,
          'exit':greeting.Exit,
        },
      },
    }));
    return table.insert(rowsToInsert);
  })  .catch((error) => {
    console.error('Something went wrong:', error);
  });*/
 
 //additional data
 /*Promise.resolve()
  .then(() => {

   instance = bigtableClient.instance('codegrind');

    table = instance.table(TABLE_NAME);
    return table.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    console.log(data[0]);
    if (!tableExists) {
      console.log(`Creating table ${TABLE_NAME}`);
      const options = {
        families: [COLUMN_FAMILY_NAME],
      };
      return table.create(options);
    }
  })
  .then(() => {
    console.log('Write some greetings to the table');
    //const greetings = [{'email':'magsworldz@gmail.com','clientid':'10001', 'age':'35','gender':'female','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz1@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz2@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' }];
    //const greetings = [{'email':'shroff.parimal@gmail.com', 'clientid':'10050', 'age':'48', 'gender':'0', 'noOfCalls':'1', 'noOfVisits':'0', 'Positive':'3', 'Negative':'5', 'Exit':'0', 'lastSentiment':'1', 'Probability':'0.37162291907954'},{'email':'shroff.parimal@gmail.com', 'clientid':'10051', 'age':'20', 'gender':'1', 'noOfCalls':'1', 'noOfVisits':'1', 'Positive':'1', 'Negative':'1', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.618868302257852'},{'email':'shroff.parimal@gmail.com', 'clientid':'10052', 'age':'21', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.195867883439889'},{'email':'shroff.parimal@gmail.com', 'clientid':'10053', 'age':'22', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.179408228744954'},{'email':'shroff.parimal@gmail.com', 'clientid':'10054', 'age':'23', 'gender':'1', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.195895337961781'},{'email':'shroff.parimal@gmail.com', 'clientid':'10055', 'age':'24', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.149765764033827'}];
    const greetings = [{'email':'10051@gmail.com', 'clientid':'10051', 'age':'20', 'gender':'1', 'noOfCalls':'1', 'noOfVisits':'1', 'Positive':'1', 'Negative':'1', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.618868302257852'},{'email':'10052@gmail.com', 'clientid':'10052', 'age':'21', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.195867883439889'},{'email':'10053@gmail.com', 'clientid':'10053', 'age':'22', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.179408228744954'},{'email':'10054@gmail.com', 'clientid':'10054', 'age':'23', 'gender':'1', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.195895337961781'},{'email':'10055@gmail.com', 'clientid':'10055', 'age':'24', 'gender':'0', 'noOfCalls':'0', 'noOfVisits':'0', 'Positive':'0', 'Negative':'0', 'Exit':'0', 'lastSentiment':'0', 'Probability':'0.149765764033827'}];
    const rowsToInsert = greetings.map((greeting, index) => ({
      key: greeting.email,
      data: {
        [COLUMN_FAMILY_NAME]: {
        'email':greeting.email,
        'clientid':greeting.clientid,
          'age': greeting.age,
          'gender':greeting.gender,
          'noOfVisits': greeting.noOfVisits,
          'noOfCalls': greeting.noOfCalls,
          'Positive': greeting.Positive,
          'Negative': greeting.Negative,
          'lastSentiment' : greeting.lastSentiment,
          'Probability': greeting.Probability,
          'exit':greeting.Exit,
        },
      },
    }));
    return table.insert(rowsToInsert);
  })  .catch((error) => {
    console.error('Something went wrong:', error);
  });*/
 

  /* Promise.resolve()
  .then(() => {

   instance = bigtableClient.instance('codegrind');

    table = instance.table(TABLE_NAME);
    return table.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    console.log(data[0]);
    if (!tableExists) {
      console.log(`Creating table ${TABLE_NAME}`);
      const options = {
        families: [COLUMN_FAMILY_NAME],
      };
      return table.create(options);
    }
  })
  .then(() => {
    console.log('Write some greetings to the table');
    //const greetings = [{'email':'magsworldz@gmail.com','clientid':'10001', 'age':'35','gender':'female','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz1@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' },{ 'email':'magsworldz2@gmail.com', 'age':'35','noOfVisits':'10','noOfCalls':'1','Positive':'2','Negative':'1','lastSentiment':'0','Probability':'0' }];
     const greetings =[{ 'intercept':'0.83664461', 'gender':'0.264021','age':'-0.10793263','noOfVisits':'0.82122099','noOfCalls':'0.03913366','Positive':'-0.05592548','Negative':'0.76151437' }];
    const rowsToInsert = greetings.map((greeting, index) => ({
      key: "regressionValues",
      data: {
        [COLUMN_FAMILY_NAME]: {
        'intercept':greeting.intercept,
          'age': greeting.age,
          'gender':greeting.gender,
          'noOfVisits': greeting.noOfVisits,
          'noOfCalls': greeting.noOfCalls,
          'Positive': greeting.Positive,
          'Negative': greeting.Negative,
        },
      },
    }));
    return table.insert(rowsToInsert);
  })  .catch((error) => {
    console.error('Something went wrong:', error);
  });*/
 
 /*Promise.resolve()
  .then(() => {

   instance = bigtableClient.instance('codegrind');

    table = instance.table(TABLE_NAME);
    return table.exists();
  }).then(() => {
    console.log('Delete the table');
    return table.delete();
  }) .catch((error) => {
    console.error('Something went wrong:', error);
  });*/
 
   
//delete table code
/*.then(() => {
    console.log('Delete the table');
    return table.delete();
  })*/



// ROUTES FOR OUR API
// =============================================================================

// create our router





// test route to make sure everything is working (accessed at GET http://localhost:8080/api)




app.get('/', function(req, res) {
	//res.json({ message: 'hooray! welcome to our api!!!!' });	
		     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/AboutUs', function(req, res) {
	//res.json({ message: 'hooray! welcome to our api!!!!' });	
		     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.sendFile(path.join(__dirname+'/AboutUs.html'));
});
app.get('/regressionconstant', function(req, res) {
	//res.json({ message: 'hooray! welcome to our api!!!!' });	
		     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.sendFile(path.join(__dirname+'/constants.html'));
});
app.get('/refreshConstant', function(req, res) {
	//res.json({ message: 'hooray! welcome to our api!!!!' });	
		     res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	PythonShell.run('logistic_regression.py', function (err, results) {
		res.sendFile(path.join(__dirname+'/constants.html'));
	});
});
app.get("/crmData/:emailid", function(req, res) {
  // Not ideal, as it uses two requests
    	     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	
	res.redirect('/route1?id='+req.params.emailid);
});
app.get("/refreshSentiment/:emailid", function(req, res) {
  // Not ideal, as it uses two requests
    	     res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	var options = {
	args: [req.params.emailid.toString()]
	};
	PythonShell.run('scrape.py',options, function (err, results) {
	res.redirect('/route1?id='+req.params.emailid);
	});
});

app.get('/route1',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
/*	var options = {
	args: ['shroff.parimal@gmail.com']
	};
	PythonShell.run('scrape.py',options, function (err, results) { 
	console.log(err+' '+results);*/
	res.sendFile(path.join(__dirname+'/crmData.html'));
//});
});

app.get('/all', function(req, res) {
	   	     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	
	Promise.resolve()
  .then(() => {
    return table.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    if (tableExists) {
      return table.getRows();
      }
      return null;

    }).then((data) => {
    const rows = data[0];
      res.send(rows);
    /*for (const row of rows) {
      console.log(`\tRead: ${getRowGreeting(row)}`);
    }*/
  }).catch((error) => {
    console.error('Something went wrong:', error);
  });
	
});

app.get('/constants', function(req, res) {
	   	     res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	Promise.resolve()
  .then(() => {
    return table_constant.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    if (tableExists) {
      return table_constant.getRows();
      }
      return null;

    }).then((data) => {
    const rows = data[0];
      res.send(rows);
    /*for (const row of rows) {
      console.log(`\tRead: ${getRowGreeting(row)}`);
    }*/
  }).catch((error) => {
    console.error('Something went wrong:', error);
  });
	
});



app.get('/email/:emailid', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	Promise.resolve()
  .then(() => {
    return table.exists();
  })
  .then((data) => {
    const tableExists = data[0];
    if (tableExists) {
    var emailid = req.params.emailid;
    console.log(emailid);
    return table.row(emailid).get();
      }
      return null;

    }).then((data) => {
    const rows = data[0];
    console.log("here");
      res.send(rows);
    /*for (const row of rows) {
    	responsejson = responsejson+
      console.log(`\tRead: ${getRowGreeting(row)}`);
    }*/
  }).catch((error) => {
    console.error('Something went wrong:', error);
  });
});


// REGISTER OUR ROUTES -------------------------------
app.disable('etag');


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
