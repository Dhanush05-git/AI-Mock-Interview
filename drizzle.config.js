/** @type { import("drizzle-kit").Config } */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_NJXVfl5aB9pT@ep-spring-unit-a51d0fn5-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
};
