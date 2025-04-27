export default () => ({
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432
    }
});
