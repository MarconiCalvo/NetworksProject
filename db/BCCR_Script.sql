CREATE TABLE SINPE_SUBSCRIPTIONS (
    SINPE_NUMBER VARCHAR(30) NOT NULL UNIQUE,
    SINPE_CLIENT_NAME VARCHAR(100) NOT NULL UNIQUE,
    SINPE_BANK_CODE VARCHAR(3) NOT NULL
);