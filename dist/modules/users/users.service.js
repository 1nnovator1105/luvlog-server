"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const code_entity_1 = require("./entities/code.entity");
let UsersService = class UsersService {
    userRepository;
    codeRepository;
    constructor(userRepository, codeRepository) {
        this.userRepository = userRepository;
        this.codeRepository = codeRepository;
    }
    async findOneByUserId(userId) {
        return this.userRepository.findOne({
            where: { userId },
        });
    }
    async findOneWithRole(userId) {
        const user = await this.userRepository.findOne({
            where: { userId },
        });
        if (!user) {
            return null;
        }
        const roleCode = await this.codeRepository.findOne({
            where: {
                codeUnit: 'USER_ROLE',
                codeId: user.userRole,
            },
        });
        return {
            userId: user.userId,
            userName: user.userName,
            userRole: user.userRole,
            roleName: roleCode?.codeName || user.userRole,
            createDate: user.createDate,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(code_entity_1.Code)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map