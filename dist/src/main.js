"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.increment = exports.Table = void 0;
const table_1 = require("./models/table");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return table_1.Table; } });
const auto_1 = require("./utils/auto");
Object.defineProperty(exports, "increment", { enumerable: true, get: function () { return auto_1.increment; } });
Object.defineProperty(exports, "random", { enumerable: true, get: function () { return auto_1.random; } });
