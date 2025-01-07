function primInput(left, right) {
    var self = {};
    var total;
    console.log('primInput: in constructor');
    total = 0;
    self.state = '4';
    function nudge_4(amount) {
        total += amount;
        console.log('first nudge: ', amount);
        self.state = '7';
    }
    function nudge_7(amount) {
        total += amount;
        console.log('second nudge: ', amount);
        self.total = total + left + right;
        self.state = undefined;
    }
    function nudge(amount) {
        switch (self.state) {
        case '4':
            return nudge_4(amount);
        case '7':
            return nudge_7(amount);
        default:
            return undefined;
        }
    }
    self.nudge = nudge;
    return self;
}
module.exports = { primInput };