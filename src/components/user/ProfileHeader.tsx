"use client";
import React from "react";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { User } from "@/types/api.types";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-900 rounded-lg mb-8">
      <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-slate-700">
        {user.photo_url ? (
          <Image
            src={user.photo_url}
            alt={user.username}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <UserIcon size={48} className="text-slate-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
        <p className="text-slate-400 mb-2">{user.email}</p>
        <div className="flex gap-4 mt-2">
          <div className="px-4 py-2 bg-slate-800 rounded-md">
            <p className="text-sm text-slate-400">Vai trò</p>
            <p className="font-semibold capitalize">{user.role}</p>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-md">
            <p className="text-sm text-slate-400">Tham gia</p>
            <p className="font-semibold">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
