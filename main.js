const { app, BrowserWindow } = require('electron');
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
    const client = tdl.createClient({apiId: apiId, apiHash: apiHash});
    client.login();
    const me = await client.invoke({ _: 'getMe' });
    console.log('My user:', me);
    const chats = await client.invoke({
        _: 'getChats',
        chat_list: { _: 'chatListMain' },
        limit: 10
      });
}

app.whenReady().then(createWindow);
