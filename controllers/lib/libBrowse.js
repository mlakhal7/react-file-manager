// route /browse - returns a list of files and directories for a given path

const fs = require("fs");
const pathMD = require("path");

const config = require("../../config");

module.exports = {
  getPathContent(req, res) {
    const { dirPath } = req.query;

    if (dirPath === undefined) {
      console.log("dirPath argument is undefined.");
      return res.status(401).send("dirPath argument is undefined.");
    }

    var dir = config.configDirectory;
    const searchPath = pathMD.join(dir, dirPath);

    const files = [];
    const folders = [];

    try {
      fs.readdirSync(searchPath).forEach((item) => {
        var itemPath = pathMD.join(searchPath, item);
        var stat = fs.statSync(itemPath);
        if (stat.isFile()) files.push(item);
        else folders.push(item);
      });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ message: "Error while reading path.", error });
    }

    return res.status(200).json({ searchPath, files, folders });
  },
};