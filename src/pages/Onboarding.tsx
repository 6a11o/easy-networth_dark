
import { Layout } from "@/components/Layout";
import { OnboardingFlow } from "@/components/OnboardingFlow";

const Onboarding = () => {
  return (
    <Layout requireAuth={true}>
      <OnboardingFlow />
    </Layout>
  );
};

export default Onboarding;
