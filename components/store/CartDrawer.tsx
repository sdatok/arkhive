"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQty, subtotal } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <h2 className="text-[11px] uppercase tracking-widest font-bold">
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="text-[11px] uppercase tracking-widest hover:text-neutral-500 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[12px] text-neutral-400 uppercase tracking-widest">
                Your cart is empty
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 px-6 py-5"
                >
                  {/* Image */}
                  <div className="relative w-20 h-24 bg-neutral-100 flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-neutral-400 uppercase tracking-widest truncate">
                      {item.brand}
                    </p>
                    <p className="text-[12px] font-medium mt-0.5 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Size: {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.size, item.quantity - 1)
                          }
                          className="w-5 h-5 flex items-center justify-center border border-neutral-300 text-[12px] hover:border-black transition-colors"
                        >
                          −
                        </button>
                        <span className="text-[12px] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.size, item.quantity + 1)
                          }
                          className="w-5 h-5 flex items-center justify-center border border-neutral-300 text-[12px] hover:border-black transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-[12px] font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] uppercase tracking-widest text-neutral-500">
                Subtotal
              </span>
              <span className="text-[14px] font-medium">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              disabled
              className="w-full bg-black text-white text-[11px] uppercase tracking-widest py-3.5 hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              Checkout, coming soon
            </button>
            <p className="text-[10px] text-neutral-400 text-center mt-3">
              Payment integration coming soon
            </p>
          </div>
        )}
      </div>
    </>
  );
}
