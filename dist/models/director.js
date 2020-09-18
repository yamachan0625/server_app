"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Director = exports.directorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Scema = mongoose_1.default.Schema;
exports.directorSchema = new Scema({
    name: String,
    age: Number,
});
exports.Director = mongoose_1.default.model('Director', exports.directorSchema);
//# sourceMappingURL=director.js.map