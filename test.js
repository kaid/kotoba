var exec = require('child_process').exec
  , assert = require('chai').assert
  , path = require('path')
  , fs = require('fs')
  , kotoba = require('./index');

var kotoba_file = __dirname + '/.kotoba/' + kotoba.file_name() + '.kotoba'
  , kotoba_file1 = __dirname + '/.kotoba/' + (kotoba.file_name() - 1) + '.kotoba';

var exists = function() {
  return path.existsSync(kotoba_file);
}

var capture_stdout = function(cmd, callback) {
  exec(cmd, function(err, stdout, stderr) {
    callback(err, stdout);
  });
}

var rmdir = function(f) {
  exec('rm -rf ' + f, function(err) {
    if (err) throw err;
  })
}

var sample = function() {
  exec('mkdir .kotoba', function(err) {
    if (err) throw err;
    exec('echo "some\ntest\nrecords\na test phrase" > ' + kotoba_file1, function(err) {
      if (err) throw err;
    });
  });
}

suite('kotoba', function() {
  var test_count = function() {
    return test('should print the count of total records and today\'s records', function(done) {
      sample();
      capture_stdout('./bin/kotoba RAmen!', function(err, stdout) {
        assert.include(stdout, '1', 'count of today\'s record has been printed');
        assert.include(stdout, '5', 'count of total records has been printed');
        done(err);
      });
    });
  }
  
  test_count();

  suite('--help', function() {
    test('should print usage', function(done) {
      capture_stdout('./bin/kotoba --help', function(err, stdout) {
        assert.include(stdout.toString(), 'Usage:', 'usage has been printed');
        done(err);
      });
    });
  });

  suite('<word/phrase>', function() {

    setup(function() {
      process.env.HOME = __dirname;
      rmdir('.kotoba');
    });

    teardown(function() {
      rmdir('.kotoba');
    });
    
    test('should create .kotoba dir and kotoba file and record input', function(done) {
      exec('./bin/kotoba blahblahblahblah', function(err) {
        assert.ok(exists(), 'file has been created');
        var data = fs.readFileSync(kotoba_file, 'utf-8')
        data = data.split('\n');
        var last = data[data.length - 1] ? data[data.length - 1] : data[data.length - 2];
        assert.equal(last, 'blahblahblahblah', 'the input has been recorded');
        done(err);
      });
    });

    test('should print the recorded word/phrase', function(done) {
      capture_stdout('./bin/kotoba another line', function(err, stdout) {
        assert.include(stdout, 'another line', 'the recorded input has been printed');
        done(err);
      })
    });

    test_count();
  });
});
