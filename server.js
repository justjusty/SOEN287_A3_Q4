const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require("fs");
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002;
const usersFile = path.join(__dirname, 'data', 'users.txt');
const petsFile = path.join(__dirname, 'data', 'pets.txt');

app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to inject header and footer, and update the side menu
app.use((req, res, next) => {
  const isLoggedIn = !!req.session.user;

  ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user: req.session.user }, (err, header) => {
    if (err) return res.status(500).send('Error loading header');

    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'footer.ejs'), (err, footer) => {
      if (err) return res.status(500).send('Error loading footer');

      // Update side menu to show "Logout" if user is logged in
      ejs.renderFile(path.join(__dirname, 'views', 'partials', 'sidemenu.ejs'), { isLoggedIn }, (err, sidemenu) => {
        if (err) return res.status(500).send('Error loading sidemenu');

        res.locals.header = header;
        res.locals.footer = footer;
        res.locals.sidemenu = sidemenu;
        next();
      });
    });
  });
});

function readData(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    const parsedData = data.trim().split('\n').map(line => line.split(':'));
    callback(null, parsedData);
  });
}

function writeData(filePath, data, callback) {
  const content = data.map(item => item.join(':')).join('\n');
  fs.writeFile(filePath, content, 'utf8', (err) => {
    callback(err);
  });
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML files
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'home.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading home page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

app.get('/cat-care', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'cat-care.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

app.get('/dog-care', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'dog-care.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

app.get('/find-pet', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'find-pet.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

app.get('/contact-us', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'contact-us.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

app.get('/privacy', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'privacy.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});



app.get('/create-account', (req, res) => {
  fs.readFile(path.join(__dirname, 'views', 'create-account.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});


// POST route to handle account creation
app.post('/create-account', (req, res) => {
  const { username, password } = req.body;

  // Read users from the file
  readData(usersFile, (err, users) => {
    if (err) {
      return res.status(500).send('Server error. Please try again later.');
    }

    // Check if username already exists
    const userExists = users.some(user => user[0] === username);
    if (userExists) {
      // If the username exists, send back a message to choose a new username
      res.send('<p>Username already exists. Please choose another.</p>');
    } else {
      // If the username is available, add the new user and save it to the file
      users.push([username, password]);

      writeData(usersFile, users, (err) => {
        if (err) {
          return res.status(500).send('Server error. Please try again later.');
        }

        // Send success message
        res.send('<p>Account successfully created! You can now <a href="/login">login</a>.</p>');
      });
    }
  });
});

// Serve the "Login" page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/have-pet');
  }

  fs.readFile(path.join(__dirname, 'views', 'login.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  readData(usersFile, (err, users) => {
    if (err) {
      res.status(500).send('Server error. Please try again later.');
      return;
    }

    const validUser = users.find(user => user[0] === username && user[1] === password);

    if (validUser) {
      req.session.user = { username };
      res.redirect('/have-pet');
    } else {
      res.send('<p>Invalid username or password. Please try again.</p>');
    }
  });
});

// Protected route for "Have a Pet to Give Away"
app.get('/have-pet', (req, res) => {
  if (!req.session.user) {
    // If not logged in, redirect to login page
    return res.redirect('/login');
  }

  fs.readFile(path.join(__dirname, 'views', 'have-pet.html'), 'utf8', (err, content) => {
    if (err) return res.status(500).send('Error loading page');
    res.send(res.locals.header + res.locals.sidemenu + content + res.locals.footer);
  });
});

// Handle pet submission
// Handle pet submission
app.post('/submit-pet', (req, res) => {
  const {
    petType,
    'breed-dog[]': breedDog,
    'breed-cat[]': breedCat,
    'animalage-dog': ageDog,
    'animalage-cat': ageCat,
    'gender-dog': genderDog,
    'gender-cat': genderCat,
    'getalong-dog': getAlongDogs,
    'getalong-cats': getAlongCats,
    'getalong-children': getAlongChildren,
    'info-dog': infoDog,
    'info-cat': infoCat,
    'firstname-dog': firstNameDog,
    'firstname-cat': firstNameCat,
    'lastname-dog': lastNameDog,
    'lastname-cat': lastNameCat,
    'email-dog': emailDog,
    'email-cat': emailCat
  } = req.body;

  const owner = req.session.user ? req.session.user.username : null;

  if (!owner) {
    return res.status(403).send('Unauthorized: You need to be logged in to submit pet information.');
  }

  // Assign variables based on whether it's a dog or cat
  const breed = breedDog ? breedDog.join(',') : breedCat ? breedCat.join(',') : '';
  const age = ageDog || ageCat || '';
  const gender = genderDog || genderCat || '';
  const getAlongDogsInfo = getAlongDogs || 'not sure';
  const getAlongCatsInfo = getAlongCats || 'not sure';
  const getAlongChildrenInfo = getAlongChildren || 'not sure';
  const info = infoDog || infoCat || '';
  const firstName = firstNameDog || firstNameCat || '';
  const lastName = lastNameDog || lastNameCat || '';
  const email = emailDog || emailCat || '';

  // Read the existing pets data
  readData(petsFile, (err, pets) => {
    if (err) {
      return res.status(500).send('Server error. Please try again later.');
    }

    // Generate a new unique ID for the pet
    let newId = 1; // Start with 1 if the file is empty
    if (pets.length > 0) {
      const lastPet = pets[pets.length - 1];
      const lastId = parseInt(lastPet[0], 10); // Parse the last ID as an integer
      if (!isNaN(lastId)) {
        newId = lastId + 1; // Increment the last ID by 1
      }
    }

    // Construct the new pet entry
    const newPet = [
      newId,
      owner,
      petType,
      breed,
      age,
      gender,
      getAlongDogsInfo,
      getAlongCatsInfo,
      getAlongChildrenInfo,
      info,
      firstName,
      lastName,
      email
    ];

    // Add the new pet entry to the list
    pets.push(newPet);

    // Write the updated pets data back to the file
    writeData(petsFile, pets, (err) => {
      if (err) {
        return res.status(500).send('Server error. Please try again later.');
      }
      res.send('<p>Pet information successfully submitted! Thank you for contributing to FurEverHomes. <a href="/">Go to home</a></p>');
    });
  });
});

// Consolidated Route to handle Find Dog form submission and display results
app.post('/find-dog-results', (req, res) => {
  const {
    dogbreed,
    dogage,
    doggender,
    doggetalongdogs,
    doggetalongcats,
    doggetalongchildren
  } = req.body;

  // Read the pets data from the file
  readData(petsFile, (err, pets) => {
    if (err) {
      return res.status(500).send('Server error. Please try again later.');
    }

    // Filter the pets data based on the form input criteria for dogs
    const matchedDogs = pets.filter(pet => {
      return pet[2] === 'dog' && // Ensure it's a dog
        (dogbreed === "Doesn't matter" || pet[3].includes(dogbreed)) &&
        (dogage === "Doesn't matter" || pet[4] === dogage) &&
        (doggender === 'nopref' || pet[5] === doggender) &&
        (doggetalongdogs === "Doesn't matter" || pet[6] === doggetalongdogs) &&
        (doggetalongcats === "Doesn't matter" || pet[7] === doggetalongcats) &&
        (doggetalongchildren === "Doesn't matter" || pet[8] === doggetalongchildren);
    });

    // Log matchedDogs for debugging
    console.log("Matching Dogs:", matchedDogs);

    // Ensure that matchedDogs is not undefined before passing it to the template
    if (matchedDogs.length > 0) {
      res.render('partials/find-dog-results.ejs', { matchedDogs });
    } else {
      res.send('<p>No dogs found matching your criteria. <a href="/find-pet">Try again</a>.</p>');
    }
  });
});


// Consolidated Route to handle Find Cat form submission and display results
app.post('/find-cat-results', (req, res) => {
  const {
    catbreed,
    agecat,
    catgender,
    catgetalongdogs,
    catgetalongcats,
    catgetalongchildren
  } = req.body;

  // Read the pets data from the file
  readData(petsFile, (err, pets) => {
    if (err) {
      return res.status(500).send('Server error. Please try again later.');
    }

    // Filter the pets data based on the form input criteria for cats
    const matchedCats = pets.filter(pet => {
      return pet[2] === 'cat' && // Ensure it's a cat
        (catbreed === "Doesn't matter" || pet[3].includes(catbreed)) &&
        (agecat === "Doesn't matter" || pet[4] === agecat) &&
        (catgender === 'nopref' || pet[5] === catgender) &&
        (catgetalongdogs === "Doesn't matter" || pet[6] === catgetalongdogs) &&
        (catgetalongcats === "Doesn't matter" || pet[7] === catgetalongcats) &&
        (catgetalongchildren === "Doesn't matter" || pet[8] === catgetalongchildren);
    });

    // Log matchedCats for debugging
    console.log("Matching Cats:", matchedCats);

    // Ensure that matchedCats is not undefined before passing it to the template
    if (matchedCats.length > 0) {
      res.render('partials/find-cat-results.ejs', { matchedCats });
    } else {
      res.send('<p>No cats found matching your criteria. <a href="/find-pet">Try again</a>.</p>');
    }
  });
});


// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed.');
    }
    res.send('<p>You have been logged out successfully. <a href="/">Go to home</a></p>');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
