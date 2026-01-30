"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../types");
const loanSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1000,
        max: 10_000_000,
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500,
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 360,
    },
    status: {
        type: String,
        enum: Object.values(types_1.LoanStatus),
        default: types_1.LoanStatus.PENDING,
    },
    interestRate: {
        type: Number,
        default: 5,
        min: 0,
    },
    monthlyPayment: {
        type: Number,
        default: 0,
    },
    totalRepayment: {
        type: Number,
        default: 0,
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedAt: Date,
    rejectionReason: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
loanSchema.pre("save", function () {
    if (this.status !== types_1.LoanStatus.APPROVED &&
        this.status !== types_1.LoanStatus.DISBURSED) {
        return;
    }
    const monthlyRate = this.interestRate / 100 / 12;
    const principal = this.amount;
    const n = this.duration;
    if (monthlyRate === 0) {
        this.monthlyPayment = principal / n;
    }
    else {
        this.monthlyPayment =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                (Math.pow(1 + monthlyRate, n) - 1);
    }
    this.totalRepayment = this.monthlyPayment * n;
});
exports.Loan = mongoose_1.default.model("Loan", loanSchema);
//# sourceMappingURL=loan.model.js.map