import React from 'react';
import LoadingDots from './loading-dots';

const Loader = ({
  bgColor,
  textColor,
  message,
  width,
  height,
  strokeWidth,
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10 mx-auto">
        <LoadingDots color={bgColor} />
        {message && (
          <div className="mt-2">
            <h3 className={`${textColor} font-semibold text-l`}>{message}</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Loader;
