import mongoose, { Schema } from 'mongoose';

export interface LogSchema extends Document {
    message: string;
    level: string;
    payload: Record<string, unknown>;
}

const logsDataSchema = new Schema<LogSchema>({
    message: { type: String, required: true },
    level: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

const LogsModel = mongoose.model<LogSchema>('logs', logsDataSchema);

export default LogsModel;