"use client";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function Modal({
  open,
  title,
  description,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg bg-white">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 text-sm">
              {description}
            </p>
          )}
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
