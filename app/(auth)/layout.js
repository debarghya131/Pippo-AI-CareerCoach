const AuthLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]">
        <div className="flex min-h-[100dvh] items-start justify-center px-4 pt-8 pb-8 sm:items-center sm:px-6 sm:pt-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
