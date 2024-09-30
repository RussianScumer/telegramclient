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

    // Upload profile photo
    /*photo = me.profile_photo;
    if (photo) {
        const file = await client.invoke({
            _: 'downloadFile',
            file: photo,
            file_name: 'profile_photo.jpg',
            mime_type: 'image/jpeg'
        });
        const result = await client.invoke({
            _: 'uploadProfilePhoto',
            file_id: file.id
        });
        photo = result;
    }*/
    //console.log(me.profile_photo);
    const photo = await client.invoke({
        _: 'downloadFile',
        file_id: me.profile_photo.small.id,
        priority: 1,
        offset: 0,
        limit: 0,
        synchronous:false
    });
    console.log(photo);
    win.webContents.send('user-info', me);
    win.webContents.send('chats-info', chats);
    win.webContents.send('user-photo', photo);
}

app.whenReady().then(createWindow);
