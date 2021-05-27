SELECT properties.city, sum(reservations) as total_reservations
FROM properties
JOIN reservations ON reservations.property_id = properties.id
ORDER BY total_reservations DESC;