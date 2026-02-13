import ValentinePage from "@/app/components/ValentinePage";

export const metadata = {
  title: "Demo Love Page | vals.love",
  description: "See what a vals.love page looks like",
};

export default function DemoPage() {
  return (
    <ValentinePage
      startDate={new Date("2025-10-29")}
      recipientName="Demo"
      senderName="vals.love"
    />
  );
}
