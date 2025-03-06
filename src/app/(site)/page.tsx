import { ButcheryActivity } from "@/components/user/landingPage/butcheryActivity";
import ClickAndCollect from "@/components/user/landingPage/clickandcollect/clickAndCollect";
import { ContactLandingPage } from "@/components/user/landingPage/contact/contactLandingPage";
import { NosValeurs } from "@/components/user/landingPage/valeurs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-4 py-6 box-border">
      <div><ButcheryActivity /></div>
      <div><NosValeurs /></div>
      <div><ClickAndCollect /></div>
      <div ><ContactLandingPage /></div>
    </div>
  );
}
