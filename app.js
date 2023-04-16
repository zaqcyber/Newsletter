const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname +"/signup.html");
  });

app.post('/', (req, res) => {
    const Fname = req.body.fName;
    const Lname = req.body.lName;
    const Email = req.body.email;
    
    mailchimp.setConfig({
        apiKey: "a9bb826c7bfde476197a89ed94cfd25a-us8",
        server: "us8",
    });
      
    const listId = "c6bd0585b9";
    const subscribingUser = {
      firstName: Fname,
      lastName: Lname,
      email: Email
    };

    async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      }).then(
          (value) => {
              console.log("Successfully added contact as an audience member.");
              res.sendFile(__dirname + "/success.html");
          },
          (reason) => {
              res.sendFile(__dirname + "/failure.html");
          },
        );
      
    }

    run();        
    
});


app.post('/failure', (req, res) => {
  res.redirect('/');
})

app.listen(process.env.PORT || port, () => {
console.log(`Server started on port ${port}`)
});












//ApiKey: a9bb826c7bfde476197a89ed94cfd25a-us8

//List ID: c6bd0585b9