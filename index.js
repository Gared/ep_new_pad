var async = require('ep_etherpad-lite/node_modules/async');
var padManager = require('ep_etherpad-lite/node/db/PadManager');
// use Node.js PRNG to generate a "unique" sequence
const crypto = require('crypto');

exports.registerRoute = function (hook_name, args, cb) {
  args.app.get('/randomPad', function (req, res) {

    createRandomPadName = function () {
      // the number of distinct chars (64) is chosen to ensure that
      // the selection will be uniform when using the PRNG below
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
      // the length of the pad name is chosen to get 120-bit security:
      // log2(64^20) = 120
      var string_length = 20;
      // make room for 8-bit integer values that span from 0 to 255.
      var randomarray = new Uint8Array(string_length);

      crypto.randomFillSync(randomarray);
      var randomstring = '';
      for (var i = 0; i < string_length; i++) {
        // instead of writing "Math.floor(randomarray[i]/256*64)"
        // we can save some cycles.
        var rnum = Math.floor(randomarray[i] / 4);
        randomstring += chars.substring(rnum, rnum + 1);
      }
      return randomstring;
    };

    async.series([
      function (callback) {
        // find a really new pad
        var padName = createRandomPadName();
        // redirect to new pad
        res.writeHead(302, {
          'Location': 'p/' + padName
        });
        res.end();
        callback();
      }
    ]);
  });
};

