import LoadingDots from './loading-dots';

export const TinyLoader = ({ color, size, stroke }) => {
  return (
    <div style={{ transform: `scale(${(size || 20) / 20})` }}>
      <LoadingDots color={color || '#000'} />
    </div>
  );
};
