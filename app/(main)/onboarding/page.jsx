import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getCurrentUserProfile } from "@/actions/user";

const formatSubIndustrySlug = (value) => value.toLowerCase().replace(/ /g, "-");

export default async function OnboardingPage() {
  const userProfile = await getCurrentUserProfile();

  let initialValues = null;

  if (userProfile?.industry) {
    const [industryId, ...subIndustryParts] = userProfile.industry.split("-");
    const subIndustrySlug = subIndustryParts.join("-");
    const matchedIndustry = industries.find((industry) => industry.id === industryId);
    const matchedSubIndustry = matchedIndustry?.subIndustries.find(
      (subIndustry) => formatSubIndustrySlug(subIndustry) === subIndustrySlug
    );

    initialValues = {
      industry: matchedIndustry?.id || "",
      subIndustry: matchedSubIndustry || "",
      experience:
        typeof userProfile.experience === "number"
          ? String(userProfile.experience)
          : "",
      skills: userProfile.skills?.join(", ") || "",
      bio: userProfile.bio || "",
    };
  }

  return (
    <main>
      <OnboardingForm
        industries={industries}
        initialValues={initialValues}
        isEditing={!!userProfile?.industry}
      />
    </main>
  );
}
