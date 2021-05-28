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
// New
const getAllReservations = function(guest_id, limit = 10) {
  const query = pool.query(
    `SELECT properties.*
    FROM reservations
    JOIN properties ON property_id = properties.id
    WHERE guest_id = $1
    LIMIT $2;`, [guest_id, limit])
    .then(res=>{
      const resultObject = {};
      const properties = res.rows
      for (const property of properties) {
        const id = property.id;
        resultObject[id] = property;
      }
      return resultObject;
    })
    .catch(err=>{console.log(err)});
    return query;
};
exports.getAllReservations = getAllReservations;

// getAllReservations1('100').then(res=>{console.log("function call:", res)})

// Original
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// }


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

//  const testOptions = {
//   city: 'Vancouver'
// }
// New
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // Keep track for AND
  let needAnd = false;
  // 3
  if (options.city) {
    let prefix = 'WHERE';
    let and = 'AND';
    if (needAnd) {
      prefix = and;
    }
    queryParams.push(`%${options.city}%`);
    queryString += `${prefix} city LIKE $${queryParams.length} `;
    needAnd = true;
  };

  if (options.owner_id) {
    console.log("options.owner_id", options.owner_id);
    let prefix = 'WHERE';
    let and = 'AND';
    if (needAnd) {
      prefix = and;
    }
    queryParams.push(options.owner_id);
    queryString += `${prefix} properties.owner_id = $${queryParams.length} `;
    needAnd = true;
  };

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    const minimumCents = options.minimum_price_per_night * 100;
    const maximumCents = options.maximum_price_per_night * 100;
    let prefix = 'WHERE';
    let and = 'AND';
    if (needAnd) {
      prefix = and;
    }
    queryParams.push(minimumCents);
    queryString += `${prefix} cost_per_night > $${queryParams.length} `;
    queryParams.push(maximumCents);
    queryString += `AND cost_per_night < $${queryParams.length} `;
    needAnd = true;
  };

  if (options.minimum_rating) {
    let prefix = 'WHERE';
    let and = 'AND';
    if (needAnd) {
      prefix = and;
    }
    queryParams.push(options.minimum_rating);
    queryString += `${prefix} rating > $${queryParams.length} `;
    needAnd = true;
  };
  
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;



// Original
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }

// getAllProperties(null, 2).then(res=>(console.log(res)));

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// Property
const testData = {
  owner_id: 2,
  title: 'Test Property',
  description: 'Test description',
  thumbnail_photo_url: 'thumbnail',
  cover_photo_url: 'coverphoto',
  cost_per_night: '1000',
  street: 'test street',
  city: 'test city',
  province: 'BC',
  post_code: 'test_postal',
  country: 'test_country',
  parking_spaces: 4,
  number_of_bathrooms: 5,
  number_of_bedrooms: 6
};

const addProperty = function(property) {
  const priceInCents = property.cost_per_night * 100;
  const query = pool.query(
    `INSERT INTO properties (
      owner_id,
      title, 
      description, 
      thumbnail_photo_url, 
      cover_photo_url, 
      cost_per_night, 
      street, 
      city, 
      province, 
      post_code, 
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;`, 
          [
            property.owner_id, 
            property.title,
            property.description,
            property.thumbnail_photo_url,
            property.cover_photo_url,
            priceInCents,
            property.street,
            property.city,
            property.province,
            property.post_code,
            property.country,
            property.parking_spaces,
            property.number_of_bathrooms,
            property.number_of_bedrooms
          ])
    .then(res=>{
      return res.rows[0];
    })
    .catch(err=>{console.log(err)});
    return query;
};
exports.addProperty = addProperty;

// Test
// addProperty1(testData).then(res=>{console.log(res)});

// Original
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// }
