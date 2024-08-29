\echo 'Delete and recreate pixelpets db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pixelpets;
CREATE DATABASE pixelpets;
\connect pixelpets

\i pixelpets-schema.sql
\i pixelpets-seed.sql

\echo 'Delete and recreate pixelpets_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE pixelpets-test;
CREATE DATABASE pixelpets-test;
\connect pixelpets-test

\i pixelpets-schema.sql