exports.Schema = {
	Owner: ObjectId,
	Created: { type: Date, Default: Date.now },
	Name : String,
	Meta: {
		Description: String,
		Postcount: { type: Number, Default: 0 }
	}
}

exports.Options = {  }
