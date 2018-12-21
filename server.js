const app = require("./src");
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`API server now running on port ${port}.`));