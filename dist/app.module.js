"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const admin_module_1 = require("./admin/admin.module");
const companies_module_1 = require("./modules/companies/companies.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const devices_module_1 = require("./modules/devices/devices.module");
const user_entity_1 = require("./auth/entities/user.entity");
const refresh_token_entity_1 = require("./auth/entities/refresh-token.entity");
const company_entity_1 = require("./auth/entities/company.entity");
const admin_entity_1 = require("./auth/entities/admin.entity");
const admin_refresh_token_entity_1 = require("./auth/entities/admin-refresh-token.entity");
const device_entity_1 = require("./auth/entities/device.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 10,
                }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [user_entity_1.User, refresh_token_entity_1.RefreshToken, company_entity_1.Company, admin_entity_1.Admin, admin_refresh_token_entity_1.AdminRefreshToken, device_entity_1.Device],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            admin_module_1.AdminModule,
            companies_module_1.CompaniesModule,
            dashboard_module_1.DashboardModule,
            devices_module_1.DevicesModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map