const { randomBytes } = require('crypto');

const Emoji = {
    'love': ['โค', '๐', '๐', '๐', '๐ป', '๐', '๐ฉโโคโ๐ฉ', '๐จโโคโ๐จ', '๐', '๐ฉโโคโ๐โ๐ฉ', '๐จโโคโ๐โ๐จ', '๐งก', '๐', '๐', '๐', '๐', '๐ค', '๐', 'โฃ', '๐', '๐', '๐', '๐', '๐', '๐', '๐', 'โฅ', '๐', '๐', '๐ฉโโค๏ธโ๐โ๐ฉ', '๐จโโค๏ธโ๐โ๐จ', '๐ฉโโค๏ธโ๐จ', '๐ฉโโค๏ธโ๐ฉ', '๐จโโค๏ธโ๐จ', '๐ฉโโค๏ธโ๐โ๐จ', '๐ฌ', '๐ญ', '๐ซ', '๐ฅฐ', '๐', '๐', '๐', '๐น', '๐ฝ', 'โฃ๏ธ', 'โค๏ธ'],
    'happy': ['๐', ' ๐', ' ๐', ' ๐', ' ๐', ' ๐', ' ๐', ' ๐คฃ', ' ๐', ' ๐', ' ๐', ' ๐', ' ๐คช', ' ๐ค', ' ๐บ', ' ๐ธ', ' ๐น', ' โบ', ' ๐', ' ๐', ' ๐ค', ' ๐'],
    'sad': ['โน', ' ๐ฃ', ' ๐', ' ๐ซ', ' ๐ฉ', ' ๐ข', ' ๐ญ', ' ๐', ' ๐', ' ๐', ' ๐', ' ๐ค', ' ๐ ', ' ๐ฅ', ' ๐ฐ', ' ๐จ', ' ๐ฟ', ' ๐พ', ' ๐', ' ๐โโ', ' ๐โโ', ' ๐', ' ๐', ' ๐ฅบ', ' ๐ค', ' โ๏ธ', ' โ', ' ๐ฉ', ' ๐ง'],
    'angry': ['๐ฏ', ' ๐ฆ', ' ๐ง', ' ๐ฎ', ' ๐ฒ', ' ๐', ' ๐ฑ', ' ๐คฏ', ' ๐ณ', ' โ', ' โ', ' ๐คฌ', ' ๐ก', ' ๐ ', ' ๐', ' ๐ฟ', ' ๐พ', ' ๐ค', ' ๐ข', ' ๐บ', ' ๐ฏ๏ธ', ' ๐', ' ๐ฅต'],
    'greet': ['๐'],
    'celebrate': ['๐', ' ๐', ' ๐', ' ๐', ' ๐ฏโโ๏ธ', ' ๐ฏ', ' ๐ฏโโ๏ธ', ' ๐', ' ๐บ', ' ๐ฅ', ' โญ๏ธ', ' โจ', ' ๐ซ', ' ๐', ' ๐', ' ๐ป', ' ๐ฅ', ' ๐พ', ' ๐', ' ๐ฐ']
}

class Exif {
    /**
     * let set the sticker metadata
     * @typedef {Object} IStickerMetadata
     * @property {string} packname sticker pack name
     * @property {string} author sticker author
     * @property {string} packId sticker pack id
     * @property {string} categories sticker emoji categories
     */

    /**
     * create exif
     * @param {IStickerMetadata} metadata WASticker Metadata
     * @example
     * const exif = new Exif({ packname: 'mg pack', author: '@gimenz.id', packId: 'ilham - skhyzi' })
     * exif.create()
     */
    constructor(metadata) {
        this.packname = metadata.packname
        this.author = metadata.author
        this.packId = metadata.packId || randomBytes(32).toString('hex')
        this.categories = Emoji[metadata.categories] || Emoji['love']
    }
    /**
     * create exif
     * @returns {Buffer} exif buffer
     */
    // part of this code is copied from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
    create() {
        const json = {
            'sticker-pack-name': this.packname,
            'sticker-pack-publisher': this.author,
            'sticker-pack-id': this.packId,
            'emojis': this.categories
        };
        let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        let exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        return exif;
    }
}

module.exports = {
    Exif,
    Emoji
};
