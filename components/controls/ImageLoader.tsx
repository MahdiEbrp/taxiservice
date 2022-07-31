import CenterBox from './CenterBox';
import CircularLoading from './CircularLoading';
import Image from 'next/image';
import { ElementType, useState } from 'react';
interface ImageLoaderProps{
    src: string,
    alt: string,
    width: number,
    height: number
}
const ImageLoader: ElementType = (Props: ImageLoaderProps) => {
    const { src, alt, width, height, ...others } = Props;
    const [isLoading, setIsLoading] = useState(true);
    return (
        <CenterBox>
            {isLoading  && <CircularLoading style={{ position: 'absolute', zIndex: '1' }} />}
            <Image src={src} alt={alt} width={width} height={height} {...others} onLoad={()=>setIsLoading(false)} />
        </CenterBox>
    );
};

export default ImageLoader;