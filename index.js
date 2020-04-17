const os = require("os");
const ip = require("ip");
const events = require("events");
const http = require("http");
const fs = require("fs");
process.title = "Wengiel - SYSInfo";
var eventEmmiter = new events.EventEmitter();
const startTime = Date.now();
function a() {
    console.clear();
    console.log("Host: " + os.hostname());
    var system = os.type();
    if (system == "Darwin") {
        system = "MacOS";
    } else if (system == "Windows_NT") {
        system = "Windows";
    }
    console.log("System: " + system);
    console.log("CPU model: " + os.cpus()[0].model);
    console.log("CPU cores: " + os.cpus().length);
    console.log("RAM capacity: " + (os.totalmem / 1000000000).toFixed(0) + "GB");
    var ram = (((os.totalmem() - os.freemem()) * 100) / os.totalmem).toFixed(2);
    if (ram > 75) {
        eventEmmiter.emit("ramError");
    } else if (ram < 75 && ram > 50) {
        eventEmmiter.emit("ramWarning");
    } else {
        eventEmmiter.emit("ramNormal");
    }
    console.log("[" + ramStatus + "] RAM usage: " + ram + "%");
    console.log("System uptime: " + os.uptime() + "s");
    console.log("Process uptime: " + ((Date.now() - startTime) / 1000).toFixed(0) + "s")
    console.log("Local IP address: " + ip.address());
    fs.writeFile("a.txt", ram, (error, result) => {
        if (error) {
            throw error;
        }
    });
    setTimeout(a, 100);
}
var ramError = () => {
    ramStatus = "\x1b[31m HIGH \x1b[0m";
}
var ramWarning = () => {
    ramStatus = "\x1b[33mMEDIUM\x1b[0m";
}
var ramNormal = () => {
    ramStatus = "\x1b[32m GOOD \x1b[0m";
}
eventEmmiter.on("ramError", ramError);
eventEmmiter.on("ramWarning", ramWarning);
eventEmmiter.on("ramNormal", ramNormal);
a();