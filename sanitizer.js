var Sanitizer = module.exports = function Sanitizer() {
    if(!(this instanceof Sanitizer)){
        return new Sanitizer();
    }
};

Sanitizer.prototype = {
	sanitize: function (model, sanitizer, cb) {
		for(var layer in model)
			this.sanitizeLayer(model, sanitizer, layer);

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
		for(var layer in purger)
			this.purgeLayer(model, purger, layer);

		if(typeof cb === 'function')
			cb(model);

		return model;
	}
	, purgeLayer: function(model, purger, layer) {
		if(model[layer] === null || model[layer] === undefined) {
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