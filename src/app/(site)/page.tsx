import { ButcheryActivity } from "@/components/user/butcheryActivity";
import OrderSteps from "@/components/user/orderSteps";

export default function Home() {
  return (
    <div className="min-h-screen  text-center">
      <ButcheryActivity />
      <OrderSteps />
      {/* 
      <ClickAndCollectSteps />
      <DescriptionButchery />
      <Contact /> */}
    </div>
  );
}
