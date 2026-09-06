import FetchProfiles from "@/components/FetchProfiles";
import SettingsButton from "@/components/SettingsButton";

export default function Home() {

  return (
    <main className="roby-page">
      <FetchProfiles />
      <SettingsButton />     
    </main>
  );
}
