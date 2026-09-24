import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { errorResponse, hashPassword, HttpError, requireUser, verifyPassword } from "@/lib/auth";
import { getUserProfile } from "@/lib/data";

export async function GET() {
  try {
    const sessionUser = await requireUser();
    const data = await getUserProfile(sessionUser.id);
    if (!data) {
      throw new HttpError(404, "User not found.");
    }
    return Response.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}

const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Display name must be at least 2 characters.")
      .max(80, "Display name cannot exceed 80 characters.")
      .optional(),
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters.")
      .max(200, "Current password cannot exceed 200 characters.")
      .optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .max(200, "New password cannot exceed 200 characters.")
      .optional(),
    confirmPassword: z
      .string()
      .min(8, "Confirmation password must be at least 8 characters long.")
      .max(200, "Confirmation password cannot exceed 200 characters.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasAnyPassword =
      data.currentPassword !== undefined ||
      data.newPassword !== undefined ||
      data.confirmPassword !== undefined;

    if (hasAnyPassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Current password is required to change password.",
          path: ["currentPassword"],
        });
      }
      if (!data.newPassword) {
        ctx.addIssue({
          code: "custom",
          message: "New password is required to change password.",
          path: ["newPassword"],
        });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Confirmation password is required.",
          path: ["confirmPassword"],
        });
      }
      if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "New password and confirmation password do not match.",
          path: ["confirmPassword"],
        });
      }
    }

    if (!data.name && !hasAnyPassword) {
      ctx.addIssue({
        code: "custom",
        message: "No profile updates were provided.",
      });
    }
  });

async function handleProfileUpdate(request: Request) {
  try {
    const sessionUser = await requireUser();

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new HttpError(400, "Invalid JSON in request body.");
    }

    const body = profileUpdateSchema.parse(raw);

    const updatedName = body.name;
    let newPasswordHash: string | undefined;

    if (body.currentPassword && body.newPassword) {
      const [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, sessionUser.id))
        .limit(1);

      if (!userRecord) {
        throw new HttpError(404, "User account not found.");
      }

      const isCurrentValid = verifyPassword(body.currentPassword, userRecord.passwordHash);
      if (!isCurrentValid) {
        throw new HttpError(400, "Current password is incorrect.");
      }

      newPasswordHash = hashPassword(body.newPassword);
    }

    const updateFields: { name?: string; passwordHash?: string } = {};
    if (updatedName) updateFields.name = updatedName;
    if (newPasswordHash) updateFields.passwordHash = newPasswordHash;

    const [updatedUser] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, sessionUser.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return Response.json({
      message:
        updatedName && newPasswordHash
          ? "Profile and password updated successfully."
          : newPasswordHash
          ? "Password updated successfully."
          : "Profile display name updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
    }
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  return handleProfileUpdate(request);
}

export async function PUT(request: Request) {
  return handleProfileUpdate(request);
}
