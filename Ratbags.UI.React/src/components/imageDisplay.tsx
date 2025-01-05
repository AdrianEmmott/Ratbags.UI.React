import { environment } from '../environments';
import { useImage } from '../hooks/useImage';

interface ImageDisplayProps {
    imageUrl: string;
    subFolder?: string;
}

export const ImageDisplay = ({ imageUrl, subFolder }: ImageDisplayProps) => {
    const { imgSrc, loading } = useImage(imageUrl, {
        fallbackUrl: `${environment.apiUrl}/api/images/ratbags.jpg`,
        subFolder: subFolder
    });

    if (loading) return <p>Loading image...</p>;



    return (
        <div>
            {imgSrc &&
                <img
                    src={imgSrc}
                    alt="Some alt text"
                    style={{ maxWidth: '200px' }} />
            }
        </div>
    );
};
