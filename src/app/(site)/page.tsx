import { ButcheryActivity } from "@/components/user/landingPage/butcheryActivity";
import ClickAndCollect from "@/components/user/landingPage/clickAndCollect";
import { ContactLandingPage } from "@/components/user/landingPage/contactLandingPage";
import { NosValeurs } from "@/components/user/landingPage/valeurs";

export default function Home() {
  return (
    <div className="min-h-screen text-center flex flex-col gap-4 py-6 box-border">
      <div className=""><ButcheryActivity /></div>
      <div className="py-6 px-4 box-border bg-gray-200/50"><NosValeurs /></div>
      {/* <div className=""><ClickAndCollect /></div> */}
      <div className="py-6 box-border bg-gray-200/50"><ContactLandingPage /></div>
    </div>
  );
}
