import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User interface
export interface IUser extends Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true },
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password as string, 12);
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
}

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;