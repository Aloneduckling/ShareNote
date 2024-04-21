"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.get('/', function (req, res) {
    return res.send("Root route Working");
});
console.log('hello');
app.listen(port, function () {
    console.log("Listening on port ".concat(port));
});
