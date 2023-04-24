// Create a script that uses the Node.js core fs.writeFile() (callback API) method to write a text file.

const fs = require("fs");

fs.writeFile("./6/hello.txt", "Hello World!", function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("File written!");
  }
});
