const mineflayer = require('mineflayer');
const fs = require('fs');
require("./keep_alive"); // keep_alive dosyanı çağırıyor

let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);

const host = data["ip"];
const port = data["port"];
const username = data["name"];

console.log("Bağlanılıyor:", host, "Port:", port);

function createBot() {
    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: username,
        version: "1.21.1", // ViaVersion olduğu için bu en iyisi
        checkTimeoutInterval: 600000 
    });

    bot.on('login', () => console.log("Giriş yapıldı!"));

    bot.on('spawn', () => {
        console.log("Spawn oldum, AFK modu aktif!");
        // Eğer sunucuda giriş şifresi varsa aşağıyı kullan:
        // bot.chat('/login ŞİFREN'); 
    });

    bot.on('kicked', (reason) => {
        console.log("Atıldım! Sebep:", reason);
        setTimeout(createBot, 30000); // 30 saniye sonra tekrar dene
    });

    bot.on('error', (err) => {
        console.log("Hata oluştu:", err);
        setTimeout(createBot, 30000);
    });

    // Hareket döngüsü (spawn olduktan sonra çalışır)
    bot.on('time', () => {
        if (bot.entity == null) return;
        
        // Rastgele bakma ve hareket etme
        if (Math.random() < 0.01) {
            bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI, false);
        }
    });
}

createBot();
