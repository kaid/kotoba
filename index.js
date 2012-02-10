var fs = require('fs')
  , path = require('path')
  , HOME = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
  , kpath = HOME + '/.kotoba/';

exports = module.exports = core = {};

core.version = (JSON.parse(fs.readFileSync(__dirname + '/package.json')).version);

core.create_dir = function() {
  if (!path.existsSync(kpath)) {
    fs.mkdir(kpath, 0755, function(err) {
      if (err) throw err;
    });
  }
}

core.write_file = function(w) {
  var f = core.file_name() + '.kotoba';
  var ws =fs.createWriteStream(kpath + f, {
      flags: 'a+'
    , encoding: 'utf-8'
    , mode: 0644
  });
  ws.write(w + '\n');
}

core.file_name = function() {
  var d = new Date;
  var year = '' + (d.getYear() + 1900);
  var month = '' + (d.getMonth() + 1);
  var date = '' + d.getDate();
  if (month.length < 2) month = 0 + month;
  if (date.length < 2) date = 0 + date;
  return year + month + date;
}

core.count_records = function(callback) {
  fs.readdir(kpath, function(err, files) {
    var today = 0, total = 0;
    if (files) total = files.filter(function(f) {
      return f.substring(f.length - 7, f.length) === '.kotoba';
    }).map(function(f) {
      var t = f;
      f = fs.readFileSync(kpath + f, 'utf-8').split('\n');
      f = f.filter(function(i) {
        return !!i;
      });
      (t === core.file_name() + '.kotoba') ? today = f.length : today = 0;
      return f.length;
    }).reduce(function(p, c) {
      return p + c;
    });
    console.log('today: %s, total: %s', today, total);
    if (callback) callback();
  });
}
