/**
 * Pass in full path to javascript files
 *  Will process .js or .jsx files
 *  Expects files to be in format: [name].[chunkhash].js(x) *
 *  
 * Returns:
 *  JSON object { files: [ {filekey: k, filepath: p} ], ... }
 *  Will only take latest file with [name] (based on creation date)
 */
'use strict';

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('bundles.json')
const db = low(adapter)

const fs = require('fs');

const path2js = process.argv[2].match(/\/$/) ? process.argv[2] : process.argv[2] + '/'; // ~*~
const files = fs.readdirSync(path2js);

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

// console.log(bundlesMap);