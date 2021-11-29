const express = require("express");
const app = express();
const axios = require("axios");
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser')

app.set("port", process.env.PORT || 5000);

app.use(cors())
// parse application/json
app.use(bodyParser.json())

app.use(cors({ origin: "http://localhost:3000", credentials: false }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})


// const getAccessToken = () => {
let access_token;
axios.post(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`)
    .then(function (response) {
        access_token = response.data.access_token;
    }).catch(function (error) {
        access_token = error;
    });
//         return access_token
// }




app.get("/test", (req, res) => {
    // console.log(access_token);
    // console.log(getAccessToken());
    res.status(200).json(access_token)
});


// Get Data
app.get("/getdata", (req, res) => {
    axios
        .get(`https://zohoapis.com/crm/v2/Contacts`, {
            headers: {
                Authorization: `Zoho-oauthtoken  ${access_token}`,
            },
        })
        .then(function (response) {
            res.status(200).json(response.data)
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
});

// Insert Data

app.post("/insert", (req, res) => {
    console.log(req);
    let requestBody = JSON.stringify({ "data": [req.body] })
    // console.log(body);

    // console.log(JSON.stringify(body));

    axios.post(`https://zohoapis.com/crm/v2/Contacts`, requestBody, {
        headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`
        }
    })
        .then(function (response) {
            console.log(response);
            // res.send(200).json(response.data)
            // console.log(response);
            console.log("hello");
            res.sendStatus(200);
        })
        .catch(function (res) {
            console.log(res);
            res.sendStatus(res.status);
        });
});




// Delete Data

app.post("/delete/:id", (req, res) => {
    console.log(req.params.id);


    axios.delete(`https://zohoapis.com/crm/v2/Contacts/${req.params.id}`, {
        headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`
        }
    })
        .then(function (response) {
            console.log(response);
            console.log("hello");
            res.sendStatus(200);
        })
        .catch(function (res) {
            console.log(res);
            res.sendStatus(res.status);
        });
});






// update Data 
app.listen(app.get("port"), function () {
    console.log("Node app is running at https://localhost:" + app.get("port"));
});