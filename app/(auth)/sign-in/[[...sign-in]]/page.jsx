import { SignIn } from "@clerk/nextjs";

const authAppearance = {
  elements: {
    rootBox: "flex w-full justify-center",
    card: "w-full max-w-md border border-white/10 bg-card/95 shadow-2xl backdrop-blur",
    headerTitle: "text-foreground text-2xl sm:text-3xl",
    headerSubtitle: "text-sm text-muted-foreground sm:text-base",
    socialButtonsBlockButton:
      "h-11 border border-border bg-background/80 hover:bg-accent",
    socialButtonsBlockButtonText: "text-foreground",
    dividerLine: "bg-border",
    dividerText: "text-xs text-muted-foreground sm:text-sm",
    formFieldLabel: "text-sm text-foreground",
    formFieldInput:
      "h-11 rounded-md border border-border bg-background/80 text-foreground placeholder:text-muted-foreground",
    formButtonPrimary:
      "h-11 bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
    footerActionText: "text-muted-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    identityPreviewText: "text-foreground",
    formResendCodeLink: "text-primary hover:text-primary/80",
    otpCodeFieldInput:
      "border border-border bg-background/80 text-foreground",
    alertText: "text-sm",
    footer: "pb-1",
  },
};

export default function Page() {
  return <SignIn routing="path" path="/sign-in" appearance={authAppearance} />;
}
