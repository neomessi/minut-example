module.exports = function (db) {
    this.db = db;

    this.getBundle = (key) => {
        return this.db.get(key).value();
    };

    this.autoSwapBundles = ( body ) => {
        return body.replace( /~`bundle:(.+?\.js)`~/g, ( match, p1 ) => {
            return this.getBundle( p1 )
        } );
    }

}
