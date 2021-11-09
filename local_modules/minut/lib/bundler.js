module.exports = function (db) {
    this.db = db;

    this.getBundle = (key) => this.db.get(key).value();

    this.autoSwapBundles = (body) => body.replace(/~`bundle:(.+?\.js)`~/g, (match, p1) => this.getBundle(p1) || match);
};
