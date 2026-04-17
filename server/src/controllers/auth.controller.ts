import User, { IUser } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { setAuthCookie, generateToken } from "../utils/auth.js";
import { Request, Response } from "express";
import {
    generateAndStoreOTP,
    verifyAndConsumeOTP,
    buildConditions,
    checkContactUniqueness
} from "../services/auth.service.js";
import { getAvatarForUser } from "../services/profile.service.js";
import { cacheAside } from "../utils/cache.js";
import { AppError } from "../types/error.js";

export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
    const { phone, email } = req.body;
    const conditions = buildConditions({ email, phone });
    const user = await User.findOne({ $or: conditions });
    await generateAndStoreOTP(conditions);
    res.status(200).json({ message: "OTP Sent", isNewUser: !user });
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { phone, name, otp, role, email } = req.body;
    const conditions = buildConditions({ email, phone });
    await verifyAndConsumeOTP(conditions, otp);

    let user = await User.findOne({ $or: conditions });
    if (!user) {
        user = await User.create({
            phone,
            email,
            name: name || (email ? email.split("@")[0] : "User"),
            authType: email ? "email" : "phone",
            role: role || "worker",
            ...(email ? { emailVerified: true } : { phoneVerified: true })
        });
    } else {
        if (email) user.emailVerified = true;
        if (phone) user.phoneVerified = true;
        await user.save();
    }

    const [safeUser, avatar] = await Promise.all([
        User.findById(user._id).select("-password -__v").lean(),
        getAvatarForUser(user._id, user.role)
    ]);

    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);
    res.json({ user: { ...safeUser, avatar } });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, role, name } = req.body;
    await checkContactUniqueness({ email });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        email, password: hashedPassword, authType: "email", role, name, emailVerified: true
    });

    const [safeUser, avatar] = await Promise.all([
        User.findById(user._id).select("-password -__v").lean(),
        getAvatarForUser(user._id, user.role)
    ]);
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);
    res.json({ user: { ...safeUser, avatar } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;
    const conditions = buildConditions({ email, phone });
    const user = await User.findOne({ $or: conditions });

    if (!user) {
        throw new AppError("Invalid Credentials", 400);
    }
    if (!user.password) {
        throw new AppError("Please login with OTP", 400);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new AppError("Invalid Credentials", 400);
    }

    const [safeUser, avatar] = await Promise.all([
        User.findById(user._id).select("-password -__v").lean(),
        getAvatarForUser(user._id, user.role)
    ]);
    
    const token = generateToken(user._id.toString());
    setAuthCookie(res, token);
    res.json({ user: { ...safeUser, avatar } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone } = req.body;
    const conditions = buildConditions({ email, phone });

    const user = await User.findOne({ $or: conditions });
    if (!user) {
        throw new AppError("User not found", 400);
    }

    await generateAndStoreOTP(conditions);
    res.status(200).json({ message: "OTP Sent" });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, otp, newPassword } = req.body;
    const conditions = buildConditions({ email, phone });
    await verifyAndConsumeOTP(conditions, otp);

    const user = await User.findOne({ $or: conditions });
    if (!user) {
        throw new AppError("User not found", 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Logout successfully" });
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !user.password) {
        throw new AppError("You are logged in via OTP. Set a password via Forgot Password flow if needed.", 400);
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        throw new AppError("Incorrect current password", 400);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: "Password updated successfully" });
});

export const sendUpdateOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone } = req.body;
    const conditions = buildConditions({ email, phone });
    await checkContactUniqueness({ email, phone }, req.user._id.toString());
    await generateAndStoreOTP(conditions);
    res.status(200).json({ message: "OTP Sent" });
});

export const verifyUpdateOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, phone, otp } = req.body;
    const conditions = buildConditions({ email, phone });
    await verifyAndConsumeOTP(conditions, otp);

    const updates: Partial<IUser> = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                ...updates, ...(email ? { emailVerified: true } : {}),
                ...(phone ? { phoneVerified: true } : {})
            }
        },
        { new: true }
    ).select("-password -__v");

    res.json({ message: "Account updated successfully", user });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const cacheKey = `user:session:${req.user._id}`;

    // Only pure DB fields are cached — never signed URLs (they expire in 1hr)
    const userDoc = await cacheAside(cacheKey, 300, async () => {
        const doc = await User.findById(req.user._id).select("-password -__v").lean();
        return doc ?? null;
    });

    if (!userDoc) {
        throw new AppError("User not found", 404);
    }

    // Avatar resolved outside the cache so it's always a fresh signed URL
    const avatar = await getAvatarForUser(req.user._id, req.user.role);
    res.json({ user: { ...userDoc, avatar } });
});
