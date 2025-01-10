function primInput(left, right) {
    var self = {};
    var total;
    total = 0;
    self.state = 'branch_0';
    function branch_0_nudge(amount) {
        total += amount;
        self.total = total + left + right;
        self.state = undefined;
    }
    function nudge(amount) {
        switch (self.state) {
        case 'branch_0':
            return branch_0_nudge(amount);
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
    self.state = 'Blackstate';
    function Blackstate_left(value) {
        if (value < 0) {
            arg2 += value;
            self.state = 'Redstate';
        } else {
            arg1 += value;
            arg1++;
            self.state = 'Redstate';
        }
    }
    function Blackstate_right(value) {
        arg2 += value;
        self.state = 'Redstate';
    }
    function Greystate_print() {
        self.a1 = arg1 + x;
        self.a2 = arg2;
        self.state = 'Blackstate';
    }
    function Redstate_left(value) {
        arg1 += value * 2;
        x++;
        self.state = 'Greystate';
    }
    function Redstate_right(value) {
        arg2 += value * 2;
        self.state = 'Blackstate';
    }
    function left(value) {
        switch (self.state) {
        case 'Blackstate':
            return Blackstate_left(value);
        case 'Redstate':
            return Redstate_left(value);
        default:
            return undefined;
        }
    }
    function print() {
        switch (self.state) {
        case 'Greystate':
            return Greystate_print();
        default:
            return undefined;
        }
    }
    function right(value) {
        switch (self.state) {
        case 'Blackstate':
            return Blackstate_right(value);
        case 'Redstate':
            return Redstate_right(value);
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