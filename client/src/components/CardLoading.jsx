const CardLoading = () => {
  return (
    <div className="border p-4 grid gap-4 min-w-[10rem] lg:max-w-[13rem] xl:max-w-[16rem] rounded-lg bg-white shadow-sm animate-pulse">
      <div className="h-16 lg:h-24 bg-blue-100 rounded-md" aria-hidden="true" />

      <div
        className="h-4 lg:h-5 bg-blue-100 rounded-md w-3/4"
        aria-hidden="true"
      />

      <div
        className="h-4 lg:h-5 bg-blue-100 rounded-md w-full"
        aria-hidden="true"
      />

      <div
        className="h-4 lg:h-5 bg-blue-100 rounded-md w-1/2"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-4">
        <div className="h-8 bg-blue-100 rounded-md w-1/3" aria-hidden="true" />
        <div className="h-8 bg-blue-100 rounded-md w-1/3" aria-hidden="true" />
      </div>
    </div>
  );
};

export default CardLoading;
