var Validator = module.exports = function Validator(msg) {
	this.defaultMessage = msg || "Invalid value specified";
    if(!(this instanceof Validator)){
        return new Validator(this.defaultMessage);
    }
};

Validator.prototype = {

	ValidatorException: function(v) {
		this.message = 'Invalid validator: "'+v+'"';
	}
	, andOrOperators: {
		$and: function(item1, item2) { return Boolean(item1 && item2); }
		, $or: function(item1, item2) { return Boolean(item1 || item2); }
	}
	, notNull: function(item) {
		return item !== null && item !== undefined;
	}
	, hasValue: function(item, truth, target) {
        if(target)
          item = item[target];
		return (this.notNull(item) && item.toString().length > 0) == truth;
	}
	, minLength: function(item, min, target) {
        if(target)
          item = item[target];
		return this.notNull(item) && item.length && item.length >= min;
	}
	, maxLength: function(item, max, target) {
        if(target)
          item = item[target];
		return this.notNull(item) && item.length && item.length <= max;
	}
	, minValue: function(item, val, target) {
        if(target)
          item = item[target];
		return this.notNull(item) && item >= val;
	}
	, maxValue: function(item, val, target) {
       if(target)
          item = item[target];
		return this.notNull(item) && item >= val;
	}
	, match: function(item, regex, target) {
        if(target)
          item = item[target];
		if(regex instanceof Array) {
          var truth = true;
			regex.forEach(function(r) {
				if(!item.match(r))
					return truth = false;
			});
			return truth;
		}
		return this.notNull(item) && item.match(regex);
	}
	, equalsOther: function(item, other, target) {
		return item[target] === item[other];
	}
  	, subValidate: function(item, v, target, scope) {
        var validator = v;
        if(validator == undefined || !(validator instanceof Object))
			throw new this.ValidatorException(v);
    	var errs = [];
        for(var test in validator) {
			if(test == '$and' || test == '$or') {
				var truth = true;
				for(var andTest in validator[test]) {
					truth = this.andOrOperators[test](truth, this[andTest](item, validator[test][andTest], target));
					if(!truth) {
						var err = (validator['$all'] || validator[test+'Error'] || this.defaultMessage);
						errs.push({target: scope+target, error: err});
						break;
					}
				}
				continue;
			}

			if(this[test] && !this[test](item, validator[test], target)) {
				var err = (validator['$all'] || validator[test+'Error'] || this.defaultMessage);
				errs.push({target: scope+target, error: err});
			}
        }
      	return errs;
	}
	, validate: function(item, v, scope, cb) {
        if(scope)
        	item = item[scope];
        else
        	scope = "";
		var validator = v;
		if(validator == undefined || !(validator instanceof Object))
			throw new this.ValidatorException(v);
		var errs = [];
		for(var prop in validator) {
			var options = validator[prop];
			if(typeof options === 'function') {
				var res = options(item[prop]);
				if(typeof res === 'string')
					errs.push({target: scope+prop, error: res});
				continue;
			}
			if(this[prop]) continue;

			for(var test in options) {
				if(test == '$and' || test == '$or') {
					var truth = true;
					for(var andTest in options[test]) {
                        
						truth = this.andOrOperators[test](truth, this[andTest](item, options[test][andTest], prop));
						if(!truth) {
							var err = (options['$all'] || options[test+'Error'] || this.defaultMessage);
							errs.push({target: scope+prop, error: err});
							break;
						}
					}
					continue;
				}

				if(this[test] && !this[test](item, options[test], prop)) {
					var err = (options['$all'] || options[test+'Error'] || this.defaultMessage);
					errs.push({target: scope+prop, error: err});
				}
                else if(item[prop] && item[prop].hasOwnProperty(test) && item[prop][test] instanceof Object) {
                	errs = errs.concat(this.validate(item[prop], validator[prop][test], scope+prop+"."));
                }
                else if(item[prop] && item[prop].hasOwnProperty(test)) {
                	errs = errs.concat(this.subValidate(item[prop], validator[prop][test], test, scope+prop+"."));
                }
            }
		}
		if(typeof cb === 'function')
        	cb(errs);
	  	else return errs;
	}
};