const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { query } = require('express');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// New
 const getUserWithEmail = function(email) {
    const query = pool.query(
      `SELECT *
      FROM users
      WHERE email LIKE $1;`, [email])
    .then(res=>{
      return res.rows[0];
    })
    .catch(err=>{console.log(err)});
    return query;
};
exports.getUserWithEmail = getUserWithEmail;

// Original
// const getUserWithEmail = function(email) {
//   let user;
//   for (const userId in users) {
//     user = users[userId];
//     if (user.email.toLowerCase() === email.toLowerCase()) {
//       break;
//     } else {
//       user = null;
//     }
//   }
//   return Promise.resolve(user);
// }

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// New
const getUserWithId = function(id) {
  const query = pool.query(
    `SELECT *
    FROM users
    WHERE $1 = $1;`, [id])
  .then(res=>{
    return res.rows[0];
  })
  .catch(err=>{console.log(err)});
  return query;
};
exports.getUserWithId = getUserWithId;

// // Original
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// }

// getUserWithId('1').then(res => {console.log(res)});
/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const testUser = {
  name: 'Tim',
  email: 'tim@gmail.com',
  password: 'password'
}
// New
const addUser = function(user) {
  const query = pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`, [user.name, user.email, user.password])
  .then(res => {
    const user = res.rows[0];
    return user
  })
  .catch(err=>{console.log(err)});
    return query;
};
exports.addUser = addUser;


// // Original
// const addUser =  function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// }


// addUser(testUser).then(res=>{console.log(res)});

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
