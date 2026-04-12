function Red(name) {
    var self = { _type_: 'Red' };
    function getValue() {
        return name + ': ' + self.value;
    }
    function machineMethod(foo) {
        var _event_;
    }
    function machineMethod_create(foo) {
        var _event_, me, moo;
        me = {
            _type: 'machineMethod',
            _busy: true,
            state: 'created'
        };
        async function run() {
            me.state = '4';
            me._busy = false;
            _event_ = await new Promise(accept => {
                me._accept = accept;
            });
            moo = _event_[1];
            me.hello = moo;
            self.value = foo + moo;
        }
        me.run = run;
        return me;
    }
    self.getValue = getValue;
    self.machineMethod = machineMethod;
    self.machineMethod_create = machineMethod_create;
    return self;
}
function primInput(left, right) {
    var _event_;
}
function silReceive(arg1, arg2) {
    var _branch_, _eventType_, _event_;
}
function primInput_create(left, right) {
    var _event_, amount, me, total;
    me = {
        _type: 'primInput',
        _busy: true,
        state: 'created'
    };
    async function run() {
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
    me.run = run;
    return me;
}
function silReceive_create(arg1, arg2) {
    var _branch_, _eventType_, _event_, me, value, what, x;
    me = {
        _type: 'silReceive',
        _busy: true,
        state: 'created'
    };
    async function run() {
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
    me.run = run;
    return me;
}
module.exports = {
    primInput,
    silReceive,
    primInput_create,
    silReceive_create
};