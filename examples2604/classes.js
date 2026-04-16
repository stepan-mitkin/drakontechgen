function YellowClass(name, color, arg1, arg2) {
    var self = { _type: 'YellowClass' };
    var title;
    title = 'Dr.';
    const greeting = 'Hello';
    const {x, y} = arg1;
    var [a, b] = arg2;
    function YellowClass_getFullInfo() {
        var result;
        log('getFullInfo');
        a = 1000;
        result = {
            name: name,
            color: color,
            address: self.address,
            a: a,
            b: b,
            x: x,
            y: y
        };
        return result;
    }
    function YellowClass_greet() {
        var message;
        log('greet');
        message = greeting + ', ' + title + ' ' + name + '!';
        return message;
    }
    function YellowClass_setName(newName) {
        log('setName: ' + newName);
        name = newName;
    }
    function YellowClass_setTitle(newTitle) {
        log('setTitle: ' + newTitle);
        title = newTitle;
    }
    function log(message) {
        console.log('YellowClass', message);
    }
    self.getFullInfo = YellowClass_getFullInfo;
    self.greet = YellowClass_greet;
    self.setName = YellowClass_setName;
    self.setTitle = YellowClass_setTitle;
    return self;
}
function log(message) {
    console.log('GreyClass', message);
}
function smarterAdd(left, right) {
    return (left + right) * 2;
}
function GreyClass() {
    var self = { _type: 'GreyClass' };
    function GreyClass_getValue() {
        log('getValue');
        return smarterAdd(self.value, 20);
    }
    function GreyClass_init(value) {
        self.value = value;
    }
    self.getValue = GreyClass_getValue;
    self.init = GreyClass_init;
    return self;
}
function runGrey() {
    var grey;
    grey = GreyClass();
    grey.init(42);
    return grey.getValue();
}
module.exports = {
    YellowClass,
    GreyClass,
    runGrey
};