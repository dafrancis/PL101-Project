var convertPitch = function (pitch) {
    var notes = ['c', '', 'd', '', 'e', 'f', '', 'g', '', 'a', '', 'b'];
    var letterPitch = notes.indexOf(pitch[0]);
    var octave = +pitch[1];
    return 12 + (12 * octave) + letterPitch;
};

var compile = function (musexpr) {
    var note_arr = [];
    var traverse = function (expr, time) {
        if(expr.tag === 'par'){
            return Math.max(traverse(expr.left, time), traverse(expr.right, time)) + time;
        }else if(expr.tag === 'seq'){
            time = traverse(expr.left, time);
            time = traverse(expr.right, time);
            return time;
        } else {
            expr.start = time;
            note_arr.push(expr);
            if(expr.pitch) {
                expr.pitch = convertPitch(expr.pitch);
            }
            return (expr.dur || expr.duration) + time;
        }
    };
    traverse(musexpr, 0);
    return note_arr;
};

var melody_mus =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

melody_mus =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'rest', duration: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
