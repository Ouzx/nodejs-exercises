"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const planets_js_1 = require("./controllers/planets.js");
const users_js_1 = require("./controllers/users.js");
const multer = require("multer");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/uploads", express_1.default.static("uploads"));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(".");
        cb(null, `${fileName[0]}-${Date.now()}.${fileName[1]}`);
    },
});
const upload = multer({ storage: storage });
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/api/planets", planets_js_1.getAll);
app.get("/api/planets/:id", planets_js_1.getOneById);
app.post("/api/planets", planets_js_1.create);
app.put("/api/planets/:id", planets_js_1.updateById);
app.delete("/api/planets/:id", planets_js_1.deleteById);
app.post("/api/planets/:id/image", upload.single("image"), planets_js_1.createImage);
app.post("/api/users/login", users_js_1.login);
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT}. Link: http://localhost:${process.env.PORT}`);
});
