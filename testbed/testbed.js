function setUpMachine(folder) {
    var _collection_2, id, item;
    if (folder.keywords.async) {
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
        if (folder.eventItems.length !== 0) {
            folder.isMachine = true;
            folder.originalName = folder.name;
        }
    } else {
        if (folder.keywords.machine) {
            delete folder.keywords.machine;
            folder.keywords.async = true;
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
            if (!(folder.eventItems.length !== 0)) {
                folder.isMachine = true;
                folder.originalName = folder.name;
            }
        } else {
            if (folder.eventItems.length !== 0) {
                reportError('events are not allowed in non-async functions', folder.path, folder.eventItems[0]);
            }
        }
    }
}