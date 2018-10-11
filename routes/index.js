var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/buildquery", (req, res) => {
  var querySQL = "SELECT ID, USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, SCREEN_WIDTH, SCREEN_HEIGHT, VISITS, PAGE_RESPONSE, DOMAIN, PATH FROM SESSION "

  for(var idx=0; idx < req.body.predicates.length; idx++) {
    querySQL = querySQL + buildQuery(req.body.predicates[idx], idx)
  }

  console.log (querySQL)
    res.json(querySQL);
});


function buildQuery(predicate, idx) {
  var newQuerySQL = ''
  if (idx === 0) {
    newQuerySQL = " WHERE " }
  else {
    newQuerySQL = "AND " }

  if (predicate.operator === 'text_starts_with') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " LIKE '" + predicate.value + "%' "
  } else if (predicate.operator === 'text_equals') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " = '" + predicate.value + "' "
  } else if (predicate.operator === 'text_contains') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " LIKE '%" + predicate.value + "%' "
  } else if (predicate.operator === 'text_in_list') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " IN (" + predicate.value.split(",").map(function(str){return "'" + str + "'"; }).join(",") + ") "
  } else if (predicate.operator === 'number_range') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " BETWEEN " + predicate.rangeValue1 + " AND " + predicate.rangeValue2 + " "
  } else if (predicate.operator === 'number_less_than_or_equal') {
      newQuerySQL = newQuerySQL + predicate.sessionField + " <= " + predicate.value + " " 
  } else if (predicate.operator === 'number_equals') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " = " + predicate.value + " " 
  } else if (predicate.operator === 'number_greater_than_or_equal') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " >= " + predicate.value + " " 
  } else if (predicate.operator === 'number_in_list') {
    newQuerySQL = newQuerySQL + predicate.sessionField + " IN (" + predicate.value + ") " 
  } 

    return newQuerySQL;
}

module.exports = router;
