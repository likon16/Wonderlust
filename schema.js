const Joi = require("joi");

module.exports = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().trim().min(1).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow("", null)
    }),
  }).required() // ✅ THIS LINE: Makes "listing" required
});
