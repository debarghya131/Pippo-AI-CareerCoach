"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";
import { DEMO_READONLY_MESSAGE } from "@/lib/demo";

const emptyValues = {
  industry: "",
  subIndustry: "",
  experience: "",
  skills: "",
  bio: "",
};

const OnboardingForm = ({
  industries,
  initialValues = null,
  isEditing = false,
  isDemoMode = false,
}) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(() => {
    if (!initialValues?.industry) return null;
    return (
      industries.find((industry) => industry.id === initialValues.industry) ||
      null
    );
  });

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: initialValues || emptyValues,
  });

  const onSubmit = async (values) => {
    if (isDemoMode) {
      toast.error(DEMO_READONLY_MESSAGE);
      return;
    }

    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success(
        isEditing ? "Profile updated successfully!" : "Profile completed successfully!"
      );
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, isEditing, router]);

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");

  useEffect(() => {
    if (!watchIndustry) {
      setSelectedIndustry(null);
      return;
    }

    setSelectedIndustry(
      industries.find((industry) => industry.id === watchIndustry) || null
    );
  }, [watchIndustry, industries]);

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            {isEditing ? "Edit Your Profile" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription>
            {isDemoMode
              ? "This demo profile is prefilled for exploration. Sign in to update anything."
              : isEditing
              ? "Update your profile details to refresh your personalized career insights."
              : "Select your industry to get personalized career insights and recommendations."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isDemoMode && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Demo mode is read-only. You can inspect the profile fields, but
                saving changes requires sign-in.
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                disabled={isDemoMode}
                value={watchIndustry || undefined}
                onValueChange={(value) => {
                  setValue("industry", value);
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  disabled={isDemoMode}
                  value={watchSubIndustry || undefined}
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                disabled={isDemoMode}
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                disabled={isDemoMode}
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                disabled={isDemoMode}
                placeholder="Tell us about your professional background..."
                className="h-32"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button
              type={isDemoMode ? "button" : "submit"}
              className="w-full"
              disabled={updateLoading}
              onClick={
                isDemoMode ? () => toast.error(DEMO_READONLY_MESSAGE) : undefined
              }
            >
              {updateLoading && !isDemoMode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : (
                isDemoMode
                  ? "Sign In To Edit"
                  : isEditing
                  ? "Update Profile"
                  : "Complete Profile"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push(isEditing ? "/dashboard" : "/")}
              disabled={updateLoading}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
