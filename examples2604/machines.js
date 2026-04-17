function Red(name) {
    var self = { _type: 'Red' };
    function Red_getValue() {
        return name + ': ' + self.value;
    }
    function Red_machineMethod(foo) {
        var _obj_;
        _obj_ = Red_machineMethod_create(foo);
        return _obj_.run();
    }
    function Red_machineMethod_create(foo) {
        var _topGen_, _topReject_, _topResolve_, me;
        me = {
            _type: 'machineMethod',
            _busy: true,
            state: 'created'
        };
        function* machineMethod_main() {
            var _event_, moo;
            me.state = '4';
            me._busy = false;
            _event_ = yield;
            moo = _event_[1];
            me.hello = moo;
            self.value = foo + moo;
            _topResolve_();
        }
        function machineMethod_run() {
            if (me.state !== 'created') {
                throw new Error('run() can be called only once');
            }
            me.state = 'started';
            _topGen_ = machineMethod_main();
            _topGen_.next();
            return new Promise((resolve, reject) => {
                _topResolve_ = resolve;
                _topReject_ = reject;
            });
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
                _topGen_.next(_args_);
                break;
            default:
                break;
            }
        };
        return me;
    }
    self.getValue = Red_getValue;
    self.machineMethod = Red_machineMethod;
    self.machineMethod_create = Red_machineMethod_create;
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
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'primInput',
        _busy: true,
        state: 'created'
    };
    function* primInput_main() {
        var _event_, amount, total;
        total = 0;
        me.state = '4';
        me._busy = false;
        _event_ = yield;
        amount = _event_[1];
        total += amount;
        me.total = total + left + right;
        _topResolve_(me.total);
        return;
    }
    function primInput_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = primInput_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
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
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function silReceive_create(arg1, arg2) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'silReceive',
        _busy: true,
        state: 'created'
    };
    function* silReceive_main() {
        var _branch_, _eventType_, _event_, value, what, x;
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
                _event_ = yield;
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
                _event_ = yield;
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
                    if (value === '7777') {
                        _topReject_(new Error('Bad right value'));
                        return;
                    }
                    arg2 += value * 2;
                    _branch_ = 'Black state';
                }
                break;
            case 'Grey state':
                x++;
                me.state = '25';
                me._busy = false;
                _event_ = yield;
                what = _event_[1];
                console.log(what);
                me.a1 = arg1 + x;
                me.a2 = arg2;
                _branch_ = 'Black state';
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function silReceive_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = silReceive_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
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
        case '13':
            _args_ = [];
            _args_.push('left');
            _args_.push(value);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.right = function (value) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '13':
            _args_ = [];
            _args_.push('right');
            _args_.push(value);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
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
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
module.exports = {
    Red,
    primInput,
    silReceive,
    primInput_create,
    silReceive_create
};