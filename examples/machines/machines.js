function primInput(left, right) {
    var self = {};
    var total;
    total = 0;
    self.state = '_start_4';
    function nudge_start_4(amount) {
        total += amount;
        self.state = '_start_7';
    }
    function nudge_start_7(amount) {
        total += amount * 2;
        self.total = total + left + right;
        self.state = undefined;
    }
    function nudge(amount) {
        switch (self.state) {
        case '_start_4':
            return nudge_start_4(amount);
        case '_start_7':
            return nudge_start_7(amount);
        default:
            return undefined;
        }
    }
    self.nudge = nudge;
    return self;
}
function silReceive(arg1, arg2) {
    var self = {};
    var x;
    x = arg1 + 2;
    self.state = 'Blackstate_11';
    function left_Blackstate_11(value) {
        if (value < 0) {
            arg2 += value;
            self.state = 'Redstate_13';
        } else {
            arg1 += value;
            arg1++;
            self.state = 'Redstate_13';
        }
    }
    function left_Greystate_23(value) {
        arg1 += value * 10;
        self.state = 'Greystate_25';
    }
    function left_Redstate_13(value) {
        arg1 += value * 2;
        x++;
        self.state = 'Greystate_23';
    }
    function print_Greystate_25() {
        self.a1 = arg1 + x;
        self.a2 = arg2;
        self.state = 'Blackstate_11';
    }
    function right_Blackstate_11(value) {
        arg2 += value;
        self.state = 'Redstate_13';
    }
    function right_Redstate_13(value) {
        arg2 += value * 2;
        self.state = 'Blackstate_11';
    }
    function left(value) {
        switch (self.state) {
        case 'Blackstate_11':
            return left_Blackstate_11(value);
        case 'Redstate_13':
            return left_Redstate_13(value);
        case 'Greystate_23':
            return left_Greystate_23(value);
        default:
            return undefined;
        }
    }
    function print() {
        switch (self.state) {
        case 'Greystate_25':
            return print_Greystate_25();
        default:
            return undefined;
        }
    }
    function right(value) {
        switch (self.state) {
        case 'Blackstate_11':
            return right_Blackstate_11(value);
        case 'Redstate_13':
            return right_Redstate_13(value);
        default:
            return undefined;
        }
    }
    self.left = left;
    self.print = print;
    self.right = right;
    return self;
}
module.exports = {
    primInput,
    silReceive
};