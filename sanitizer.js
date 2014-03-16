var Sanitizer = module.exports = function Sanitizer() {
    if(!(this instanceof Sanitizer)){
        return new Sanitizer();
    }
};

Sanitizer.prototype = {
	sanitize: function (model, sanitizer, cb) {
		if(model instanceof Array) {
			for(var i=0; i<model.length; ++i)
				for(var layer in model[i])
					this.sanitizeLayer(model[i], sanitizer, layer);
		} else {
			for(var layer in model)
				this.sanitizeLayer(model, sanitizer, layer);
		}

		if(typeof cb === 'function')
			cb(model);
		return model;
	}
	, sanitizeLayer: function(model, sanitizer, layer) {
		if(sanitizer[layer] === null || sanitizer[layer] === undefined) {
			delete model[layer];
			return;
		}
		for(var sublayer in model[layer])
			this.sanitizeLayer(model[layer], sanitizer[layer], sublayer);
	}
	, purge: function(model, purger, cb) {
		if(model instanceof Array) {
			for(var i=0; i<model.length; ++i)
				for(var layer in model[i])
					this.purgeLayer(model[i], purger, layer);
		} else {
			for(var layer in model)
				this.purgeLayer(model, purger, layer);
		}

		if(typeof cb === 'function')
			cb(model);

		return model;
	}
	, purgeLayer: function(model, purger, layer) {
		if(model[layer] === null || model[layer] === undefined || purger[layer] === null || purger[layer] === undefined) {
			return;
		}

		if(!(purger[layer] instanceof Object))
			delete model[layer];

		for(var sublayer in purger[layer])
			this.purgeLayer(model[layer], purger[layer], sublayer);
	}
	, extractSanitized: function(model, sanitizer, cb) {
		var extract = JSON.parse(JSON.stringify(model)); //clone
		this.sanitize(extract, sanitizer);
		if(typeof cb === 'function')
			cb(extract);
		return extract;
	}
	, extractPurged: function(model, sanitizer, cb) {
		var extract = JSON.parse(JSON.stringify(model)); //clone
		this.purge(extract, sanitizer);
		if(typeof cb === 'function')
			cb(extract);
		return extract;
	}

};