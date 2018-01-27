/* útfæra greina virkni */
const express = require('express');
const router = express.Router();

router.get('/:name', (req, res) => {
    res.end(req.params.name);
    res.redirect('/halleluja');
});


module.exports = router;

/* app.get('route', cb1, cb2, cb3..) {

} */
