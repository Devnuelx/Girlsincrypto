"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const stripe_webhook_controller_1 = require("./stripe-webhook.controller");
const enrollments_module_1 = require("../enrollments/enrollments.module");
const flutterwave_service_1 = require("./flutterwave.service");
const products_module_1 = require("../products/products.module");
const email_module_1 = require("../email/email.module");
const auth_module_1 = require("../auth/auth.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [enrollments_module_1.EnrollmentsModule, products_module_1.ProductsModule, email_module_1.EmailModule, auth_module_1.AuthModule],
        controllers: [payments_controller_1.PaymentsController, stripe_webhook_controller_1.StripeWebhookController],
        providers: [payments_service_1.PaymentsService, flutterwave_service_1.FlutterwaveService],
        exports: [payments_service_1.PaymentsService, flutterwave_service_1.FlutterwaveService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map