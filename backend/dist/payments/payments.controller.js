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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getTierPricing() {
        return this.paymentsService.getTierPricing();
    }
    async getMyTiers(user) {
        return this.paymentsService.getUserTiers(user.id);
    }
    async createTierCheckout(user, tier) {
        const validTiers = ['HEIRESS', 'EMPRESS', 'SOVEREIGN'];
        if (!validTiers.includes(tier.toUpperCase())) {
            throw new Error('Invalid tier');
        }
        return this.paymentsService.createTierCheckout(user.id, tier.toUpperCase());
    }
    async initializeProductPayment(body) {
        return this.paymentsService.initializeProductPayment(body);
    }
    async verifyFlutterwave(transactionId, txRef) {
        return this.paymentsService.verifyFlutterwaveTransaction(transactionId, txRef);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTierPricing", null);
__decorate([
    (0, common_1.Get)('my-tiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMyTiers", null);
__decorate([
    (0, common_1.Post)('checkout/:tier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createTierCheckout", null);
__decorate([
    (0, common_1.Post)('initialize-product'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initializeProductPayment", null);
__decorate([
    (0, common_1.Get)('verify-flutterwave'),
    __param(0, (0, common_1.Query)('transaction_id')),
    __param(1, (0, common_1.Query)('tx_ref')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyFlutterwave", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map