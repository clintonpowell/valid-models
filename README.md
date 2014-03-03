# Valid Models

A library for validating JavaScript objects

## changelog
###0.1.0
* Added sanitization library to help remove unwanted fields when transferring objects
###0.0.5
* added ability to put `$error` inside Boolean specifiers instead of `$andError` etc.
* fixed bug with the `$all` error messages repeating for each specifier
* fixed other miscellaneous bugs
###0.0.4
* added ability to use custom validator functions for methods
* cleaned up clutter

### previous versions
* Initial commits and sanitization

## Simple to Use
### Initial Setup
```js
var userValidation = {
   name: {
      hasValue: true,
      hasValueError: 'Please enter your name'
   },
   phone: {
      hasValue: true,
      hasValueError: 'Please enter your phone',
      match: /[0-9]{10}/,
      matchError: 'Please enter a valid 10-digit phone number'
   },
   location: {
     address: {
        minLength: 10,
        minLengthError: 'Enter a valid address'
     },
     city: {
        $and: {
           hasValue: true,
           minLength: 3
        },
        $andError: 'Please enter a valid city'
     },
     state: {
        maxLength: 2,
        $all: 'Please enter a valid 2-letter state'
     }
   }
};
```
### Now validate your models
```js
var userValidation = require('./somemodels').userValidation;
var validator = require('valid-models').validator();

var myUserModel = {
   name: 'John Smith',
   phone: '1231231234A',
   location: {
      address: '123 JavaScript Street',
      city: 'Chromeville',
      state: 'CAL'
   },
   optionalField: null
};

validator.validate(myUserModel, userValidation, function(errs) {
  console.log(errs);
});
```
### Output
```js
[
  {
    target:"phone",
    error:"Please enter a valid 10-digit phone number"
  },

  {
    target:"location.state",
    error:"Please enter a valid 2-letter state"
  }
]
```

## Now in version 0.1.0
### Sanitize your models
```js
var sanitizer = require('valid-models').sanitizer();

var myModel = {
   username: 'coolbeans123',
   passHash: 'e3f2-3f1f-32f3-244b',
   salt: 'fuzzywuzzywasabear',
   name: {
      first: 'John',
      middle: 'Joshua',
      last: 'McJacobson'
   }
};

// Sanitizor object. Keep the specified fields
var sanitized = {
  username: true,
  name: {
     first: true,
     last: true
  }
};

sanitizer.sanitize(myModel, sanitized);
/* Resulting in myModel sanitized in place:
  {
    username: 'coolbeans123',
    name: {
      first: 'John',
      last: 'McJacobson'
    }
  }
*/

```
Or use purge method which does the opposite (deletes specified fields);
```js
var purger = {
  passHash: true,
  salt: true,
  name: {
    middle: true
  }
};

sanitizer.sanitize(myModel, purger);
```



