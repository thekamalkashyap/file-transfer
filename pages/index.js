import Link from "next/link";
const Index = () => {
  return (
    <>
      <div className="border-black w-full h-full flex justify-center items-center ">
        <div className=" w-1/2 min-w-[17rem] max-w-[30rem] h-1/2 relative p-5 bg-[#1d1d1d] rounded-md">
          <Link href={`/private#${Math.floor(Math.random() * 10 ** 6)}`}>
            <button className="bg-[#303030] heading rounded-lg w-full h-[calc(50%-1rem)] center mb-[2rem]">
              <svg height="40" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z" />
              </svg>
            </button>
          </Link>
          <Link href="/private/">
            <button className="bg-[#262626] heading rounded-lg w-full h-[calc(50%-1rem)] center ">
              <svg height="40" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Index;
