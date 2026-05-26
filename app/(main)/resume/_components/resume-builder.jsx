"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { DEMO_READONLY_MESSAGE } from "@/lib/demo";

const emptyResumeValues = {
  contactInfo: {},
  summary: "",
  skills: "",
  experience: [],
  education: [],
  projects: [],
};

const exportMarkdown = (content) =>
  (content || "")
    .replace(/^## <div align="center">(.*?)<\/div>$/m, "# $1")
    .replace(/<\/?div[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export default function ResumeBuilder({
  initialContent,
  isDemoMode = false,
  viewerName = null,
}) {
  const [savedContent, setSavedContent] = useState(initialContent || "");
  const hasStoredResume = Boolean(savedContent?.trim());
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const [isUsingFormDraft, setIsUsingFormDraft] = useState(!hasStoredResume);
  const hasFormDraftFromStoredResume = hasStoredResume && isUsingFormDraft;
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: emptyResumeValues,
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  const getContactMarkdown = useCallback((values) => {
    const { contactInfo = {} } = values;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    const header = `## <div align="center">${
      user?.fullName || viewerName || "PippoAI Demo User"
    }</div>`;

    return parts.length > 0
      ? `${header}\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : header;
  }, [user?.fullName, viewerName]);

  const getCombinedContent = useCallback((values) => {
    const { summary, skills, experience, education, projects } = values;
    return [
      getContactMarkdown(values),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [getContactMarkdown]);

  useEffect(() => {
    setSavedContent(initialContent || "");
  }, [initialContent]);

  useEffect(() => {
    setIsUsingFormDraft(!hasStoredResume);

    if (hasStoredResume) {
      setActiveTab("preview");
      setResumeMode("preview");
      setPreviewContent(savedContent);
      reset(emptyResumeValues);
      return;
    }

    setActiveTab("edit");
    setPreviewContent("");
    reset(emptyResumeValues);
  }, [hasStoredResume, reset, savedContent]);

  useEffect(() => {
    if (isDemoMode) {
      setActiveTab("preview");
      setResumeMode("preview");
    }
  }, [isDemoMode]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit" && isUsingFormDraft) {
      const newContent = getCombinedContent(formValues);
      setPreviewContent(newContent || "");
    }
  }, [activeTab, formValues, getCombinedContent, isUsingFormDraft]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
  }, [saveResult, isSaving]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (isDemoMode) {
      toast.error(DEMO_READONLY_MESSAGE);
      return;
    }

    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      if (!element) {
        toast.error("Resume export is unavailable right now");
        return;
      }

      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            const root = clonedDoc.documentElement;
            const body = clonedDoc.body;
            const resumeNode = clonedDoc.getElementById("resume-pdf");

            const colorOverrides = {
              "--background": "#ffffff",
              "--foreground": "#111111",
              "--card": "#ffffff",
              "--card-foreground": "#111111",
              "--popover": "#ffffff",
              "--popover-foreground": "#111111",
              "--primary": "#111111",
              "--primary-foreground": "#ffffff",
              "--secondary": "#f3f4f6",
              "--secondary-foreground": "#111111",
              "--muted": "#f3f4f6",
              "--muted-foreground": "#4b5563",
              "--accent": "#f3f4f6",
              "--accent-foreground": "#111111",
              "--border": "#d1d5db",
              "--input": "#d1d5db",
              "--ring": "#9ca3af",
            };

            Object.entries(colorOverrides).forEach(([key, value]) => {
              root.style.setProperty(key, value);
            });

            body.style.background = "#ffffff";
            body.style.color = "#111111";

            if (resumeNode) {
              resumeNode.style.background = "#ffffff";
              resumeNode.style.color = "#111111";
            }
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveMarkdownContent = async () => {
    if (isDemoMode) {
      toast.error(DEMO_READONLY_MESSAGE);
      return;
    }

    const formattedContent = (previewContent || "")
      .replace(/\n/g, "\n")
      .replace(/\n\s*\n/g, "\n\n")
      .trim();

    if (!formattedContent) {
      toast.error("Resume content is empty");
      return;
    }

    const savedResume = await saveResumeFn(formattedContent);
    if (savedResume) {
      setSavedContent(formattedContent);
    }
  };

  const saveFormContent = async (values) => {
    const combinedContent = getCombinedContent(values).trim();

    if (!combinedContent) {
      toast.error("Resume content is empty");
      return;
    }

    setPreviewContent(combinedContent);

    const savedResume = await saveResumeFn(combinedContent);
    if (savedResume) {
      setSavedContent(combinedContent);
      setIsUsingFormDraft(false);
      setResumeMode("preview");
      setActiveTab("preview");
    }
  };

  const handleSaveClick = () => {
    if (isDemoMode) {
      toast.error(DEMO_READONLY_MESSAGE);
      return;
    }

    if (activeTab === "edit" && isUsingFormDraft) {
      handleSubmit(saveFormContent)();
      return;
    }

    saveMarkdownContent();
  };

  const startFormDraft = () => {
    if (
      !window.confirm(
        "Starting a new form draft will not import your existing markdown resume. Continue?"
      )
    ) {
      return;
    }

    reset(emptyResumeValues);
    setPreviewContent("");
    setIsUsingFormDraft(true);
    setResumeMode("preview");
    setActiveTab("edit");
  };

  const cancelFormDraft = () => {
    if (
      !window.confirm(
        "Discard this form draft and return to your saved markdown resume?"
      )
    ) {
      return;
    }

    reset(emptyResumeValues);
    setPreviewContent(savedContent || "");
    setIsUsingFormDraft(false);
    setResumeMode("preview");
    setActiveTab("preview");
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          {hasFormDraftFromStoredResume && !isDemoMode && (
            <Button type="button" variant="outline" onClick={cancelFormDraft}>
              Cancel Draft
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving && !isDemoMode ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isDemoMode ? "Sign In To Save" : "Save"}
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating && !isDemoMode}>
            {isGenerating && !isDemoMode ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {isDemoMode ? "Sign In To Export" : "Download PDF"}
              </>
            )}
          </Button>
        </div>
      </div>

      {isDemoMode && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          You are previewing a sample resume. Editing, saving, AI upgrades, and
          PDF export are disabled until you sign in.
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            value="edit"
            disabled={isDemoMode || (hasStoredResume && !isUsingFormDraft)}
          >
            Form
          </TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          {hasFormDraftFromStoredResume && (
            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">New form draft in progress</p>
                <p className="text-sm text-muted-foreground">
                  This draft is separate from your saved markdown resume until
                  you save it.
                </p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit(saveFormContent)} className="space-y-6">
            <fieldset disabled={isDemoMode} className="space-y-8">
              <Card className="border border-border/60 bg-muted/20">
                <CardHeader>
                  <CardTitle>Resume Structure</CardTitle>
                  <CardDescription>
                    Fill this out from top to bottom: add your contact basics,
                    summarize your story, then support it with experience,
                    education, and projects.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                  <div className="rounded-lg border bg-background/70 p-3">
                    <p className="font-medium text-foreground">1. Identity</p>
                    <p>Email, phone, and profile links.</p>
                  </div>
                  <div className="rounded-lg border bg-background/70 p-3">
                    <p className="font-medium text-foreground">2. Positioning</p>
                    <p>Summary and skills that match your target role.</p>
                  </div>
                  <div className="rounded-lg border bg-background/70 p-3">
                    <p className="font-medium text-foreground">3. Evidence</p>
                    <p>Experience, education, and project wins.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    These details appear at the top of your resume and help
                    recruiters contact you quickly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="resume-email">Email</Label>
                    <Input
                      id="resume-email"
                      {...register("contactInfo.email")}
                      type="email"
                      placeholder="your@email.com"
                      error={errors.contactInfo?.email}
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume-mobile">Mobile Number</Label>
                    <Input
                      id="resume-mobile"
                      {...register("contactInfo.mobile")}
                      type="tel"
                      placeholder="+1 234 567 8900"
                    />
                    {errors.contactInfo?.mobile && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume-linkedin">LinkedIn URL</Label>
                    <Input
                      id="resume-linkedin"
                      {...register("contactInfo.linkedin")}
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resume-twitter">Twitter/X Profile</Label>
                    <Input
                      id="resume-twitter"
                      {...register("contactInfo.twitter")}
                      type="url"
                      placeholder="https://twitter.com/your-handle"
                    />
                    {errors.contactInfo?.twitter && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.twitter.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                  <CardDescription>
                    Write 3-5 lines about your experience, strongest strengths,
                    and the type of work you want next.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="h-32"
                        placeholder="Example: Product-minded frontend developer with 3+ years building polished web experiences, scalable UI systems, and AI-assisted workflows..."
                        error={errors.summary}
                      />
                    )}
                  />
                  {errors.summary && (
                    <p className="text-sm text-red-500">
                      {errors.summary.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>
                    Group your most relevant tools, technologies, and domain
                    strengths. Keep it scannable.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        className="h-28"
                        placeholder="Example: React, Next.js, TypeScript, Prisma, PostgreSQL, REST APIs, Tailwind CSS"
                        error={errors.skills}
                      />
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    Tip: prioritize the skills most relevant to the job you are
                    applying for.
                  </p>
                  {errors.skills && (
                    <p className="text-sm text-red-500">
                      {errors.skills.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add roles that show impact. Focus on results, ownership, and
                    measurable improvements where possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Experience"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-500">
                      {errors.experience.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Include degrees, certifications, or formal programs that
                    strengthen your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Education"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.education && (
                    <p className="text-sm text-red-500">
                      {errors.education.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Highlight practical work that proves your skills, especially
                    if it matches your target role.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Controller
                    name="projects"
                    control={control}
                    render={({ field }) => (
                      <EntryForm
                        type="Project"
                        entries={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.projects && (
                    <p className="text-sm text-red-500">
                      {errors.projects.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </fieldset>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {hasStoredResume && !isDemoMode && !isUsingFormDraft && (
            <div className="mb-3 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Editing an existing resume</p>
                <p className="text-sm text-muted-foreground">
                  Markdown editing is enabled. Starting a fresh form draft does
                  not import your saved markdown automatically.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={startFormDraft}>
                Start Fresh Form Draft
              </Button>
            </div>
          )}
          {activeTab === "preview" && !isDemoMode && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && !isDemoMode && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={isDemoMode ? undefined : setPreviewContent}
              height={800}
              preview={isDemoMode ? "preview" : resumeMode}
              hideToolbar={isDemoMode}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none fixed left-[-10000px] top-0 opacity-0"
          >
            <div
              id="resume-pdf"
              style={{
                width: "794px",
                padding: "48px",
                background: "#ffffff",
                color: "#111111",
                fontFamily: "Inter, Arial, sans-serif",
                lineHeight: 1.6,
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1
                      style={{
                        textAlign: "center",
                        fontSize: "32px",
                        fontWeight: 700,
                        margin: "0 0 16px",
                      }}
                    >
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        margin: "28px 0 12px",
                        paddingBottom: "6px",
                        borderBottom: "1px solid #d1d5db",
                      }}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: "18px 0 6px",
                      }}
                    >
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ margin: "0 0 12px", whiteSpace: "pre-wrap" }}>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ margin: "0 0 16px 20px", padding: 0 }}>
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: "8px" }}>{children}</li>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} style={{ color: "#2563eb" }}>
                      {children}
                    </a>
                  ),
                  hr: () => (
                    <hr
                      style={{
                        border: 0,
                        borderTop: "1px solid #d1d5db",
                        margin: "24px 0",
                      }}
                    />
                  ),
                }}
              >
                {exportMarkdown(previewContent)}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
