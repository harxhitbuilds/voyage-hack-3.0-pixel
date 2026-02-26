"use client";

const AuthVideo = () => {
  return (
    <div className="hidden shrink-0 self-stretch md:block md:w-[40%] lg:w-[45%]">
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
