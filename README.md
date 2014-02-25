# Valid Models

A library for validating JavaScript objects

## changelog
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
var validator = require('valid-models');

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
