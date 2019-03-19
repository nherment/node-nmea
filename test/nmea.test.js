
var nmea   = require('../lib/NMEA.js');
var Helper   = require('../lib/Helper.js');
var assert = require('assert');

//console.log(util.inspect(nmea));

describe('nmea',function() {
    
    it("parse GPGGA with checksum",function() {
        var s = "GPGGA";
        var n = nmea.parse("$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M, , *42");
        assert.ok(n !== null,'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.strictEqual(n.latitude,(48.0 + (7.038 / 60.0)).toFixed(8),'latitude');
            assert.strictEqual(n.longitude,(11.0 + (31.324 / 60.0)).toFixed(8),'longitude');
            assert.strictEqual(n.fix,1,'fix');
            assert.strictEqual(n.satellites,8,'sats');
            assert.strictEqual(n.hdop,0.9,'hdop');
            assert.strictEqual(n.altitude,545.4,'altitude');
            assert.strictEqual(n.aboveGeoid,46.9,'aboveGeoid');
            assert.equal(n.dgpsUpdate,'','dgpsUpdate');
            assert.equal(n.dgpsReference,'','dgpsUpdate');
        }
    });


    it("parse GPGGA without checksum",function() {
        var s = 'GPGGA';
        var n = nmea.parse("$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M,,");
        assert.ok(n !== null,'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.strictEqual(n.latitude,(48.0 + (7.038 / 60.0)).toFixed(8),'latitude');
            assert.strictEqual(n.longitude,(11.0 + (31.324 / 60.0)).toFixed(8),'longitude');
            assert.strictEqual(n.fix,1,'fix');
            assert.strictEqual(n.satellites,8,'sats');
            assert.strictEqual(n.hdop,0.9,'hdop');
            assert.strictEqual(n.altitude,545.4,'altitude');
            assert.strictEqual(n.aboveGeoid,46.9,'aboveGeoid');
            assert.equal(n.dgpsUpdate,'','dgpsUpdate');
            assert.equal(n.dgpsReference,'','dgpsUpdate');
        }
    });

    it("parse GPGGA with negative coordinates", function(){
        var s = 'GPGGA';
        var n = nmea.parse("$GPGGA,134740.200,-3403.130,N,-11814.617,E,1,12,1.0,0.0,M,0.0,M,,");
        assert.ok(n !== null, 'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.strictEqual(n.latitude, (-(34.0 + (3.130 / 60))).toFixed(8),'latitude');
            assert.strictEqual(n.longitude, (-(118.0 + (14.617 / 60.0))).toFixed(8),'longitude');
            assert.strictEqual(n.fix,1,'fix');
            assert.strictEqual(n.satellites,12,'sats');
            assert.strictEqual(n.hdop,1,'hdop');
            assert.strictEqual(n.altitude,0,'altitude');
            assert.strictEqual(n.aboveGeoid,0,'aboveGeoid');
            assert.equal(n.dgpsUpdate,'','dgpsUpdate');
            assert.equal(n.dgpsReference,'','dgpsUpdate');
        }
    });

    it.skip("parse GPRMC",function() {
        var s = 'GPRMC';
        var n = nmea.parse("$GPRMC,081836,A,3751.65,S,14507.36,E,000.0,360.0,130998,011.3,E*62");
        assert.ok(n !== null,'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.equal(n.time,'081836','time');
            assert.equal(n.valid,'A','valid');
            assert.strictEqual(n.latitude,(-(37.0 + (51.65/60.0))).toFixed(8),'latitude');
            assert.strictEqual(n.longitude,(118.0 + (7.36 / 60.0)).toFixed(8),'longitude');
            assert.strictEqual(n.sog,0.0,'sog');
            assert.strictEqual(n.course,360.0,'course');
            assert.equal(n.date,'130998','date');
            assert.strictEqual(n.variation,-11.3,'variation');
//            assert.strictEqual(n.datetime.toUTCString(),'Tue, 13 Oct 1998 08:18:36 GMT','datetime');
        }
    });
    
    // $GPGSV,3,2,12,16,17,148,46,20,61,307,51,23,36,283,47,25,06,034,00*78
    it("parse GPGSV",function() {
      var s = "GPGSV";
      var n = nmea.parse("$GPGSV,3,2,12,16,17,148,46,20,61,307,51,23,36,283,47,25,06,034,00*78");
      assert.ok(n != null,'parser result not null');
      if (n !== null) {
        assert.ok(n.id === s,s + '!== ' + n.id);
        assert.strictEqual(n.msgs,3,'message count');
        assert.strictEqual(n.mnum,2,'message number');
        assert.strictEqual(n.count,12,'total satellites in view');
 
        assert.strictEqual(n.sat[0].prn,16,'sat 0 prn');
        assert.strictEqual(n.sat[0].el,17,'sat 0 el');
        assert.strictEqual(n.sat[0].az,148,'sat 0 az');
        assert.strictEqual(n.sat[0].ss,46,'sat 0 ss');
        
        assert.strictEqual(n.sat[1].prn,20,'sat 1 prn');
        assert.strictEqual(n.sat[1].el,61,'sat 1 el');
        assert.strictEqual(n.sat[1].az,307,'sat 1 az');
        assert.strictEqual(n.sat[1].ss,51,'sat 1 ss');
        
        assert.strictEqual(n.sat[2].prn,23,'sat 2 prn');
        assert.strictEqual(n.sat[2].el,36,'sat 2 el');
        assert.strictEqual(n.sat[2].az,283,'sat 2 az');
        assert.strictEqual(n.sat[2].ss,47,'sat 2 ss');
        
        assert.strictEqual(n.sat[3].prn,25,'sat 3 prn');
        assert.strictEqual(n.sat[3].el,6,'sat 3 el');
        assert.strictEqual(n.sat[3].az,34,'sat 3 az');
        assert.strictEqual(n.sat[3].ss,0,'sat 3 ss');
      }
    });
    it("parse GPGSA",function() {
        var s = 'GPGSA';
        var n = nmea.parse("$GPGSA,A,3,13,07,04,08,17,10,,,,,,,4.3,2.8,3.2*30");
        assert.ok(n !== null,'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.equal(n.mode, 'A');
            assert.equal(n.fix, 3);
            assert.equal(n.sat[0], '13');
            assert.equal(n.sat[1], '07');
            assert.equal(n.sat[2], '04');
            assert.equal(n.sat[3], '08');
            assert.equal(n.sat[4], '17');
            assert.equal(n.sat[5], '10');
            assert.strictEqual(n.pdop,4.3,'pdop');
            assert.strictEqual(n.hdop,2.8,'hdop');
            assert.strictEqual(n.vdop,3.2,'vdop');
        }
    });
    it("parse GPVTG",function() {
        var s = 'GPVTG';
        var n = nmea.parse("$GPVTG,276.8,T,,M,018.1,N,000.0,K,A*0E");
        assert.ok(n !== null,'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s,s + '!== ' + n.id);
            assert.equal(n.course, 276.8);
            assert.equal(n.knots, 18.1);
            assert.equal(n.kph, 0);
            assert.equal(n.mode, 'A');
        }
    });

    it("parse MWV", function () {
        var s = 'IIMWV';
        var n = nmea.parse("$IIMWV,017,R,02.91,N,A*2F");
        assert.ok(n !== null, 'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s, s + '!== ' + n.id);
            assert.equal(n.apparent_wind_angle, 17);
            assert.equal(n.reference, 'relative');
            assert.equal(n.apparent_wind_speed, 2.91);
            assert.equal(n.status, 'data valid');
        }
    });


    it("parse DBT", function () {
        var s = 'IIDBT';
        var n = nmea.parse("$IIDBT,036.41,f,011.10,M,005.99,F*25");
        assert.ok(n !== null, 'parser result not null');
        if (n !== null) {
            assert.ok(n.id === s, s + '!== ' + n.id);
            assert.equal(n.feet, 36.41);
            assert.equal(n.meters, 11.1);
        }
    });

    it("VWR parse", function() {
       var s = "IIVWR";
       var n = nmea.parse("$IIVWR,23.4,R,9.09,N,4.67,M,16.8,K*46");
       assert.ok(n !== null,'parser result not null');
       if (n !== null) {
         assert.ok(n.id === s,s + '!== ' + n.id);
       }
    })

    it("VHW parse", function() {
       var s = "IIVHW";
       var n = nmea.parse("$IIVHW,183.0,T,171.0,M,3.63,N.4.56,K*5B");
       assert.ok(n !== null,'parser result not null');
       if (n !== null) {
         assert.ok(n.id === s,s + '!== ' + n.id);
       }
    })



    it("encode latitude", function () {
        var s;
        s = Helper.encodeLatitude(48.1173);
        assert.strictEqual(s,'4807.038,N',48.1173);
        s = Helper.encodeLatitude(-37.86083);
        assert.strictEqual(s,'3751.650,S',-37.86083);
    });

    it("encode longitude",function() {
        var s;
        s = Helper.encodeLongitude(11.522066);
        assert.strictEqual(s,'01131.324,E',11.522066);
    });

    it("encode then parse latitude",function() {
        var s;
        var lat;
        var hemi;
        var tokens;
        var epsilon = 0.0001
        var count = 0;
        var p;
        for(lat=-90.0;lat<=90.0;lat += 0.01) {
            s = Helper.encodeLatitude(lat);
            tokens = s.split(',');
            p = Helper.parseLatitude(tokens[0],tokens[1]);
    
            // only find failures
            if (Math.abs(lat - p) > epsilon) {
                assert.strictEqual(lat,p,s);
            }
        }
    });

    it("encode then parse longitude",function() {
        var s;
        var lon;
        var hemi;
        var tokens;
        var epsilon = 0.0001
        var count = 0;
        var p;
        for(lon=-180.0;lon<=180.0;lon += 0.01) {
            s = Helper.encodeLongitude(lon);
            tokens = s.split(',');
            p = Helper.parseLongitude(tokens[0],tokens[1]);
    
            // only find failures
            if (Math.abs(lon - p) > epsilon) {
                console.log(lon,p,s);
                assert.strictEqual(lon,p,s);
            }
        }
    });
    
    // $GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M, , *42
    it("GGA encoder",function() {
        var s;
        s = nmea.encode("GPGGA",
                        {
                            date:new Date(Date.UTC(98,08,13,12,35,19.0)),
                            lat:48.1173,
                            lon:11.522066,
                            fix:1,
                            satellites:8,
                            hdop:0.9,
                            altitude:545.4,
                            aboveGeoid:46.9
                        });
        assert.ok(s !== null);
        assert.strictEqual(s,'$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M,,*42','GPGGA');
    });

    it("RMC encoder",function() {
        var s;
        s = nmea.encode("GPRMC",{
            date:new Date(Date.UTC(98,8,13,8,18,36)),
            status:'A',
            lat:-37.86083,
            lon:145.12266,
            speed:0,
            course:360.0,
            variation:-11.3,
            mode: 'E'
        });
        if (s !== null) {
            assert.strictEqual(s,'$GPRMC,081836,A,3751.650,S,14507.360,E,000.0,360.0,130998,011.3,E*62','GPRMC');
        }
        else {
            assert.ok(s !== null);
        }
    });

    it("GSV decoder", function() {

    })

    it("error handlers",function() {
        var n;
        
        console.log();
        assert.ok(nmea.error != null,'standard error handler not null');
        
        assert.throws(function() {
          nmea.addParser(null)
          },
          Error,
          'null parser');
        
        // n = nmea.parse("$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M");
        assert.throws(function() {
          nmea.parse("$GPGGA,123519,4807.038,N,01131.324,E,1,08,0.9,545.4,M,46.9,M");
          },
          Error,
          'GGA not enough tokens');
        
        // n = nmea.parse("$GPRMC,081836,A,3751.65,S,14507.36,E,000.0,360.0,130998,011.3");
        assert.throws(function() {
          nmea.parse("$GPRMC,081836,A,3751.65,S,14507.36,E,000.0,360.0,130998,011.3");
          },
          Error,
          'RMC not enough tokens');
        
    });
    
});
