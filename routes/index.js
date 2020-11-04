const express = require('express');
const bodyParser = require('body-parser');
const { validate, ValidationError, Joi } = require('express-validation');
const app = express();
const db = require('./queries');
const port = 1337;



const todaydate = Date.now();
const cutoffDate = new Date(todaydate - (1000 * 60 * 60 * 24 * 365 * 18));

const loginValidation = {
    body: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().regex(/^[a-zA-Z0-9_\-\.]+$/).min(3).max(8).required(),
        birthdate: Joi.date().max(cutoffDate).required().messages({
            'date.max':"Age should be Greater than 18"
        })
    })
}

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const useridvalidate = {
    params: Joi.object({
        id: Joi.number()
    })
}


app.get('/', (request, response) => {
    response.json("Welcome to PostgreSql CRUD Operations");
})

app.get('/users', db.getUsers);
app.get('/userbyid/:id', validate(useridvalidate, {}, {}), db.getUserById);
app.post('/adduser', validate(loginValidation, {}, { abortEarly: false }), db.createUser);

app.put('/updateuser/:id', db.updateUser);
app.delete('/deleteuser/:id', db.deleteUser);

//For display errors
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }

    return res.status(500).json(err)
})


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})