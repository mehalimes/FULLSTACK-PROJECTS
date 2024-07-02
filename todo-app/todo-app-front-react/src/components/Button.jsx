import "./../globals.css";

export default function Button(props) {
  const { name, event, className } = props;
  return (
    <button
      onClick={event}
      className={`w-auto h-[25px] bg-white border-2 border-solid border-black rounded-[10px] shadow-[0_2px_0_0] pl-[10px] pr-[10px] active:shadow-none active:translate-y-[2px] cursor-pointer mx-auto flex justify-center items-center font-poppins ${className}`}
    >
      {name}
    </button>
  );
}
