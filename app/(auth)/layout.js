const AuthLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      <div className="flex min-h-screen items-start justify-center px-4 pt-16 pb-10 md:items-center md:pt-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
