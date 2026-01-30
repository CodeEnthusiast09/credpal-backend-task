import mongoose from "mongoose";
import { LoanDocument } from "../../types";
export declare const Loan: mongoose.Model<LoanDocument, {}, {}, {}, mongoose.Document<unknown, {}, LoanDocument, {}, mongoose.DefaultSchemaOptions> & LoanDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, LoanDocument>;
