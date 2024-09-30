const { app, BrowserWindow, ipcMain } = require('electron');
const tdl = require('tdl');

require('dotenv').config();
const apiId = process.env.API_ID;
const apiHash = process.env.API_HASH;

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');

    const { getTdjson } = require('prebuilt-tdlib')
    tdl.configure({ tdjson: getTdjson() })
    const client = tdl.createClient({ apiId: apiId, apiHash: apiHash });

    client.login();
    const me = await client.invoke({ _: 'getMe' });
    const chats = await client.invoke({
        _: 'getChats',
        chat_list: { _: 'chatListMain' },
        limit: 10
    });

    //console.log(me);
    console.log(me.profile_photo);
    //console.log(chats);
    win.webContents.send('user-info', me);
    win.webContents.send('chats-info', chats);
}

app.whenReady().then(createWindow);
