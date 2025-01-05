import { useState, useEffect } from 'react';
import { environment } from '../environments';
import { UseImageOptions } from '../interfaces/UseImageOptions';

/**
 * custom hook - load an image from a filename and return an object URL for rendering
 * (we prepend with api url and '/api/images/' and maybe an images subfolder)
 */
export function useImage(
    imageUrl: string,
    options: UseImageOptions = {}
) {
    
    const { fallbackUrl } = options;
    const { subFolder } = options;

    imageUrl = `${environment.apiUrl}/api/images${subFolder ? '/' + subFolder  : ''}/${imageUrl}`;

    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
        console.log('>>>>>>>>>>>>> setImgSrc', imgSrc);
    }, [imgSrc]);

    useEffect(() => {
        if (!imageUrl) {
            // no url? use fallback or nothing
            setImgSrc(fallbackUrl || null);
            setLoading(false);
            setError(null);
            return;
        }

        let didCancel = false; // to prevent setting state if unmounted
        let objectUrl: string | null = null;

        const loadImage = async () => {
            setLoading(true);
            setError(null);
            setImgSrc(null);

            try {
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to load image from ${imageUrl}`);
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);

                if (!didCancel) {
                    setImgSrc(objectUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`Error fetching image "${imageUrl}":`, err);
                if (!didCancel) {
                    setError(err as Error);
                    setImgSrc(fallbackUrl || null); // use fallback if available
                    console.log('>>> error state - what is imageUrl?', imageUrl)
                    setLoading(false);
                }
            }
        };

        loadImage();

        // cleanup: revoke object url when the component unmounts or the URL changes
        return () => {
            didCancel = true;
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageUrl, fallbackUrl]);

    return { imgSrc, loading, error };
}
