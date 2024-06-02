const { validationResult, matchedData } = require('express-validator');

module.exports = {
    validationErrors: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            const errorsMsgs = errors.array().map(error => (
                {
                    field: error.path, 
                    message: error.msg, 
                    location: error.location
                }
            ));
            return res.status(400).json({ errors: errorsMsgs });
        }

        req.validData = matchedData(req);
        next();
    },
    errorHandler: (err, req, res, next) => {
        if(err.status) {
            res.status(err.status);
        } else {
            res.status(400);
        }
        if(err.message) {
            res.json({ error: err.message });
        } else {
            res.json({ error: 'Ocorreu algum erro.' });
        }
    }
}