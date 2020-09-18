"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Scema = mongoose_1.default.Schema;
const userSchema = new Scema({
    email: String,
    password: String,
    refreshToken: {
        hash: String,
        expiry: Date,
    },
});
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.js.map