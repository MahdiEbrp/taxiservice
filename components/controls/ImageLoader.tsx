import CenterBox from './CenterBox';
import CircularLoading from './CircularLoading';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { BsEmojiDizzy } from 'react-icons/bs';
import { ElementType, useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export type ImageLoaderProps= {
    src: string,
    alt: string,
    width: number,
    height: number;
}

const ImageLoader: ElementType = (Props: ImageLoaderProps) => {

    const { src, alt, width, height, ...others } = Props;

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const { language } = useContext(LanguageContext);

    const { settings, components } = language;

    return (
        <CenterBox sx={{ dir: settings.direction }}>
            {isLoading && !hasError && <CircularLoading sx={{ position: 'absolute', zIndex: '1' }} />}
            {!hasError ?
                <Image objectFit='contain' src={src} alt={alt} width={width} height={height} {...others}
                    onLoad={() => setIsLoading(false)} onError={() => setHasError(true)} />
                :
                <CenterBox>
                    <BsEmojiDizzy style={{ width: 32, height: 32 }} />
                    <Typography variant='body2'>{`${components.imageLoaderError} '${alt}'`}</Typography>
                </CenterBox>
            }
        </CenterBox>
    );
};

export default ImageLoader;