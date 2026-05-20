import { Loader } from "@/src/shared/ui/Loader";

export default function ProfileLoading() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        background: "#FFFFFF",
      }}
    >
      <Loader />
    </main>
  );
}
