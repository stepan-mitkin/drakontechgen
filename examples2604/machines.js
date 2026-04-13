function machines() {
var unit;
function Red(name) {
    var self = { _type: 'Red' };
    function getValue() {
        return name + ': ' + self.value;
    }
    function machineMethod(foo) {
        var _obj_;
        _obj_ = machineMethod_create(foo);
        return _obj_.run();
    }
    function machineMethod_create(foo) {
        var me;
        me = {
            _type: 'machineMethod',
            _busy: true,
            state: 'created'
        };
        async function machineMethod_run() {
            var _event_, moo;
            if (me.state !== 'created') {
                throw new Error('run() can be called only once');
            }
            me.state = 'started';
            me.state = '4';
            me._busy = false;
            _event_ = await new Promise(accept => {
                me._accept = accept;
            });
            moo = _event_[1];
            me.hello = moo;
            self.value = foo + moo;
        }
        me.run = machineMethod_run;
        me.stop = function () {
            me.state = undefined;
        };
        me.bar = function (moo) {
            var _args_;
            if (me._busy) {
                throw new Error('Synchronous reentry is not allowed');
            }
            switch (me.state) {
            case '4':
                _args_ = [];
                _args_.push('bar');
                _args_.push(moo);
                me._busy = true;
                me._accept(_args_);
                return true;
            default:
                return false;
            }
        };
        return me;
    }
    self.getValue = getValue;
    self.machineMethod = machineMethod;
    self.machineMethod_create = machineMethod_create;
    return self;
}
function primInput(left, right) {
    var _obj_;
    _obj_ = primInput_create(left, right);
    return _obj_.run();
}
function silReceive(arg1, arg2) {
    var _obj_;
    _obj_ = silReceive_create(arg1, arg2);
    return _obj_.run();
}
function primInput_create(left, right) {
    var me;
    me = {
        _type: 'primInput',
        _busy: true,
        state: 'created'
    };
    async function primInput_run() {
        var _event_, amount, total;
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        total = 0;
        me.state = '4';
        me._busy = false;
        _event_ = await new Promise(accept => {
            me._accept = accept;
        });
        amount = _event_[1];
        total += amount;
        me.total = total + left + right;
    }
    me.run = primInput_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.nudge = function (amount) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '4':
            _args_ = [];
            _args_.push('nudge');
            _args_.push(amount);
            me._busy = true;
            me._accept(_args_);
            return true;
        default:
            return false;
        }
    };
    return me;
}
function silReceive_create(arg1, arg2) {
    var me;
    me = {
        _type: 'silReceive',
        _busy: true,
        state: 'created'
    };
    async function silReceive_run() {
        var _branch_, _eventType_, _event_, value, what, x;
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _branch_ = 'Init';
        while (true) {
            switch (_branch_) {
            case 'Init':
                x = arg1 + 2;
                _branch_ = 'Black state';
                break;
            case 'Black state':
                me.state = '11';
                me._busy = false;
                _event_ = await new Promise(accept => {
                    me._accept = accept;
                });
                _eventType_ = _event_[0];
                if (_eventType_ === 'left') {
                    value = _event_[1];
                    if (value < 0) {
                        arg2 += value;
                        _branch_ = 'Red state';
                    } else {
                        arg1 += value;
                        _branch_ = 'Inter-transitional';
                    }
                } else {
                    if (_eventType_ !== 'right') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    value = _event_[1];
                    arg2 += value;
                    _branch_ = 'Red state';
                }
                break;
            case 'Inter-transitional':
                arg1++;
                _branch_ = 'Red state';
                break;
            case 'Red state':
                me.state = '13';
                me._busy = false;
                _event_ = await new Promise(accept => {
                    me._accept = accept;
                });
                _eventType_ = _event_[0];
                if (_eventType_ === 'left') {
                    value = _event_[1];
                    arg1 += value * 2;
                    _branch_ = 'Grey state';
                } else {
                    if (_eventType_ !== 'right') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    value = _event_[1];
                    arg2 += value * 2;
                    _branch_ = 'Black state';
                }
                break;
            case 'Grey state':
                x++;
                me.state = '25';
                me._busy = false;
                _event_ = await new Promise(accept => {
                    me._accept = accept;
                });
                what = _event_[1];
                console.log(what);
                me.a1 = arg1 + x;
                me.a2 = arg2;
                _branch_ = 'Black state';
                break;
            default:
                return;
            }
        }
    }
    me.run = silReceive_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.left = function (value) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('left');
            _args_.push(value);
            me._busy = true;
            me._accept(_args_);
            return true;
        case '13':
            _args_ = [];
            _args_.push('left');
            _args_.push(value);
            me._busy = true;
            me._accept(_args_);
            return true;
        default:
            return false;
        }
    };
    me.right = function (value) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('right');
            _args_.push(value);
            me._busy = true;
            me._accept(_args_);
            return true;
        case '13':
            _args_ = [];
            _args_.push('right');
            _args_.push(value);
            me._busy = true;
            me._accept(_args_);
            return true;
        default:
            return false;
        }
    };
    me.print = function (what) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '25':
            _args_ = [];
            _args_.push('print');
            _args_.push(what);
            me._busy = true;
            me._accept(_args_);
            return true;
        default:
            return false;
        }
    };
    return me;
}
unit.Red = Red;
unit.primInput = primInput;
unit.silReceive = silReceive;
unit.primInput_create = primInput_create;
unit.silReceive_create = silReceive_create;
return unit;
}