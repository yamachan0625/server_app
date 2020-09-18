"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = exports.movieSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Scema = mongoose_1.default.Schema;
exports.movieSchema = new Scema({
    name: String,
    genre: String,
    directorId: String,
});
exports.Movie = mongoose_1.default.model('Movie', exports.movieSchema);
//# sourceMappingURL=movie.js.map