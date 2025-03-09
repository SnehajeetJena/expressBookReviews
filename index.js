const express = require('express');
const app = express();
const customerRoutes = require("./auth_users").router;  // ✅ Import only `router`

app.use(express.json());  
app.use("/auth", customerRoutes);  // ✅ Mount routes under `/auth`

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
