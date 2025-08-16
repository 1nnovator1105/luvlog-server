"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../modules/users/entities/user.entity");
const post_entity_1 = require("../modules/posts/entities/post.entity");
const code_entity_1 = require("../modules/users/entities/code.entity");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'luvlog',
    entities: [user_entity_1.User, post_entity_1.Post, code_entity_1.Code],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});
//# sourceMappingURL=typeorm.config.js.map