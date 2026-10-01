function setUpMachine(folder) {
    var id, item;
    if (folder.keywords.async) {
        folder.events = {};
        for (id of folder.eventItems) {
            item = folder.items[id];
            if (item.type === 'select') {
                addSelectEvent(folder, item, id);
            } else {
                addInputEvent(folder, item, id);
            }
        }
        if (!(folder.eventItems.length === 0)) {
            folder.isMachine = true;
            folder.originalName = folder.name;
        }
    } else {
        if (folder.keywords.machine) {
            delete folder.keywords.machine;
            folder.keywords.async = true;
            folder.events = {};
            for (id of folder.eventItems) {
                item = folder.items[id];
                if (item.type === 'select') {
                    addSelectEvent(folder, item, id);
                } else {
                    addInputEvent(folder, item, id);
                }
            }
            if (!(folder.eventItems.length === 0)) {
                folder.isMachine = true;
                folder.originalName = folder.name;
            }
        } else {
            if (!(folder.eventItems.length === 0)) {
                reportError('events are not allowed in non-async functions', folder.path, folder.eventItems[0]);
            }
        }
    }
}