var PEG = require('pegjs');
var fs = require('fs');

var parser = function (callback) {
    fs.readFile('parser.peg', 'ascii', function(err, data) {
        callback.call(null, PEG.buildParser(data).parse);
    });
};

exports["Test (a b c)"] = function (test) {
    test.expect(2);
    parser(function (parse) {
        test.deepEqual(parse("(a b c)"), ["a", "b", "c"], "Test (a b c)");
        test.deepEqual(parse("(1 (2 (3)))"), ['1', ['2', ['3']]], "Test nesting");
        test.done();
    });
};

exports["Test Many spaces"] = function (test) {
    test.expect(2);
    parser(function (parse) {
        test.deepEqual(parse("(a       b         c)"), ["a", "b", "c"], "Spaces between atoms");
        test.deepEqual(parse("    (   a b c   )     "), ["a", "b", "c"], "Spaces by parens");
        test.done();
    });
};

exports["Test accept newline"] = function (test) {
    test.expect(1);
    parser(function (parse) {
        test.deepEqual(parse("(a b c)\n"), ["a", "b", "c"], "Accept newline");
        test.done();
    });
};

exports["Test quotes"] = function (test) {
    test.expect(2);
    parser(function (parse) {
        test.deepEqual(parse("'x"), ['quote', 'x'], "Quote x");
        test.deepEqual(parse("'(1 2 3)"), ['quote', ['1', '2', '3']], "Quote (1 2 3)");
        test.done();
    });
};

exports["Test comment"] = function (test) {
    test.expect(2);
    parser(function (parse) {
        test.deepEqual(parse(";; a b c"), '', "Comment does nothing");
        test.deepEqual(parse(";; list of a b and c\n(a b c)"), ['a', 'b', 'c'], "Comment does nothing. (a b c) as normal");
        test.deepEqual(parse(";;a\n(1 ;;b\n;;c 3\n2\n;; )\n)"), ['1', '2'], "Multiple comments");
        test.done();
    });
};
