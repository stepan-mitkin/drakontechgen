function setUpMachine(folder) {
    var _collection_2, _state_, id, item;
    _state_ = 'Normalize async flag';
    while (true) {
        switch (_state_) {
        case 'Normalize async flag':
            if (folder.keywords.async) {
                _state_ = 'Async';
            } else {
                if (folder.keywords.machine) {
                    delete folder.keywords.machine;
                    folder.keywords.async = true;
                    _state_ = 'Async';
                } else {
                    _state_ = 'Not async';
                }
            }
            break;
        case 'Not async':
            if (folder.eventItems.length !== 0) {
                reportError('events are not allowed in non-async functions', folder.path, folder.eventItems[0]);
            }
            _state_ = 'Exit';
            break;
        case 'Async':
            folder.events = {};
            _collection_2 = folder.eventItems;
            for (id of _collection_2) {
                item = folder.items[id];
                if (item.type === 'select') {
                    addSelectEvent(folder, item, id);
                } else {
                    addInputEvent(folder, item, id);
                }
            }
            _state_ = 'Mark as machine';
            break;
        case 'Mark as machine':
            if (folder.eventItems.length !== 0) {
                folder.isMachine = true;
                folder.originalName = folder.name;
            }
            _state_ = 'Exit';
            break;
        case 'Exit':
            _state_ = undefined;
            break;
        default:
            return;
        }
    }
}