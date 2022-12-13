// Import third-party module
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { validationResult, body } = require('express-validator')
// const morgan = require('morgan')

// Import local module
// const locfunc = require('./public/js/crud')
const pool = require('./public/js/db')

// Variable for express
const app = express()
// Variable for port
const port = 3000

// Basic setup using EJS with Express JS
app.set('view engine', 'ejs')

// Basic setup using Express-ejs-layouts with Express JS
app.use(expressLayouts)

// Allow middleware to execute these assets to public or web browser
app.use(express.static('public'))

// Parse the inputted form in contact
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

// Use Morgan
// app.use(morgan('dev'))

// Functions to render and switch directories in URL
// Index/home page
app.get('/', (req, res) => {
    res.render('index', {
        name: 'Nathanure',
        title: 'Home',
        layout: 'layout/html'
    });
})
// About page
app.get('/about', (req, res) => {
    res.render('about', {
        name: 'Nathanure',
        title: 'About',
        layout: 'layout/html'
    });
})
// GET/show contact in contact page
app.get('/contact', async (req, res) => {
    // Display all data in JSON
    try {
        const {rows:contact} = await pool.query(`SELECT * FROM contacts ORDER BY name ASC`)
        res.render('contact', {
            name: 'Nathanure',
            title: 'Contact',
            layout: 'layout/html',
            err: [],
            contact
        });
    } catch (error) {
        console.error(error.message);
    }
})
// POST/add contact
app.post('/contact',
    body('name').trim().notEmpty().withMessage('Please enter your name').isAlpha('en-US', {ignore: ' '}).withMessage('Please enter a valid name')
    .custom(async name => {
        const {rows:[existName]} = await pool.query(`SELECT name FROM contacts WHERE name = '${name}'`)
        if (name === existName.name) {
            throw new Error('Name already exist')
        }
        return true
    }),
    body('email').trim().isEmail().withMessage('Please enter a valid email').optional({ nullable: true, checkFalsy: true }),
    body('mobile').trim().notEmpty().withMessage('Please enter your phone number').isMobilePhone('id-ID').withMessage('Please enter a valid phone number'),
    async (req, res) => {
        try {
            const {rows:contact} = await pool.query(`SELECT * FROM contacts ORDER BY name ASC`)
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render('contact', {
                    title: 'Contact',
                    layout: 'layout/html',
                    err: errors.array(),
                    contact
                })
            } else {
                await pool.query(`INSERT INTO contacts VALUES ('${req.body.name}', '${req.body.mobile}', '${req.body.email}') RETURNING *`);
                res.redirect('/contact')
            }
        } catch (error) {
            console.error(error.message);
        }
    }
)
// GET/show detail contact
app.get('/contact/:name', async (req, res) => {
    // To callback the parameters that are in the URL, use req.params.id
    // To callback the query from URL, use ?<queryName>=<input>
    // before ? sign you can put an :id, make sure to define it first
    // And make sure the query in URL is the same as <queryName> in the code 

    // res.send(`Product ID: ${(req.params.id)}<br>Category: ${(req.query.idCat)}`);
    try {
        const {rows:[search]} = await pool.query(`SELECT * FROM contacts WHERE name = '${req.params.name}'`)
        const {rows:next} = await pool.query(`SELECT * FROM contacts WHERE name = '${req.params.name}'`)
        res.render('contactDetails', {
            name: 'Nathanure',
            title: 'Contact',
            layout: 'layout/html',
            url: req.params.name,
            search,
            next
        });
    } catch (error) {
        console.error(error.message);
    }
})
// PUT/update detail contact
app.get('/contact/:name/update', async (req, res) => {
    try {
        const {rows:[search]} = await pool.query(`SELECT * FROM contacts WHERE name = '${req.params.name}'`)
        res.render('contactUpdate', {
            name: 'Nathanure',
            title: 'Contact',
            layout: 'layout/html',
            url: req.params.name,
            err: [],
            search
        });
    } catch (error) {
        console.error(error.message);
    }
})
// PUT/update detail contact
app.post('/contact/:name/update',
    body('prevname').trim(),
    body('name').trim().isAlpha('en-US', {ignore: ' '}).withMessage('Please enter a valid name')
    .custom(async newname => {
        const {rows:[existNames]} = await pool.query(`SELECT name FROM contacts WHERE name = '${newname}'`)
        if (newname === existNames.name) {
            throw new Error('Name already exist')
        }
        return true
    }),
    body('email').trim().isEmail().withMessage('Please enter a valid email').optional({ nullable: true, checkFalsy: true }),
    body('mobile').trim().isMobilePhone('id-ID').withMessage('Please enter a valid phone number'),
    async (req, res) => {
        try {
            const {rows:search} = await pool.query(`SELECT * FROM contacts WHERE name = '${req.params.name}'`)
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render('contactUpdate', {
                    title: 'Contact',
                    layout: 'layout/html',
                    err: errors.array(),
                    url: req.params.name,
                    search,
                })
            } else {
                await pool.query(`UPDATE contacts SET name = '${req.body.name}', mobile = '${req.body.mobile}', email = '${req.body.email}' WHERE name = '${req.body.prevname}'`);
                res.redirect('/contact')
            }
        } catch (error) {
            console.error(error.message);
        }
    }
)
// DELETE/destroy detail contact
app.get('/contact/:name/delete', async (req, res) => {
    try {
        if (req.params.name) {
            await pool.query(`DELETE FROM contacts WHERE name = '${req.params.name}'`)
            res.redirect('/contact')
        } else {
            res.status(404).render('contactDetails', {
                title: 'Fail to delete file',
                layout: 'layout/error'
            });
        }
    } catch (error) {
        console.error(error.message);
    }
})
// GET/show detail contact
app.get('/contact/:name', async (req, res) => {
    // To callback the parameters that are in the URL, use req.params.id
    // To callback the query from URL, use ?<queryName>=<input>
    // before ? sign you can put an :id, make sure to define it first
    // And make sure the query in URL is the same as <queryName> in the code 

    // res.send(`Product ID: ${(req.params.id)}<br>Category: ${(req.query.idCat)}`);
    try {
        const {rows:search} = await pool.query(`SELECT * FROM contacts WHERE name = '${req.params.name}'`)
        res.render('contactDetails', {
            name: 'Nathanure',
            title: 'Contact',
            layout: 'layout/html',
            url: req.params.name,
            search
        });
    } catch (error) {
        console.error(error.message);
    }
})

app.get('/addasync', async (req, res) => {
    try {
        const name = 'Nathan'
        const mobile = '085954464651'
        const email = 'nathancadankelas6a@gmail.com'
        const newContact = await pool.query(`INSERT INTO contacts VALUES ('${name}', '${mobile}', '${email}') RETURNING *`);
        res.json(newContact)
    } catch (error) {
        console.error(error.message);
    }
})

app.use('/', (req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found 404',
        layout: 'layout/error'
    });
})

app.listen(port, () => {
    console.log(`Example app on port ${(port)}`)
})