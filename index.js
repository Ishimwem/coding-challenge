const request = require('request');
const rp = require('request-promise');

const url = 'https://api.blockcypher.com/v1/btc/test3';
var source = null;
var dest = null;

function getSpecificBalance() {
    var data = {
      method: 'GET',
      uri: url + '/addr/' + source + '/balance',
      qs: {},
      json: true
    }; 
  
    rp(data).then(
      function(body){
        console.log("The balance for address ", body['address'], ": ", body['balance']);
      });
}
  
function generateDestination() {
    var data = {
        method: 'POST',
        uri: url + '/addrs?token=c14430584b8e4323985d81590fb535fc',
        qs: {},
        json: true
    };

    return rp(data);
}

function generateSource(addr) {
    //assign the destination address to global variable dest
    dest = addr['address'];
    var data = {
        method: 'POST',
        uri: url + '/addrs?token=c14430584b8e4323985d81590fb535fc',
        qs: {},
        json: true
    };

    return rp(data);
}

function fundSource(addr) {
    source = addr['address'];
    console.log(source);
    var data = {"address": source, "amount": 10000};
    var d = {
        method: 'POST',
        uri: url + '/faucet?token=c14430584b8e4323985d81590fb535fc',
        body: data,
        json: true
    };
    //console.log (d);

    // rp(d).then(function(body)
    //   {console.log("faucet: ", body);}).catch(function(e){console.log(e);});

    return rp(d);
}

function makeTransaction() {
    var tx = {
        inputs: [{ addresses: [ source ] }],
        outputs: [{ addresses: [ destination ], value: 3000}]
    };

    var data = {
        method: 'POST',
        uri: url + '/txs/new',
        body: tx,
        json: true
    };

    return rp(data);
}


generateDestination()
.then(generateSource)
.then(fundSource)
.then(makeTransaction)
.then(getSpecificBalance)
.catch(function(e){console.log(e);});
//generateAddress().then(fundSource).catch(function(e){console.log(e);});