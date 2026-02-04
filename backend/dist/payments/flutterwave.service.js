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
var FlutterwaveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterwaveService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Flutterwave = require('flutterwave-node-v3');
let FlutterwaveService = FlutterwaveService_1 = class FlutterwaveService {
    constructor(configHelper) {
        this.configHelper = configHelper;
        this.logger = new common_1.Logger(FlutterwaveService_1.name);
        const publicKey = this.configHelper.get('FLW_PUBLIC_KEY');
        const secretKey = this.configHelper.get('FLW_SECRET_KEY');
        if (publicKey && secretKey) {
            this.flw = new Flutterwave(publicKey, secretKey);
        }
        else {
            this.logger.warn('Flutterwave keys not found in config');
        }
    }
    async initializePayment(data) {
        try {
            const payload = {
                tx_ref: data.tx_ref,
                amount: data.amount,
                currency: data.currency,
                redirect_url: data.redirect_url,
                customer: {
                    email: data.email,
                    name: data.customerName || 'Customer',
                },
                meta: data.meta,
                customizations: {
                    title: 'Girls in Crypto Hub',
                    description: 'Payment for Digital Product',
                    logo: 'https://girlsincrypto.com/logo.png',
                },
            };
            const response = await this.flw.Payment.initialize(payload);
            return response;
        }
        catch (error) {
            this.logger.error('Flutterwave Init Error', error);
            throw error;
        }
    }
    async verifyTransaction(transactionId) {
        try {
            const response = await this.flw.Transaction.verify({ id: transactionId });
            return response;
        }
        catch (error) {
            this.logger.error('Flutterwave Verify Error', error);
            throw error;
        }
    }
};
exports.FlutterwaveService = FlutterwaveService;
exports.FlutterwaveService = FlutterwaveService = FlutterwaveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FlutterwaveService);
//# sourceMappingURL=flutterwave.service.js.map