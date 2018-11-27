const request = require('request');
const rp = require('request-promise');

var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});

const url = 'https://api.blockcypher.com/v1/btc/test3';
var source = null;
var dest = null;


function getBalance(form) {
    alert("got in get balance");
    var addr = form.address.value;
    var data = {
        method: 'GET',
        uri: url + '/addr/' + addr + '/balance',
        qs: {},
        json: true
    };

    rp(data).then(
        function(body) {
            var bal = body['address'];
            var p = '<p> The balance for ' + addr + ': ' + bal + '</p>';
            document.getElementById('addrBalance').appendChild(p); 

        }
    ).catch(
        function(err) {
            console.log(err);
            var p = '<p> Unable to get the balance</p>';
            document.getElementById('addrBalance').appendChild(p);
        }
    );
}

function makeTransaction(form) {
    var source = form.source.value;
    var dest  = form.destination.value;
    var tx = {
        inputs: [{ addresses: [ source ] }],
        outputs: [{ addresses: [ dest ], value: 3000}]
    };

    var data = {
        method: 'POST',
        uri: url + '/txs/new',
        body: tx,
        json: true
    };

    rp(data).then(
        function(body){
            var p = '<p> Transaction successful!</p>';
            document.getElementById('confirmation').appendChild(p);
        }
    ).catch(
        function(err) {
            console.log(err);
            var p = '<p> Transaction failed</p>';
            document.getElementById('confirmation').appendChild(p);
        }
    );
}

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});


