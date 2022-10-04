import Link from "next/link";

const Header = () => {
  return (
    <header className="h-[4rem] border-b border-gray-500 mx-4 flex justify-start items-center space-x-4">
      <Link href="/">
        <button>LeinDein</button>
      </Link>
      <svg
        width="25"
        height="25"
        className="fill-white mt-[6px] -rotate-[22deg]"
        viewBox="0 0 16 16"
      >
        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
      </svg>
    </header>
  );
};

export default Header;
