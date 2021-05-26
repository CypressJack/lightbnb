INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bedrooms, number_of_bathrooms, country, street, city, province, post_code, active)
VALUES (1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930, 6, 4, 8, 'Canada', '536 Namsub Highway', 'Sotboske', 'Quebec', '28142', TRUE),
(2, 'Blank corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 1000, 0, 3, 5, 'Canada', '1650 Hejto Center', 'Toronto', 'Ontario', '12356', TRUE),
(3, 'Fun Glad', 'description', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1172064/pexels-photo-1172064.jpeg', 3000, 7, 4, 5, 'Canada', '340 Docto Park', 'Vancouver', 'British Columbia', '78910', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES (TO_DATE('17/06/2021', 'DD/MM/YYYY'), TO_DATE('17/07/2021', 'DD/MM/YYYY'), 1, 3),
(TO_DATE('12/02/2021', 'DD/MM/YYYY'), TO_DATE('12/04/2021', 'DD/MM/YYYY'), 2, 1),
(TO_DATE('07/04/2021', 'DD/MM/YYYY'), TO_DATE('12/04/2021', 'DD/MM/YYYY'), 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 1, 'message'),
(2, 1, 1, 2, 'message'),
(3, 3, 3, 3, 'message');
