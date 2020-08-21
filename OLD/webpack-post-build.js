/**
 * Pass in manifest.json
 *  Expects files to be in format: [name].[chunkhash].js(x) *
 *  
 * Returns:
 *  JSON object { files: [ {filekey: k, filepath: p} ], ... }
 */
'use strict';

const fs = require('fs');
// const mfest = fs.readFileSync(process.argv[2]);

// console.log(mfest);

/*
const getBundleKey = (s) => {
    return s.split('.', 1)[0];
}

if( files.length == 0 ) {
    console.log("Didn't find any files in " + path2js);
    return;
}

let sorted = [];
if( files.length > 1 ) {
    sorted = files
        .filter((n)=>{return n.match(/\.js$/)})
        .sort((a, b) => {
            if ( getBundleKey(a) == getBundleKey(b) ) {
                let s1 = fs.statSync(path2js + a).mtime;
                let s2 = fs.statSync(path2js + b).mtime;
                if (s1 > s2)
                    return -1;
                else if (s2 > s1)
                    return 1;
                }
            return 0;
        });    
} else {
    sorted = files[0];    
}

const bundlesMap = {};
sorted.map((e)=>{
    let bkey = getBundleKey(e);
    if ( Object.keys(bundlesMap).indexOf(bkey) == -1 ) {
        bundlesMap[bkey] = e;
        db.set(bkey, bundlesMap[bkey]).write()
    }
});
*/