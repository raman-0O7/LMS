import Image from "next/image"

export const Logo = () => {
  return (
    <div className="w-full flex items-center gap-x-3">
      <Image 
        width={30}
        height={30}
        alt="logo"
        src={"/logo.svg"}
      />
      <h1 className="text-2xl font-[700] text-[#0369A1] ">
        Learniverse
      </h1>
    </div>

  )
}