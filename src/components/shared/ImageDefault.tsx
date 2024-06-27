import { Image, Skeleton } from 'antd';
import { fallbackImageError } from 'utils/media';
interface Props {
  width?: number;
  height?: number;
  className?: string;
}
const IndexComponent: React.FC<Props> = ({ width, height, className }) => {
  return (
    <Image
      className={className}
      preview={false}
      width={width || 50}
      height={height || 50}
      src="/no-image.png"
      fallback={fallbackImageError}
      placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
    />
  );
};

export default IndexComponent;
