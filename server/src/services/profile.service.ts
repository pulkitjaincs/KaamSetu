import { IUser } from "../models/User.model.js";
import WorkerProfile from "../models/WorkerProfile.model.js";
import EmployerProfile from "../models/EmployerProfile.model.js";
import { generateReadSignedUrl } from "../config/s3.js";
import { cacheAside } from "../utils/cache.js";
import type { ProfileResponse } from "../types/index.js";
import mongoose from "mongoose";
export type { ProfileResponse };

export const assembleProfileResponse = (profile: Record<string, unknown> | null, user: IUser, role: 'worker' | 'employer'): ProfileResponse => {
    const base: ProfileResponse = {
        name: user.name || "",
        email: user.email,
        phone: user.phone,
        role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
    };

    if (!profile) {
        if (role === 'worker') {
            return { ...base, completionPercent: 0, documents: {} };
        }
        return base;
    }

    const profileData: ProfileResponse = { ...profile, ...base };
    if (!profileData.name) profileData.name = user.name;

    return profileData;
};

export const getAvatarForUser = async (userId: string | mongoose.Types.ObjectId, role: string): Promise<string | null> => {
    const cacheKey = `avatar:key:${userId}`;

    // Cache only the raw S3 key (not the signed URL, which expires)
    const avatarKey = await cacheAside<string | null>(cacheKey, 1800, async () => {
        let profile;
        if (role === 'employer') {
            profile = await EmployerProfile.findOne({ user: userId }).select('avatar isAvatarHidden').lean();
        } else {
            profile = await WorkerProfile.findOne({ user: userId }).select('avatar isAvatarHidden').lean();
        }
        if (!profile || profile.isAvatarHidden || !profile.avatar) return null;
        return profile.avatar;
    });

    if (!avatarKey) return null;
    if (!avatarKey.startsWith('http')) {
        return generateReadSignedUrl(avatarKey);
    }
    return avatarKey;
};
