<h1>Valid Models</h1>
<p>A library for validating JavaScript objects</p>

<h3>Simple to Use</h3>
<h4>Initial Setup</h4>
<code>
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
        hasValue: true,
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
        hasValue: true,
        $all: 'Please enter a valid 2-letter state'
     }
   }
};
</code>
<h4>Now validate your models</h4>
<code>
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
</code>
<h4>Output:</h4>
<code>
[
  {
    target:"phone",
    error:"Please enter a valid 10-digit phone number"
  },

  {
    target:"state",
    error:"Please enter a valid 2-letter state"
  }
]
</code>

