"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your store from here
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="neu-pill bg-navy hover:bg-navy-hover text-white font-bold px-5 py-2.5 text-sm transition-all"
        >
          + Add Product
        </Link>
      </div>

      {/* Manage cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          className="neu-card p-4 text-center hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl mb-1">📦</p>
          <p className="font-bold text-gray-900 text-sm">All Products</p>
          <p className="text-gray-400 text-xs mt-0.5">View & edit</p>
        </Link>
        <Link
          href="/admin/products/new"
          className="neu-card p-4 text-center hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl mb-1">➕</p>
          <p className="font-bold text-gray-900 text-sm">Add Product</p>
          <p className="text-gray-400 text-xs mt-0.5">List new item</p>
        </Link>
        <Link href="/admin/categories" className="neu-card p-4 text-center hover:shadow-lg transition-shadow">
          <p className="text-2xl mb-1">📂</p>
          <p className="font-bold text-gray-900 text-sm">Categories</p>
          <p className="text-gray-400 text-xs mt-0.5">Manage</p>
        </Link>
        <Link href="/admin/users" className="neu-card p-4 text-center hover:shadow-lg transition-shadow">
          <p className="text-2xl mb-1">🧑‍🤝‍🧑</p>
          <p className="font-bold text-gray-900 text-sm">Users</p>
          <p className="text-gray-400 text-xs mt-0.5">Manage</p>
        </Link>
      </div>
    </div>
  );
}
