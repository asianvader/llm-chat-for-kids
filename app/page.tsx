import FetchProfiles from "@/components/FetchProfiles";

export default function Home() {

  return (
    <div
      className="bg-fixed bg-repeat pb-32 h-screen"
      style={{ backgroundImage: `url("/background.png")` }}
    >
      <FetchProfiles />

     
    </div>
  );
}
