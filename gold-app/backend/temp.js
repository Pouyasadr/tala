const bcrypt = require("bcrypt");
bcrypt.hash("newadmin123", 10).then(hash => console.log("New Hash:", hash));