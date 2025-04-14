-- CREATE TABLE users (
--     id_user SERIAL PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     profile_image VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- )

-- CREATE TABLE banners (
--     id_banner SERIAL PRIMARY KEY,
--     banner_name VARCHAR(255) NOT NULL,
--     banner_image VARCHAR(255) NOT NULL,
--     description varchar(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- )

-- INSERT INTO banners (banner_name, banner_image, description) VALUES
-- ('Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
-- ('Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
-- ('Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
-- ('Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
-- ('Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
-- ('Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

CREATE TABLE services (
    service_code VARCHAR(15) NOT NULL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255) NOT NULL,
    service_tarif INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- INSERT INTO services (service_code, service_name, service_icon, service_tarif) VALUES
-- ('PAJAK', 'Pajak PBB', 'https://minio.nutech-integrasi.com/take-home-test/services/PBB.png', 40000),
-- ('PLN', 'Listrik', 'https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png', 10000),
-- ('PDAM', 'PDAM Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png', 40000),
-- ('PULSA', 'Pulsa', 'https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png', 40000),
-- ('PGN', 'PGN Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PGN.png', 50000),
-- ('MUSIK', 'Musik Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Musik.png', 50000),
-- ('TV', 'TV Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png', 50000),
-- ('PAKET_DATA', 'Paket Data', 'https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png', 50000),
-- ('VOUCHER_GAME', 'Voucher Game', 'https://minio.nutech-integrasi.com/take-home-test/services/Game.png', 100000),
-- ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png', 100000),
-- ('QURBAN', 'Qurban', 'https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png', 200000),
-- ('ZAKAT', 'Zakat', 'https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png', 300000);

-- ALTER TABLE users ADD COLUMN balance INT DEFAULT 0;

-- CREATE TABLE top_up (
--     top_up_number INT NOT NULL PRIMARY KEY,
--     id_user BIGINT UNSIGNED NOT NULL,
--     top_up_amount INT NOT NULL,
--     total_amount INT NOT NULL,
--     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES users(id_user)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE
-- )

-- CREATE TABLE transaction (
--     invoice_number VARCHAR(20) NOT NULL PRIMARY KEY,
--     service_code VARCHAR(15) NOT NULL,
--     id_user BIGINT UNSIGNED NOT NULL,
--     transaction_type VARCHAR(20) NOT NULL,
--     total_amount INT NOT NULL,
--     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_transaction_service FOREIGN KEY (service_code) REFERENCES services(service_code)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE,
--     CONSTRAINT fk_transaction_user FOREIGN KEY (id_user) REFERENCES users(id_user)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE
-- )