const port       = 3000;
const express    = require('express');
const app        = express();
const http       = require('http');
const server     = http.createServer(app);
const {Server}   = require("socket.io");
const io         = new Server(server);
const escapeHtml = (text) =>
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const nl2br     = (str, is_xhtml) => 
{
    if (typeof str === 'undefined' || str === null)
        return '';

    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

io.on('connection', (socket) => 
{
    socket.on('chat message', (msg) => 
    {
        io.emit('chat message', {nama: escapeHtml(msg.nama), pesan: nl2br(escapeHtml(msg.pesan)), waktu: msg.waktu});
    });
});

server.listen(3000, () => {console.log('> Server dijalankan di port %d', port)});
app.use(express.static(__dirname + '/public'));