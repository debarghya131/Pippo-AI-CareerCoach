// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const parsedDate = parse(dateString, "yyyy-MM", new Date());
  if (isValid(parsedDate)) {
    return format(parsedDate, "MMM yyyy");
  }

  // If the value is already formatted or otherwise invalid, return it unchanged
  // instead of crashing the form submission.
  return dateString;
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const entryLabel = type === "Experience" ? "role" : type.toLowerCase();
  const fieldCopy =
    type === "Experience"
      ? {
          titleLabel: "Job Title",
          titlePlaceholder: "Frontend Engineer",
          organizationLabel: "Company / Organization",
          organizationPlaceholder: "Acme Labs",
          currentLabel: "This is my current role",
          descriptionLabel: "Impact Description",
          descriptionPlaceholder:
            "Describe what you built, improved, or owned, and include results where possible.",
          descriptionHelper:
            "Focus on outcomes, ownership, metrics, and tools used in this role.",
        }
      : type === "Education"
      ? {
          titleLabel: "Degree / Program",
          titlePlaceholder: "B.Tech in Computer Science",
          organizationLabel: "School / Institution",
          organizationPlaceholder: "Example University",
          currentLabel: "I am currently enrolled here",
          descriptionLabel: "Details",
          descriptionPlaceholder:
            "Add relevant coursework, achievements, GPA, certifications, or activities.",
          descriptionHelper:
            "Include the strongest academic details that support your profile.",
        }
      : {
          titleLabel: "Project Title",
          titlePlaceholder: "AI Resume Builder",
          organizationLabel: "Organization / Context",
          organizationPlaceholder: "Personal Project",
          currentLabel: "This project is still ongoing",
          descriptionLabel: "Project Description",
          descriptionPlaceholder:
            "Explain the problem, what you built, the stack you used, and the outcome.",
          descriptionHelper:
            "Highlight the problem solved, your contribution, and the impact of the project.",
        };
  const addCardDescription =
    type === "Experience"
      ? "Capture the role, time period, and the strongest outcomes you delivered."
      : type === "Education"
      ? "Add the degree or program details that best support your profile."
      : "Show what you built, the stack you used, and why the project mattered.";

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
  }, [improvedContent, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(), // 'experience', 'education', or 'project'
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index} className="border border-border/60 bg-background/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium leading-relaxed">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card className="border border-border/70 bg-background/90">
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
            <p className="text-sm text-muted-foreground">{addCardDescription}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${type.toLowerCase()}-title`}>
                  {fieldCopy.titleLabel}
                </Label>
                <Input
                  id={`${type.toLowerCase()}-title`}
                  placeholder={fieldCopy.titlePlaceholder}
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${type.toLowerCase()}-organization`}>
                  {fieldCopy.organizationLabel}
                </Label>
                <Input
                  id={`${type.toLowerCase()}-organization`}
                  placeholder={fieldCopy.organizationPlaceholder}
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${type.toLowerCase()}-start-date`}>
                  Start Month
                </Label>
                <Input
                  id={`${type.toLowerCase()}-start-date`}
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                <p className="text-xs text-muted-foreground">
                  Choose when this {entryLabel} started.
                </p>
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${type.toLowerCase()}-end-date`}>
                  End Month
                </Label>
                <Input
                  id={`${type.toLowerCase()}-end-date`}
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                />
                <p className="text-xs text-muted-foreground">
                  Leave this blank only if it is your current {entryLabel}.
                </p>
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${type.toLowerCase()}-current`}
                  className="h-4 w-4 rounded border-border bg-transparent accent-foreground"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) {
                      setValue("endDate", "");
                    }
                  }}
                />
                <Label htmlFor={`${type.toLowerCase()}-current`}>
                  {fieldCopy.currentLabel}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type.toLowerCase()}-description`}>
                {fieldCopy.descriptionLabel}
              </Label>
              <Textarea
                id={`${type.toLowerCase()}-description`}
                placeholder={fieldCopy.descriptionPlaceholder}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              <p className="text-xs text-muted-foreground">
                {fieldCopy.descriptionHelper}
              </p>
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
              className="justify-start px-0 md:px-2.5"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsAdding(false);
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleAdd}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
