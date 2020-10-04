browser.commands.onCommand.addListener(watch);

async function watch(cmd) {
    let tab = await getCurrentTabInfo();

    if (tab) {
        let highest = await getHighestIndex();
        let newIndex = -1;
    
        switch (cmd) {
            case 'left':
                if (tab.index - 1 >= 0) {
                    newIndex = tab.index - 1;
                }
                else {
                    newIndex = highest;
                }
                break;
            case 'right':
                if (tab.index + 1 > highest) {
                    newIndex = 0;
                }
                else {
                    newIndex = tab.index + 1;
                }
                break;
            case 'leftend':
                newIndex = 0;
                break;
            case 'rightend':
                newIndex = highest;
                break;
        }

        if (newIndex !== -1) {
            browser.tabs.move(tab.id, {
                index: newIndex
            });
        }
    }
}

async function getHighestIndex() {
    let tabs = await browser.tabs.query({ currentWindow: true });
    let highest = 0;
    
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].index > highest) {
            highest = tabs[i].index;
        }
    }

    return highest;
}

async function getCurrentTabInfo() {
    let tab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];

    if (!tab) {
        return null;
    }

    return {
        id: tab.id,
        index: tab.index
    };
}