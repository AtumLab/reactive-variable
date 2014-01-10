# Reactive Variable

> The premise of Reactive Programming is the Observer pattern. This involves a subject and an observer that observes the subject. - Jesse Liberty

## Usage

A quick example how to use rv.js:

    var watch = molly.get('watch');
    var variable = molly.get('type.Variable');
    var a = new variable(1);
    var b = new variable(2);
    var c = watch(function (com) {
        return a.get() + b.get();
    }, 'Number');
    console.log(c.get()); // 3 = 1 + 2
    b.set(3);
    console.log(c.get()); // 4 = 1 + 3
    a.set(3);
    console.log(c.get()); // 6 = 3 + 3
    c.stop();
    b.set(0);
    console.log(c.get()); // still 6
