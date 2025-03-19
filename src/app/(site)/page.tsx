import { ButcheryActivity } from "@/components/user/landingPage/butcheryActivity";
import ClickAndCollect from "@/components/user/landingPage/clickandcollect/clickAndCollect";
import { ContactLandingPage } from "@/components/user/landingPage/contact/contactLandingPage";
import { FaqSection } from "@/components/user/landingPage/faq/faq-section";
import { NosValeurs } from "@/components/user/landingPage/valeurs";
import { FAQ_DATA } from "@/constants";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-4 py-6 px-4  box-border">
      <div><ButcheryActivity /></div>
      <div id="valeurs"><NosValeurs /></div>
      <div id="click-collect"><ClickAndCollect /></div>
      <div id="faq">      
        <FaqSection title="Foire aux questions" subtitle="Retrouvez ici les réponses aux questions les plus courantes." data={FAQ_DATA} />;
      </div>
      <div id="contact"><ContactLandingPage /></div>
    </div>
  );
}
