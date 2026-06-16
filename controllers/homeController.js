const db = require("../db/queries")

exports.homeGet = async (req,res) => {
    const info = await db.homeNbGet();
    res.render("dashboard", {info: info})
}