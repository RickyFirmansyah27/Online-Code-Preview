import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import ProPlanView from "./_components/ProPlanView";
import NavigationHeader from "../(root)/_components/Header";
import { ENTERPRISE_FEATURES, FEATURES, PRICING, COLORS, BREAKPOINTS } from "./_constants";
import { Star } from "lucide-react";
import FeatureCategory from "./_components/FeatureCategory";
import FeatureItem from "./_components/FeatureItem";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UpgradeButton from "./_components/UpgradeButton";
import LoginButton from "@/components/LoginButton";

// Hero section component
/**
 * Renders the hero section of the pricing page with title and subtitle.
 */
function HeroSection(): JSX.Element {
  return (
    <div className="text-center mb-16 sm:mb-20">
      <div className="relative inline-block">
        <div className={`absolute -inset-px bg-gradient-to-r ${COLORS.GRADIENT_FROM} ${COLORS.GRADIENT_TO} blur-xl opacity-10`} />
        <h1 className={`relative ${BREAKPOINTS.HERO_TITLE} font-semibold bg-gradient-to-r ${COLORS.TEXT_GRADIENT} text-transparent bg-clip-text mb-8`}>
          Elevate Your <br />
          Development Experience
        </h1>
      </div>
      <p className={`${BREAKPOINTS.HERO_SUBTITLE} ${COLORS.TEXT_SECONDARY} max-w-lg mx-auto leading-relaxed`}>
        Join the next generation of developers with our professional suite of tools
      </p>
    </div>
  );
}

// Enterprise features section
/**
 * Renders the enterprise features grid showcasing key benefits.
 */
function EnterpriseFeatures(): JSX.Element {
  return (
    <div className={`grid ${BREAKPOINTS.GRID_COLS} gap-4 sm:gap-6 mb-12 sm:mb-16`}>
      {ENTERPRISE_FEATURES.map((feature) => (
        <div
          key={feature.label}
          className={`group relative bg-gradient-to-b ${COLORS.CARD_BACKGROUND} ${COLORS.BACKGROUND} rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300`}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${COLORS.GRADIENT_FROM}/10 ${COLORS.GRADIENT_TO}/10 flex items-center justify-center mb-4 ring-1 ring-gray-800/60 group-hover:ring-blue-500/20`}>
              <feature.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className={`text-lg font-medium ${COLORS.TEXT_PRIMARY} mb-2`}>{feature.label}</h3>
            <p className={COLORS.TEXT_SECONDARY}>{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Pricing card component
/**
 * Renders the main pricing card with features and call-to-action.
 */
function PricingCard(): JSX.Element {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className={`absolute -inset-px bg-gradient-to-r ${COLORS.GRADIENT_FROM} ${COLORS.GRADIENT_TO} rounded-2xl blur opacity-10`} />
      <div className={`relative ${COLORS.CARD_BACKGROUND}/90 backdrop-blur-xl rounded-2xl`}>
        <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent`} />
        <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent`} />
        <div className={`relative ${BREAKPOINTS.CARD_PADDING}`}>
          <div className="text-center mb-12">
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${COLORS.GRADIENT_FROM}/10 ${COLORS.GRADIENT_TO}/10 ring-1 ring-gray-800/60 mb-6`}>
              <Star className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className={`text-3xl font-semibold ${COLORS.TEXT_PRIMARY} mb-4`}>Lifetime Pro Access</h2>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className={`text-2xl ${COLORS.TEXT_SECONDARY}`}>{PRICING.CURRENCY}</span>
              <span className={`text-6xl font-semibold bg-gradient-to-r ${COLORS.TEXT_GRADIENT} text-transparent bg-clip-text`}>
                {PRICING.AMOUNT}
              </span>
              <span className={`text-xl ${COLORS.TEXT_SECONDARY}`}>{PRICING.PERIOD}</span>
            </div>
            <p className={`${COLORS.TEXT_SECONDARY} text-lg`}>{PRICING.DESCRIPTION}</p>
          </div>
          <div className={`grid ${BREAKPOINTS.FEATURE_GRID} gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 md:mb-10`}>
            <FeatureCategory label="Development">
              {FEATURES.development.map((feature, idx) => (
                <FeatureItem key={idx}>{feature}</FeatureItem>
              ))}
            </FeatureCategory>
            <FeatureCategory label="Collaboration">
              {FEATURES.collaboration.map((feature, idx) => (
                <FeatureItem key={idx}>{feature}</FeatureItem>
              ))}
            </FeatureCategory>
            <FeatureCategory label="Deployment">
              {FEATURES.deployment.map((feature, idx) => (
                <FeatureItem key={idx}>{feature}</FeatureItem>
              ))}
            </FeatureCategory>
          </div>
          <div className="flex justify-center">
            <SignedIn>
              <UpgradeButton />
            </SignedIn>
            <SignedOut>
              <LoginButton />
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main pricing page component.
 * Handles user authentication and renders the pricing content or pro plan view.
 */
async function PricingPage() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  if (convexUser?.isPro) return <ProPlanView />;

  return (
    <div className={`relative min-h-screen ${COLORS.BACKGROUND} selection:bg-blue-500/20 selection:text-blue-200`}>
      <NavigationHeader />

      {/* Main content */}
      <main className="relative pt-16 pb-12 px-4 sm:pt-20 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
          <EnterpriseFeatures />
          <PricingCard />
        </div>
      </main>
    </div>
  );
}
export default PricingPage;
