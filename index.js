var async = require('ep_etherpad-lite/node_modules/async');
var padManager = require('ep_etherpad-lite/node/db/PadManager');

exports.registerRoute = function (hook_name, args, cb) {
  args.app.get('/randomPad', function(req, res) {
    var padName;
    
    createRandomPadName = function() {
      var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var length = Math.floor((Math.random()*15)+8);
      var randomstring = '';
      for (var i = 0; i < length; i++)
      {
        var charNum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(charNum, charNum + 1);
      }
      return randomstring;
    };

    findPad = function(padNameString, cb) {
      // check if pad exists already
      padManager.doesPadExists(padNameString, function(err, exists) {
        // if it exists already
        if (exists) {
          // try another pad name
          findPad(createRandomPadName(), cb);
        } else {
          // save new pad name
          padName = padNameString;
          cb();
        }
      });
    };
    
  	async.series([
	  function(callback){
        // find a really new pad
        padName = findPad(createRandomPadName(), callback);
      },
      function (callback) {
        // redirect to new pad
        res.writeHead(302, {
          'Location': '/p/'+padName
        });
        res.end();
        callback();
      }
    ]);
  });
};

