import FetchProfiles from "@/components/FetchProfiles";
import SettingsButton from "@/components/SettingsButton";

export default function Home() {

  return (
    <div
      className="bg-fixed bg-repeat min-h-screen pb-8"
      style={{ backgroundImage: `url("/background.png")` }}
    >
      <FetchProfiles />
      <SettingsButton />     
    </div>
  );
}
