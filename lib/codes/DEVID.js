// Sierra Wireless GX 440 Device ID Parser
// $DEVID,0x0000028A003D2A10*40

var Helper = require("../Helper.js");

exports.Decoder = function(id) {
  this.id = id;
  this.talker_type_id = "DEVID";
  this.talker_type_desc = "Device ID";

  this.parse = function(tokens) {
    if(tokens.length < 2) {
      throw new Error('DEVID: not enough tokens');
    }

    // trim whitespace
    // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
    var i;
    for(i=0;i<tokens.length;++i) {
      tokens[i] = tokens[i].trim();
    }

    // Remove 0x to match the device id from the status page
    var deviceId = Helper.encodeValue(tokens[1]);
    if(deviceId.length > 2){
      deviceId = deviceId.substr(2);
    }

    return  {
      id : tokens[0].substr(1),
      talker_type_id: this.talker_type_id,
      talker_type_desc: this.talker_type_desc,
      device:deviceId
    };
  };
};
