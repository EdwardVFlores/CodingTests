"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Function to scrape font styles and buttons from a given URL
const scrapeFontsAndButtons = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(url);
        const $ = cheerio_1.default.load(data);
        const fonts = new Set();
        const buttons = [];
        // Example selectors; modify according to your needs
        $('link[rel="stylesheet"]').each((_, el) => {
            fonts.add($(el).attr('href') || '');
        });
        $('button, input[type="button"]').each((_, el) => {
            buttons.push($(el).text());
        });
        return {
            fonts: Array.from(fonts),
            buttons,
        };
    }
    catch (error) {
        console.error('Error fetching the page:', error);
        throw new Error('Failed to scrape the page');
    }
});
app.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (typeof url !== 'string') {
        return res.status(400).json({ error: 'A valid URL is required' });
    }
    try {
        const result = yield scrapeFontsAndButtons(url);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
