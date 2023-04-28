CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    role VARCHAR(50),
    password VARCHAR(100)
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    balance DECIMAL (10,2),
    name VARCHAR(50),
    user_id SERIAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    amount DECIMAL (10,2),
    type BOOLEAN,
    timestamps TIMESTAMP,
    description TEXT,
    category_id SERIAL,
    wallet_id SERIAL,   
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);