export const getGeoLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition((position) => resolve(position), (error) => reject(error),);
        else
            reject(new Error('Geolocation is not supported by this browser.'));

    });

};
export default getGeoLocation;