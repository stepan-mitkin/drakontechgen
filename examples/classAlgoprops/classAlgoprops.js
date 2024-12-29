function Lime() {
    var self = {};
    var bar, foo;
    function _calc_bar() {
        return 5 + foo;
    }
    async function _calc_foo() {
        await pause(1);
        return 10;
    }
    async function getBar() {
        await _compute_bar();
        return bar;
    }
    async function _compute_bar() {
        foo = await _calc_foo();
        bar = _calc_bar();
    }
    self.getBar = getBar;
    return self;
}
function Pink(redValue) {
    var self = {};
    var index, orange, red, yellow;
    function _calc_index() {
        return 1;
    }
    function _calc_orange() {
        return {
            yellow: red[0],
            red: 100,
            blue: 0
        };
    }
    function _calc_red() {
        return [
            redValue,
            10,
            0
        ];
    }
    function _calc_yellow() {
        var x;
        x = orange.yellow + red[index];
        return x * 2;
    }
    function calculateYellow() {
        _compute_yellow();
        return yellow;
    }
    function _compute_yellow() {
        red = _calc_red();
        orange = _calc_orange();
        index = _calc_index();
        yellow = _calc_yellow();
    }
    self.calculateYellow = calculateYellow;
    return self;
}
function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
module.exports = {
    Lime,
    Pink
};