const csvparse = require('csv-parse');
const fs = require("fs");
const results = [];

/**
 * filtering planet based on koi_disposition property
 * @param {*} currentplanet 
 * @returns 
 */
function isHabitable(currentplanet) {
    return currentplanet["koi_disposition"] === 'CONFIRMED'
        && currentplanet['koi_insol'] > 0.36 
        && currentplanet["koi_insol"] < 1.11
        && currentplanet["koi_prad"] < 1.6
        ;
}

fs.createReadStream("kepler_data.csv")
    .pipe(csvparse(
        {
            comment: "#",
            columns: true,
        }
    ))
    .on("data", (data) => {
        if (isHabitable(data)) {
            results.push(data);
        }
    }).on("err", (err) => {
        console.log(err);
    }).on("end", () => {
        console.log(results.map((plan) => {
            return plan["kepler_name"]; 
        }));
        console.log(` there is  ${results.length} planet(s) that could be our new home `)
    });