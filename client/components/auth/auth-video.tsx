"use client";

const AuthVideo = () => {
  return (
    <div className="flex h-full w-[35vw] items-center justify-center overflow-hidden rounded-xl bg-red-500">
      <video
        src="/videos/auth-page-video.mp4"
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};
export default AuthVideo;
