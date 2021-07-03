/**
 * custom array filter 
 */
const myFilter = (arr, fn) => {
    const arr2 = [];
    for ( let i=0; i<arr.length; i++ ) {
        if ( fn( arr[i], i ) ) {
            arr2.push(arr[i]);
        }
    }
    return arr2;
}
// test
let arr = [2,4,8,9,11,12];
let arr2 = myFilter( arr, (val, i) => val % 2 == 0 ); // only even numbers
console.log( arr2 );

/**
 * modifying Array.prototype
 */
 Array.prototype.myFilter = function( fn ) { // note: fat arrow does not work
    const arr2 = [];
    for ( let i=0; i<this.length; i++ ) {
        if ( fn( this[i], i ) ) {
            arr2.push(this[i]);
        }
    }
    return arr2;
}
// test
arr2 = [2,4,8,9,11,12].myFilter( (val, i) => val % 2 == 0 ); // only even numbers
console.log( arr2 );

/**
 * custom Object.entries - filteredEntries
 * Equivalent of doing Object.entries(...).filter(...)
 */
// const str = { email: "abc@123.com", fullName: "Tommy Messi", age: 40 }
