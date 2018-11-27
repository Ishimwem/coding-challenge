'use strict';

const request = require('request');
const rp = require('request-promise');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');
var keys    = new bitcoin.ECPair(bigi.fromHex(my_hex_private_key));

app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});

const url = 'https://api.blockcypher.com/v1/btc/test3';

/* Given a form with a testnet address, uses blockcypher api to get its balance and display it*/
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

/* Given the source and the destination addresses, makes a transaction
 from the source to the destination address */
function makeTransaction(form) {
    var source = form.source.value;
    var dest  = form.destination.value;
    var newtx = {
        inputs: [{ addresses: [ source ] }],
        outputs: [{ addresses: [ dest ], value: 3000}]
    };

    var data = {
        method: 'POST',
        uri: url + '/txs/new',
        body: newtx,
        json: true
    };

    return rp(data).then(function(tx) {
        tx.pubkeys = [];
        tx.signatures = tx.tosign.map(function(tosign, n) {
          tx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
          return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
        });
        
        var d = {
            method: 'POST',
            uri: url + '/txs/send',
            body: tmptx,
            json: true
        };
        rp(d).then(function(body) {
            console.log(finaltx);
            var p = '<p> Transaction successful</p>';
            document.getElementById('confirmation').appendChild(p);
        })
      }).catch(
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
