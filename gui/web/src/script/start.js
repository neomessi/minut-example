/**
 * I'm an example of a vanilla js bundle
 */

// const a = fetch("/api/test1");
// a.then((b) => {
//     return b.json();
// }).then((c) => {
//     console.log(c.testing);
// });

window.addEventListener('DOMContentLoaded', (event) => {

    // fetch
    document.querySelector("#getFavNum").addEventListener("click", async () => {
        const result = await fetch("/api/test1");
        const obj = await result.json();
        document.querySelector("#favNum").value = obj.testing;
    });

    // post
    document.querySelector("#setFavNum").addEventListener("click", async () => {
        const body = new FormData();
        body.append( "favNum", document.querySelector("#favNum").value );

        const result = await fetch( "/api/save/prefs",
        {
            method: "POST",
            body
        });

        const obj = await result.json();
        console.log( obj.result );
    });

});