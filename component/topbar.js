"use client";
import React from "react";

export default function Topbar({ title, children }) {
  return (
    <div className="h-16 bg-[#E5E6E9] flex items-center justify-center px-5 shadow-md relative z-10">
      <h1 className="text-xl font-bold text-[#081F5C]">{title}</h1>
      <div className="absolute right-5">{children}</div>
    </div>
  );
}
