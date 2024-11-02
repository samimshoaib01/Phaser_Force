"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = async () => {
    const uri = "mongodb://localhost:27017/Phaser-Force";
    try {
        const connect = await mongoose_1.default.connect(uri);
        console.log("MongoDB connected " + connect.connection.host);
    }
    catch (e) {
        console.log("Error: ", e);
        process.exit(1);
    }
};
exports.dbConnect = dbConnect;
