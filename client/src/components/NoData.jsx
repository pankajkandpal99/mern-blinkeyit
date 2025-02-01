import NoDataImage from "../assets/nothing here yet.webp";

const NoData = ({ message = "No Data Found!", image = NoDataImage }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <img src={image} alt="no-data" className="w-36 h-36 object-contain" />
      <p className="text-neutral-500 text-center">{message}</p>
    </div>
  );
};

export default NoData;
