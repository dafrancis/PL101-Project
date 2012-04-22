var PEG = require('pegjs');
var fs = require('fs');

var parser = function (callback) {
    fs.readFile('parser.peg', 'ascii', function(err, data) {
        callback.call(null, PEG.buildParser(data).parse);
    });
};

exports["Test (a b c)"] = function (test) {
    test.expect(1);

    parser(function (parse) {
        test.deepEqual(parse("(a b c)"), ["a", "b", "c"], "Test (a b c)");
        test.done();
    });

};
