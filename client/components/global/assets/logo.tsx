import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/img/nimbus-logo.svg"
        alt="Nimbus Logo"
        width={32}
        height={32}
        className="h-6 w-6 rounded-sm bg-yellow-500 p-1"
      />
      <span className="text-lg font-bold text-white">Nimbus</span>
    </div>
  );
}
